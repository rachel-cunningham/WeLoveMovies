if (process.env.USER) require("dotenv").config();
const express = require("express");
const app = express();

const movieRouter = require("./movies/movies.router");
const reviewRouter = require("./reviews/reviews.router");
const theaterRouter = require("./theaters/theaters.router");

app.use(express.json());

app.use("/movies", movieRouter);

app.use("/reviews", reviewRouter);

app.use("/theaters", theaterRouter);

const notFound = require("./errors/notFound");
const errorHandler = require("./errors/errorHandler");

app.use(notFound);
app.use(errorHandler);

module.exports = app;
