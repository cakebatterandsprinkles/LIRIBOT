//require dotenv
require('dotenv').config();
//require chalk, give error messages red color
const chalk = require('chalk');
const error = chalk.bold.red;
//require spotify API, take the keys from keys.js
const Spotify = require('node-spotify-api');
const keys = require('./keys.js');
const spotify = new Spotify(keys.spotify);
//require moment
const moment = require('moment');
//require axios
const axios = require('axios');

//get the query
var queryName = "";
// make a command variable
var command = process.argv[2];

// Grab or assemble the query and store it in a variable called "queryName"
for (var i = 3; i < process.argv.length; i++) {
    if (i > 3 && i < process.argv.length) {
        queryName = queryName + "+" + process.argv[i];
    } else if (i == 3) {
        queryName = process.argv[i];
    }
}
console.log(queryName);

// Create OMDB API queryUrl
var queryUrlBit = "https://rest.bandsintown.com/artists/" + queryName + "/events?app_id=codingbootcamp";
console.log(queryUrlBit);


//Write a function named concert-this
//this function will search the Bands in Town Artist Events API 
//("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp") 
//for an artist and render the following information about each event to the terminal:
//Name of the venue
//Venue location
//Date of the Event (use moment to format this as "MM/DD/YYYY")

if (command == "concert-this") {
    findConcert(queryUrlBit);
}

function findConcert(query) {
    axios.get(query).then(
        function (response) {
            let data = response.data;
            data.forEach(function (item) {
                console.log(item.venue.name + " at " + item.venue.city + "/" + item.venue.country);
            });
        }
    ).catch(function (error) {
        if (error) throw "error";
    });
}




//Write a function named spotify-this-song
//This will show the following information about the song in your terminal/bash window
//Artist(s)
//The song's name
//A preview link of the song from Spotify
//The album that the song is from
//If no song is provided then your program will default to "The Sign" by Ace of Base.


//Write a function named movie-this
//This will output the following information to your terminal/bash window:
//* Title of the movie.
//* Year the movie came out.
//* IMDB Rating of the movie.
//* Rotten Tomatoes Rating of the movie.
//* Country where the movie was produced.
//* Language of the movie.
//* Plot of the movie.
//* Actors in the movie.

//Write a function named do-what-it-says
//Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
//It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
//Edit the text in random.txt to test out the feature for movie-this and concert-this.