class ValidationException extends Error {
  code = 422;

  constructor(message) {
    super(message);
  }
}

module.exports = ValidationException;
