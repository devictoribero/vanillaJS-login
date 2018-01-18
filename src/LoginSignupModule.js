import ViewController from './Controllers/View';
import StateController from './Controllers/State';
import EventsController from './Controllers/Events';
import AnimationsTransitionController from './Controllers/AnimationsTransition';

import urlsLogin from './Controllers/urlsLogin';
import translationsLogin from './Controllers/translationsLogin';
import RequestMaker from './Controllers/RequestMaker';

import Login from './Controllers/Login';
import Signup from './Controllers/Signup';
import './sass/index.sass';

/*
 * We can create a new trigger for the module adding the class
 * `loginSignupModule__triggerToInit` to the element
 */
const triggers = document.getElementsByClassName('loginSignupModule__triggerToInit');
for (let i = 0, n = triggers.length; i < n; i++) {
  const CLASS_OVERFLOW_HIDDEN = 'overflow-hidden';
  triggers[i].addEventListener('click', () => {
    document.body.classList.add(CLASS_OVERFLOW_HIDDEN);
    const _animationsController = AnimationsTransitionController();
    const _stateController = StateController({
      action: null,
      mode: null,
      step: 0,
      hadUserAnAccount: null,
      data: {
        email: null,
        password: null,
        firstName: null,
        lastName: null,
      },
    });
    const requestMaker = RequestMaker();

    const _loginController = Login({
      urls: urlsLogin,
      requestMaker,
    });
    const _signupController = Signup({ urls: urlsLogin, requestMaker });

    const _viewController = ViewController(
      _stateController.getState(),
      translationsLogin,
      urlsLogin,
    );
    _viewController.init(_stateController.getState());

    const _mainNodeToInsertcontent = document.getElementById('loginSignupModule__children');
    _animationsController.slideToRightAndFadeIn(_mainNodeToInsertcontent);

    const _evtsController = EventsController(
      _viewController,
      _stateController,
      _animationsController,
      _loginController,
      _signupController,
    );


    _evtsController.init();
    document.getElementById('loginSignupModule').style.display = 'block';
  });
}
