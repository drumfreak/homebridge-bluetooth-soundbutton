"use strict";

var debug = require('debug')('[Homebridge SoundButton] -  ');
var Accessory, Service, Characteristic, UUIDGen, HAPServer;
var accessories = [];
var amixer = require('./lib/alsa.js')
const { spawn } = require('child_process');

module.exports = function(homebridge) {
  Accessory = homebridge.platformAccessory;
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  UUIDGen = homebridge.hap.uuid;
  HAPServer = homebridge.hap.HAPServer;
  homebridge.registerPlatform("homebridge-sound-button", "SoundButton", SoundButtonPlatform);
}

function SoundButtonPlatform(log, config, api) {
  this.log = log;
  this.cache_timeout = 10; // seconds
  this.refresh = config['refresh'] || 10; // Update every 10 seconds
  this.debugging = config.debugging || false;
  this.debugPrefix = config.debugPrefix || '~~~~~~!!!!~~~~~~ '
  this.log.prefix = 'Homebridge Sound Button';
  this.alsaDebug = config.enableAlsaOutput || false;
  this.defaultSoundPlayer = config.defaultSoundPlayer || '';
  this.configAccessories = (config.accessories !== undefined && config.accessories.constructor === Array) ? config.accessories : [];

  if (api) {
    this.api = api;
    this.api.on('didFinishLaunching', this.didFinishLaunching.bind(this));
  }
}



SoundButtonPlatform.prototype.didFinishLaunching = function() {
  this.pdebug('Finished launching, didFinishLaunching called');
  this.loadSoundAccesories(function() {
    this.pdebug('******* Sound Accessories Loaded!');
  }.bind(this));

  if(this.alsaDebug === true) {
    this.alsaMixer = new amixer();
    this.alsaMixer.amixer([], function(err, message) {
      this.pdebug('AlsaMixer amixer');
      if(err) {
        this.pdebug('Error' + err.message);
      }
      if(message) {
        this.pdebug('AlsaMixer defaultDevice');
        this.pdebug(message);
      }
    }.bind(this)); // main alsa query
  }
};



SoundButtonPlatform.prototype.loadSoundAccesories = function(callback) {
  this.pdebug('******* Loading accessories from config');
  var alength = this.configAccessories.length;
  for(var i = 0; i < alength; i++) {
    if(!accessories[this.configAccessories[i].id]) {
      this.log('New Accessory ' + i + ' Adding');
      this.addAccessory(this.configAccessories[i]);
    }
    if(i === (alength - 1)) {
      callback();
    }
  }
};


SoundButtonPlatform.prototype.configureAccessory = function(accessory) {
  var accessoryId = accessory.context.id;
  var found = false;
  var alength = this.configAccessories.length;
  for(var i = 0; i < alength; i++) {
    if(this.configAccessories[i].id === accessory.context.id) {
      this.pdebug('FOUND ACCESSORY: ' + accessoryId + ' Name: ' + accessory.context.name);
      var found = true;
      var data = this.configAccessories[i];
    }
  }

  if(found) {
    this.log('******* Updating accessory to new config options: ' +  accessoryId + 'Name: ' + data.name);
    accessory.context.name = data.name;
    accessory.context.id = data.id;
    accessory.context.isPlaying = false;
    accessory.context.soundFile = data.soundFile;
    accessory.context.soundOptions = data.soundOptions || [];
    accessory.context.repeat = data.repeat || 0;
    accessory.context.volume = data.volume || 100;
    accessory.context.loop = data.loop || false;
    accessory.context.soundEnabled = data.soundEnabled || true;

    if(data.soundPlayer !== undefined) {
      accessory.context.soundPlayer = data.soundPlayer;
    } else {
      accessory.context.soundPlayer = '';
    }

    this.setService(accessory);
    accessories[accessoryId] = accessory;
  } else {
    this.log("******* REMOVE Accessory Missing from Config: " + accessoryId + ' Name: ' + accessory.context.name);
    this.removeAccessory(accessory);
  }
};



SoundButtonPlatform.prototype.addAccessory = function(data) {
  // this.pdebug(accessories);
  if (!accessories[data.id]) {
    this.log('******* Adding accessory ' + data.name);

    var uuid = UUIDGen.generate(data.id);
    this.pdebug('UUID' + uuid);

    var accessory = new Accessory(data.id, uuid, 8);

    accessory.context.name = data.name;
    accessory.context.id = data.id;
    accessory.context.isPlaying = false;
    accessory.context.soundFile = data.soundFile;
    accessory.context.soundOptions = data.soundOptions || [];
    accessory.context.repeat = data.repeat || 0;
    accessory.context.volume = data.volume || 100;
    accessory.context.loop = data.loop || false;
    accessory.context.soundEnabled = data.soundEnabled || true;

    if(data.soundPlayer !== undefined) {
      accessory.context.soundPlayer = data.soundPlayer;
    } else {
      accessory.context.soundPlayer = '/usr/bin/omxplayer';
    }

    accessory.getService(Service.AccessoryInformation)
      .setCharacteristic(Characteristic.Manufacturer, "Sound Buttons - drumfreak@github")
      .setCharacteristic(Characteristic.Model, "B11")
      .setCharacteristic(Characteristic.SerialNumber, accessory.context.id)
      .setCharacteristic(Characteristic.FirmwareRevision, require('./package.json').version);

    accessory.addService(Service.Switch, data.name);

    this.setService(accessory);

    this.api.registerPlatformAccessories("homebridge-sound-button", "SoundButton", [accessory]);
    accessories[data.id] = accessory;
  }

};


