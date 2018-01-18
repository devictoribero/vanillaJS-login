/*
 * This Module performs the Signup logic
 * - Does the Signup action
 * - Validates the needed fields to make possible the form correct
 *
 * @urls -> Check them on the urlLogin injection
 */
const Signup = (_) => {
  function perform(userData) {
    return _.requestMaker.post(_.login, 'post', userData);
  }

  function isValid(userData) {
    return _isValidEmail(userData.email) &&
      _isValidPassword(userData.password) &&
      isValidName(userData.firstName) &&
      isValidName(userData.lastName);
  }

  function _isValidEmail(email) {
    const PATTERN_EMAIL = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    return email.match(PATTERN_EMAIL);
  }

  function _isValidPassword(password) {
    return password.length > 5;
  }

  function isValidName(text) {
    if (text === undefined || text === null) return;
    if (text.length <= 3) return;
    return true;
  }

  function areValidNames(data) {
    if (data.firstName === undefined || data.lastName === undefined ||
        data.firstName === null || data.lastName === null ||
        data.firstName === '' || data.lastName === '') {
      return;
    }
    if (!isValidName(data.firstName) && !isValidName(data.lastName)) return;
    return true;
  }

  return {
    isValidName,
    areValidNames,
    isValid,
    perform,
  };
};

export default Signup;
