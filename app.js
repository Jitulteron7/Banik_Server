require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./connect");
const morgan =require("morgan");
const compression=require("compression")
const app = express();
const PORT = process.env.PORT || 5000;
const routes = require("./routes");
const chalk=require("chalk");

app.use(express.json());
app.use(cookieParser("secret_passcode"));
app.use(cors({
    origin: true,
    credentials: true,
  }));

app.use(compression());
app.use(morgan("dev"));

// router setup
app.use("/", routes);

// error handler
app.use((error, req, res, next) => {
    console.error(chalk.red(error.message));
    res.status(error.statusCode || 500).json({
        error: true,
        message: error.message || "An Error Occured",
        route: req.url,
        name: error.name || "InteralServerError",
    });
});

// Database Connection and server listen...
connectDB();

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
