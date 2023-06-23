const service = require("./theaters.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function read(req, res) {
  const { theater } = res.locals;
  res.locals({ theater });
}

async function list(req, res, next) {
  const response = await service.matchTheaterToMoive();
  return res.json(response);
}
module.exports = {
  read,
  list: asyncErrorBoundary(list),
};
