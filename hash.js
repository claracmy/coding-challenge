function hashIterator() {
  const crypto = require('crypto');
  const fs = require('fs');
  const answer = [];
  let counter = 0;
  let i = 0;

  //Retreives salt and number of zeros
  const file = process.argv.slice(2);
  const text = fs.readFileSync(file[0]).toString('utf-8').trim();
  const salt = text.split(',')[0];
  const zeros = text.split(',')[1];
  const zerosString = '0'.repeat(zeros);

  //Appends number to the salt and creates hash.
  while (counter < 10) {
    i ++;
    const string = salt + i;
    const hash = crypto.createHash('md5').update(string).digest('hex');
    const position = hash[zeros];

    //Add value to answer array if conditions are met.
    if (hash.startsWith(zerosString) && !isNaN(position) && !answer[position]) {
      const modulo = i % 32;
      answer[position] = hash[modulo];
      counter ++;
      console.log(`${counter} characters identified!`);
    }
  }
  //Export answer
  if (counter === 10) {
    fs.writeFileSync(file + '.answer', answer.join(''));
    console.log(`Answer Exported to ${file + '.answer'}.`);
  }
}

hashIterator();
