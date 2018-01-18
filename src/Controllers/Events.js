/*
 * This Module controls the addEventListeners of the view rendered
 */
const Events = (
  viewController,
  stateController,
  animationsController,
  loginController,
  signupController,
) => {
  const FIRST = 0;
  const NOT_FOUND = -1;
  const ENTER = 13;

  const CLASS_MANUAL = 'loginSignupForm__loginBtn--manual';
  const CLASS_FB = 'loginSignupForm__loginBtn--fb';
  const CLASS_DISABLED = 'disabled';
  const CLASS_CHECKED = 'checked';
  const CLASS_BTN_GOBACK = 'loginSignupForm__goBack';
  const CLASS_BTN_CLOSE = 'loginSignupForm__close';
  const CLASS_OVERFLOW_HIDDEN = 'overflow-hidden';

  const MODE_MANUAL = 'MANUAL';
  const MODE_FACEBOOK = 'FACEBOOK';

  const STEP_INITIAL = 0;
  const STEP_INPUT_EMAIL = 1;
  const STEP_INPUT_PASSWORD = 2;
  const STEP_INPUT_NAMES = 3;
  const STEP_CONFIRMATION = 4;


  const TIMING_FOR_ANIMATION_PERFORMANCE = 200;

  // Events captured in View_init
  function init() {
    document.getElementById('loginSignupModule')
      .addEventListener('click', (evt) => { _addListenersInitStep(evt); });

    document.addEventListener('click', (evt) => {
      if (evt.target.className.indexOf(CLASS_BTN_GOBACK) !== -1) {
        const currentState = stateController.getState().step;
        stateController.setStep(currentState - 1);
        viewController.render(stateController.getState());
        _loadListenersByState(stateController.getState());
      }

      if (evt.target.className.indexOf(CLASS_BTN_CLOSE) !== -1) {
        const children = document.getElementById('loginSignupModule__children');
        animationsController.slideToLeftAndFadeOut(children);
        document.body.classList.remove(CLASS_OVERFLOW_HIDDEN);
        setTimeout(() => {
          document.getElementById('loginSignupModule').style.display = 'none';
        }, TIMING_FOR_ANIMATION_PERFORMANCE);
      }
    });
  }

  function _addListenersInitStep(evt) {
    const _target = evt.target;
    if (_userSelectedManualMode(_target.className)) {
      // If the user has click in `Continue with email`
      // we procedure to do the login/signup manually
      stateController.setMode(MODE_MANUAL);
      const _loginBtnsWrapper =
        document.getElementsByClassName('loginSignupForm__loginBtn-wrapper')[FIRST];
      animationsController.slideToLeftAndFadeOut(_loginBtnsWrapper);
      // This timeout makes possible the animationsController performance
      // If not, the component would be rendered inmediately without animation
      setTimeout(() => {
        _removeInitStepListeners();
        stateController.setStep(STEP_INPUT_EMAIL);
        viewController.render(stateController.getState());
        _addListenersEmailStep();
      }, TIMING_FOR_ANIMATION_PERFORMANCE);
      return;
    }


    if (_isFbMode(_target.className)) {
      // If the user has click in `Continue with email`
      // we procedure to do the login/signup manually
      // Facebook login logic
      // All the complex stuff
    }
  }

  function _removeInitStepListeners() {
    document.getElementById('loginSignupModule')
      .removeEventListener('click', (evt) => { _addListenersInitStep(evt); });
  }

  // Adds the listeners and logic needed to have in the introduce email step
  function _addListenersEmailStep() {
    const _inputEmail = document.getElementsByClassName('loginSignupForm__input-email')[FIRST];
    const _btnContinue = document.getElementsByClassName('loginSignupForm__btn-email')[FIRST];

    _inputEmail.addEventListener('input', (evt) => { _enableContinueButtonIfEmailIsOK(evt, _btnContinue); });

    _inputEmail.addEventListener('keyup', (evt) => { _submitEmailByEnter(evt); });

    _btnContinue.addEventListener('click', function _submitEmailByClick(evt) {
      const _email = document.getElementsByClassName('loginSignupForm__input-email')[FIRST].value;
      if (!loginController.isValidEmail(_email) && evt.keycode === 13) {
        alert(`Mostrar error, email no valido:' ${_email}`);
      }
      _moveFromEmailToPasswordStep(_email);
      this.removeEventListener('click', _submitEmailByClick);
    });
  }

  // Renders and calls the addListeners for introduce password step
  // if the email is valid to submit
  function _moveFromEmailToPasswordStep(email) {
    stateController.setState({ email });
    const _wrapperLoginForm = document.getElementsByClassName('loginSignupForm__form')[FIRST];
    animationsController.slideToLeftAndFadeOut(_wrapperLoginForm);

    // Check if the user already exist in our platform
    let _userInformation = loginController.userExists({ email });
    console.log(_userInformation);
    setTimeout(() => {
      stateController.setState(_userInformation);
      // It will make posible to know if we will have
      // To log in or sign up the user
      if (_userInformation.error === undefined) {
        stateController.setHadUserAnAccount(false);
      } else {
        stateController.setHadUserAnAccount(true);
        stateController.setState({ password: _userInformation.password });
      }
      // This timeout makes possible the animationsController performance
      // If not, the component would be rendered inmediately without animation
      setTimeout(() => {
        stateController.setStep(STEP_INPUT_PASSWORD);
        viewController.render(stateController.getState());
        _addListenersPasswordStep();
      }, TIMING_FOR_ANIMATION_PERFORMANCE);
    }, 2000);
  }

  function _addListenersPasswordStep() {
    const _inputPassword = document.getElementsByClassName('loginSignupForm__input-password')[FIRST];
    const _btnContinue = document.getElementsByClassName('loginSignupForm__btn-password')[FIRST];
    const _hasAlreadyAnAccount = stateController.getState().hadUserAnAccount;
    const _btnEncrypt = document.getElementsByClassName('loginSignupModule__btn-encrypted')[FIRST];

    _btnEncrypt.addEventListener('click', () => {
      const newEncryptedValue =
        _givenBooleanStringReturnsOpposite(_inputPassword.dataset.encrypted);
      _changeInputTypeDependingOnDataEncrypted(_inputPassword, newEncryptedValue);
      _updateClassEncryptButton(newEncryptedValue, _btnEncrypt);
      _inputPassword.dataset.encrypted = newEncryptedValue;
    });

    function _updateClassEncryptButton(isEncryptedBoolString, btn) {
      const icon = btn.querySelector('i');
      const classToAdd =
        isEncryptedBoolString === 'true' ? 'fa-eye' : 'fa-eye-slash';
      const classToRemove =
        isEncryptedBoolString === 'true' ? 'fa-eye-slash' : 'fa-eye';

      icon.classList.add(classToAdd);
      icon.classList.remove(classToRemove);
    }

    _inputPassword.addEventListener('input', (evt) => {
      _enableContinueButtonIfPasswordIsOK(evt, _hasAlreadyAnAccount);
    });

    _inputPassword.addEventListener('keyup', (evt) => {
      const [_password, keyCode] = [evt.target.value, evt.keyCode];

      if (_password !== stateController.getState().data.password &&
          keyCode === ENTER &&
          _hasAlreadyAnAccount) {
        viewController.showError(stateController.getState());
        return;
      }

      if (keyCode === ENTER && !loginController.isValidPassword(_password)) {
        alert(`Mostrar error, password no valido:' ${_password}`);
        return;
      }

      if (keyCode === ENTER && loginController.isValidPassword(_password)) {
        stateController.setState({ password: _password });
        _moveFromPasswordToNextStep();
      }
    });

    _btnContinue.addEventListener('click', () => {
      const _password = document.getElementsByClassName('loginSignupForm__input-password')[FIRST].value;
      if (!loginController.isValidPassword(_password)) {
        alert('password not valid'); return;
      }

      if (_password !== stateController.getState().data.password && _hasAlreadyAnAccount) {
        viewController.showError(stateController.getState());
        return;
      }

      stateController.setState({ password: _password });
      _moveFromPasswordToNextStep();
    });
  }

  function _moveFromPasswordToNextStep() {
    const _userLoginInformation = stateController.getDataToLogin();

    if (stateController.getHadUserAnAccount()) {
      try {
        _logIn(_userLoginInformation);
        // If the function _login throws an error because something wrong
        // happened, the code below is not going to execute
        showConfirmationStep({ duration: 1000 });
      } catch (error) {
        alert(error.message);
        return;
      }

      return;
    }

    const _wrapperLoginForm = document.getElementsByClassName('loginSignupForm__form')[FIRST];
    animationsController.slideToLeftAndFadeOut(_wrapperLoginForm);
    // This timeout makes possible the animationsController performance
    // If not, the component would be rendered inmediately without animation
    setTimeout(() => {
      stateController.setStep(STEP_INPUT_NAMES);
      viewController.render(stateController.getState());
      _addListenersNamesStep();
    }, TIMING_FOR_ANIMATION_PERFORMANCE);
  }

  function _addListenersNamesStep() {
    const _btnContinue = document.getElementsByClassName('loginSignupForm__btn-names')[FIRST];
    const _firstName = document.getElementsByClassName('loginSignupForm__input-firstName')[FIRST];
    const _lastName = document.getElementsByClassName('loginSignupForm__input-lastName')[FIRST];

    _firstName.addEventListener('keyup', (evt) => {
      const names = {
        firstName: document.getElementsByClassName('loginSignupForm__input-firstName')[0].value,
        lastName: document.getElementsByClassName('loginSignupForm__input-lastName')[0].value,
      };

      stateController.setState({ firstName: evt.target.value });
      _showAndRemoveInputCheckIfValid(evt.target);
      if (signupController.isValidName(evt.target.value)) {
        _enableBtnIfNamesAreValid(_btnContinue, names);
        if (evt.keycode === ENTER) {
          const _userInformation = stateController.getDataToSignup();
          if (signupController.isValid(_userInformation)) {
            _signUpAndShowConfirmationPage(_userInformation);
          }
        }
      }
    });

    _lastName.addEventListener('keyup', (evt) => {
      const names = {
        firstName: document.getElementsByClassName('loginSignupForm__input-firstName')[0].value,
        lastName: document.getElementsByClassName('loginSignupForm__input-lastName')[0].value,
      };

      stateController.setState({ lastName: evt.target.value });
      _showAndRemoveInputCheckIfValid(evt.target);
      if (signupController.isValidName(evt.target.value)) {
        _enableBtnIfNamesAreValid(_btnContinue, names);
        if (evt.keycode === ENTER) {
          const _userInformation = stateController.getDataToSignup();
          if (signupController.isValid(_userInformation)) {
            _signUpAndShowConfirmationPage(_userInformation);
          }
        }
      }
    });

    _btnContinue.addEventListener('click', () => {
      const _userInformation = stateController.getDataToSignup();
      if (signupController.isValid(_userInformation)) {
        _signUpAndShowConfirmationPage(_userInformation);
      }
    });
  }

  function _isFbMode(_eventTargetClassnames) {
    return _eventTargetClassnames.indexOf(CLASS_FB) !== -1;
  }

  function showConfirmationStep(_) {
    const _wrapperLoginForm = document.getElementsByClassName('loginSignupForm__form')[FIRST];
    animationsController.slideToLeftAndFadeOut(_wrapperLoginForm);
    // This timeout makes possible the animationsController performance
    // If not, the component would be rendered inmediately without animation
    setTimeout(() => {
      stateController.setStep(STEP_CONFIRMATION);
      viewController.render(stateController.getState());
    }, TIMING_FOR_ANIMATION_PERFORMANCE);
    // This view is going to be live as much time as we especificate
    setTimeout(() => {
      loginController.redirect();
    }, _.duration + TIMING_FOR_ANIMATION_PERFORMANCE);
  }

  function _enableContinueButtonIfPasswordIsOK(evt) {
    const _target = evt.target;
    const _value = _target.value;
    const _btnContinue = document.getElementsByClassName('loginSignupForm__btn-continue')[FIRST];

    if (loginController.isValidPassword(_value)) {
      _target.classList.remove(CLASS_DISABLED);
      _btnContinue.classList.remove(CLASS_DISABLED);
      return;
    }

    _target.classList.add(CLASS_DISABLED);
    _btnContinue.classList.add(CLASS_DISABLED);
  }

  function _enableBtnIfNamesAreValid(button, names) {
    if (signupController.areValidNames(names) && _isDisabled(button)) {
      _enable(button);
      return;
    }

    if (!signupController.areValidNames(names)) {
      _disable(button);
    }
  }

  function _enable(button) {
    button.classList.remove(CLASS_DISABLED);
  }

  function _disable(button) {
    button.classList.add(CLASS_DISABLED);
  }

  function _isDisabled(button) {
    return button.className.indexOf(CLASS_DISABLED) !== NOT_FOUND;
  }

  function _showAndRemoveInputCheckIfValid(target) {
    if (!signupController.isValidName(target.value) && _isInputCheckShown(target)) {
      _toggleCheckInInputField({ show: false, target });
      target.classList.remove(CLASS_CHECKED);
      return;
    }
    if (signupController.isValidName(target.value) && !_isInputCheckShown(target)) {
      _toggleCheckInInputField({ show: true, target });
      target.classList.add(CLASS_CHECKED);
    }
  }

  function _createCheckIconNode() {
    const _check = document.createElement('i');
    _check.className += 'fa fa-check hisInputIsValid';
    _check.setAttribute('aria-hidden', 'true');
    return _check;
  }

  function _toggleCheckInInputField(_) {
    const _parentNode = _.target.parentNode;
    if (_.show) {
      _parentNode.appendChild(_createCheckIconNode());
      return;
    }
    _parentNode.removeChild(_parentNode.children[_parentNode.childElementCount - 1]);
  }

  function _givenBooleanStringReturnsOpposite(booleanString) {
    return booleanString === 'true' ? 'false' : 'true';
  }

  function _changeInputTypeDependingOnDataEncrypted(input, stringBoolean) {
    const type = _getInputTypeByStringBoolean(stringBoolean);
    input.setAttribute('type', type);
  }

  function _getInputTypeByStringBoolean(stringBoolean) {
    return stringBoolean === 'true' ? 'password' : 'text';
  }

  function _isInputCheckShown(target) {
    return target.parentNode.lastElementChild.nodeName === 'I';
  }

  function _userSelectedManualMode(_eventTargetClassnames) {
    return _eventTargetClassnames.indexOf(CLASS_MANUAL) !== -1;
  }

  function _logIn(data) {
    let loginResponse = loginController.perform(data);
    if (loginResponse.status !== 200) {
      throw { message: 'show user could not log in. Something wrong happened!' }
    }
  }


  function _signUp(data) {
    let signupResponse = signupController.perform(data);
    if (signupResponse.status !== 200) {
      throw { message: 'show user could not signup. Something wrong happened!' }
    }
  }

  function _signUpAndShowConfirmationPage(_userSignupInformation) {
    try {
      _signUp(_userSignupInformation);
      const _wrapperLoginForm = document.getElementsByClassName('loginSignupForm__form')[FIRST];
      animationsController.slideToLeftAndFadeOut(_wrapperLoginForm);
      stateController.setHadUserAnAccount(false);
      // This timeout makes possible the animationsController performance
      // If not, the component would be rendered inmediately without animation
      setTimeout(() => {
        stateController.setStep(STEP_CONFIRMATION);
        viewController.render(stateController.getState());
      }, TIMING_FOR_ANIMATION_PERFORMANCE);
    } catch (error) {
      alert(error.message);
    }
  }

  function _enableContinueButtonIfEmailIsOK(evt, btnContinue) {
    const _value = evt.target.value;

    if (loginController.isValidEmail(_value)) {
      btnContinue.classList.remove(CLASS_DISABLED);
      return;
    }
    btnContinue.classList.add(CLASS_DISABLED);
  }

  function _submitEmailByEnter(evt) {
    const _email = evt.target.value;
    const _keyCode = evt.keyCode;

    if (_keyCode === ENTER && loginController.isValidEmail(_email)) {
      _moveFromEmailToPasswordStep(_email);
      return;
    }
    if (_keyCode === ENTER && !loginController.isValidEmail(_email)) {
      alert(`Mostrar error, email no valido:' ${_email}`);
    }
  }

  function _loadListenersByState(state) {
    if (state.step === STEP_INPUT_EMAIL) {
      _addListenersEmailStep();
    }
    if (state.step === STEP_INPUT_PASSWORD) {
      _addListenersPasswordStep();
    }
  }

  return {
    init,
  };
};

export default Events;
