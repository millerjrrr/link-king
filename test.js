let inputString =
  "This is an example sentence withnt. It's important to replace nt with not.";

// Use replace() with a regular expression to replace all occurrences of "nt" with "not"
let outputString = inputString.replace(/nt/g, 'not');

console.log(outputString);
