import * as fs from "fs";
import _ from "lodash";

// const payload = fs.readFileSync("../payload.txt", "utf-8");

const payload = `two1nine 
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen
`

const mappings: string[] = [
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine'
];

const revMappings: typeof mappings = _(mappings).map(str => _(str).split('').reverse().join('')).value();

const enumerateMappings = mappings.reduce((obj, item, index) => {
    obj[item] = ""+(index+1);
    return obj;
}, {} as { [key: string]: string});

const enumerateRevMappings = revMappings.reduce((obj, item, index) => {
    obj[item] = ""+(index+1);
    return obj;
}, {} as { [key: string]: string});

const regex = new RegExp(`(${mappings.join('|')}|\\d)`);
const revRegex = new RegExp(`(${revMappings.join('|')}|\\d)`);
const processed = payload
    .split('\n')
    .map(str => _.find(str.match(regex)))
    .map(str => {
        if (str === undefined) return "0";
        else if (enumerateMappings.hasOwnProperty(str)) {
           return enumerateMappings[str];
        } else {
            return str;
        }
    });

const revProcessed = payload.split('\n')
    .map(str => str.split('').reverse().join(''))
    .map(str => _.find(str.match(revRegex)))
    .map(str => {
        if (str === undefined) return "0";
        else if (enumerateRevMappings.hasOwnProperty(str)) {
            return enumerateRevMappings[str];
        } else {
            return str;
        }
    })
const total = _
    .zipWith(processed, revProcessed, (a, b) => _.toInteger(a+b))
    .reduce((a, b) => a+b);
console.log(total);
