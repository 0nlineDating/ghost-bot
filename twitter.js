const {TwitterApi} = require('twitter-api-v2');

const client = new TwitterApi({
    appKey: '' ,  
    appSecret: '',  
    accessToken: '',  
    accessSecret: ''
});

function out(message) {
client.v1.tweet(message).then((val) => {
    console.log(val)
    console.log("success")
}).catch((err) => {
    console.log(err)
})
}

module.exports = { out };


/**
 * PLANS
 * 
 * build tweet into a simple function that can be called in bot.js
 * 
 * tweetOut("tweet content");
 * 
 * make SGB auto-react with a basic star emote in #free-band-names
 * 
 * when the star total hits 4, message is selected to tweet
 * 
 * SGB must watch new reacts in that channel and check for reacts on star emote
 */
