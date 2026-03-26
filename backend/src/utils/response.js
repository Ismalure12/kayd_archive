function success(res, data, status = 200) {
  return res.status(status).json({ success: true, data });
}

function paginated(res, data, total, page, limit) {
  return res.status(200).json({
    success: true,
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

module.exports = { success, paginated };
