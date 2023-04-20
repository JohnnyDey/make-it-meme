// Grade meme page
class Grade {
    constructor() {
        this.content = $('body');
        this.canvas = new Canvas();
    }

     initGradePage(meme, creds) {
        this.meme = meme;
        this.creds = creds;
        this.content.empty();
        const content = createElement('content');
        this.content.append(content);

        const container = createAndAppend('content-grade container py-5', content);
        this.timer = new Timer(container);
        this.timer.initTimer(15);

        let row = createAndAppend('row row-cols-3 justify-content-center gy-3', container);
        let col = createAndAppend('col col-1 d-flex justify-content-center align-content-center flex-wrap', row);
        col.innerHTML = "Ржака";
        const img = createAndAppend(null, col, 'img');
        img.src = 'assets/memebuddy.png';
        img.height = 75;
        $(img).click(function() {
            window.ws.buddyMeme(meme.lobbyId);
        });

        col = createAndAppend('col col-8 d-flex', row);
        const afterLoad = function () {
            for (let i = 0; i < this.meme.caps.length; i++) {
                this.canvas.draw(this.meme.lines[i], this.meme.caps[i]);
            }
        }.bind({meme: this.meme, canvas: this.canvas});
        this.canvas.initCanvas(col, afterLoad);

        col = createAndAppend('col col-1 d-flex align-content-end flex-wrap', row);
        let innerRow = createAndAppend('row row-cols-1', col);

        if (meme.asLeader) {
            const ban = this.createControlButton('control-button-ban', 'disabled_visible');
            innerRow.append(ban);
            $(ban).click(this.canvas.censor.bind(this.canvas));
        }

        const download = this.createControlButton('control-button-standart', 'download');
        innerRow.append(download);
        $(download).click(this.canvas.download);

        col = createAndAppend('col d-flex justify-content-around', row);
        row = createAndAppend('row row-cols-3 gx-5', col);

        this.grades = [];
        row.append(this.createGradeButton('like', 1));
        row.append(this.createGradeButton('mda', 0));
        row.append(this.createGradeButton('dislike', -1));
        this.updateCanvas(afterLoad);
     }

     createControlButton(subClass, icon) {
        const col = createElement('col');
        const span = createAndAppend('material-icons control-button ' + subClass, col, 'span');
        span.innerHTML = icon;
        return col;
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
        const colJquery = $(col)
        this.grades.push(colJquery);
        $(colJquery).click(function() {
            if (this.graded) return;
            for(const g of this.grades) {
                if (g != colJquery) {
                    g.addClass('inactive');
                }
            }
            this.onGrade(score)
            this.graded = true;
        }.bind(this));
        if (this.meme.ownerId === this.creds) {
            this.graded = true;
            colJquery.addClass('inactive');
        }
        return col
     }

     updateCanvas(afterLoad){
        afterLoad();
        this.canvas.updateImage(this.meme.img, afterLoad)
     }

     onGrade(score) {
        window.ws.gradeMeme(this.meme.lobbyId, score);
     }
}