const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reviewExists(req, res, next) {
  const review_id = req.params.reviewId;
  const review = await service.read(review_id);

  if (review) {
    res.locals.review = review;
    return next();
  }
  return next({ status: 404, message: `Review cannot be found` });
}

async function destory(req, res) {
  const { review } = res.locals;
  await service.delete(review.review_id);
  res.sendStatus(204);
}

async function update(req, res) {
  const updateReview = {
    ...res.locals.review[0],
    ...req.body.data,
  };
  const response = await service.update(updateReview);
  res.json({ data: response });
}

module.exports = {
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destory)],
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
};
