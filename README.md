# Homebridge Sound Buttons

This plugin allows you to create switches (buttons) like power outlets / dimmer switches (for volume faders and on/off state) that play sounds through the command line launched from HomeBridge using Apple HomeKit.  These are useful for automating sounds delivered through speakers using the Alsa channels or built in sound card.  For example, if someone opens a door, you could have the speaker on your Homebridge (Raspberry Pi for example) server play a sound, or you could have it play a sound through bluetooth to one, or multiple speakers.

I created this in an effort to setup a bluetooth system using multiple speaker groups from my Rasperry Pi 3 Homebridge  through the bluetooth adapater and multiple speakers. Did I succeed? Well, not completely, but it was a blast getting this far... I'll tell you more about that as this story goes on and give some insights to bluetooth and Raspberry Pi as of (March 2018) without Pulse Audio using BlueAlsa as that's how Raspberry Pi running on Stretch is configured by default out of the "box".

## Sound Buttons and Automation Triggers in iOS Apple HomeKit from Homebridge

<img src="https://github.com/drumfreak/homebridge-bluetooth-soundbutton/blob/master/docs/img/homebridge-sounds1.jpg" align="center" height="200" alt=""> <img src="https://github.com/drumfreak/homebridge-bluetooth-soundbutton/blob/master/docs/img/homebridge-sounds-automations.jpg" height="200" align="center" alt=""> <img src="https://github.com/drumfreak/homebridge-bluetooth-soundbutton/blob/master/docs/img/homebridge-sounds2.jpg" height="200" align="center" alt=""> <img src="https://github.com/drumfreak/homebridge-bluetooth-soundbutton/blob/master/docs/img/homebridge-sounds-bridge.jpg" height="200" align="center" alt="">



## Homebridge / HomeKit Device Limitation Considerations

There are limitations in homebridge and Apple's Homekit where up to 100 devices can be exposed. If you have a busy Smart Home with a lot of devices polling and refreshing, it can slow down your HomeKit response times and you'll start to see "Updating" while waiting on the status of your devices. For example, I use a Philips Hue Hub and a Samsung SmartThings hub with a few other homebridge plugins and running about 70 devices using light bulbs, plugs, door locks, cameras, sensors and more, so I see "updating" a lot when using the Home app on iOS even with a dedicated iPad as my bridge.  Therefore, I recommend you create a separate installation of your homebridge (see Standalone Install below) for running sounds and then add it to your Apple Home app via an accessory. This way... you can have up to 100 sounds and all of your devices all in one app :) 


# Installation

> You'll need to setup and follow the homebridge instructions here: https://github.com/nfarina/homebridge

> Raspberry Pi Users, check this out: https://github.com/nfarina/homebridge/wiki/Running-HomeBridge-on-a-Raspberry-Pi


## Standard Installation - Adding to your Existing Homebridge:

```sh
	npm install -g homebridge-bluetooth-soundbutton
```

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
                        "id" : "000000000001",
                        "name" : "ILY Erock",
                        "soundFile": "/home/pi/sounds/ILoveYou.mp3",
                        "soundOptions" : ["-o", "alsa:default"],
                        "repeat" : 0,
                        "loop" : false,
                        "volume" : 60,
                        "debugging" : true,
                        "soundEnabled" : true
                    },
                    {
                        "accessory": "SoundButton",
                        "id" : "000000000002",
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
                        "id" : "000000000006",
                        "name" : "Unicorns",
                        "soundPlayer" : "/usr/bin/aplay",
                        "soundOptions" : ["-D", "echo1"],
                        "soundFile": "/home/pi/sounds/unicornsEverywhere.wav",
                        "repeat" : 0,
                        "loop" : false,
                        "volume" : 90,
                        "debugging" : true,
                        "soundEnabled" : true
                    },

                    {
                        "accessory": "SoundButton",
                        "id" : "000000000007",
                        "name" : "MotionDownstairs",
                        "soundPlayer" : "/usr/bin/aplay",
                        "soundOptions" : ["-D", "echo1"],
                        "soundFile": "/home/pi/sounds/motionDownstairs.wav",
                        "repeat" : 0,
                        "loop" : false,
                        "volume" : 90,
                        "debugging" : true,
                        "soundEnabled" : true
                    },

                    {
                        "accessory": "SoundButton",
                        "id" : "000000000008",
                        "name" : "BackDoor Opened",
                        "soundPlayer" : "/usr/bin/aplay",
                        "soundOptions" : ["-D", "echo1"],
                        "soundFile": "/home/pi/sounds/backDoorOpened.wav",
                        "repeat" : 0,
                        "loop" : false,
                        "volume" : 90,
                        "debugging" : true,
                        "soundEnabled" : true
                    },

                    {
                        "accessory": "SoundButton",
                        "id" : "000000000009",
                        "name" : "FrontDoor Opened",
                        "soundPlayer" : "/usr/bin/aplay",
                        "soundOptions" : ["-D", "echo1"],
                        "soundFile": "/home/pi/sounds/frontDoorOpened.wav",
                        "repeat" : 0,
                        "loop" : false,
                        "volume" : 90,
                        "debugging" : true,
                        "soundEnabled" : true
                    },

                    {
                        "accessory": "SoundButton",
                        "id" : "000000000010",
                        "name" : "GarageDoor Opened",
                        "soundPlayer" : "/usr/bin/aplay",
                        "soundOptions" : ["-D", "echo1"],
                        "soundFile": "/home/pi/sounds/garageDoorOpened.wav",
                        "repeat" : 0,
                        "loop" : false,
                        "volume" : 90,
                        "debugging" : true,
                        "soundEnabled" : true
                    },

                    {
                        "accessory": "SoundButton",
                        "id" : "000000000011",
                        "name" : "GarageSideDoor Opened",
                        "soundPlayer" : "/usr/bin/aplay",
                        "soundOptions" : ["-D", "echo1"],
                        "soundFile": "/home/pi/sounds/garageSideDoorOpened.wav",
                        "repeat" : 0,
                        "loop" : false,
                        "volume" : 90,
                        "debugging" : true,
                        "soundEnabled" : true
                    }

               ]
            }
        ]




