/**
 * Daniel Menahem
 */

var twit = require("twit");
var config = require("./config.js");
var gifSource = require("giphy-api")('dc6zaTOxFJmzC');

//configure the hosting tweeter account based on the keys in config.js
var Twitter = new twit(config);

//tags for searching in giphy
var tags = ['final whistle','end of match','good game', 'referee final whistle' ];

//tweet head options
var tweetText = ['End of match!','Game over','Final score','Final whistle','Final result','Its over!' ];

//live Football Goals account id.
var followedAccount = {
    follow: ['762099717283119105']
};

//start twitter stream
var stream = Twitter.stream('statuses/filter', followedAccount);

//get random number in a range
function getRand(from, to) {
    return Math.floor(Math.random() * (to - from + 1)) + from;
}

//called when an end of match is detected
function tweetAfterMatchEnds(text) {
    //create a tweet
    var tweet = {
        status: text
    };
    //post the tweet
    Twitter.post('statuses/update', tweet, function (err, data, response) {
        if (err) {
            console.log("Error: " + err.text);
        } else {
            console.log("Success: " + text);
        }
    });
}

//incoming tweet from the followed account
stream.on('tweet', function (tweet) {
    //detection for end of match indicators
    if ((tweet.text.includes("Final whistle") || tweet.text.includes("End of match")) && !tweet.text.includes("RT")){

        //search for gif from 'giphy' and calls the tweet function
        gifSource.search(tags[getRand(0, tags.length - 1)], function (err, res) {
            tweetAfterMatchEnds(tweetText[getRand(0, tweetText.length - 1)] + "\n" + tweet.text + "\n"
                + res.data[getRand(0, 4)].bitly_gif_url);
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

