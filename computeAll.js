"use strict";
const fs = require('fs');

let talksById = {};


for (var i = 1; i<= 16; i++) {
    console.log('/Users/rlemaire/Documents/workspaces/veille/talks/' + i + '.json');
    const content = require('/Users/rlemaire/Documents/workspaces/veille/talks/' + i + '.json');
    for (var j = 0; j < content.talks.length; j++) {
        talksById[content.talks[j].id] = content.talks[j];
    }
}

let alltalks = [];

for(var o in talksById) {
    alltalks.push(talksById[o]);
}

console.log(alltalks.length);


fs.writeFile('alltalks.json', JSON.stringify(alltalks, null, 2));