## Rasberry Pi Homebridge Standalone (Separate) Sound Server:

Assuming you're running systemd and using systemctl to manage your Homebridge install under the 'pi' user:
```sh
	[pi@homebridge] mkdir ~/.homebridge-sounds
	[pi@homebridge] nano ~/.homebridge-sounds/config.json
	[pi@homebridge] cd /home/pi/.homebridge-sounds/
	[pi@homebridge] mkdir ~/.homebridge-sounds/sounds
	[pi@homebridge] cd /home/pi/.homebridge-sounds/sounds
	[pi@homebridge] pwd
```

The output will be where you place your sound files, however you choose what directory you would like:

```sh
	[pi@homebridge:] cd ~/.homebridge-soundserver/sounds
	[pi@homebridge:] pwd
	/home/pi/.homebridge-soundserver/sounds (<--- This is your config sound path)
```

Setup a full homebridge `config.json` for this separate homebridge instance:

	{
		"bridge": {
			"name": "PiSound",
			"username": "A3:B1:C2:A3:E4:D5",
			"port": 51829,
			"pin": "123-45-678"
		},
        	"description": "Pi Sound Server",

		"platforms": [{
		       "platform": "SoundButton",
		       "name": "SoundButton",
		       "debugging" : true,
		       "defaultSoundPlayer" : "/usr/bin/omxplayer.bin",
		       "enableAlsaOutput": false,
		       "accessories" : [
			    {
				"accessory": "SoundButton",
				"id" : "000000000001",
				"name" : "I Love You",
				"soundFile": "/home/pi/.homebridge-sounds/sounds/ILoveYou.mp3",
				"soundOptions" : ["-o", "alsa:echo1"],
				"repeat" : 0,
				"loop" : false,
				"volume" : 60,
				"debugging" : true,
				"soundEnabled" : true
			    },

			    {
				"accessory": "SoundButton",
				"id" : "000000000002",
				"name" : "MotionDownstairs",
				"soundPlayer" : "/usr/bin/aplay",
				"soundOptions" : ["-D", "speakerGroup1"],
				"soundFile": "/home/pi/.homebridge-sounds/sounds/motionDownstairs.wav",
				"repeat" : 0,
				"loop" : false,
				"volume" : 90,
				"debugging" : true,
				"soundEnabled" : true
			    },

			    {
				"accessory": "SoundButton",
				"id" : "000000000003",
				"name" : "BackDoor Opened",
				"soundPlayer" : "/usr/bin/aplay",
				"soundOptions" : ["-D", "alexa"],
				"soundFile": "/home/pi/.homebridge-sounds/sounds/backDoorOpened.wav",
				"repeat" : 0,
				"loop" : false,
				"volume" : 90,
				"debugging" : true,
				"soundEnabled" : true
			    },

			    {
				"accessory": "SoundButton",
				"id" : "000000000004",
				"name" : "FrontDoor Opened",
				"soundPlayer" : "/usr/bin/aplay",
				"soundOptions" : ["-D", "default"],
				"soundFile": "/home/pi/.homebridge-sounds/sounds/frontDoorOpened.wav",
				"repeat" : 0,
				"loop" : false,
				"volume" : 90,
				"debugging" : true,
				"soundEnabled" : true
			    },

			    {
				"accessory": "SoundButton",
				"id" : "000000000005",
				"name" : "GarageDoor Opened",
				"soundPlayer" : "/usr/bin/aplay",
				"soundOptions" : ["-D", "echo1"],
				"soundFile": "/home/pi/.homebridge-sounds/sounds/garageDoorOpened.wav",
				"repeat" : 0,
				"loop" : false,
				"volume" : 90,
				"debugging" : true,
				"soundEnabled" : true
			    },

			    {
				"accessory": "SoundButton",
				"id" : "000000000007",
				"name" : "I AM Computer",
				"soundPlayer" : "/usr/bin/aplay",
				"soundOptions" : ["-D", "echo1"],
				"soundFile": "/home/pi/.homebridge-sounds/sounds/helloComputer.wav",
				"repeat" : 0,
				"loop" : false,
				"volume" : 90,
				"debugging" : true,
				"soundEnabled" : true
			    }
		       ]
		    }
		]
	}
	
