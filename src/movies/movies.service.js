const knex = require("../db/connection");

function mapCriticToReview(rows) {
  const resultArr = [];
  rows.forEach((element) => {
    const found = resultArr.find(
      (review) => review.review_id === element.review_id
    );
    if (!found) {
      const reviewObj = {
        review_id: element.review_id,
        content: element.content,
        score: element.score,
        created_at: element.reviews_created_at,
        updated_at: element.reviews_updated_at,
        critic_id: element.critic_id,
        movie_id: element.movie_id,
      };
      resultArr.push(reviewObj);
    }
  });
  rows.forEach((element) => {
    const index = resultArr.findIndex(
      (review) => review.review_id === element.review_id
    );
    resultArr[index]["critic"] = {
      critic_id: element.critic_id,
      preferred_name: element.preferred_name,
      surname: element.surname,
      organization_name: element.organization_name,
      created_at: element.critic_created_at,
      updated_at: element.critic_updated_at,
    };
  });
  return resultArr;
}

function list() {
  return knex("movies").select("*");
}

function listIfShowing() {
  return knex("movies as m")
    .distinct()
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .select(
      "m.movie_id",
      "m.title",
      "m.runtime_in_minutes",
      "m.rating",
      "m.description",
      "m.image_url"
    )
    .where("mt.is_showing", true);
}

function read(movieId) {
  return knex("movies").select("*").where({ movie_id: movieId }).first();
}

function listTheatersShowingMovie(movieId) {
  return knex("movies_theaters as mt")
    .join("theaters as t", "t.theater_id", "mt.theater_id")
    .select("t.*", "mt.is_showing", "mt.movie_id")
    .where({ movie_id: movieId, "mt.is_showing": true });
}

function listReviewsForMovie(movieId) {
  return knex("reviews as r")
    .where({ movie_id: movieId })
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select(
      "r.review_id",
      "r.content",
      "r.score",
      "r.critic_id",
      "r.movie_id",
      "r.created_at as reviews_created_at",
      "r.updated_at as reviews_updated_at",
      "c.critic_id",
      "c.preferred_name",
      "c.surname",
      "c.organization_name",
      "c.created_at as critic_created_at",
      "c.updated_at as critic_updated_at"
    )
    .then(mapCriticToReview);
}

module.exports = {
  list,
  listIfShowing,
  read,
  listTheatersShowingMovie,
  listReviewsForMovie,
};
