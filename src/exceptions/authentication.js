class AuthenticationException extends Error {
  code = 401;

  constructor(message = "Authentication failed") {
    super(message);
  }
}

module.exports = AuthenticationException;
