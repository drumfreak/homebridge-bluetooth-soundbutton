This plugin allows you to create switches (buttons) in your that play sounds through the command line launched from HomeBridge using Apple HomeKit.

I created this in an effort to setup a bluetooth system using multiple speaker groups from my Rasperry Pi 3 Homebridge setup through the bluetooth adapater and multiple speakers. Did I succeed? Well, not yet, but it was a blast getting this far... I'll tell you more about that as this story goes on and give some insights to bluetooth and Raspberry Pi without Pulse Audio using BlueAlsa as that's how Raspberry Pi running on Stretch is configured by default.

For now,

`npm -i homebridge-bluetooth-soundbutton`

Here's a quick configuration example, I'll add more about bluetooth setup later.

Example Homebridge `config.json`

	"platforms": [

            {
               "platform": "SoundButton",
               "name": "SoundButton",
               "debugging" : true,
               "defaultSoundPlayer" : "/usr/bin/omxplayer.bin",
               "enableAlsaOutput": false,
               "accessories" : [

                    {
                        "accessory": "SoundButton",
                        "id" : "09244492920194",
                        "name" : "ILY Erock",
                        "soundFile": "/home/pi/sounds/ILoveYou.m4a",
                        "soundOptions" : ["-o", "alsa:default"],
                        "repeat" : 0,
                        "loop" : false,
                        "volume" : 60,
                        "debugging" : true,
                        "soundEnabled" : true
                    },

                    {
                        "accessory": "SoundButton",
                        "id" : "09230432914958f83",
                        "name" : "Metallica Hates Mp3",
                        "soundFile": "/home/pi/sounds/metallica.mp3",
                        "soundOptions" : ["-o", "alsa:bluetoothSpeaker1"],
                        "repeat" : 0,
                        "loop" : false,
                        "volume" : 60,
                        "debugging" : true,
                        "soundEnabled" : true
                    },

                    {
                        "accessory": "SoundButton",
                        "id" : "09230432914958f84",
                        "name" : "I Love it",
                        "soundFile": "/home/pi/sounds/Iloveit.mp3",
                        "soundOptions" : ["-o", "alsa:echo1"],
                        "repeat" : 0,
                        "loop" : false,
                        "volume" : 60,
                        "debugging" : true,
                        "soundEnabled" : true
                    },

                    {
                        "accessory": "SoundButton",
                        "id" : "09230432914951f84",
                        "name" : "Gong",
                        "soundFile": "/home/pi/sounds/1111.mp3",
                        "soundOptions" : ["-o", "alsa:alexa"],
                        "repeat" : 0,
                        "loop" : false,
                        "volume" : 90,
                        "debugging" : true,
                        "soundEnabled" : true
                    },

                    {
                        "accessory": "SoundButton",
                        "id" : "0923043291491114",
                        "name" : "Unicorns",
                        "soundPlayer" : "/home/pi/bluetooth-players/bluetooth-play",
                        "soundFile": "/home/pi/sounds/unicornsEverywhere.wav",
                        "soundOptions" : ["/usr/bin/omxplayer.bin", "echo1"],
                        "repeat" : 0,
                        "loop" : false,
                        "volume" : 90,
                        "debugging" : true,
                        "soundEnabled" : true
                    }

               ]
            }
        ]
