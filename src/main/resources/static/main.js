// Main Page
class Main {
  maxId = 7;
  constructor() {
    this.content = $('body');
    this.avaId = Math.floor(Math.random() * this.maxId);
  }

  initMainPage(errorMsg) {
    this.content.empty();
    const content = createElement('content');
    this.content.append(content);

    this.createNavbar(content);

    if (errorMsg) {
        const alert = createAndAppend('alert alert-danger alert-dismissible fade show', content);
        alert.setAttribute('role', 'alert');
        alert.append(createElement(null, 'div', errorMsg));
    }
    const container = createAndAppend('container py-5', content);
    let row = createAndAppend('row row-cols-1 justify-content-center gy-5', container, 'form');
    let col = createAndAppend('col d-flex justify-content-around', row);
    const logo = createElement('logo', 'img');
    logo.src = 'assets/logo.png';
    col.append(logo);

    col = createAndAppend('col d-flex justify-content-around', row);

    const avatar = createAndAppend('avatar', col);
    const avatarImg = createElement(null, 'img');
    avatarImg.src = this.getAvaSrc();
    avatar.append(avatarImg);

    const arrow = createAndAppend('arrow', avatar);

    const arrowImg = createElement(null, 'img');
    arrowImg.src = 'assets/arrow.png';
    arrowImg.height='30';
    $(arrowImg).click(function(){
        if (++this.avaId > this.maxId) {
            this.avaId = 0;
        }
        avatarImg.src = this.getAvaSrc();
    }.bind(this));
    arrow.append(arrowImg);

    col = createAndAppend('col-8 d-flex justify-content-around', row);

    const nameInput = createElement('text', 'input');
    nameInput.type = 'text';
    nameInput.placeholder = 'Введите имя';
    nameInput.maxLength = 15;
    nameInput.required = true;
    col.append(nameInput);
    this.nameInput = $(nameInput);

    const accessToken = localStorage.getItem('twitch_access_token');
    if (accessToken) {
        fetch('https://api.twitch.tv/helix/users', {
          headers: {
            'Client-ID': 'cnev6y1p1y3yyafvt9n3paa3qd3dfl',
            'Authorization': 'Bearer ' + accessToken
            }
          })
          .then(response => response.json())
          .then(data => {
            const userName = data.data[0].display_name;
            nameInput.value = userName;
            nameInput.disabled = true;
          })
          .catch(error => {
            console.log('Произошла ошибка:', error);
          });

    }


    col = createAndAppend('col', row);

    row = createAndAppend('row row-cols-2 justify-content-center', col);
    col = createAndAppend('col-4 d-flex justify-content-around', row);

    const action = createElement(null, 'button', 'Создать игру');
    this.action = $(action);
    col.append(action);

    col = createAndAppend('col-4 d-flex justify-content-around', row);
    const codeInput = createElement('text', 'input');
    codeInput.type = 'text';
    codeInput.placeholder = 'Код комнаты';
    codeInput.maxLength = 5;
    col.append(codeInput);

    this.codeInput = $(codeInput);
    this.codeInput.keyup(function(){
      this.action.html(this.isCodeEmpty() ? 'Создать игру' : 'Присоединится к игре');
    }.bind(this));

    this.action.click(function(){
      if(this.nameInput.val()) {
        if(this.isCodeEmpty()) {
          window.ws.createLobby(this.nameInput.val(), this.avaId, true);
        } else {
          window.ws.joinLobby(this.nameInput.val(), this.codeInput.val(), this.avaId);
        }
        window.lobby.initLobbyPage();
      }
    }.bind(this));
  }

  createNavbar(parent) {
      const nav = createAndAppend('navbar bg-info', parent, 'nav');
      const container = createAndAppend('container-sm', nav);

      container.append(this.createBrand('assets/twitch-icon.svg'));
      this.actualNavbar();
  }

  actualNavbar() {
    const twitch_access_token = localStorage.getItem('twitch_access_token');
    const img = this.twitch.children[0];
    const twitchLabel =  twitch_access_token ? 'Выйти' : 'Войти';
    this.twitch.innerHTML = ' ' + twitchLabel;
    this.twitch.prepend(img);
    const action = twitch_access_token ? () => {
        localStorage.removeItem('twitch_access_token');
        this.actualNavbar();
        this.nameInput.prop('disabled', false);
    } : () => {
        const location = window.location.href + 'auth';
        const twitchAuthUrl = 'https://id.twitch.tv/oauth2/authorize?client_id=cnev6y1p1y3yyafvt9n3paa3qd3dfl&redirect_uri=' + location + '&response_type=token';
        window.open(twitchAuthUrl, '_self');
    };
    $(this.twitch).click(action);
  }

  createBrand(src) {
    const a = createElement('navbar-brand', 'a');
    const img = createAndAppend(null, a, 'img');
    img.width = 20;
    img.height = 20;
    img.src = src;
    this.twitch = a;
    return a;
  }

  isCodeEmpty() {
    return this.codeInput.val().length == 0;
  }

  getAvaSrc() {
    return 'ava/ava' + this.avaId + '.png';
  }
}