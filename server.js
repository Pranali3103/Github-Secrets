const express = require("express");
const { PubSub } = require("@google-cloud/pubsub");

const app = express();
app.use(express.json());

// Initialize PubSub with credentials
const pubSubClient = new PubSub();

const topicId = process.env.TOPIC_ID || "github-secret";

app.post("/publish", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).send({ error: "Message is required" });
        }

        const topic = pubSubClient.topic(topicId);
        const messageId = await topic.publishMessage({ data: Buffer.from(message) });

        res.status(200).send({ messageId });
    } catch (err) {
        console.error("Error publishing message:", err);
        res.status(500).send({ error: "Failed to publish message" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
