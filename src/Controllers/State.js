/*
 * This Module controls de current State.
   {
    action,
    mode,
    step,
    hadUserAnAccount,
    data: {
      email,
      password,
      firstName,
      lastName
    }
  }
 */
const State = (config) => {
  const _ = config;


  function setMode(mode) {
    _.mode = mode;
  }

  function setStep(step) {
    _.step = step;
  }

  function setHadUserAnAccount(bool) {
    _.hadUserAnAccount = bool;
  }

  function getState() {
    return _;
  }

  function setState(state) {
    if (state !== undefined) {
      if (state.email !== undefined) {
        _.data.email = state.email;
      }
      if (state.password !== undefined) {
        _.data.password = state.password;
      }
      if (state.firstName !== undefined) {
        _.data.firstName = state.firstName;
      }
      if (state.lastName !== undefined) {
        _.data.lastName = state.lastName;
      }
    }
  }

  function getHadUserAnAccount() {
    return _.hadUserAnAccount;
  }

  function getDataToLogin() {
    return {
      email: _.data.email,
      password: _.data.password,
    };
  }

  function getDataToSignup() {
    return {
      email: _.data.email,
      password: _.data.password,
      firstName: _.data.firstName,
      lastName: _.data.lastName,
    };
  }

  return {
    setState,
    setMode,
    setStep,
    setHadUserAnAccount,
    getState,
    getHadUserAnAccount,
    getDataToLogin,
    getDataToSignup,
  };
};

export default State;
