import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("MERN Blog API Running");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
