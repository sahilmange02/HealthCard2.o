const express = require("express");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const cookieParser = require("cookie-parser");
const registerRoute = require("./routes/registerRoute");
const doctorRoute = require("./routes/doctorRoute");
const adminRoutes = require("./routes/adminRoutes");
const logoutRoute = require("./routes/logoutRoute");
const cors = require("cors");
const app = express();

dotenv.config({ path: "./config.env" });

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// Set Mongoose strictQuery to avoid deprecation warning
mongoose.set('strictQuery', true);

const dbURI = process.env.DATABASE;
const port = process.env.PORT || 5000;

// Connect to the database
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to the database successfully.");
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err.message);
    app.listen(port, () => {
      console.log("Server is still running but without a database connection.");
    });
    app.get("/", (req, res) => {
      res.send(
        "Something went wrong with the database connection. Please try again later."
      );
    });
  });


app.get("/", (req, res) => res.send("Server listening at 5000 port! "));

app.use(authRoutes);
app.use(registerRoute);
app.use(doctorRoute);
app.use(patientRoutes);
app.use(adminRoutes);
app.use(logoutRoute);
