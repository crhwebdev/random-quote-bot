/*
  useage: node parse-quotes [input filename] [output filename]
  description: breaks file into lines using endofline indicator, places quote in a list, and then when finished parsing list, it
  converts the list to JSON and exports it to new file (or appends it if file already has contents)
*/
const readline = require('readline');
const fs = require('fs');
const inputFile = process.argv[2];
const outputFile = process.argv[3];
let lines = [];

const writeLinesToOutput = function(lines, output) {
  //write data to output file
  let data = JSON.stringify(lines);
  fs.writeFile(output, data, (err, data) => {
    if (err) console.log(err);
    console.log('Have succesffuly parsed the file.');
  });
};

//create readline interface
let rl = readline.createInterface({
  input: fs.createReadStream(inputFile)
});

//read each line into lines list
let line_no = 0;
rl.on('line', line => {
  line_no++;
  lines.push(line);
});

//write lines to output file once read stream closes
rl.on('close', line => {
  writeLinesToOutput(lines, outputFile);
});
