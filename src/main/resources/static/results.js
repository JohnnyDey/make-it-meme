class Results {

  constructor() {
    this.content = $('body');
  }

  initResults(lobby) {
    console.log(lobby);
    this.content.empty();
    const content = createElement('content');
    this.content.append(content);

    const container = createAndAppend('container py-5', content);
    const row = createAndAppend('row row-cols-1 row-cols-lg-12 justify-content-between g-3', container);
    let col = createAndAppend('col col-lg-6 order-2 order-lg-1 backgrounded', row);
    this.resultParent = createAndAppend('row justify-content-between p-3', col);
    lobby.round.memes.sort((a, b) => a.score > b.score);
    lobby.round.memes.forEach(meme => {
        const player = lobby.players.find(p => p.id === meme.playerId);
        this.addResultMeme(player, meme)
    })

    col = createAndAppend('col col-lg-6 order-1 order-lg-2 gx-lg-5', row);
    this.scoreParent = createAndAppend('row py-3 backgrounded', col);
    lobby.players.sort((a, b) => a.score > b.score);
    lobby.players.forEach(player => {
        this.addResultScore(player)
    })
  }

  addResultMeme(player, meme) {
    let col = createAndAppend('col col-auto', this.resultParent);
    this.addAvatar(col, player.avatarId, player.name);

    col = createAndAppend('col col-auto d-flex align-content-center flex-wrap', this.resultParent);
    const scoreDiv = createAndAppend('col col-auto d-flex align-content-center flex-wrap', col);
    scoreDiv.innerHTML = meme.score;

    col = createAndAppend('col col-12 d-flex justify-content-center py-3', this.resultParent);
    const canvas = new Canvas();
    canvas.initCanvas(col);
    const afterLoad = function () {
        for (let i = 0; i < meme.caps.length; i++) {
            canvas.draw(meme.lines[i], meme.caps[i]);
        }
    };
    canvas.updateImage(meme.img, afterLoad)
  }

  addResultScore(player){
    let col = createAndAppend('col col-auto', this.scoreParent);
    this.addAvatar(col, player.avatarId, player.name);

    col = createAndAppend('col d-flex justify-content-end', this.scoreParent);
    const table = createAndAppend('table table-borderless', col, 'table');
  }

  addAvatar(parent, avatarId, name) {
    let img = createAndAppend('player-avatar', parent, 'img');
    img.src = 'ava/ava' + avatarId + '.png';
    parent.innerHTML += name;
  }
}