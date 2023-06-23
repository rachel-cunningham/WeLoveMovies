const knex = require("../db/connection");

function addCriticInfo(rows) {
  const result = rows.map(async (element) => {
    const criticData = await readCritic(element.critic_id);
    const copy = { ...element, critic: criticData };
    return copy;
  });
  return result[0];
}

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
    .where({ review_id: updateReview.review_id })
    .update(updateReview, ["*"])
    .then(addCriticInfo);
}

module.exports = {
  read,
  readCritic,
  delete: destory,
  update,
};
