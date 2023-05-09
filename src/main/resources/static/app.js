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

function checkAuthParams() {
  if (document.URL.includes('#')) {
    let url = document.URL.replaceAll('#', '?');
    location.replace(url);
  } else if (document.URL.includes('?')) {
    const access_token = new URLSearchParams(window.location.search).get('access_token');
    localStorage.setItem('twitch_access_token', access_token);
  }
}

function hideParams() {
    if (document.URL.includes('?')) {
        const baseUrl = document.URL.split('?')[0];
        window.history.pushState({}, document.title, window.location.origin);
    }
}

async function validateTokens() {
    const token = localStorage.getItem('twitch_access_token');
    if (token) {
        const response = await fetch('https://id.twitch.tv/oauth2/validate', {
            headers: {
              'Authorization': `OAuth ${token}`
            }
        });

        if (!response.ok) {
            localStorage.removeItem('twitch_access_token');
        }
    }
}

$(function () {
    checkAuthParams();
    hideParams();
    initWrappers();
    window.main.initMainPage();
    $.when(validateTokens()).then(() => {window.main.actualNavbar()})
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