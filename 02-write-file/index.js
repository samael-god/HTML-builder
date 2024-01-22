const fs = require('fs');
const path = require('path');
const streamOutput = fs.createWriteStream(path.join(__dirname, 'text.txt'), {
  flags: 'a',
});
const readline = require('readline');
const rlInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function write(whatToWrite) {
  rlInterface.question(whatToWrite, (text) => {
    if (text === 'exit') {
      process.exit(0);
    }
    streamOutput.write(`${text}\n`);
    write(whatToWrite);
  });
}
write('What do you want to save?\n');
process.on('exit', () => {
  console.log('Goodbye!');
});
