import express from "express";
import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

const db = createClient({
  url: 'libsql://cicloit-samuelnar.turso.io',
  authToken: process.env.TURSO_DB_TOKEN,
});

app.get("/items", async (req, res) => {
  try {
    const result = await db.execute("SELECT * FROM items");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/items", async (req, res) => {
  const { name, category } = req.body;
  try {
    await db.execute("INSERT INTO items (name, category) VALUES (?, ?)", [name, category]);
    res.status(201).json({ message: "Item added" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;