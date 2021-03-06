//require dotenv
require('dotenv').config();
//require chalk, give error messages red color
const chalk = require('chalk');
//require spotify API, take the keys from keys.js
const Spotify = require('node-spotify-api');
const keys = require('./keys.js');
const spotify = new Spotify(keys.spotify);
//require moment
const moment = require('moment');
//require axios
const axios = require('axios');
//require fs
const fs = require('fs');
//require inquirer
const inquirer = require('inquirer');

//get the query
let queryName = "";
// make a command variable
let command = process.argv[2];


// Grab or assemble the query and store it in a variable called "queryName"
for (let i = 3; i < process.argv.length; i++) {
    if (i > 3 && i < process.argv.length) {
        queryName = queryName + "+" + process.argv[i];
    } else if (i == 3) {
        queryName = process.argv[i];
    }
}
if (queryName.length > 0) {
    console.log(chalk.cyan.bold("You have searched for: ") + chalk.bold(queryName.replace(/\+/g, " ").toUpperCase()));
}

// Create OMDB API & Bands in town queryUrl
let queryUrlBit = "https://rest.bandsintown.com/artists/" + queryName + "/events?app_id=codingbootcamp";
let queryUrlOmdb = "https://www.omdbapi.com/?t=" + queryName + "&apikey=bcc8450a";

//write the command statements
if (command == "concert-this") {
    findConcert(queryUrlBit);
    logResult (command + ": " + queryName.replace(/\+/g, " ").toUpperCase() + "\n");
} else if (command == "spotify-this-song") {
    findSong(queryName);
    logResult (command + ": " + queryName.replace(/\+/g, " ").toUpperCase() + "\n");
} else if (command == "movie-this") {
    if (queryUrlOmdb == "https://www.omdbapi.com/?t=&apikey=bcc8450a") {
        queryUrlOmdb = "https://www.omdbapi.com/?t=mr+nobody&apikey=bcc8450a";
        findMovie(queryUrlOmdb);
        logResult (command + ": " + queryName.replace(/\+/g, " ").toUpperCase() + "\n");
    } else {
        findMovie(queryUrlOmdb);
        logResult (command + ": " + queryName.replace(/\+/g, " ").toUpperCase() + "\n");
    }
} else if (command == "do-what-it-says") {
    executeComm();
    logResult (command + ": " + queryName.replace(/\+/g, " ").toUpperCase() + "\n");
} else if (command == "last-search") {
    lastSearch();
} else if (command == "clear-data") {
    clearData();
} else if (command == "search-log") {
    searchLog();
}

//Write a function to create and append the following data to log.txt file
function logResult (text) {
    fs.appendFile('log.txt', text, (err) => {
        if (err) throw err;
      });
    //change the text in random.txt
    fs.writeFile('random.txt', text, (err) => {
        if (err) throw err;
        console.log('random.txt has been updated!');
    });
}

//Write a function named concert-this
//this function will search the Bands in Town Artist Events API 
//("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp") 
//for an artist and render the following information about each event to the terminal:
//Name of the venue
//Venue location
//Date of the Event (use moment to format this as "MM/DD/YYYY")

