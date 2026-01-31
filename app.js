require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const connectDB = require("./db/connect");
const authRouter = require("./routes/auth");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const learningUnitsRouter = require("./routes/learningUnits");

app.use(express.json());
// extra packages

// routes
app.get("/", (req, res) => {
  res.send("jobs api");
});

const authenticateUser = require("./middleware/authentication");

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/learning-units", learningUnitsRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI;

const start = async () => {
  try {
    if (!mongoUri) {
      throw new Error("MONGO_URI is missing in .env");
    }

    await connectDB(mongoUri);
    console.log("Connected to MongoDB");

    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
