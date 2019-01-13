/*
  useage: node parse-quotes [input filename] [output filename]
  description: breaks file into lines using endofline indicator, places quote in a list, and then when finished parsing list, it
  converts the list to JSON and exports it to new file (or appends it if file already has contents)
*/
const fs = require('fs');
const path = require('path');
const readline = require('readline');

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

const parseQuotes = function(inputFile, outputFile) {
  //create readline interface
  let rl = readline.createInterface({
    input: fs.createReadStream(inputFile)
  });

  //read each line from input file into lines list
  let inputFileLines = [];
  let line_no = 0;
  rl.on('line', line => {
    line_no++;
    if (line != '') {
      inputFileLines.push(line);
    }
  });

  //write input file lines to output file once read stream closes
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
};

const input = process.argv[2] || path.join(__dirname, '/data/input.txt');
const output = process.argv[3] || path.join(__dirname, '/data/output.json');

/*
   `parse-quotes [filename]` -> parses file into default output
   `parse-quotes [filename] [filename]` -> parses file to second listed file as output
   `parse-quotes -i [filename] [filename] ...  -o [filename] -> parses sequence of files to output file (can also use without -o)   
 */

//use real expression to parse into groups of input files, output file
//if there is an input list, then iterate through it and add each file one by one to output
//if there is an output, use it for output file; otherwise, use default

//if no -i or -o flags, then just take first argument as input
//if no input, then use default
//use second argument as output
//if no output, then use default

parseQuotes(input, output);
