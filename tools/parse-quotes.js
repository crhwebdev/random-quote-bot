/*
  useage: node parse-quotes [input filename] [output filename]
  description: breaks file into lines using endofline indicator, places quote in a list, and then when finished parsing list, it
  converts the list to JSON and exports it to new file (or appends it if file already has contents)
*/
const readline = require('readline');
const fs = require('fs');
const inputFile = process.argv[2] || '/data/input.txt';
const outputFile = process.argv[3] || '/data/output.json';
let inputFileLines = [];

const dedupeLines = function(lines) {
  let unique = [...new Set(lines)];
  return unique;
};

const writeLinesToOutput = function(lines, output) {
  console.log('Writing data to output file');
  let linesToWrite = dedupeLines(lines);
  //write data to output file
  let data = JSON.stringify(linesToWrite);
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
  inputFileLines.push(line);
});

//write lines to output file once read stream closes
rl.on('close', line => {
  //check to see if outputFile exists
  fs.stat(outputFile, (err, stats) => {
    //if it does not exist, then just write inputFileLines to outputFile
    if (err) {
      console.log('Output file does not exist. Creating file....');
      writeLinesToOutput(inputFileLines, outputFile);
      //if it does exist, then read in files from existing outputFile
      // parse them to an array, concat new outputFileLines with inputFileLines
      // and then write combined array to file
    } else {
      console.log('Output file exists.');
      fs.readFile(outputFile, 'utf8', (err, contents) => {
        let outputFileLines = JSON.parse(contents);
        let combinedFileLines = outputFileLines.concat(inputFileLines);
        writeLinesToOutput(combinedFileLines, outputFile);
      });
    }
  });
});
