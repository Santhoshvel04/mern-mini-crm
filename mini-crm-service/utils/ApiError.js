class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }

  static badRequest(msg, d) {
    return new ApiError(400, 'BAD_REQUEST', msg, d);
  }

  static unauthorized(msg = 'Authentication required') {
    return new ApiError(401, 'UNAUTHENTICATED', msg);
  }

  static forbidden(msg = 'Insufficient permission') {
    return new ApiError(403, 'FORBIDDEN', msg);
  }

  static notFound(msg = 'Not found') {
    return new ApiError(404, 'NOT_FOUND', msg);
  }

  static conflict(msg) {
    return new ApiError(409, 'CONFLICT', msg);
  }

  static internal(msg = 'Internal server error') {
    return new ApiError(500, 'INTERNAL', msg);
  }
}

module.exports = ApiError;
