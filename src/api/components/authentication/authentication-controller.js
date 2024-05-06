const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

const MAX_LOGIN_ATTEMPTS = 5;
/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */

async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    if (
      !request.session ||
      request.session.loginAttempt >= MAX_LOGIN_ATTEMPTS
    ) {
      const errorMessage = `Too many attempts, Blocked for several minutes`;

      throw errorResponder(
        errorTypes.TOO_MANY_ATTEMPTS,
        errorMessage,
        `Blocked for several minutes`
      );
    }

    const loginAttempt = request.session.loginAttempt || 0;
    const loginSuccess = await checkLoginCredentials(email, password, request);

    if (!loginSuccess) {
      request.session.loginAttempt = loginAttempt + 1;

      const errorMessage = `Failed login attempt ${loginAttempt + 1}`;
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong email or password',
        errorMessage
      );
    }

    request.session.loginAttempt = 0;

    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
