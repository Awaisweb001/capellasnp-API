const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { adminRoutes } = require("./routes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes

app.use("/api/v1/admin", adminRoutes);

connectDB();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
