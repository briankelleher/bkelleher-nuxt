---
title: Creating and Hosting a Simple Discord Bot
description: In this short tutorial I will show you how to get started writing an application for Discord, particularly a "Discord Bot", and how to host it.
---

[Discord](https://discord.com/) is an increasingly popular chat application. With origins in the gaming community, it has been quickly realized by hobbyist groups, industries, and communities as an effective cross-platform communication tool.

The flexibility of Discord is unparalleled in any other chat app, and aside from its rich customizable permission and role system, it provides a rather simple API to build applications for. On top of that, there is a very well maintained NodeJS library that makes the job even easier, called Discord.js.

In this short tutorial I will show you how to get started writing an application for Discord, particularly a “Discord Bot”, and how to host it.

I will assume you have at least a basic understanding of:

- the Discord platform
- NodeJS
- Git / Version Control

I will cover:

- Setting up a Discord Developer account, and an application
- Creating the project on your local machine and providing some example code to help you get started
- Hosting the bot on DigitalOcean’s App Platform via Github
- Strategies for continued development

Requirements to get started:

- NodeJS 14+ installed locally
- A [Discord.com](https://discord.com) account and ability to log into the developer portal to create applications
- I highly recommend having the Discord app installed on your local machine, but you can use the browser
- You will need to create a test discord server for yourself. You should be prompted to do this if you are not part of any existing discord servers, otherwise use the Plus icon on the left sidebar.


### Registering a Discord Application

To start working on your bot, you will need to have an account on [Discord.com](https://discord.com). Once you have one, you can visit the Developer Applications page to create your first application. In the Discord hierarchy, an application is an overarching project that has one or multiple integrations with Discord, and a “bot” is a unique part of an application that can perform operations in the Discord chat app. Thus, in order to create a bot, we must create an application.

In the top right corner of the page, there should be a button for “New Application”. You will be prompted for an application name. Now, there are plenty of different ways to develop a bot locally while also maintaining a bot in production using the same tokens, however I’ve found that an extremely effective method is to maintain two “applications” (one for production, and one for local development), and thus having two different bots. If you envision yourself doing this with your bot, I would name your Application something like `<your-application-name>-dev`, otherwise any simple name for your application will be fine for demo purposes.

<article-image src="discord-intro-popup.png" alt="The popup interface for creating a new Discord Application" caption="The popup interface for creating a new Discord Application."></article-image>

Once you successfully create an application, you should be redirected to an application management page with a few menu options on the left. Before we leave this area, take note of the Client ID number below your Application description, as we will need it later. Navigate to the link on the left that says “Bot”.

Here, we will need to set a username, which is the name that will be presented to other Discord users when your bot is sending messages. Right below the username is a place to reveal and manage your bot token as well, which we will need later.

IMAGE HERE
The username and token management area for your Discord Bot.

### Adding Your Bot to Your Discord Server

Now, in the project requirements I mention having a test discord server ready for use. If you have not already, log into the discord chat application on your desktop (or the application on their website) and enter that server. The first thing we are going to do is add your bot to the test server.

In order to do that, we need two things: the Client ID we retrieved earlier, and a Permission Integer. A permission integer is essentially a number that maps to a set of permissions for a discord user. Since a bot is treated as just another discord user, we have to set some base permissions in order for it to have its full capabilities. Discord makes this very easy.

To create the Permissions Integer, you must navigate to the bottom of the Bot management page, to the section labelled “Bot Permissions”. Here you can select the permissions your bot will need to perform its duties, and the tool will generate a permissions integer for you at the bottom. Here is an example basic set of permissions that we can use to simply send messages to any basic, open channel:

IMAGE HERE
An example set of permissions for a basic Discord Bot.

At the time of authoring, your bot by default is private. In order to add the bot to your server, you must enter a URL into your browser to prompt it. The URL should be formed as such, replacing {your-client-id} and {your-bot-permission-integer}:

```
https://discordapp.com/api/oauth2/authorize?client_id={your-client-id}&scope=bot&permissions={your-bot-permission-integer}
```

Here, you should be prompted to select the server to add the bot to, and asked to accept any requested permissions for the bot. After successfully adding your bot to your server, you should see a message in your test server welcoming your bot, and the bot should now be listed on the Member List (which can be opened by selecting the icon in the top right of Discord that looks like two people). Since your bot is not running, your bot should appear in the “Offline” section, but in any case an example of my member list when the bot is running:

IMAGE HERE
Example Member List when Discord Bot is added successfully.

Using this same OAuth2 URL method, you can add this bot to any server you have permission to. It’s as simple as that. Now, we can start developing the actual bot code.

### Writing the Bot Code

We can start by navigating to a project directory in your local command prompt, and for these purposes I will be simulating working in a MacOS terminal.

```bash
npm init
```

Use NPM init to initialize your project directory as a NodeJS project. Next, we will need to install the following packages:

```bash
npm i axios discord.js
```

While doing this, please ensure that the version of discord.js installed is >= 12.0.0. I will be referencing a specific API that is not supported in versions earlier than this.

Next, we need to write the entry point for the application.

```bash
touch index.js
```

Open up this index.js file in your preferred text editor, and lets get started:

```js [index.js]
// index.js
// Import all necessary libraries, commands, and functions.
const Discord = require('discord.js')
const client = new Discord.Client();
const http = require('http');
const CLIENT_LOGIN_KEY = process.env.CLIENT_LOGIN_KEY || 'Your-Dev-Bot-Token-Here';

// When the bot is logged in and ready to go
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// On message sent in discord
client.on('message', msg => {
    if (client.user.id !== msg.author.id) {
        console.log(`processing ${msg.content}`);
    }
});

// Perform the login, which initializes a websocket connection.
client.login(CLIENT_LOGIN_KEY);
```

Replace the CLIENT_LOGIN_KEY assignment to your preferred method to retrieve a key. My particular setup looks exactly like this, where local development always uses a development bot key, and production pulls an environment variable. If you plan on hosting your code in a public repository, you should consider alternative methods of storing your token, such as using dotenv, as hosting secrets of any kind in code is bad practice. For our demo purposes and simple hosting purposes, this will be fine.

We can simply run this code, and our bot should work!

```bash
node index.js
```

You should be greeted with a console message:

```
Logged in as Your-Bot-Username#####!
```

Success. You have officially put your Discord bot online, and it’s ready to work. You can start typing messages into any channel in your test server that your bot has access to, and your node process should spit out the contents of those messages.

Now, let’s write some basic code to interpret a specific type of message and respond to it.

Lets create a folder and a file for a Command class, which is how we will model actions that should respond to particular phrases or words typed into Discord.

```bash
touch commands/Command.js
```

Open up the Command.js file in a text editor, and paste this starter code:

```js [Command.js]
// commands/Command.js
module.exports = class Command {

    // Basic constructor to set some necessary variables.
    constructor(command) {
        this.prefix = '!';
        this._command = command;
    }

    // The main function that will be invoked if the command matches.
    handler() {
        console.log(`This command is registered but does not have an explicit callback override.`);
    }

    get command()  {
        return this._command;
    }

    set message(m) {
        this._message = m;
    }

    // This needs to operate outside of the normal invoke, before a message might be set.
    // Responsible for parsing a message and determining if the message matches the command.
    matchesCommand(message) {
        this.message = message 
        let beginsWithPrefix = message.content.charAt(0) === this.prefix
        let matchesCommand = message.content.substring(1, this.command.length + 1) == this._command
        if (beginsWithPrefix && matchesCommand) {
            console.log(`Command matches.`);
            return true;
        }
        console.log(`Command does not match.`);
        return false;
    }

    // A core function to be called to invoke the current command handle function.
    invoke() {
        this.handler();
    }


    // An optional command to retrieve explanation about a particular command.
    explainCommand() {
        console.log(`This command is invoked by ${this.prefix}${this.command}.`);
    }

    // This should retrieve the message argument in the given message string
    getMessageArgument(argnumber) {
        // Parse the message string and return the argument at the index, split by space
        if (this._message) {
            let split = this._message.split(" ");
            if (split.length >= argnumber + 2) {
                return split[argnumber+1]; // implying that arg0 is the prefix
            }
        }
    }

}
```

This Command class is intended to be the interface for all commands built into our bot. Noting a few important pieces of the class:

* The constructor is used to register the word or phrase that the command will respond to. We also save the discord message in the command to interface with it directly.
* A `matchesCommand` function can parse a discord message and detect if the current command is being requested.
* The `getMessageArgument` function can return parts of the discord message after the required prefix.
* Let’s keep things simple for now, and create a basic command off of this class.

```bash
touch commands/Time.js
```

This basic function will return us the current time according to the bot. Here is the minimal code that is required to run:

```js [Time.js]
// commands/Time.js
const Command = require('./Command.js');

module.exports = class extends Command {

    constructor() {
        super('time');
    }

    handler() {
        this._message.channel.send(new Date().toString());
    }

}
```

Extremely simple! Here we can see we simply inherit the properties of the parent Command class, and we override the constructor to register a command !time, and define a handler that can simply return the current time in a readable format.

Let’s bring this all together. Back to index.js:

```js [index.js]
// index.js
// Import all necessary libraries, commands, and functions.
const Discord = require('discord.js')
const client = new Discord.Client();
const TimeCommand = require('./commands/Time.js');
const http = require('http');
const CLIENT_LOGIN_KEY = process.env.CLIENT_LOGIN_KEY || 'Your-Dev-Bot-Token-Here';

let commands = [
    new TimeCommand()
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

Here we have imported our new command and added some logic to detect and run commands based on the last discord message. Now we can run our bot and test:

```bash
node index.js
```

In your discord test server, in a chat channel which your bot has access to, type !time. The bot should post a message with the current server time! Success, we have built the basic fundamentals of a bot that can respond to discord messages in real time.

### Hosting Your Bot on DigitalOcean

In order to host our bot effectively, we will need to put our project into source control. Feel free to git init this project how you see fit, just make sure to have a .gitignore file that mentions node_modules, so we aren’t attempting to upload large dependency trees.

I recommend hosting your project in a private Github repository on your account. The DigitalOcean platform interfaces nicely with Github and that will be essential for the ease of deployment in this case.

One last thing we need to add before hosting our app – DigitalOcean requires that our app respond to a “health check” – if you are not familiar with this concept, it is essentially a quick HTTP request that DigitalOcean sends to your app to verify that it is functioning properly. Simply add this block of code to your index.js file, right above your commands array definition:

```js
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('YourBotName Online.');
    res.end();
}).listen(8080);
```

We have already imported the http library, but in case you had omitted that, make sure it still exists at the top of your index.js file. Of course you are free to add more robust web server libraries such as express if you so choose, but for our simple purposes, no dependencies are necessary.

Once you are ready, make sure to upload your code to the remote private Github repository, and we can get started with DigitalOcean.

Once you are ready, make sure to head to DigitalOcean’s website and log into an existing account/make a new account. Be aware that at the time of writing this, there is no free tier for DigitalOcean so you will need to tie a payment method to your account in order to host an app. Once you are done with this, head over to https://cloud.digitalocean.com/apps and create a new app.

There might be a few interfaces DigitalOcean will bring you through before you can create your first app, such as connecting your Github account, setting some base permissions, etc. Once you make it to step one of creating your app on the platform, you should be prompted to connect a code repository.

IMAGEHERE
DigitalOcean App Platform interface for connecting a code repository.

Next, you should be prompted to create a name for your app, choose the hosting region, and set the branch you want your code to be pulled from. When ready, you can move onto the next step, which should pull and autodetect your code. Keep in mind that the platform will not be able to detect your app if it is hosted in a subfolder in your repository – the entry point to your app must be in the root directory. There are methods to host projects in subfolders, but we will not be covering those in this tutorial.

The platform should detect a JavaScript environment, and ask you to confirm some final details about your app. As you make it through these prompts and details, add and verify a few things:

* You should make sure that any health check HTTP ports are set to the port you defined in your index.js file, which in this demo was 8080
* You should make sure to set an environment variable for your CLIENT_LOGIN_KEY to your discord bot token, especially if you are separating your production and local development bots. I set this as an application-level environment variable.
* You can certainly choose the smallest hosting capability to start – I run a production bot on the smallest $5/month service for a small amount of users and never come close to my limits.
* If prompted, for our purposes you shouldn’t need to add any additional ‘components’ such as a database. The singular NodeJS service should work just fine.
* Once configured and you make it through all of the prompts, DigitalOcean should attempt to launch your app. It will do so by pulling a relevant Docker image for your environment, and then attempt to run your app. You should be able to follow the logs directly in browser. Once running, DigitalOcean will attempt to check the health of your application as well. Hopefully your logs will display your “Logged In” message, and if so, your bot should be online in your test server!

### Building Off of This Demo? Some Additional Strategies for Development

This demo was extremely simple and intended to give a foundation to building your own bot for Discord. If you plan on building off of this demo or extending it to your needs, I have a few pieces of advice that might help you on your journey. Some initial things I learned while hosting an app in a production environment for external users:

* Keep notes. In my code repositories I keep a notes/ directory with plenty of tips and instructions on development, deployment, secret keys locations, links to dashboards, etc. This helps when returning to the project after a few months and needing to add the bot to another server, for example, and remembering how to do that. I kept notes on the OAuth2 URLs, permission integers, etc.
* Environment variables are your friend – use them. They can make your app versatile to different environments and provide a much better experience developing your bot locally without the risk of live messages flowing through your test changes.
* Set up a Command Manager, an overarching class that you can register commands to and that can hold all of the logic for matching discord messages to your custom commands. Our Command class acts as an interface, and thus collecting several commands and managing them through a single CommandManager class can help organize the chaos, or help display help information/tips to users, etc. A CommandManager class is also a decent way to add ‘register’ functionality to your app, such as enabling or disabling the commands for particular discord servers.
* Prefix your commands with something unique – a robust Discord server will have many bots and custom bots installed, which all attempt to define ‘commands’. If you end up keeping general names for your commands such as !time, you run the risk of conflicting with other bots (which may or may not be intended). Prefixing with a unique character or set of letters/numbers can help with command organization and end user experience.

Lastly, I’ve now released a Part 2 of this tutorial going over some more advanced bot operations, such as interfacing with an API and returning beautiful embedded messages. If you liked this tutorial, ran into issues, or had any comments on this type of content – shoot me an email and let me hear your thoughts!