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

//open inputfile
let rl = readline.createInterface({
  input: fs.createReadStream(inputFile)
});

let line_no = 0;

//read each line into lines list
rl.on('line', line => {
  line_no++;
  lines.push(line);
});

rl.on('close', line => {
  //write data to output file
  let data = JSON.stringify(lines);
  fs.writeFile(outputFile, data, (err, data) => {
    if (err) console.log(err);
    console.log('Have succesffuly parsed the file.');
  });
});
