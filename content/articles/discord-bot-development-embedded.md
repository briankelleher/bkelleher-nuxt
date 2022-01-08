---
title: Discord Bot Development - Embedded Messages
description: In this tutorial, I’ll be discussing some advanced Discord bot features, including embedded messages and interfacing with external APIs to inform bot responses.
---

If you are looking for a quick intro to writing a Discord bot in JavaScript, I would head on over to [my intro tutorial](/articles/creating-and-hosting-a-simple-discord-bot/). In this tutorial, I’ll be discussing some advanced Discord bot features, including embedded messages and interfacing with external APIs to inform bot responses.

I will assume you have the following knowledge approaching this tutorial:

* an understanding of what the Discord platform is, and how to scaffold a simple bot for the platform (I explain this in a previous tutorial if you need a refresher)
* NodeJS and JavaScript
* having a test Discord server used to develop your bot
* basic understanding a RESTful API

I will cover:

* Creating an embedded message in Discord
* Pulling information from a basic RESTful API to inform an embedded message

Requirements to get started:

* NodeJS 14+ installed locally
* Discord.com account and a test server equipped with your simple bot
* Simple bot project on your local machine, referenced in the previous tutorial

### Registering Our New Command

In the previous tutorial, we covered sending basic responses back to a user. As this method is perfectly acceptable for many bot implementations, there are enhanced messages in Discord called ’embedded messages’ which can provide a slightly better response format, easily distinguishable from standard user messages.

To start, we will create a simple Weather.js class. We will extend the Command class that we created in a previous session so we can just focus on the fun part.

```js [commands/Weather.js]
const Command = require('./Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

    // Invoke the constructor which registers the command prefix.
    constructor() {
        super('weather');
    }

    // Invoked when a command matches.
    handler() {
        this._message.reply(`Weather command.`);
    }

    // This should retrieve the message argument in the given message string
    getMessageArgument() {
        // Parse the message string and return the argument at the index, split by space
        if (this._message) {
            // console.log(this._message);
            let a = this._message.content.split(" ").slice(1).join(" ");
            console.log("Message argument is:", a);
            return a;
        }
        return "";
    }

}
```

Here we will setup the basics. This should give us a good starting point for the bot to simply recognize our command. Here I’ve also added a basic message argument parser. We could move this logic to our parent Command class, however not every message might parse the same. For now, we will keep it unique to the command.

To register our command, we go back to index.js. Let’s import our command and register it in our commands array:

```js [index.js]
// Import all necessary libraries, commands, and functions.
const Discord = require('discord.js')
const client = new Discord.Client();
const TimeCommand = require('./commands/Time.js');
const WeatherCommand = require('./commands/Weather.js');
const http = require('http');
const CLIENT_LOGIN_KEY = process.env.CLIENT_LOGIN_KEY || 'Your-Dev-Bot-Token-Here';

// Our Digital Ocean health check.
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('YourBotName Online.');
    res.end();
}).listen(8080);

// Register all commands here.
let commands = [
    new TimeCommand(),
    new WeatherCommand()
];

// When the bot is logged in and ready to go
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// On message sent in discord
client.on('message', msg => {
    // We want to avoid responding to ourselves.
    if (client.user.id !== msg.author.id) {
        console.log(`processing ${msg.content}`);

        // Search for the first command that matches the provided message.
        let i = commands.findIndex(c => c.matchesCommand(msg));
        if (i !== -1) {
            commands[i].invoke();
        }
    }
});

// Perform the login, which initializes a websocket connection.
client.login(CLIENT_LOGIN_KEY);
```

Super easy, thanks to our previous work.

Going back to our Weather command file, let’s add some basic functionality to fetch our weather data. We will need a bit of setup before we are ready to tackle the code. First, we will install Axios, a popular HTTP request library for convenience, and register for access to a weather API.

To install axios, simply run:

```bash
npm i --save axios
```

For our weather API, you can certainly choose your own, but for the tutorial purposes I will be using the Open Weather service. It was very simple to create an account and register an API key through their website, which we will need for our API requests.

For starters, lets import axios add two functions to our Weather class to handle the HTTP request to the weather service, and to craft the URL to request. We are also going to include a MessageEmbed class from discord.js which will assist us later in message creation:

```js [commands/Weather.js]
const axios = require("axios");
const { MessageEmbed } = require('discord.js');

.........

// Place this URL function inside the class.
url(location) {
    return "https://api.openweathermap.org/data/2.5/weather"
        + "?q="
        + location
        + "&APPID="
        + encodeURIComponent("<Your API Key Here>");
}

// Place this getWeather function inside the class.
async getWeather(location) {
    try {
        const response = await axios.get(this.url(location));
        return response;
    } catch (error) {
        console.error(error);
        return "Error finding weather information.";
    }
}
```

