import app from "./src/app.js";
import dotenv from "dotenv"
import connectDB from "./src/config/db.js";

dotenv.config();

const PORT =process.env.PORT || 8000;

app.listen(PORT,()=>{
    console.log("Server is Listening on Port",PORT);
    connectDB();
})