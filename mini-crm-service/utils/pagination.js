module.exports = function pagination(query = {}, { defaultLimit = 10, maxLimit = 50 } = {}) {
  let page = parseInt(query.page, 10);
  if (!page || page < 1) page = 1;
  let limit = parseInt(query.limit, 10);
  if (!limit || limit < 1) limit = defaultLimit;
  if (limit > maxLimit) limit = maxLimit;
  return { page, limit, skip: (page - 1) * limit };
};
