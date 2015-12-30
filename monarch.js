'use strict'
var config = {}
var configurl = 'http://<username>:<password>@<ipAddress>/Monarch/syncconnect/sdk.aspx?command=<command>'
var secureurl = configurl.replace('<username>', config.username).replace('<password>', config.password).replace('<ipAddress>', config.ipAddress)
var request = require('request')
var colors = require('colors')
var options = {
    timeout: 3000,
    permanentTestInterval: 30000,
    recordDuration: 15000,
    hdx: true
  }
var encoderOptions = ['StartRecording', 'StartEncoder1', 'StartEncoder2', 'StartBothEncoders']
var stopOptions = ['StartRecording', 'StopEncoder1', 'StopEncoder2', 'StopBothEncoders']
var permanentTest

var Monarch = function (userConfig){
    
    this.setConfig(userConfig)
}

Monarch.prototype.setConfig = function(userConfig) {

    this.config = userConfig
    console.log(this.config)
}

Monarch.prototype.setOptions = function(options) {

    this.options = options;
}

Monarch.prototype.getOptions = function() {
    return this.options
}

Monarch.prototype.getStatus = function () {
    var url = secureurl.replace('<command>', 'GetStatus')
    console.log(url)
    request({
      url: url,
      timeout: options.timeout
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
    if (encodeIndex < encoderOptions.length && encodeIndex > -1) {
      var url = secureurl.replace('<command>', encoderOptions[encodeIndex])
      console.log('Start record with:', url)
      request({
        url: url,
        timeout: options.timeout
      }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log('Recording: ' + body.green)
          setTimeout(function () {
            this.stopRecord(encodeIndex)
          }, options.recordDuration)
        } else {
          console.log('Error, starting record: ' + error.red)
        }
      })
    } else {
      console.log('the stopOptions is too short or too long...')
    }
  }

Monarch.prototype.stopRecord = function (stopIndex) {
    if (stopIndex < stopOptions.length && stopIndex > -1) {
      var url = secureurl.replace('<command>', stopOptions[stopIndex])
      console.log('Stop record with:', url)
      request({
        url: url,
        timeout: options.timeout
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

module.exports = Monarch;
