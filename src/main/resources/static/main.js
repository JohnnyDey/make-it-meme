// Main Page
class Main {
  maxId = 7;
  constructor() {
    this.content = $('body');
    this.avaId = Math.floor(Math.random() * this.maxId);
  }

  initMainPage() {
    this.content.empty();
    const content = createElement('content');
    this.content.append(content);

    const container = createAndAppend('container py-5', content);
    let row = createAndAppend('row row-cols-1 justify-content-center gy-5', container);
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
    col.append(nameInput);
    this.nameInput = $(nameInput);

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
          window.ws.createLobby(this.nameInput.val(), this.avaId);
        } else {
          window.ws.joinLobby(this.nameInput.val(), this.codeInput.val(), this.avaId);
        }
        window.lobby.initLobbyPage();
      } else {
        alert('Необходимо ввести имя.');
      }
    }.bind(this));
  }

  isCodeEmpty() {
    return this.codeInput.val().length == 0;
  }

  getAvaSrc() {
    return 'ava/ava' + this.avaId + '.png';
  }
}