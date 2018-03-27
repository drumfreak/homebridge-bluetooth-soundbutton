var spawn = require('child_process').spawn;
const debug = require('debug')('[ALSA Mixer NodeJS] !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ');
var reDefaultDevice = /Simple mixer control \'([a-z0-9 -]+)\',[0-9]+/i;
var reInfo = /Simple mixer control \'([a-z0-9 -]+)\',[0-9]+/i;
var defaultDeviceCache = null;

function AlsaMixer() {
  debug('Loading Node AlsaMixer.....');
  defaultDeviceCache = null;
};

AlsaMixer.prototype.amixer = function (args, cb) {

  var ret = '';
  var err = null;
  var p = spawn('amixer', args);

  debug(' Running Alsa Mixer: amixer()');
  // debug(this);

  p.stdout.on('data', function (data) {
    ret += data;
  });

  p.stderr.on('data', function (data) {
    err = new Error('Alsa Mixer Error: ' + data);
  });

  p.on('close', function () {
    cb(err, ret.trim());
  });

};


var defaultDevice = function(cb) {
  debug(' Running Alsa Mixer: defaultDevice()');
  if(defaultDeviceCache === null) {
    this.amixer([], function (err, data) {
      if(err) {
        cb(err);
      } else {
        var res = reDefaultDevice.exec(data);
        if(res === null) {
          cb(new Error('Alsa Mixer Error: failed to parse output'));
        } else {
          defaultDeviceCache = res[1];
          cb(null, defaultDeviceCache);
        }
      }
    });
  } else {
    cb(null, this.defaultDeviceCache);
  }
};

AlsaMixer.prototype.getInfo = function (cb) {
  this.defaultDevice(function (err, dev) {
    if(err) {
      cb(err);
    } else {
      debug(' Running Alsa Mixer: ' + dev);
      self.amixer(['get', dev], function (err, data) {
        if(err) {
          cb(err);
        } else {
          var res = reInfo.exec(data);
          if(res === null) {
            cb(new Error('Alsa Mixer Error: failed to parse output'));
          } else {
            cb(null, {
              volume: parseInt(res[1], 10),
              muted: (res[2] == 'off')
            });
          }
        }
      });
    }
  });
};

AlsaMixer.prototype.getVolume = function (cb) {
  this.getInfo(function (err, obj) {
    if(err) {
      cb(err);
    } else {
      cb(null, obj.volume);
    }
  });
};

AlsaMixer.prototype.setVolume = function (val, cb) {
  this.defaultDevice(function (err, dev) {
    if(err) {
      cb(err);
    } else {
      this.amixer(['set', dev, val + '%'], function (err) {
        cb(err);
      });
    }
  });
};

AlsaMixer.prototype.getMuted = function (cb) {
  this.getInfo(function (err, obj) {
    if(err) {
      cb(err);
    } else {
      cb(null, obj.muted);
    }
  });
};

AlsaMixer.prototype.setMuted = function (val, cb) {
  this.amixer(['set', 'PCM', (val?'mute':'unmute')], function (err) {
    cb(err);
  });
};


module.exports = AlsaMixer;