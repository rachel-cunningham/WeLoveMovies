const knex = require("../db/connection");

function mapMoviesToTheater(rows) {
  const resultArr = [];
  rows.forEach((element) => {
    //checking if that row is already added in result
    const found = resultArr.find(
      (theater) => theater.theater_id === element.theater_id
    );
    if (!found) {
      const theaterObj = {
        theater_id: element.theater_id,
        name: element.name,
        address_line_1: element.address_line_1,
        address_line_2: element.address_line_2,
        city: element.city,
        state: element.state,
        zip: element.zip,
        created_at: element.theaters_created_at,
        updated_at: element.theaters_updated_at,
        movies: [],
      };
      resultArr.push(theaterObj);
    }
  });
  rows.forEach((element) => {
    //find the matching theater for this row in my result theaters
    const index = resultArr.findIndex(
      (theater) => theater.theater_id === element.theater_id
    );
    //then push this movie to the theater found above
    resultArr[index].movies.push({
      movie_id: element.movie_id,
      title: element.title,
      runtime_in_minutes: element.runtime_in_minutes,
      rating: element.rating,
      description: element.description,
      image_url: element.image_url,
      created_at: element.movies_created_at,
      updated_at: element.movies_updated_at,
      is_showing: element.is_showing,
      theater_id: element.theater_id,
    });
  });
  return resultArr;
}

function list() {
  return knex("theaters").select("*");
}

function matchTheaterToMoive() {
  return knex("theaters as t")
    .join("movies_theaters as mt", "mt.theater_id", "t.theater_id")
    .join("movies as m", "m.movie_id", "mt.movie_id")
    .select(
      "t.theater_id",
      "t.name",
      "t.address_line_1",
      "t.address_line_2",
      "t.city",
      "t.state",
      "t.zip",
      "t.created_at as theaters_created_at",
      "t.updated_at as theaters_updated_at",
      "m.movie_id",
      "m.title",
      "m.runtime_in_minutes",
      "m.rating",
      "m.description",
      "m.image_url",
      "m.created_at as movies_created_at",
      "m.updated_at as movies_updated_at",
      "mt.is_showing"
    )
    .then(mapMoviesToTheater);
}

module.exports = {
  list,
  matchTheaterToMoive,
};
