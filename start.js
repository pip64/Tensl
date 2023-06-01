const fs = require('fs');

const file = process.argv[2];

let input = `const readlineSync = require('readline-sync');\n`;
input += fs.readFileSync(file, 'utf8');

function translator(str) {
  
  str = str.replace(/printLine\.\s*(.*)/g, 'console.log($1)');
  
  str = str.replace(
    /func\/(\w+)\.<(.+?)>[\s\S]*?\n([\s\S]+?)\nfinish/g,
    (match, funcName, args, body) => `function ${funcName}(${args}) {\n  ${body.trim()}\n}`
  );
  str = str.replace(/if\.\s*<(.*?)>\s*start/g, 'if ($1) {');
  str = str.replace(/finish/g, '}');
  str = str.replace(/let\s+box\/(\w+)/g, "let $1");
  str = str.replace(/bad\s+box\/(\w+)/g, "var $1");
  str = str.replace(/con\s+box\/(\w+)/g, "const $1");
  str = str.replace(/box\/(\w+)/g, "$1");
  str = str.replace(/inputLine\.\s*(.*)/g, "readlineSync.question($1)");
  str = str.replace(/(\w+)\.\(([^)]+)\)/g, "$1($2)");
  str = str.replace(/\.\[(\w+)\]/g, '${$1}');
  str = str.replace(/(?<!\\)<|(?<!\\)>/g, '`');
  str = str.replace(/\\\\/g, "");
  
  return str;
}

var output = translator(input);

eval(output)
