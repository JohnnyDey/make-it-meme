//Common file for application
function initWrappers() {
  window.ws = new WebSocketWrapper();
  let searchParams = new URLSearchParams(window.location.search)
  if (searchParams.has('id')) {
    window.ws.joinLobby('fake', searchParams.get('id'));
  }
  window.main = new Main();
  window.lobby = new Lobby();
  window.creation = new Creation();
}

$(function () {
    initWrappers();
    window.main.initMainPage();
    $( "#lobby" ).click(function() {
      window.ws.createLobby('fake (create)');
      window.lobby.initLobbyPage();
    });
});

function createAndAppend(cl, parent) {
    const elem = createElement(cl);
    parent.append(elem);
    return elem;
}

function createElement(cl, type, innerText) {
  const elem = document.createElement(type || "div")
  if (innerText) {
    elem.innerText = innerText;
  }
  if (typeof cl === 'string') {
    if (cl.includes('')) {
      classArray = cl.split(' ')
      for (let i = 0; i < classArray.length; i++){
        elem.classList.add(classArray[i]);
      }
    } else {
      elem.classList.add(cl)
    }
  }
  return elem;
}
