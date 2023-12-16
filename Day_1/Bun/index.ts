import * as fs from "fs";

const payload = fs.readFileSync("../payload.txt", "utf-8");

const mappings: string[] = [
    'one', 'two', 'three', 'four', 'five',
    'six', 'seven', 'eight', 'nine'
];

// Function to reverse a string
const reverseString = (str: string) => str.split('').reverse().join('');

// Create reverse mappings from the original mappings
const revMappings: typeof mappings = mappings.map(reverseString);

// Function to create enumeration mappings from an array of strings
const createEnumerationMappings = (arr: string[]) => arr.reduce((obj, item, index) => {
    obj[item] = (index + 1).toString();
    return obj;
}, {} as { [key: string]: string });

const enumerateMappings = createEnumerationMappings(mappings);
const enumerateRevMappings = createEnumerationMappings(revMappings);

// Compile regular expressions outside of mapping functions
const regex = new RegExp(`(${mappings.join('|')}|\\d)`);
const revRegex = new RegExp(`(${revMappings.join('|')}|\\d)`);

// Process the payload and calculate total
const total = payload.split('\n').reduce((sum, line) => {
    const normalMatch = line.match(regex)?.[0];
    const reverseMatch = reverseString(line).match(revRegex)?.[0];

    const normalValue = normalMatch ? enumerateMappings[normalMatch] || normalMatch : '0';
    const reverseValue = reverseMatch ? enumerateRevMappings[reverseMatch] || reverseMatch : '0';

    return sum + parseInt(normalValue + reverseValue, 10);
}, 0);

console.log(total);