SoundButtonPlatform.prototype.setPowerState = function(thisPlug, powerState, callback) {

  if(powerState === true) {

    this.log('******* Playing Sound.... ' + thisPlug.soundFile);
    var options = [];

    if(thisPlug.soundOptions.length > 0) {
      // ['/s/c'] removes quotes and escapes from within strings.
      options = thisPlug.soundOptions; // spawn changes this.
    }

    options.push(thisPlug.soundFile);

    var soundPlayer = this.defaultSoundPlayer;

    if(thisPlug.soundPlayer !== undefined && thisPlug.soundPlayer !== '') {
      soundPlayer = thisPlug.soundPlayer;
    }

    this.pdebug('Sound Player: ' + soundPlayer);
    thisPlug.playProcess = spawn(soundPlayer, options);

    thisPlug.isPlaying = true;
    if(this.debugging) {
      this.pdebug('Player Options: ' + options);
      this.pdebug('Player File: ' + thisPlug.soundFile);
      this.pdebug('Player Command: ' + soundPlayer + ' ' + thisPlug.soundOptions + ' ' + thisPlug.soundFile);
      this.pdebug('******* Launching PID .... ' + thisPlug.playProcess.pid);
      this.pdebug(JSON.stringify(thisPlug.playProcess.spawnargs, null, 4));
    }

    thisPlug.playProcess.stdout.on('data', (data) => {
      this.pdebug(`stdout: ${data}`);
    });

    thisPlug.playProcess.stderr.on('data', (data) => {
      this.pdebug(`stderr: ${data}`);
    });

    thisPlug.playProcess.on('close', (code) => {
      this.pdebug(`child process exited with code ${code}`);
      // Turn switch off after completion.
      var accessory = accessories[thisPlug.id];
      accessory.getService(Service.Switch).getCharacteristic(Characteristic.On).updateValue(false);
      delete thisPlug.playProcess;
      thisPlug.playProcess = null; // If not...
      thisPlug.isPlaying = false;
    });

    callback();

  } else {

    this.log('******* Stopping Sound.... ' + thisPlug.soundFile);

    thisPlug.isPlaying = false;

    if(thisPlug.playProcess) {
      if(this.debugging === true) {
        this.pdebug('******* Kill State .... ' + thisPlug.playProcess.killed);
        this.pdebug('******* Exit Code .... ' + thisPlug.playProcess.exitCode);
      }

      if(thisPlug.playProcess.killed === false) {
        thisPlug.playProcess.kill('SIGHUP');
        thisPlug.playProcess.kill('SIGINT');

        if(this.debugging === true) {
          this.pdebug('******* Killing PID .... ' + thisPlug.playProcess.pid);
          this.pdebug('******* Kill State .... ' + thisPlug.playProcess.killed);
          this.pdebug('******* Exit Code .... ' + thisPlug.playProcess.exitCode);
        }

        thisPlug.playProcess = null;
        callback();
        return;
      }

      if(thisPlug.playProcess.killed !== 1 && thisPlug.playProcess.exitCode === 0) {
        this.log('******* Exit Kill PID .... ' + thisPlug.playProcess.pid);

        thisPlug.playProcess.kill('SIGHUP');
        thisPlug.playProcess.kill('SIGINT');

        if(this.debugging === true) {
          this.pdebug('******* Kill State .... ' + thisPlug.playProcess.killed);
          this.pdebug('******* Exit Code .... ' + thisPlug.playProcess.exitCode);
        }

        thisPlug.playProcess = null;
        callback();
      }
      // delete thisPlug.playProcess;
    } else {
      callback();
    }
  }
};

SoundButtonPlatform.prototype.setService = function(accessory) {
  accessory.getService(Service.Switch)
    .getCharacteristic(Characteristic.On)
    .on('set', this.setPowerState.bind(this, accessory.context));
  accessory.on('identify', this.identify.bind(this, accessory.context));
};

SoundButtonPlatform.prototype.identify = function(thisPlug, paired, callback) {
  this.log("******* Identify requested for " + thisPlug.id, thisPlug.name);
  if (accessories[thisPlug.id]) {

  }

  callback();
};

SoundButtonPlatform.prototype.removeAccessory = function(accessory) {
  if (accessory) {
    var id = accessory.context.id;
    this.log("******* Removing Sound Button: " + accessory.context.name);
    this.api.unregisterPlatformAccessories("homebridge-sound-button", "SoundButton", [accessory]);
    delete accessories[id];
  }
};

SoundButtonPlatform.prototype.pdebug = function(args) {
  if(this.debugging === true) {
    debug(this.debugPrefix, args);
  }
};
