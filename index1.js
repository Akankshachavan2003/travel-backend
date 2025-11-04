// index.js
import express from "express";
import { SessionsClient } from "@google-cloud/dialogflow";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());

const sessionClient = new SessionsClient({
  keyFilename: path.join(__dirname, "key.json"), // तुझी JSON key फाईल
});

app.post("/webhook", async (req, res) => {
  const { message, sessionId = "12345" } = req.body;

  const sessionPath = sessionClient.projectAgentSessionPath(
    "travelplanneragent-loxy", // तुझा Dialogflow Project ID
    sessionId
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: "en",
      },
    },
  };

  try {
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    res.json({ reply: result.fulfillmentText });
  } catch (error) {
    console.error("Dialogflow Error:", error);
    res.status(500).json({ error: "Dialogflow request failed" });
  }
});

app.get("/", (req, res) => {
  res.send("Travel Planner Backend running 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
