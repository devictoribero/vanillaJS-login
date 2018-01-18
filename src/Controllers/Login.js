/*
 * This Module performs the Login logic
 * - Does the login action
 * - Checked if a user exists
 * - Validates the needed fields to make possible the form correct
 *
 * @urls -> Check them on the urlLogin injection
 */
const Login = (_) => {
  const _urls = _.urls;
  const _requestMaker = _.requestMaker;

  /*
   * It checks if a user exist or not.
   * - If YES, returns a user object
   * - If NOT, returns an error object
   */
  function userExists(userData) {
    return _requestMaker.perform({
      url: _urls.get.users,
      method: 'get',
      data: userData,
    });
  }

  function perform(userData) {
    return _requestMaker.perform({
      url: _urls.post.login,
      method: 'post',
      data: userData,
    });
  }

  function redirect(_redirectTo) {
    _requestMaker.redirect(_redirectTo);
  }

  function isValid(userData) {
    return isValidEmail(userData.email) && isValidPassword(userData.password);
  }

  function isValidEmail(email) {
    const PATTERN_EMAIL = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    return email.match(PATTERN_EMAIL);
  }

  function isValidPassword(password) {
    return password.length > 5;
  }

  return {
    isValidEmail,
    isValidPassword,
    isValid,
    userExists,
    perform,
    redirect,
  };
};

export default Login;
