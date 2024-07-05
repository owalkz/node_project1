const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  credentials: true,
}));
const PORT = 5000;
const connectDB = require("./db");
connectDB();
app.listen(PORT, () => console.log("Server connected to port ${PORT}"));

process.on("UnhandledRejection", (err) => {
  console.log("An error occurred: ${err.message}");
  server.close(() => process.exit(1));
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/freelancer", require("./routes/freelancerRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
