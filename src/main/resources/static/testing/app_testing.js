$(function () {
      window.creation = new CreationTest();
      window.grade = new GradeTesting();
      window.creation.initCreation();
      const id = new URLSearchParams(window.location.search).get('memeId');
      $.getJSON(document.location.origin + '/memes/meme' + id + '/config.json', function( data ) {
        window.fakeLobby = {
           id: 'fake',
           config: {},
           rounds: [{
               memes: [data]
           }]
         }
        window.creation.updateState(window.fakeLobby);
      });

});

function createAndAppend(cl, parent) {
    const elem = createElement(cl);
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

class Canvas {
     initCanvas(parent) {
        const canvas = createElement('image', 'canvas')
        parent.append(canvas);
        this.canvas = $(canvas)[0];
        this.ctx = this.canvas.getContext("2d");
    }

    draw(text, cap) {
        let lines = 0;
        let strings = [];
        let fontSize;
        do {
            lines++;
            fontSize = cap.height / lines;
            this.ctx.font = fontSize + "px serif";
            strings = text.split("\n");
            strings = strings.flatMap(v => this.splitByMaxWidth(v, cap.width));
        } while (lines < strings.length)
        this.fillText(fontSize, strings, cap.x, cap.y + fontSize);
    }

    restartCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);
    }

    fillText(fontSize, strings, initX, initY) {
        let y = initY;
        for (let i = 0; i < strings.length; i++) {
            this.ctx.fillText(strings[i], initX, y);
            y += fontSize;
        }
    }

    splitByMaxWidth(value, max) {
        const words = value.split(' ');
        let res = [''];
        for (let i = 0; i < words.length; i++) {
            let newVal = res[res.length - 1] ? res[res.length - 1] + ' ' + words[i] : words[i];
            if (this.ctx.measureText(newVal).width > max) {
                res[res.length] = words[i];
            } else {
                res[res.length - 1] = newVal;
            }
        }
        return res;
    }

    updateImage(src, afterLoad) {
        this.img = new Image();
        this.img.onload = () => {
            this.ctx.canvas.width = this.img.naturalWidth;
            this.ctx.canvas.height = this.img.naturalHeight;
            this.restartCanvas();
            if (afterLoad) {
                afterLoad();
            }
        };
        this.img.src = document.location.origin + '/' + src;
    }
}
