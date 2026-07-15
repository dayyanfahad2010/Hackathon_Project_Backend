# Hackathon_Project_Backend

## Setup

```bash
npm install
cp .env.example .env   # fill in your real MongoDB URI, JWT secret, Groq key, etc.
npm run start:dev
```

Server listens on `PORT` (default `8000`). CORS is currently whitelisted for `http://localhost:5173` and the deployed frontend URL in `src/app.js` — update that list if you deploy elsewhere.

## Fixes applied (see below)

The following bugs were found and fixed so the app works correctly end-to-end with the frontend:

1. **`signUp` never saved `role`.** Every new user had `role: undefined`, breaking every role-gated route. Now accepts an optional `role` in the request body (`"admin"` or `"technician"`), defaulting to `"technician"`.
2. **Admins couldn't see all issues.** `GET /api/issue` compared `req.user.role === "Admin"` against a lowercase enum (`"admin"`/`"technician"`), so it always fell through to "my issues only". Fixed the casing in both `issueController.js` and the duplicate implementation in `dashboardController.js`.
3. **`.populate(..., "name email")` on User references returned nothing for name.** The `User` schema only has `userName`, not `name`. Fixed all populates (`assignedTechnician`, `createdBy`, `technician`, `performedBy`) to select `userName` instead.
4. **`updateAsset` returned the controller function itself instead of the updated document** (`successRes(res, ..., updateAsset)` instead of `updatedAsset`) — a one-character typo that meant every asset edit response had no usable data.
5. **Auth cookies were unconditionally `secure: true, sameSite: "none"`**, which silently fails over plain `http://localhost` in local development (browsers drop `Secure` cookies without HTTPS) — this is what caused "logs out on every refresh": the login response looked successful, but the cookie never actually got stored, so the next `GET /api/auth/profile` (which runs on every page load) had no session to read and reported logged-out.

   The first fix made this conditional on `NODE_ENV === "production"`, but that's still fragile — it silently breaks again if `NODE_ENV` is ever unset or misconfigured. It's now derived directly from the request itself (`req.secure` / `x-forwarded-proto`, via a shared `getCookieOptions(req)` helper in `authController.js`), so it self-corrects for plain `http://localhost` in dev and HTTPS in production without needing an env var to be right. Added `app.set("trust proxy", 1)` in `app.js` so this also works correctly behind a reverse proxy (Render/Railway/Vercel). `logout`'s `clearCookie` call uses the same helper so it always matches whatever flags the cookie was actually set with.
6. **`POST /api/ai/triage` required login**, but the product spec runs AI triage during the public, unauthenticated QR-scan report flow. Removed `authMiddleware` from that route only; `POST /api/ai/maintenance-summary` is still staff-only, since only technicians log maintenance.
7. **A missing `GROQ_API_KEY` crashed the entire server on boot** (the Groq client was constructed at module load time). It's now constructed lazily on first use; if the key is missing, AI endpoints return a graceful `503` instead of taking down the whole app.
8. **Added `GET /api/users?role=technician`** (admin-only) so the frontend can show a real technician picker instead of asking admins to paste a raw MongoDB `_id` when assigning work.
9. Removed leftover `console.log` debugging statements from `authMiddleware.js`, `roleMiddleware.js`, and `errorMiddleware.js`, fixed `errorMiddleware` reporting `status: true` on errors (now `false`), and stopped `roleMiddleware`'s 403 response from leaking the decoded JWT payload back as the error `message`.
10. **`createHistory` was called but never imported** in `publicController.js`, `issueController.js`, and `maintenanceController.js` — every call to report an issue, assign a technician, change an issue's status, or create/update a maintenance record was throwing a `ReferenceError` and returning a 500. This was likely the single biggest blocker to a working demo. Fixed by adding the missing import in all three files.
11. **Evidence upload is now fully wired.** `multer` and the Cloudinary `uploadImages` util existed in the codebase but weren't attached to any route. Added `upload.array("evidence", 5)` (10MB/file, image or short video only) to:
    - `POST /api/public/assets/:assetCode/report` — evidence photos on the public QR report form
    - `POST /api/maintenance` and `PATCH /api/maintenance/:id` — repair evidence on the technician's maintenance record
    Both endpoints accept either multipart file uploads or a plain JSON array of already-hosted URLs, so the API still works for non-multipart clients.
12. **Added the business rule "next service date cannot be before the maintenance completion date"** to both `createMaintenance` and `updateMaintenance` — it existed in the spec but wasn't enforced anywhere.
13. Fixed `updateIssueStatus`'s history log, which previously always recorded `"Issue Resolved"` regardless of which status it was actually changed to.
14. **`User` model was registered under the wrong name**, causing every `.populate("assignedTechnician" | "createdBy" | "technician" | "performedBy", ...)` call to throw `"Schema hasn't been registered for model 'User'"`. `user.js` had `mongoose.model("users", userSchema)`, but `Asset.js`, `Issue.js`, `Maintenance.js`, and `History.js` all reference it as `ref: "User"`. Fixed by registering it as `mongoose.model("User", userSchema)` to match. **If you already have a MongoDB with real data from before this fix**, Mongoose was pluralizing `"users"` into a differently-named collection than intended — check your database's actual collection name and rename it to `users` if needed so existing accounts aren't orphaned.
15. **CORS was missing `PATCH` from allowed methods.** `corsOptions.methods` only listed `GET, POST, PUT, DELETE, OPTIONS` — but assigning a technician, updating issue status, editing an asset, and updating a maintenance record all use `PATCH`, so the browser's CORS preflight rejected every one of them before the request even reached the server. Added `PATCH` to the list.
