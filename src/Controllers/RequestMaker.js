/*
 * This Module controls the HTTP Petitions
 * To login, signup and check Email
 */
const RequestMaker = () => {

  function perform(_config) {
    $.ajax({
      url: _config.url,
      method: _config.method,
      data: _config.data,
    }).done((response) => {
      return response;
    });
  }

  function redirect(_url) {
    window.location = _url;
  }

  return {
    perform,
    redirect,
  };
};

export default RequestMaker;
