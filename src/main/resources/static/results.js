class Results {

  constructor() {
    this.content = $('body');
  }

  initResults(lobby, asLeader) {
    this.content.empty();
    window.grade.buddied = false;
    const content = createElement('content');
    this.content.append(content);

    const container = createAndAppend('container py-5', content);
    this.timer = new Timer(container, () => {
            if (asLeader) {
                window.blacklist.forEach(e => window.ws.kickPlayer(lobby.id, e));
            }
        });
    this.timer.initTimer(49);

    const row = createAndAppend('row row-cols-1 row-cols-lg-12 justify-content-between g-3', container);
    let col = createAndAppend('col col-lg-6 order-2 order-lg-1 backgrounded', row);
    this.resultParent = createAndAppend('row justify-content-between p-3', col);
    lobby.round.memes.sort((a, b) => a.score > b.score);
    lobby.round.memes.forEach(meme => {
        const player = lobby.players.find(p => p.id === meme.playerId);
        this.addResultMeme(player, meme, asLeader)
    })

    col = createAndAppend('col col-lg-6 order-1 order-lg-2 gx-lg-5', row);
    this.scoreParent = createAndAppend('row py-3 backgrounded', col);
    lobby.players.sort((a, b) => a.score > b.score);
    lobby.players.forEach((player, index)  => {
        const meme = lobby.round.memes.find(m => m.playerId === player.id);
        this.addResultScore(player, meme, index != 0)
    })
  }

  addResultMeme(player, meme, asLeader) {
    let col = createAndAppend('col col-auto', this.resultParent);
    this.addAvatar(col, player.avatarId, player.name);

    col = createAndAppend('col col-auto d-flex align-content-center flex-wrap', this.resultParent);
    const scoreDiv = createAndAppend('col col-auto d-flex align-content-center flex-wrap', col);
    scoreDiv.innerHTML = meme.score;

    col = createAndAppend('col col-12', this.resultParent);
    const canvas = new Canvas();
    const afterLoad = function () {
        for (let i = 0; i < meme.caps.length; i++) {
            canvas.draw(meme.lines[i], meme.caps[i]);
        }
        if (window.blacklist.includes(meme.playerId)) {
            canvas.censor();
        }
    };
    canvas.initCanvas(col, afterLoad);
    canvas.updateImage(meme.img, afterLoad);
    const row = createAndAppend('row justify-content-end', col);

    if (asLeader) {
        createBanButton(row, canvas);
    }
    createDownloadButton(row, canvas);
  }

  addResultScore(player, meme, addSplitter){
    if(addSplitter) createAndAppend('w-100 solid', this.scoreParent, 'hr');
    let col = createAndAppend('col', this.scoreParent);
    this.addAvatar(col, player.avatarId, player.name);

    col = createAndAppend('col', this.scoreParent);
    const table = createAndAppend('table table-borderless', col, 'table');
    this.addTableRow(table, 'Всего очков:', player.score);
    this.addTableRow(table, 'Очки за мем:', meme.plusMeme);
    if(meme.plusBuddy) this.addTableRow(table, 'Разделил мембади:', meme.plusBuddy);
    if(meme.plusHasBuddy) this.addTableRow(table, 'Получен мембади:', meme.plusHasBuddy);
  }

  addTableRow(table, title, value){
    const row = table.insertRow(-1);
    let cell = row.insertCell(0);
    cell.classList.add("col-2")
    cell.innerText = title;
    cell = row.insertCell(1);
    cell.classList.add("col-2")
    cell.innerText = value > 0 ? '+' + value : value;
  }

  addAvatar(parent, avatarId, name) {
    let img = createAndAppend('player-avatar', parent, 'img');
    img.src = 'ava/ava' + avatarId + '.png';
    parent.innerHTML += name;
  }
}