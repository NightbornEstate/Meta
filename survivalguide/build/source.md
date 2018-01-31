This guide is going to be a running reference point for recreating / getting my work running, and explaining each component of the ecosystem.  
I reccomend reading it thoroughly if I leave at any point. This guide is aimed at someone with basic linux and Node.JS experience

### Notice: Some commands end in a dot. If the dot is INSIDE the red code block you should include it, else don't

## Contents
 - [LoL Trivia Bot](#trivia-bot)
 - [Setting up Mongo](#mongodb)
 - [Janitor](#janitor)

## DigitalOcean
I reccommend hosting all of the bots on [DigitalOcean](https://digitalocean.com), using PM2. Create an account and add your billing information, and create a new "Droplet". I reccommend using the "one click app" `Docker x.y.z~ce on aa.bb`
![Docker 17.12.0~ce on 16.04](https://coding.has-destroyed.me/un2u0Bdt)  
I reccomend docker because some of the bots (LoLTrivia) use docker, and I'm moving more to use it.  

Set up SSH keys and login to the droplet
### Installing Node
You will need to install node, I reccommend using `nvm` because it allows you to use the most recent version, which my bot requires.
The commands (taken from [nvm's git](https://github.com/creationix/nvm)) look like this:
  - `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash` - Install NVM
  - Log out of SSH and log back in again
  - `nvm install 8.9.4`
  - `nvm use 8.9.4`
  - `node --version` => `8.7.0`  
You should also install PM2 with the command `sudo npm install -g pm2`. This manages restarting the bots etc.
You can now run my bots (hopefully) :D

### PM2
The majority of the bots use pm2 to hide them in the background. You can use the command `pm2 ls` to show all running bots, `pm2 restart CheckUser` to restart a running bot called CheckUser etc.  
![](https://coding.has-destroyed.me/uECWO88n)

## Git / GitHub
All of my bots are on [my github](https://github.com/codingJWilliams) or the [Nightborn github](https://github.com/NightbornEstate). The basic command to use is `git clone https://github.com/ACCOUNT/REPONAME`. This downloads the source code. There'll usually be a config.json file to create, which will be specified in each bot below

# Trivia bot
The LoLTrivia bot is forked (read: copied and modified) from [10sse1ucgo](https://github.com/10se1ucgo/LoLTrivia). It's pretty simple to set up

First clone the bot by typing `git clone https://github.com/NightbornEstate/LoLTrivia`. Once you have cloned the bot create a file called `config.json` in the LoLTrivia directory that has been created.
The config.json file should look like so:
```json
{
  "bot":{
    "discord_token": "Mzkarealtokenherepleasereplacemewitharealtoken",
    "owner_id": "193000000arealid"
  },
  "plugins": ["lol"],
  "plugins.lol": {
    "api_region": "NA",
    "api_key": "RGAPI-a95c4816-0000-0000-0000-000", // A production riot key. Hard to get. 
    "trivia": {
      "cd": 10, // The cooldown between trivia games
      "max_games": 15,
      "game_length": 15,
      "points": 15,
      "allowed_modes": ["CLASSIC", "ARAM", "KINGPORO"],
      "allowed_maps": ["SUMMONERS_RIFT", "HOWLING_ABYSS"]
    }
  }
}
```
### If you *do* want economy features (you have successfully set up NadekoConnector)
You should  go to the file `eco.py` in `LoLTrivia/plugins/lol/eco.py` and edit the following:
 - On line 4, add `config = {"ecokey": "your eco key (from nadekoconnector)"}`
 - On lines 12 and 24 change the ip and port to your NadekoConnector IP and port  

The bot should be good to go, you can skip to [building with docker](#building-with-docker)

### If you *don't* want economy features (you haven't yet set up NadekoConnector)
You should  go to the file `LoLTrivia/plugins/lol/questions.py` and edit the following:
 - On line 4, remove `from . import eco`
 - On lines 91 - 103, change this:
```py
       soulsToAward: int = 75
        bal: int = eco.gbal(message.author.id)
        eco.award(message.author.id, soulsToAward)

        self.active = False
        points: int = config['trivia']['points']
        await client.send_message(message.channel,
                                  f"Correct answer '{ans}'{self.extra} by {message.author.mention}! +{points} points"
                                  f" (new score: {(get_score(message.author.id) or 0) + points})"
                                  f" +{soulsToAward} :ghost: (new bal: {bal + soulsToAward})"
                                  )
        return points
```
to:
```py
        self.active = False
        points: int = config['trivia']['points']
        await client.send_message(message.channel,
                                  f"Correct answer '{ans}'{self.extra} by {message.author.mention}! +{points} points"
                                  f" (new score: {(get_score(message.author.id) or 0) + points})"
                                  )
        return points
```
and the bot should be able to work without the connector. You can continue to [building with docker](#building-with-docker)  

### Building with docker
Assuming you have docker installed (IE you chose DigitalOcean's docker image OR followed [this](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-16-04) guide) it should be easy to start the bot.
You first have to build the bot, and you should do this on any source code updates:
```bash
~/LoLTrivia$ docker build -t loltrivia .
```
This will take a while on first run, but it will go much faster afterwards.
To run the bot, you can use one of two commands:  
`docker run loltrivia` will run the bot in your console. If you close the SSH session then the bot will stop, however you're able to see the bot's logs so this is good for testing.  
`docker run --name=trivia -d loltrivia` will start the bot in the background. This means you can close the SSH window without it stopping. To see if the bot is running you can type `docker ps` and to stop it type `docker stop trivia` then `docker rm trivia`.

# MongoDB  
Most of the bots (Janitor, Sunset Bot, Nightborn Bot etc) need a [MongoDB](https://www.mongodb.com/) instance to work. I recommend spinning up a second 1gb ram droplet to host this. You should use the One-click app "MongoDB 3.4.10 on 16.04". Once you have set up the droplet and SSH'd in you should do the following:
 - Find the zip file void gave you with the database
 - Unzip it to your desktop or wherever
 - Connect via FileZilla and upload the whole folder so it sits at `/root/dump/`. Your files should be at `/root/dump/janitor/violations.bson` etc.
 - At the terminal, use the `mongorestore` command in the terminal to restore the data, like so: `mongorestore --host=127.0.0.1 --port=27017 .`
 - Edit `/etc/mongod.conf` with your favourite editor (nano master race ftw) and make the following changes:
   - Under `# network interfaces` change `bindIp: 127.0.0.1` to `bindIp: 0.0.0.0` to bind to other droplets
   - Remove the `#` before `#security:` and add the following so it looks like so:
   ```
security:
  authorization: enabled
  ```
 - Run `sudo service mongod restart`
 - Run `sudo ufw allow 27017`  

Once you've done this, your base connection uri should look like so: `mongodb://nightborn:[ask void for the password]@[your mongo ip]:27017/`. Each bot has it's own database who's name should be added after the slash. Replace `[ask void for the password]` with the password I can give you and replace `[your mongo ip]` with the IP address of the mongo hosting droplet, from the control panel.
![Mongo IP Example](https://coding.has-destroyed.me/u9YFjNdo)
# Janitor
Janitor is the bot everybody knows and loves, for censoring hard r.
The first step in setting it up is downloading the source from git. CD to your home directory using `cd ~` then download the bot using git: `git clone https://github.com/codingJWilliams/Janitor`.
CD to the bot `cd Janitor` then install the dependencies by typing `npm install`. This might take a while to download.
You should make a file called `token.json` with the following contents:
```json
{
  "token": "NDA0njareaLLyd4nkt0keN_sh.oUld-g0hErE",
  "mongo": "mongodb://nigh... your connection uri...:27017/janitor"
}
```
Replacing `mongodb://nigh... your connection uri...:27017` with the base URI from the [MongoDB](#mongodb) step.
Then test the bot in your terminal by typing `node bot.js` and ensuring the output looks like so:
```
jay@nb-bothost-1:~/Janitor$ node bot
(node:3621) ExperimentalWarning: The http2 module is an experimental API.
Connected successfully to server
Logged in as The Cleaner#1641!
```
The first error is completely normal, and a warning only.  

Next you need to start the bot with pm2 so it runs without the console open. You can do this with the command `pm2 start bot.js --name="Janitor"`. See [the pm2 section](#pm2) for more commands.
Janitor should now be running and ready to track violations :D
