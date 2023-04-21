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
  window.results = new Results();
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

function addTooltip(object, title) {
    object.setAttribute('title', title);
}

function createDownloadButton(parent, canvas) {
    const download = createControlButton('control-button-standart', 'download');
    parent.append(download);
    addTooltip(download, 'Скачать мем.');
    $(download).click(canvas.download);
}

function createBanButton(parent, canvas) {
    const ban = createControlButton('control-button-ban', 'disabled_visible');
    parent.append(ban);
    addTooltip(ban, 'Скрыть мем пользователя.\nВ начале следующего раунда игрки, чьи мемы были скрыты, будут выгнаны из игры.');
    $(ban).click(canvas.censor.bind(canvas));
}

function createControlButton(subClass, icon) {
    const col = createElement('col col-2');
    const span = createAndAppend('material-icons control-button ' + subClass, col, 'span');
    span.innerHTML = icon;
    return col;
}