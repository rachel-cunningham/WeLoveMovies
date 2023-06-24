const knex = require("../db/connection");

function read(review_id) {
  return knex("reviews").select("*").where({ review_id });
}

function readCritic(critic_id) {
  return knex("critics").select("*").where({ critic_id }).first();
}

function destory(review_id) {
  return knex("reviews").where({ review_id }).del();
}

function update(updateReview) {
  return knex("reviews as r ")
    .select("*")
    .where({ review_id: updateReview.review_id })
    .update(updateReview, "*")
    .then(async (data) => {
      const criticData = await readCritic(updateReview.critic_id);
      const copy = { ...updateReview, critic: criticData };
      return copy;
    });
}

module.exports = {
  read: read,
  readCritic,
  delete: destory,
  update,
};
