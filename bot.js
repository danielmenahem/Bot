/**
 * Daniel Menahem
 * 39676804
 */

var twit = require("twit");
var config = require("./config.js");
var gifSource = require("giphy-api")('dc6zaTOxFJmzC');
var Twitter = new twit(config);
var tags = ['goal','score','bravo','cheer','cheers','celebration'];
var tweetText = ['GOAL!','Its a goal!', 'Boom!','G GO GOA GOAL!'];

var followedAccount = {
    follow: ['627673190']
};
var stream = Twitter.stream('statuses/filter', followedAccount);

function getRand(from, to) {
    return Math.floor(Math.random() * (to - from + 1)) + from;
}

function tweetAfterGoal(text) {
    var tweet = {
        status: text
    };

    Twitter.post('statuses/update', tweet, function (err, data, response) {
        if (err) {
            console.log("Error: " + err.text);
        } else {
            console.log("Success: " + text);
        }
    });
}

stream.on('tweet', function (tweet) {
    if ((tweet.text.includes("GOAL!")) && !tweet.text.includes("RT")) {
        gifSource.search(tags[getRand(0, tags.length - 1)], function (err, res) {
            tweetAfterGoal(tweetText[getRand(0, tweetText.length - 1)] +"\n" + tweet.text+ "\n\n" + res.data[getRand(0, 4)].bitly_gif_url);
        });
    }
});

stream.on('limit', function (msg) {
    console.log(msg);
});

stream.on('disconnect', function (msg) {
    console.log(msg);
});

stream.on('reconnect', function (request, response, interval) {
    console.log('Reconnecting in ' + interval + 'ms...');
});

stream.on('error', function (msg) {
    console.log(msg);
});

