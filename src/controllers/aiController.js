import Groq from "groq-sdk";
import successRes from "../responseHandler/successResponse.js";

let groq = null;
const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) return null;
  if (!groq) groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return groq;
};

export const issueTriage = async (req, res, next) => {
  try {
    const {
      assetName,
      category,
      location,
      condition,
      complaint,
    } = req.body;

    if (!complaint) {
      return res.status(400).json({
        success: false,
        message: "Complaint is required.",
      });
    }

    const groq = getGroqClient();
    if (!groq) {
      return res.status(503).json({
        success: false,
        message: "AI triage is temporarily unavailable. Please fill in the details manually.",
      });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      response_format: {
        type: "json_object",
      },
      messages: [
        {
          role: "system",
          content: `
You are an expert maintenance engineer.

Analyze the complaint and return ONLY valid JSON.

JSON Format:

{
  "title": "",
  "category": "",
  "priority": "Low | Medium | High | Critical",
  "possibleCauses": [],
  "initialChecks": []
}

Rules:
- Return JSON only.
- Do not include markdown.
- Do not explain anything.
- Keep causes and checks concise.
`,
        },
        {
          role: "user",
          content: `
Asset Name: ${assetName || "Unknown"}

Category: ${category || "Unknown"}

Location: ${location || "Unknown"}

Condition: ${condition || "Unknown"}

Complaint:
${complaint}
`,
        },
      ],
    });

    const result = JSON.parse(
      completion.choices[0].message.content
    );

    successRes(
      res,
      "AI issue triage generated successfully.",
      result
    );
  } catch (error) {
    next(error);
  }
};

export const maintenanceSummary = async (req, res, next) => {
  try {
    const {
      assetName,
      technician,
      inspectionNotes,
      workPerformed,
      parts,
    } = req.body;

    if (!inspectionNotes || !workPerformed) {
      return res.status(400).json({
        success: false,
        message:
          "Inspection notes and work performed are required.",
      });
    }

    const groq = getGroqClient();
    if (!groq) {
      return res.status(503).json({
        success: false,
        message: "AI summary is temporarily unavailable. You can save the record without it.",
      });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: `
You are an expert maintenance engineer.

Generate a short professional maintenance report.

Include:

• Problem Summary
• Inspection Findings
• Work Performed
• Parts Replaced
• Final Recommendation

Return plain text only.
`,
        },
        {
          role: "user",
          content: `
Asset:
${assetName || "Unknown"}

Technician:
${technician || "Unknown"}

Inspection Notes:
${inspectionNotes}

Work Performed:
${workPerformed}

Parts:
${parts || "None"}
`,
        },
      ],
    });

    successRes(
      res,
      "Maintenance summary generated successfully.",
      {
        summary: completion.choices[0].message.content,
      }
    );
  } catch (error) {
    next(error);
  }
};