/*
 * This module renders all the views needed by the state of the application
 */

const View = (state, translations, urls) => {
  const MODE_MANUAL = 'MANUAL';
  const MODE_FACEBOOK = 'FACEBOOK'
  const FIRST = 0;

  const STEP_INITIAL = 0;
  const STEP_INPUT_EMAIL = 1;
  const STEP_INPUT_PASSWORD = 2;
  const STEP_INPUT_NAMES = 3;
  const STEP_CONFIRMATION = 4;

  const CLASS_DISABLED = 'disabled';

  function init() {
    const headerHTML 	= _getInitialHeader();
    const bodyHTML 		= _getInitialBody();
    document.getElementById('loginSignupModule').innerHTML = `
      <div class="loginSignupForm_topActionBar">
        <span class = "loginSignupForm__close">X</span>
      </div>
			<div
				id="loginSignupModule__children"
				class="loginSignupModule__children">
				${headerHTML + bodyHTML}
			</div>
      <div class="loginSignupForm_continueButtonBar"></div>
    `;
  }

  function _getInitialHeader() {
    const img = {
      url: 'https://upload.wikimedia.org/wikipedia/' +
        'commons/thumb/d/db/Circle-icons-brush-' +
        'pencil.svg/512px-Circle-icons-brush-pencil.svg.png',
      alt: 'logoCompany',
    };

    return `
  		<header class = "loginSignupForm__header">
  			<img 	class = "loginSignupForm__logo"
  					src = "${img.url}"
  					alt="${img.alt}">
  			<h1 class = "loginSignupForm__company-name">
          ${translations.initial.welcome}
        </h1>
  		</header>`;
  }

  function _getInitialBody() {
    return `
      <div id="secundaryNode">
				<div class="loginSignupForm__loginBtn-wrapper">
					<button class="loginSignupForm__loginBtn loginSignupForm__loginBtn--fb">
						${translations.initial.login.facebook}
						<i class="fa fa-facebook" aria-hidden="true"></i>
					</button>
					<button class="loginSignupForm__loginBtn loginSignupForm__loginBtn--manual">
						${translations.initial.login.email}
						<i class="fa fa-keyboard-o" aria-hidden="true"></i>
					</button>
					${_renderTermsAndConditions()}
				</div>
			</div>`;
  }

  function render() {
    if (state.step === STEP_INITIAL) {
      init();
      document.getElementById('loginSignupModule__children').style.opacity = 1;
      return;
    }

    _updateActionBarButtonsBystep(state.step);
    const _nodeToRenderHeaderHtmlContent =
      document.getElementsByClassName('loginSignupForm__header')[FIRST];
    _nodeToRenderHeaderHtmlContent.innerHTML = '';

    const _nodeToRenderBodyHtmlContent =
      document.getElementById('secundaryNode');
    _nodeToRenderBodyHtmlContent.innerHTML = '';


    if (state.mode === MODE_MANUAL) {
      _renderByManualMode(state, {
        header: _nodeToRenderHeaderHtmlContent,
        body: _nodeToRenderBodyHtmlContent,
      });
      return;
    }

    if (state.mode === MODE_FACEBOOK) {}
  }

  function _updateActionBarButtonsBystep(step) {
    const _nodeActionBar =
      document.getElementsByClassName('loginSignupForm_topActionBar')[FIRST];

    // remove go back arrow
    if ((step === STEP_INITIAL || step === STEP_CONFIRMATION) &&
        _nodeActionBar.childElementCount > 1) {
      _removeLastChild(_nodeActionBar);
    }

    // add go back arrow.
    if (step === STEP_INPUT_EMAIL && _nodeActionBar.childElementCount === 1) {
      _nodeActionBar.innerHTML += btnGoBack();
    }
  }

  function getNodeToRenderContent() {
    const _node = document.getElementById('secundaryNode');
    // if (_isManualMode(_state)) {
    //   return _node;
    // }
    return _node;
  }

  // User has chosen the manual login/signup
  function _renderByManualMode(state, _nodesToRender) {
    const _headerHtmlNextStep = _headerHtmlByState(state);
    const _bodyHtmlNextStep = _bodyHtmlByState(state);

    if (state.step === STEP_INPUT_EMAIL) {
      const _header = document.getElementsByClassName('loginSignupForm__header')[FIRST];
      _header.classList.add('text-left');
    }

    _nodesToRender.header.innerHTML = _headerHtmlNextStep;
    _nodesToRender.body.innerHTML = _bodyHtmlNextStep;

    _renderBtnContinue(state);
  }

  function _renderBtnContinue(state) {
    const node = document.getElementsByClassName('loginSignupForm_continueButtonBar')[FIRST];
    node.innerHTML = '';
    node.innerHTML = _printBtnContinue({ disabled: true, step: state.step });
  }

  // Returns the Header Title for each case
  function _headerHtmlByState(_state) {
    if (_state.step === undefined) {
      alert(translations.errors.general);
      return;
    }
    if (_state.step === STEP_INPUT_EMAIL) {
      return `<h1>${translations.email.title}</h1>`;
    }
    if (_state.step === STEP_INPUT_PASSWORD && !_state.hadUserAnAccount) {
      return `<h1>${translations.password.signup.title}</h1>`;
    }
    if (_state.step === STEP_INPUT_PASSWORD && _state.hadUserAnAccount) {
      return `<h1>${translations.password.login.title}</h1>`;
    }
    if (_state.step === STEP_INPUT_NAMES) {
      return `<h1>${translations.names.title}</h1>`;
    }
    if (_state.step === STEP_CONFIRMATION) {
      return '';
    }
  }

  function _bodyHtmlByState(state) {
    let _htmlToRender;
    if (state.step === STEP_INPUT_EMAIL) {
      _htmlToRender =	_renderEmailBlock();
    }
    if (state.step === STEP_INPUT_PASSWORD) {
      _htmlToRender =
        _renderPasswordBlock() +
        _forgotPasswordBlock(urls.restorePassword, translations.password.forgot);
    }

    if (state.step === STEP_INPUT_NAMES) {
      _htmlToRender = _renderFirstNameBlock() + _renderLastNameBlock();
    }
    if (state.step === STEP_CONFIRMATION) {
      _htmlToRender = _renderConfirmation(state);
    }
    return _renderLoginContentWithWrapper(_htmlToRender, state);
  }

  function _renderLoginContentWithWrapper(htmlToWrapper, state) {
    return state.step === STEP_CONFIRMATION
      ? `
        <div class="loginSignupForm__form loginSignupForm__form--confirmation">
          ${htmlToWrapper}
        </div>`
      : `<div class="loginSignupForm__form">${htmlToWrapper}</div>`;
  }

  function _renderLabel(text) {
    return `<label class="loginSignupForm__label">${text}</label>`;
  }

  function _renderInputEmail() {
    return	`
      <input
        type="email"
        name="loginSignupForm__email"
				class="loginSignupForm__input loginSignupForm__input-email"
			/>`;
  }

  function _renderEmailBlock() {
    return `
			<div class="relative">
				${_renderLabel(translations.email.label)} ${_renderInputEmail()}
			</div>`;
  }

  function _renderInputPassword() {
    return 	`
			<input
				type="password"
				name="loginSignupForm__password"
				class="loginSignupForm__input loginSignupForm__input-password"
        data-encrypted="true"
			/>`;
  }

  function _renderBtnEncrypted() {
    return `
      <button class="loginSignupModule__btn-encrypted">
        ${_eyeIcon()}
      </button>`;
  }

  function _eyeIcon() {
    return '<i class="fa fa-eye" aria-hidden="true"></i>';
  }

  function _renderPasswordBlock() {
    return `
			<div class="relative">
				${_renderLabel(translations.password.login.label)}
        ${_renderInputPassword()}
        ${_renderBtnEncrypted()}
			</div>`;
  }

  function _forgotPasswordBlock(url, text) {
    return `<p class="loginSignupForm__forgotPassword">${_renderLink(url, text)}</p>`;
  }

  function _renderLink(url, text) {
    return `<a href="${url}">${text}</a>`;
  }

  function _renderInputFirstName() {
    return `
	    <input
	      type="text"
	      name="loginSignupForm__firstName"
	      class="loginSignupForm__input loginSignupForm__input-firstName"
	    />`;
  }

  function _renderFirstNameBlock() {
    return `
			<div class="relative">
				${_renderLabel(translations.names.label.firstName)}
        ${_renderInputFirstName()}
			</div>`;
  }

  function _renderInputLastName() {
    return `
	    <input
	      type="text"
	      name="loginSignupForm__lastName"
	      class="loginSignupForm__input loginSignupForm__input-lastName"
	    />`;
  }

  function _renderLastNameBlock() {
    const labelLastName = 'Last name';
    return `
			<div class="relative">
				${_renderLabel(translations.names.label.lastName)} ${_renderInputLastName()}
			</div>`;
  }

  function btnGoBack() {
    return '<span class = "loginSignupForm__goBack"><-</span>';
  }

  function _renderTermsAndConditions() {
    const urlTermsAnConditions = 'url_terms';
    return 	`
      <p class="loginSignupForm__terms">${translations.initial.termsAndConditions}
				<a href="${urlTermsAnConditions}">${translations.initial.here}</a>
			</p>`;
  }

  function _printBtnContinue(config) {
    const textContinueMobile = '>';

    const textContinue = _isDesktop()
      ? translations.common.continue
      : textContinueMobile;
    const disabled =
      config.disabled
        ? 'disabled'
        : '';

    const classByStep = getBtnContinueClassByStep(config.step);
    return 	`
	    <button
        id="loginSignupForm__btn-continue"
        class="loginSignupForm__btn-continue ${disabled} ${classByStep}">
	    	${textContinue}
	    </button>`;
  }

  function getBtnContinueClassByStep(step) {
    if (step === STEP_INITIAL) {
      return 'loginSignupForm__btn-initial';
    }

    if (step === STEP_INPUT_EMAIL) {
      return 'loginSignupForm__btn-email';
    }

    if (step === STEP_INPUT_PASSWORD) {
      return 'loginSignupForm__btn-password';
    }

    if (step === STEP_INPUT_NAMES) {
      return 'loginSignupForm__btn-names';
    }

    if (step === STEP_CONFIRMATION) {
      return 'loginSignupForm__btn-confirmation';
    }
  }

  function _isManualMode(_state) {
    return _state.mode === MODE_MANUAL;
  }

  function _isFbMode(_state) {
    return _state.mode === MODE_FACEBOOK;
  }

  function _renderConfirmation(state) {
    const _htmlIconCheck =
    '<i class="fa fa-check-circle-o" aria-hidden="true"></i>';
    return _htmlIconCheck + _confirmationTextStructure(state);
  }

  function _confirmationTextStructure(state) {
    return `<h1>${_confirmationText(state)}</h1>`;
  }

  function _confirmationText(state) {
    return state.hadUserAnAccount
      ? `${translations.confirmation.login.hey} ${state.data.firstName}, <br>
        ${translations.confirmation.login.whatsup}`
      : `${translations.confirmation.signup.welcome} ${state.data.firstName}!`;
  }

  function _isDesktop() {
    return window.innerWidth > 1024;
  }

  function _removeLastChild(node) {
    node.children[node.childElementCount - 1].remove();
  }

  function showError(state) {
    showLabelsAsRed(state);
    showInputsAsRed(state);
  }

  function showLabelsAsRed(state) {
    const labels = document.getElementsByClassName('loginSignupForm__label');
    for (let i = 0, n = labels.length; i < labels.length; i++) {
      labels[i].classList.add('incorrect');
    }
  }

  function showInputsAsRed(state) {
    const inputs = document.getElementsByClassName('loginSignupForm__input');
    for (let i = 0, n = inputs.length; i < inputs.length; i++) {
      inputs[i].classList.add('incorrect');
    }
  }

  return {
    init,
    render,
    showError,
  };
};

export default View;
