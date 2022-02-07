const {TwitterApi} = require('twitter-api-v2');

const client = new TwitterApi({
    appKey: 'cfcwZQmGjU4jpzvF6lyAIf5AX' ,  
    appSecret: 'hvHucdZAncLY7pny8Jwc4SiT1wwCWA2hkFRsx0ALFXT6u4GhUF',  
    accessToken: '1479326819291516928-GTjNpBDWwNCL48QBIxp3vt4DAENYol',  
    accessSecret: '38hQ0EtLOnu23ELfFZqldxA53ee3jFBAbS27kMLe2CDDX'  
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