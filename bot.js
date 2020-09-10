const Discord = require('discord.js');
const Sequelize = require('sequelize');
const Canvas = require('canvas');
const { CITEXT } = require('sequelize');
const { createContext } = require('vm');
const client = new Discord.Client();
const PREFIX = "+";

const SecretWord = 'test';

const sequelize = new Sequelize('database', 'user', 'passsword', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: true,
    //SQLite only
    storage: 'database.sqlite'
    }
);

/* 
 * equivalent to: CREATE TABLE tags(
 * name VARCHAR(255),
 * description TEXT,
 * username VARCHAAR(255),
 * usage INT
 * );
 */
const Tags = sequelize.define('tags', {
	name: {
		type: Sequelize.STRING,
		unique: true,
	},
	description: Sequelize.TEXT,
	username: Sequelize.STRING,
	usage_count: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});

/*
// This only needs to be on when it's first initialized.
// I ran into issues with the sync clearing the database on hard resets

client.once('ready', () => {
 Tags.sync();
})
*/
client.on('ready', () => {

    client.user.setActivity("with my butt.", {type: "PLAYING"});
    console.log("Connected as " + client.user.tag);
    //List the servers the bot is connected to
    console.log("Servers:");
    client.guilds.cache.forEach((guild) => {
        console.log(" - " + guild.name);
        // List all channels
        guild.channels.cache.forEach((channel) => {
            console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`);
        })
    })

    //Set a channel
    var generalChannel = client.channels.cache.get("753117761084981319");
    //Send a message
    generalChannel.send("I just got restarted. What'd I miss?");
    //Attachments:
    // Provide a path to a local file   
    // const localFileAttachment = new Discord.MessageAttachment('D:\\logo.png');
    // generalChannel.send(localFileAttachment);

})
//listens and responds
client.on('message', async (receivedMessage) => {
    var messageLower = receivedMessage.content.toLowerCase();
    var message = receivedMessage;
    //Prevent bot from responding to its' own messages
    if (receivedMessage.author == client.user) {
        return;
    }
    if(message.author.bot) {
        return;
    }
    if (messageLower.startsWith(PREFIX)) {
        const input = receivedMessage.content.slice(PREFIX.length).trim().split(' ');
        const command = input.shift();
        const commandArgs = input.join(' ');
	    // These are the basic commands that come with tag management.
        if (command === 'addtag') {
            const splitArgs = commandArgs.split(' ');
            const tagName = splitArgs.shift().toLowerCase();
            const tagDescription = splitArgs.join(' ');

            try{
                // equivalent to: INSERT INTO tage (name, description, username) values (?, ?, ?);
                const tag = await Tags.create({
                    name: tagName,
                    description: tagDescription,
                    username: message.author.username,
                });
                return message.reply(`Tag ${tag.name} added.`);
            }
            catch (e) {
                if (e.name === 'SequalizeUniqueConstraintError') {
                    return message.reply('That tag already exists.');
                }
                return message.reply('Something went wrong with adding a tag.');
            }
        } else if (command === 'tag') {
            const tagName = commandArgs;

            // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
            const tag = await Tags.findOne({ where: { name: tagName } });
            if (tag) {
                // equivalent to: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
                tag.increment('usage_count');
                return message.channel.send(tag.get('description'));
            }
            return message.reply(`Could not find tag: ${tagName}`);            
        }
        else if (command === 'edittag') {
            const splitArgs = commandArgs.split(' ');
            const tagName = splitArgs.shift();
            const tagDescription = splitArgs.join(' ');

            // equivalent to: UPDATE tags (description) values (?) WHERE name='?';
            const affectedRows = await Tags.update({ description: tagDescription }, { where: { name: tagName } });
            if (affectedRows > 0) {
                return message.reply('Tag ${tagName} was edited.');
            }
            return message.reply(`Could not find a tag with name ${tagName}.`);
        } else if (command === 'taginfo') {
            const tagName = commandArgs;

            // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
            const tag = await Tags.findOne({ where: { name: tagName } });
            if (tag) {
                return message.channel.send(`${tagName} was created by ${tag.username} at ${tag.createdAt} and has been used ${tag.usage_count} times`);
            }
            return message.reply(`Could not find tag: ${tagName}`);
        } else if (command === 'showtags') {
            // equivalent to: SELECT name FROM tags;
            const tagList = await Tags.findAll({ attributes: ['name'] });
            const tagString = tagList.map(t => t.name).join(', ') || 'No tags set.';
            return message.channel.send(`List of tags: ${tagString}`);
        } else if (command === 'removetag') {
            // [mu]
            const tagName = commandArgs;
            // equivalent to: DELETE from tags WHERE name = ?;
            const rowCount = await Tags.destroy({ where: { name: tagName } });
            if (!rowCount) return message.reply('That tag did not exist.');

            return message.reply('Tag deleted.');
        } else if (command === 'help'){
            return message.channel.send("```Prefix is set to: + \n\n\nAvailable commands:\n\n1) addtag <keyword> <response>\n----Creates a custom bot response. I am always listening.\n\n2) tag\n----Manually posts a tag response, pretty useless, but exists.\n\n3) edittag <keyword> <response>\n----Allows you to edit a tag\n\n4) showtags\n----Lists all of the tags, this shit could get verbose, so try to use this only in the kindergarden.\n\n5) removetag <keyword>\n----This removes the tag entirely, might become staff locked eventually.```")
        } else {
            console.log('Lol no command given.');
        }
    }

	// this is just because i thought it was funny, i'll be honest.
	// the basic tags can't provide images, but custom commands can.
	// if you want to add in more image responses, they can be written in just by copying this block.
    if (messageLower.includes("dickbutt")) {
	// Provide a URL to a file
    const webAttachment = new Discord.MessageAttachment('https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fstyfelife.com%2Fwp-content%2Fuploads%2F2016%2F10%2Fdickbutt.png&f=1&nofb=1', "dickbuttlol.png");
    receivedMessage.channel.send(webAttachment);
    console.log(`Sent a dickbutt to ` + receivedMessage.channel.name.toString());
    }
	//this is the part that parses every single message.
    if (receivedMessage) {
	    // converts text to lowercase and removes punctuation and markup
	    // this prevents keywords from being missed in the event that they are proceeded by a period or question mark
        const input = receivedMessage.content.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
	    // this splits the message content into an array, where each word is its' own item in the array
        var commandArgs = input.split(' ');
        console.log('INPUT IS: ' + commandArgs + ' | Length is: ' + commandArgs.length);
        var i=0;
	    // this gathers the length of the array and sets it to a variable (simplifies comparison)
        var end = commandArgs.length;
	    //begins a loop through the array
        while (i < end) {
            console.log('i = ' + i);
            const tagName = commandArgs[i];
            
            // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
            const tag = await Tags.findOne({ where: { name: tagName } });
            if (tag) {
                // equivalent to: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
                tag.increment('usage_count');
                message.channel.send(tag.get('description'));
            }
            else{
                console.log(`Could not find tag: ${tagName}`);
            }
            i++;
        }
    }
    // This doesn't work yet. Eventually, it'll post an image when a secret word is said
    // the plan is to have it shuffle a set of secret words every week
    // working with canvas is hard though, so right now it just throws an error for every instance of the word test.
    // it's not an error that crashes the script, luckily.
    if (receivedMessage.content.includes(SecretWord)) {
        const channel = receivedMessage.channel;

        const canvas = Canvas.createCanvas(750,588);
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage('/home/pi/DiscordBot/images/secretword.png');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#FFFFFF';
        ctx.strokeRect(0,0,canvas.width,canvas.height);

        ctx.font = applyText(canvas, member.displayName);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(member.displayName, 287, 320);

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'secret-word.png');

        channel.send(`YOU SAID THE SECRET WORD, ${member}!`, attachment);
    }
})



//Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> "Click to reveal token"
bot_secret_token = " ";

client.login(bot_secret_token);