function findConcert(query) {
    axios.get(query).then(
        function (response) {
            let data = response.data;
            if (data.length === 0) {
                console.log(chalk.green("No planned events available for this artist."));
            } else {
                data.forEach(function (item) {
                    console.log("===================");
                    console.log(chalk.yellow("Name of the venue: ") + item.venue.name);
                    console.log(chalk.red("Venue location: ") + item.venue.city + "/" + item.venue.country);
                    let date = item.datetime;
                    let formattedDate = moment(date).format("MM DD YYYY");
                    console.log(chalk.blue("Date of the event: ") + formattedDate);
                });
            }
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

function findSong(query) {
    if (query.length === 0) {
        spotify
            .search({
                type: 'track',
                query: "the sign"
            })
            .then(function (response) {
                var data = response.tracks.items;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].artists[0].name.toLowerCase() === "ace of base") {
                        let item = data[i];
                        console.log("===================");
                        console.log(chalk.green("Song name: ") + item.name);
                        console.log(chalk.yellow("Artists: ") + item.artists[0].name);
                        // console.log(item.artists);
                        console.log(chalk.red("Album: ") + item.album.name);
                        console.log(chalk.blue("Preview link: ") + item.external_urls.spotify);
                    }
                }
            })
            .catch(function (err) {
                console.log(err);
            });
    } else {
        spotify
            .search({
                type: 'track',
                query: query.replace(/\+/g, " ")
            })
            .then(function (response) {
                var data = response.tracks.items;
                data.forEach(function (item) {
                    console.log("===================");
                    console.log(chalk.green("Song name: ") + item.name);
                    console.log(chalk.yellow("Artists: ") + item.artists[0].name);
                    // console.log(item.artists);
                    console.log(chalk.red("Album: ") + item.album.name);
                    console.log(chalk.blue("Preview link: ") + item.external_urls.spotify);
                });
            })
            .catch(function (err) {
                console.log(err);
            });
    }
}

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

// * If you don't type a movie in, the program will output data for the movie 'Mr. Nobody.'

function findMovie(query) {
    axios.get(query).then(
        function (response) {
                console.log("===================");
                console.log(chalk.red("Movie title: ") + response.data.Title);
                console.log(chalk.yellow("Released: ") + response.data.Released);
                console.log(chalk.green("IMDB rating: ") + response.data.imdbRating);
                if (response.data.Ratings.length > 1) {
                    console.log(chalk.blue("Rotten Tomatoes rating: ") + response.data.Ratings[1].Value);
                } else {
                    console.log(chalk.blue("Rotten Tomatoes rating: ") + "No rating");
                }
                console.log(chalk.magenta("Country: ") + response.data.Country);
                console.log(chalk.cyan("Language: ") + response.data.Language);
                console.log(chalk.red("Plot: ") + response.data.Plot);
                console.log(chalk.yellow("Actors: ") + response.data.Actors);
        });
}

//Write a function named do-what-it-says
//Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
//It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
//Edit the text in random.txt to test out the feature for movie-this and concert-this.

function executeComm() {
    inquirer.prompt([
            // Prompt the function
            {
                type: "list",
                message: "What would you like to do?",
                choices: ["spotify-this-song", "movie-this", "concert-this"],
                name: "activity"
            },
            //prompt the name
            {
                type: "input",
                message: "Search for:",
                name: "searchParameter"
            },
        ])
        .then(function (inquirerResponse) {
            let activity = inquirerResponse.activity;
            let query = inquirerResponse.searchParameter;
            queryName = query.replace(/\s/g, "+");

            //change the function according to activity input
            if (activity == "concert-this") {
                let queryUrlBit = "https://rest.bandsintown.com/artists/" + queryName + "/events?app_id=codingbootcamp";
                findConcert(queryUrlBit);
            } else if (activity == "spotify-this-song") {
                findSong(queryName);
            } else if (activity == "movie-this") {
                let queryUrlOmdb = "https://www.omdbapi.com/?t=" + queryName + "&apikey=bcc8450a";
                findMovie(queryUrlOmdb);
            }
        });
}

//Write a function named last-search
//This will output the last search logged into random.txt

function lastSearch () {
    fs.readFile('./random.txt', 'utf8', function read(err, data){
        if (err) throw err;
        console.log(chalk.inverse(data));
    });
}

//Write a function named search-log
//This will output the last search logged into random.txt

function searchLog () {
    fs.readFile('./log.txt', 'utf8', function read(err, data){
        if (err) throw err;
        console.log(chalk.inverse(data));
    });
}

//Write a function named clear-data
//This will delete the random.txt, log.txt

function clearData () {
    fs.unlink('./random.txt', (err) => {
        if (err) throw err;
        console.log('successfully deleted random.txt');
      });
    fs.unlink('./log.txt', (err) => {
    if (err) throw err;
    console.log('successfully deleted log.txt');
    });
}