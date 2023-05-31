// Grade meme page
class Grade {
    constructor() {
        this.content = $('body');
        this.canvas = new Canvas();
    }

     initGradePage(meme, creds) {
        this.canvas.consored = false;
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
        if (window.grade.buddied) {
            img.classList.add('inactive');
        }
        addTooltip(img, 'Вы можете получить полвину очков за этотм мем.\nБудьте осторожны, если мем получит много дизлайков, вы получите штраф.\nМожно использовать только раз в раунд.');
        if (this.meme.ownerId === this.creds) {
            img.classList.add('inactive');
            this.buddied = true
        } else {
            this.buddied = false;
        }
        $(img).click(function() {
            if(!window.grade.buddied) {
                window.grade.buddied = true;
                img.classList.add('inactive');
                window.ws.buddyMeme(meme.lobbyId);
            }
        });

        col = createAndAppend('col col-8 d-flex', row);
        const afterLoad = function () {
            for (let i = 0; i < this.meme.caps.length; i++) {
                this.canvas.draw(this.meme.lines[i], this.meme.caps[i]);
            }
        }.bind({meme: this.meme, canvas: this.canvas});
        this.canvas.initCanvas(col, afterLoad);

        col = createAndAppend('col col-1 d-flex align-content-end flex-wrap', row);
        let innerRow = createAndAppend('row-cols-1', col);

        if (meme.asLeader) {
            createBanButton(innerRow, this.canvas, meme.ownerId);
        }

        createDownloadButton(innerRow, this.canvas);

        col = createAndAppend('col d-flex justify-content-around', row);
        row = createAndAppend('row row-cols-3 gx-5', col);

        this.grades = [];
        row.append(this.createGradeButton('like', 1));
        row.append(this.createGradeButton('mda', 0));
        row.append(this.createGradeButton('dislike', -1));
        this.updateCanvas(afterLoad);
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
        } else {
            this.graded = false;
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