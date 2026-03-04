require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const userRoutes = require("./routes/userRoutes");
const movieRoutes = require("./routes/movieRoutes");

const app = express();

// ===============================
// RATE LIMITER
// ===============================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

// ===============================
// MIDDLEWARE
// ===============================
app.use(helmet());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://reeltalk-rho.vercel.app"
    ]
  })
);

app.use(express.json());
app.use(limiter);

// ===============================
// DATABASE CONNECTION
// ===============================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Connection Error:", err));

// ===============================
// ROUTES
// ===============================
app.use("/users", userRoutes);
app.use("/movies", movieRoutes);

// ===============================
// TEST ROOT ROUTE
// ===============================
app.get("/", (req, res) => {
  res.send("s84 Movie Catalog API is running");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// ===============================
// SERVER START
// ===============================
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});