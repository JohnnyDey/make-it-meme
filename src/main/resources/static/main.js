// Main Page
class Main {
  constructor() {
    this.content = $('body');
  }

  initMainPage() {
    this.content.empty();
    const background = createElement('background');
    this.content.append(background);

    const content = createElement('content');
    background.append(content);

    const logo = createElement('logo', 'img');
    logo.src = 'assets/Logo.png';
    content.append(logo);

    this.initProfile(content);
    this.initControl(content);
  }

  initProfile(parent){
    const wrapper = createElement('registration');
    parent.append(wrapper);

    const avatar = createElement('avatar');
    wrapper.append(avatar);
    const avatarImg = createElement(null, 'img');
    avatarImg.src = 'assets/avatar1.png';
    avatar.append(avatarImg);

    const arrow = createElement('arrow');
    avatar.append(arrow);

    const arrowImg = createElement(null, 'img');
    arrowImg.src = 'assets/arrow.png';
    arrowImg.height='30';
    arrow.append(arrowImg);

    const nameInput = createElement('name', 'input');
    nameInput.type = 'text';
    nameInput.placeholder = 'Введите имя';
    nameInput.maxLength = 15;
    wrapper.append(nameInput);
    this.nameInput = $(nameInput);
  }

  initControl(parent){
    const wrapper = createElement('registration-buttons');
    parent.append(wrapper);

    const action = createElement('registration-button', null, 'Создать игру');
    this.action = $(action);
    wrapper.append(action);

    const codeInput = createElement('name', 'input');
    codeInput.type = 'text';
    codeInput.placeholder = 'Код комнаты';
    codeInput.maxLength = 5;
    wrapper.append(codeInput);

    this.codeInput = $(codeInput);
    this.codeInput.keyup(function(){
      this.action.html(this.isCodeEmpty() ? 'Создать игру' : 'Присоединится к игре');
    }.bind(this));

    this.action.click(function(){
      if(this.nameInput.val()) {
        if(this.isCodeEmpty()) {
          window.ws.createLobby(this.nameInput.val());
        } else {
          window.ws.joinLobby(this.nameInput.val(), this.codeInput.val());
        }
        window.lobby.initLobbyPage();
      } else {
        alert('звать тебя как?');
      }
    }.bind(this));
  }

  isCodeEmpty() {
    return this.codeInput.val().length == 0;
  }
}