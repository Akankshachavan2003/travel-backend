import express from "express";

const app = express();
app.use(express.json());

// --- MAIN WEBHOOK ROUTE ---
app.post("/webhook", (req, res) => {
  const intent = req.body.queryResult.intent.displayName;
  let responseText = "Hi! I’m your Travel Buddy ✈️";

  // Handle specific intent
  if (intent === "PlanTrip") {
    const place = req.body.queryResult.parameters.place || "your destination";
    const days = req.body.queryResult.parameters.days || 2;
    const budget = req.body.queryResult.parameters.budget || "medium budget";

    responseText = `Here’s a ${days}-day trip plan for ${place} with a ${budget} 💼✨. Would you like me to suggest top places to visit?`;
  }

  // Default reply
  res.json({ fulfillmentText: responseText });
});

// --- HOME ROUTE ---
app.get("/", (req, res) => {
  res.send("Travel Buddy Webhook is Live ✅");
});

// --- SERVER CONFIG ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
