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
  window.grade = new Grade();
}

$(function () {
    initWrappers();
    window.main.initMainPage();
});

function createAndAppend(cl, parent, type) {
    const elem = createElement(cl, type);
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