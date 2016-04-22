"use strict";

const _ = require('lodash');
const fs = require('fs');


function saveTalksInFile(content, fileName) {
    let theCSV = "Talk ID; Track; Talk Type; Talk Title; nb votes; sum; avg\n";

    for (var j = 0; j < content.length; j++) {
        theCSV += content[j].id + ";" + content[j].title+ ";" +content[j].track + ";" + content[j].talkType + ";" + content[j].title + ";"+
            content[j].count + ";" + content[j].sum + ";" + content[j].avg + "\n";
    }

    fs.writeFile(fileName, theCSV);
}


function saveSpeakersInFile(content, fileName) {
    let theCSV = "Name; Note; Talks\n";

    for (var j = 0; j < content.length; j++) {
        theCSV += content[j].name + ";" + content[j].note + ";" + content[j].talks + "\n";
    }

    fs.writeFile(fileName, theCSV);
}

const talks = require('/Users/rlemaire/Documents/workspaces/veille/talks/talks.json');

let sortedByCount = _.cloneDeep(talks);
sortedByCount = _.reverse(_.sortBy(sortedByCount, 'count'));

saveTalksInFile(sortedByCount, 'sortedByCount.csv');

let sortedByNotes = _.cloneDeep(talks);
sortedByNotes = _.reverse(_.sortBy(sortedByNotes, 'avg'));

saveTalksInFile(sortedByNotes, 'sortedByNotes.csv');

let talksRatingsBySpeakerNames = {};

_.forEach(talks, (talk) => {
    _.forEach(talk.speakers, (speaker) => {
        if (!talksRatingsBySpeakerNames[speaker.name]) {
            talksRatingsBySpeakerNames[speaker.name] = [];
        }
        talksRatingsBySpeakerNames[speaker.name].push(talk.talkRating);
    })
});

let avgNoteBySpeakerName = _.map(Object.keys(talksRatingsBySpeakerNames), 
    (name) => { return { 
        name : name,
        note : _.chain(talksRatingsBySpeakerNames[name]).map('avg').mean().value()
    }});

let speakers = [];

for(var o in avgNoteBySpeakerName) {
    speakers.push(avgNoteBySpeakerName[o]);
}

speakers = _.reverse(_.sortBy(speakers, 'note'));

for (var i = 0; i < speakers.length; i++) {
    speakers[i].talks = "\"";
    for (var j = 0; j < talks.length; j++) {
        if (_.some(talks[j].speakers, (s) => s.name == speakers[i].name)) {
            if (speakers[i].talks !== "\"") {
                speakers[i].talks += "  #  ";
            }
            speakers[i].talks += talks[j].title;
        }
    }
    speakers[i].talks += "\"";
}

saveSpeakersInFile(speakers, 'topSpeakers.csv');