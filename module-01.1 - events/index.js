const EventEmitter = require('events');

class MyEmissor extends EventEmitter {

}

const myEmissor = new MyEmissor();
// const nomeEvento = 'usuario:click';
// myEmissor.on(nomeEvento, function (click) {
//   console.log('user clicked', click);
// });

// myEmissor.emit(nomeEvento, 'na barra de rolagem');
// myEmissor.emit(nomeEvento, 'no ok');
const stdin = process.stdin;

stdin.addListener('data', function(value) {
  console.log(`You typed: ${value.toString().trim()}`)
})