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

function createElement(cl, type, innerText) {
  const elem = document.createElement(type || "div")
  if(innerText) {
    elem.innerText = innerText;
  }
  if (Array.isArray(cl)) {
    for (let i = 0; i < cl.length; i++){
      elem.classList.add(cl[i]);
    }
  } else if(typeof cl === 'string'){
    elem.classList.add(cl)
  }
  return elem;
}
