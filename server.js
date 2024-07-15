const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv")
const app = express();
// const cookieParser = require("cookie-parser");
const corsOptions = {
  origin: "http://localhost:5173", // Your frontend URL
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
dotenv.config();
// app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));
const PORT = process.env.PORT;
const connectDB = require("../node_project1/config/db");
connectDB();
app.listen(PORT, () => console.log(`Server connected to port ${PORT}`));

process.on("UnhandledRejection", (err) => {
  console.log("An error occurred: ${err.message}");
  server.close(() => process.exit(1));
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/freelancer", require("./routes/freelancerRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
