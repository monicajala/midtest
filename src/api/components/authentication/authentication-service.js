const authenticationRepository = require('./authentication-repository');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');

const failedLoginAttempts = {};

/**
 * Check username and password for login.
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} An object containing, among others, the JWT token if the email and password are matched. Otherwise returns null.
 */
async function checkLoginCredentials(email, password) {
  const user = await authenticationRepository.getUserByEmail(email);

  const failedAttempts = failedLoginAttempts[email] || 0;

  if (failedAttempts >= 5) {
    const lastFailedAttemptTime = failedLoginAttempts[`${email}_lastAttempt`];
    const currentTime = Date.now();
    const timeDiffMinutes = (currentTime - lastFailedAttemptTime) / (1000 * 60);

    if (timeDiffMinutes < 30) {
      return null;
    }
  }

  // Because we always check the password (see above comment), we define the
  // login attempt as successful when the `user` is found (by email) and
  // the password matches.
  const passwordChecked = await authenticationServices.checkPassword(
    password,
    user.password
  );
  if (user && passwordChecked) {
    failedLoginAttempts[email] = 0;
    failedLoginAttempts[`${email}_lastAttempt`] = undefined;

    return {
      email: user.email,
      name: user.name,
      user_id: user.id,
      token: generateToken(user.email, user.id),
    };
  } else {
    failedLoginAttempts[email] = failedAttempts + 1;
    failedLoginAttempts[`${email}_lastAttempt`] = Date.now();
  }

  return null;
}
module.exports = {
  checkLoginCredentials,
};
