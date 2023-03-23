// Grade meme page
class Grade {
    constructor() {
        this.content = $('body');
        this.canvas = new Canvas();
    }

     initGradePage(meme) {
        this.meme = meme;
        this.content.empty();
        const content = createElement('content');
        this.content.append(content);

        const container = createAndAppend('content-grade container py-5', content);
        let row = createAndAppend('row row-cols-1 justify-content-center gy-3', container);
        let col = createAndAppend('col-auto d-flex', row);
        this.canvas.initCanvas(col);

        col = createAndAppend('col d-flex justify-content-around', row);
        row = createAndAppend('row row-cols-3 gx-5', col);
        row.append(this.createGradeButton('like', 1));
        row.append(this.createGradeButton('mda', 0));
        row.append(this.createGradeButton('dislike', -1));
        this.updateCanvas();
     }

     createGradeButton(src, score) {
        const col = createElement('col');
        let img = createElement('button-image', 'img');
        img.src = "assets/" + src + ".png";
        col.append(img);
        let grade = createAndAppend('grade', col);
        img = createElement(null, 'img');
        img.src = "assets/" + src + ".svg";
        grade.append(img);
        $(col).click(function() {
            this.onGrade(score)
        }.bind(this));
        return col
     }

     updateCanvas(){
        const afterLoad = function () {
            for (let i = 0; i < this.meme.caps.length; i++) {
                this.canvas.draw(this.meme.lines[i], this.meme.caps[i]);
            }
        }.bind({meme: this.meme, canvas: this.canvas});
        this.canvas.updateImage(this.meme.img, afterLoad)
     }

     onGrade() {
        window.ws.gradeMeme(this.meme.lobbyId, score);
     }
}