### Raspberry Pi systemd / systemctl config:

```sh
	[pi@homebridge] sudo cp /etc/default/homebridge /etc/default/homebridge-sounds
	[pi@homebridge] sudo cp /etc/systemd/system/homebridge.service /etc/systemd/system/homebridge-sounds.service
```

Now edit `sudo nano /etc/default/homebridge-sounds` and here's how my file looks:

	# Defaults / Configuration options for homebridge
	# The following settings tells homebridge where to find the config.json

	HOMEBRIDGE_SOUNDS_OPTS=-D -U /home/pi/.homebridge-sounds/ -D -P /home/pi/.homebridge-sounds 
	# -P <dir> is Optional for development directory:

	# If you uncomment the following line, homebridge will log more
	# You can display this via systemd's journalctl: journalctl -f -u homebridge-sounds
	DEBUG=*



Now edit `sudo nano /etc/systemd/system/homebridge-sounds.service` and here's how my file looks:

	[Unit]
	Description=Homebridge Sound Server Node.js HomeKit Server
	After=syslog.target network-online.target

	[Service]
	Type=simple
	User=pi
	EnvironmentFile=/etc/default/homebridge-sounds
	# Adapt this to your specific setup (could be /usr/bin/homebridge)
	# See comments below for more information
	ExecStart=/usr/bin/homebridge $HOMEBRIDGE_SOUNDS_OPTS
	Restart=on-failure
	RestartSec=10
	KillMode=process

	[Install]
	WantedBy=multi-user.target


Next reload the systemd daemon and set the sound server to boot:
```sh
	[pi@homebridge] sudo systemctl daemon-reload
	[pi@homebridge] sudo systemctl enable homebridge-sounds
	[pi@homebridge] sudo systemctl start homebridge-sounds
	[pi@homebridge] journalctl -f -u homebridge-sounds
```

You should be able to see the logs and the next step is to add this new homebridge "Pi Sound Server" with the PIN number you created in the config file above.

You can also take a look at  `ls ~/.homebridge-sounds`  to see if you now have an accessories and persist folder:

```sh
	pi@homebridge:~/.homebridge/accessories $ ls -alh ~/.homebridge-sounds/
	total 32K
	drwxr-xr-x  6 pi pi 4.0K Mar 28 12:55 .
	drwxr-xr-x 27 pi pi 4.0K Mar 28 11:46 ..
	drwxr-xr-x  2 pi pi 4.0K Mar 28 12:55 accessories
	-rwxr--r--  1 pi pi 7.3K Mar 28 12:52 config.json
	drwxr-xr-x  2 pi pi 4.0K Mar 28 12:55 persist
	drwxr-xr-x  2 pi pi 4.0K Mar 28 12:13 sounds
```

Now you can go to your Home app on your iOS device and pair the new PiSound bridge and gain access to the sound switches.
> Note: I created a separate room for my sounds called 'Sounds' and then ensured that 'Include in Favorites' is unchecked. All of my sounds are now in the "Sounds" room and I can setup my Automation triggers.

<img src="https://github.com/drumfreak/homebridge-bluetooth-soundbutton/blob/master/docs/img/homebridge-sounds1.jpg" align="center" height="200" alt=""> <img src="https://github.com/drumfreak/homebridge-bluetooth-soundbutton/blob/master/docs/img/homebridge-sounds-automations.jpg" height="200" align="center" alt=""> <img src="https://github.com/drumfreak/homebridge-bluetooth-soundbutton/blob/master/docs/img/homebridge-sounds2.jpg" height="200" align="center" alt=""> <img src="https://github.com/drumfreak/homebridge-bluetooth-soundbutton/blob/master/docs/img/homebridge-sounds-bridge.jpg" height="200" align="center" alt="">


