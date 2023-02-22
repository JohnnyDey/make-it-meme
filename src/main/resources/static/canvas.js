$( document ).ready(function() {
  const canvas = $("#canvas")[0];
  const ctx = canvas.getContext("2d");
  const cap = $("#cap");

  const img = new Image();
  img.onload = () => {
      initCanvas()
  };
  img.src = "img/meme6.jpg";

  cap.bind('input propertychange', function() {
      initCanvas();
      if(cap.val()) {
        draw();
      }
  });

  function draw() {
    let lines = 2;
    let strings = [];
    let fontSize;
    do {
      lines++;
      fontSize = 150/lines;
      ctx.font = fontSize + "px serif";
      strings = cap.val().split("\n");
      strings = strings.flatMap(v => splitByMaxWidth(v, 550, ctx));
    } while (lines < strings.length)
    fillText(fontSize, strings);
  }

  function initCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  }

  function fillText(fontSize, strings) {
    let y = fontSize;
    for(let i = 0; i < strings.length; i++) {
      ctx.fillText(strings[i], 10, y);
      y += fontSize;
    }
  }
});

function splitByMaxWidth(value, max, ctx) {
  const words = value.split(' ');
  let res = [''];
  for (let i = 0; i < words.length; i++) {
    let newVal = res[res.length - 1] ? res[res.length - 1] + ' ' + words[i] : words[i] ;
    if (ctx.measureText(newVal).width > max) {
      res[res.length] = words[i];
    } else {
      res[res.length - 1] = newVal;
    }
  }
  return res;
}