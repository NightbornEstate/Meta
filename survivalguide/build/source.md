# The one-stop guide for surviving in the wild without a Void 👀
---

This guide is going to be a running reference point for recreating / getting my work running, and explaining each component of the ecosystem.  
I reccomend reading it all if I leave

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

You can now run my bots (hopefully) :D

## Git / GitHub
All of my bots are on [my github](https://github.com/codingJWilliams) or the [Nightborn github](https://github.com/NightbornEstate). The basic command to use is `git clone https://github.com/ACCOUNT/REPONAME`. This downloads the source code. There'll usually be a config.json file to create, which will be specified in each bot below

## Trivia bot
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

### If you *do* want economy features (you have successfully set up NadekoConnector)
You should  go to the file `LoLTrivia/plugins/lol/questions.py` and edit the following:

### Building with docker
test