NOTE: If you are intending to put this type of service into production, I would recommend moving your API key to an environment variable, verifying the location parameter, returning a reliable type from the getWeather command, etc.

### Creating an Embedded Discord Message

First, lets set two helper functions for ourselves. Based on our weather API response, I’ve decided I want to change the color of the discord embed message to match, and be able to present the degrees in Fahrenheit rather than Kelvin.

Adding to our class methods:

```js [commands/Weather.js]
// Capable of translating a kelvin numeric value to Fahrenheit
kelvinToF( kelvin ) {
    return ((kelvin - 273.15) * (9/5) + 32).toFixed(2);
}

// Returns the correct color for the discord embed.
getEmbedColorForType( type ) {
    let type_string = type;
    if ( typeof type_string === 'string' || type_string instanceof String ) {
        type_string = type_string.toLowerCase();
    }
    switch(type_string) {
        case "snow":
            return "WHITE";
        case "sun":
            return "YELLOW";
        case "clear":
            return "YELLOW";
        case "clouds":
            return "DARK_GREY";
        case "mist":
            return "GREYPLE";
        case "rain":
            return "DARK_AQUA";
        default:
            return "AQUA";
    }
}
```

Now, let’s edit our handler function.

Replace the contents of the handler function with the following, and I will explain:

```js [commands/Weather.js]
handler() {
    // Set a couple of starter variables, and pull in message arguments/set defaults.
    let self = this;
    let arg = this.getMessageArgument();
    let loc = 'Denver';
    if ( arg ) {
        loc = arg;
    }

    // Initialize the message embed class.
    const embed = new MessageEmbed();

    // Set a title for the Query.
    embed.setTitle("Weather Search: " + loc);

    // Set a default color for the embed.
    embed.setColor(this.getEmbedColorForType());

    // Make API request for the weather.
    this.getWeather(loc).then( function(resp) {

        // Set the body of the message embed.
        embed.setDescription("Weather information for " + resp.data.name + " (Country: " + resp.data.sys.country + ")");

        // Set metadata fields for the message embed.
        embed.addField("Current Conditions", resp.data.weather[0].main + " (" + resp.data.weather[0].description + ")");
        embed.addField("Current Temperature", self.kelvinToF(resp.data.main.temp).toString() + " °F");
        if ( resp.data.snow ) {
            embed.addField("Precipitation:", resp.data.snow['1h'] + ' mm/hr');
        }

        // Override the color set.
        embed.setColor(self.getEmbedColorForType(resp.data.weather[0].main));

        // Send the embed to discord.
        self._message.channel.send(embed).catch(function() {
            console.log('error sending data to discord');
        });
    }).catch( function() {
        self._message.channel.send("Error retrieving weather information.  Please use only a city and country code, no state codes.").catch(function() {
            console.log('error sending message to discord');
        });
    });
}
```

I’ve commented each line, but essentially we initialize a MessageEmbed object, we set a bunch of fields and properties by default, we make a weather request, and based on the result we either complete our embedded message with weather data, or show an error.

It’s that simple! We should be ready to test. Start up our server with node index.js, and test the command in your server! You should see the following:

<article-image src="discord-weather-embed-message.png" alt="Embedded Message output for a basic weather command." caption="Embedded Message output for a basic weather command." max-width="450px"></article-image>

Success!

### Additional Capabilities and Resources

Now, embedded messages are really powerful. They can display a lot of information in a user friendly format, link to resources, and even attach files. I highly recommend browsing the discord.js API documentation, [particularly on MessageEmbed](https://discord.js.org/#/docs/main/stable/class/MessageEmbed), to see all of the available methods and properties to customize a message. In another side project I was able to use these advanced features to flush out embedded messages to be rather useful:

<article-image src="discord-embed-stock.png" alt="Embedded stock data." caption="Embedded stock data." max-width="650px"></article-image>

<article-image src="discord-embed-stock-graph.png" alt="Embedded stock graph." caption="Embedded stock graph." max-width="650px"></article-image>

If you are looking for a place to get started with creating embedded media on the fly such as the graph above, I can recommend looking at a project such as the [chartjs-node-canvas project](https://www.npmjs.com/package/chartjs-node-canvas). Discord’s powerful API and messaging capabilities matched with powerful Node tools for calculations and media creation can result in some really fun and useful possibilities.

To let me know your thoughts or questions on a project like this – just [tweet me](https://twitter.com/b_kelleher)!