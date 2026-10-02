const ok = (res, data, meta, status = 200) =>
  res.status(status).json({ success: true, data, ...(meta ? { meta } : {}) });

const created = (res, data) => ok(res, data, null, 201);

module.exports = { ok, created };
