const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res, next) {
  const query = req.query.is_showing;
  if (!query) {
    const data = await service.list();
    return res.json(data);
  } else {
    const selectedData = await service.listIfShowing();
    return res.json(selectedData);
  }
}

async function doesMovieExist(req, res, next) {
  const { movieId } = req.params;
  const movie = await service.read(movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  return next({ status: 404, message: "Movie can not be found" });
}

async function read(req, res) {
  const { movie } = res.locals;
  res.json({ data: movie });
}

async function matchMovieToTheaters(req, res, next) {
  const { movieId } = req.params;
  const response = await service.listTheatersShowingMovie(movieId);
  return res.json(response);
}

async function matchMovietoReview(req, res, next) {
  const { movieId } = req.params;
  const response = await service.listReviewsForMovie(movieId);
  return res.json(response);
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(doesMovieExist), read],
  matchMovieToTheaters,
  matchMovietoReview,
};
