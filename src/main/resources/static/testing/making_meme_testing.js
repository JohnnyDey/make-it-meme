class CreationTest extends Creation {
    onSubmit() {
        this.lobby.round.memes[0].lines = this.caps.map(v => v.val());
        window.grade.initGradePage(this.lobby.round.memes[0]);
    }

     createCapTextArea(col, textCount, memeCaps){
        const capIndex = memeCaps.length - textCount;

        super.createCapTextArea(col, textCount, memeCaps);
        const x = this.createGroup(col, 'x', memeCaps[capIndex].x, capIndex);
        const y = this.createGroup(col, 'y', memeCaps[capIndex].y, capIndex);
        const height = this.createGroup(col, 'height', memeCaps[capIndex].height, capIndex);
        const width = this.createGroup(col, 'width', memeCaps[capIndex].width, capIndex);
        const angle = this.createGroup(col, 'angle', memeCaps[capIndex].angle, capIndex);
        const maxFont = this.createGroup(col, 'maxFont', memeCaps[capIndex].maxFont, capIndex);
        const ready = createElement(null, 'button', 'Применить конфиг')
        $(ready).click(function() {
           this.lobby.round.memes[0].caps[capIndex].x = parseInt(x.value);
           this.lobby.round.memes[0].caps[capIndex].y = parseInt(y.value);
           this.lobby.round.memes[0].caps[capIndex].height = parseInt(height.value);
           this.lobby.round.memes[0].caps[capIndex].width = parseInt(width.value);
           this.lobby.round.memes[0].caps[capIndex].angle = parseInt(angle.value);
           this.lobby.round.memes[0].caps[capIndex].maxFont = parseInt(maxFont.value);
           const memeCaps = this.getMeme().caps;
           this.canvas.restartCanvas();
           for (let cap of this.caps) {
               this.canvas.drawTestFields(memeCaps[cap.attr('index')]);
               if (cap.val()) {
                   this.canvas.draw(cap.val(), memeCaps[cap.attr('index')]);
               }
           }
        }.bind(this));
        col.append(ready);
     }

     createGroup(col, textAttr, value, index) {
         const group = createElement('input-group');
         col.append(group);

         let append = createElement('input-group-prepend');
         createAndAppend('input-group-text', append, textAttr);
         group.append(append);

         let text = createElement('form-control', 'input');
         text.type = 'number';
         text.setAttribute(textAttr, index);
         text.value = value;

         group.append(text);
         return text;
     }

     initContent(parent) {
        super.initContent(parent);
        const config = createElement(null, 'button', 'Скачать конфиг');
        $(config).click(function() {
            const link = document.createElement("a");
            const content = JSON.stringify(this.lobby.round.memes[0], null, 4);
            const file = new Blob([content], { type: 'application/json' });
            link.href = URL.createObjectURL(file);
            link.download = "config.json";
            link.click();
        }.bind(this));
        parent.children[1].append(config);
     }

     drawCap(cap, memeCaps) {
         this.canvas.drawTestFields(memeCaps[cap.attr('index')]);
         super.drawCap(cap, memeCaps);
     }

    initTimer() {
    }

    onTimerFire() {}
}