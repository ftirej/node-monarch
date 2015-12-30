'use strict'

var request = require('request')
var extend = require('util')._extend

var Monarch = function (userConfig, options) {
  this.configurl = 'http://<username>:<password>@<ipAddress>/Monarch/syncconnect/sdk.aspx?command=<command>'

  this.options = extend({
    timeout: 3000,
    recordDuration: 15000,
    hdx: true
  }, options)
  this.encoderOptions = ['StartRecording', 'StartEncoder1', 'StartEncoder2', 'StartBothEncoders']
  this.stopOptions = ['StartRecording', 'StopEncoder1', 'StopEncoder2', 'StopBothEncoders']
  this.secureurl

  this.setConfig(userConfig)
}

Monarch.prototype.setConfig = function (userConfig) {
  this.config = userConfig
  this.secureurl = this.configurl.replace('<username>', this.config.username).replace('<password>', this.config.password).replace('<ipAddress>', this.config.ipAddress)
  console.log(this.config)
}

Monarch.prototype.setOptions = function (options) {
  this.options = options
}

Monarch.prototype.getOptions = function () {
  return this.options
}

Monarch.prototype.getStatus = function () {
  var url = this.secureurl.replace('<command>', 'GetStatus')
  console.log(url)
  request({
    url: url,
    timeout: this.options.timeout
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log('Status: ' + body.blue)
    } else {
      if (error.code === 'ETIMEDOUT') {
        console.error("Can't reach host. Please verify your config or that the address is well configured.\n")
        process.exit()
      } else {
        console.log('Status error: ', error)
      }
    }
  })
}

Monarch.prototype.startRecord = function (encodeIndex) {
  if (encodeIndex === undefined && !this.options.hdx) {
    encodeIndex = 0
  } else if (encodeIndex === undefined && this.options.hdx) {
    encodeIndex = 3
  }
  if (encodeIndex < encoderOptions.length && encodeIndex > -1) {
    var url = this.secureurl.replace('<command>', encoderOptions[encodeIndex])
    console.log('Start record with:', url)
    request({
      url: url,
      timeout: this.options.timeout
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log('Recording: ' + body.green)
        setTimeout(function () {
          this.stopRecord(encodeIndex)
        }, this.options.recordDuration)
      } else {
        console.log('Error, starting record: ' + error.red)
      }
    })
  } else {
    console.log('the stopOptions is too short or too long...')
  }
}

Monarch.prototype.stopRecord = function (stopIndex) {
  if (stopIndex === undefined && !this.options.hdx) {
    encodeIndex = 0
  } else if (stopIndex === undefined && this.options.hdx) {
    encodeIndex = 3
  }
  if (stopIndex < stopOptions.length && stopIndex > -1) {
    var url = this.secureurl.replace('<command>', stopOptions[stopIndex])
    console.log('Stop record with:', url)
    request({
      url: url,
      timeout: this.options.timeout
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log('Stop recording: ' + body.green)
      } else {
        console.log('Error, stoping record: ' + error.red)
      }
    })
  } else {
    console.log('the stopOptions is too short or too long...')
  }
}

module.exports = Monarch
