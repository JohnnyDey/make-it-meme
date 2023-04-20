$(function () {
      window.creation = new CreationTest();
      window.grade = new GradeTesting();
      window.creation.initCreation();
      const id = new URLSearchParams(window.location.search).get('memeId');
      $.getJSON(document.location.origin + '/memes/meme' + id + '/config.json', function( data ) {
        window.fakeLobby = {
           id: 'fake',
           config: {},
           round: {
               memes: [data]
           }
         }
        window.creation.updateState(window.fakeLobby);
      });

});

function createAndAppend(cl, parent, type) {
    const elem = createElement(cl, type);
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
