'use strict'
var config = require('./config/config.json')
var configurl = 'http://<username>:<password>@<ipAddress>/Monarch/syncconnect/sdk.aspx?command=<command>'
var secureurl = configurl.replace('<username>', config.username).replace('<password>', config.password).replace('<ipAddress>', config.ipAddress)
var request = require('request')
var colors = require('colors')
var inquirer = require('inquirer')
var options = {
    timeout: 3000,
    permanentTestInterval: 30000,
    recordDuration: 15000,
    hdx: true
  }
var encoderOptions = ['StartRecording', 'StartEncoder1', 'StartEncoder2', 'StartBothEncoders']
var stopOptions = ['StartRecording', 'StopEncoder1', 'StopEncoder2', 'StopBothEncoders']
var permanentTest

var setConfig = function (userConfig){
    var fs = require('fs')
    var Validator = require('jsonschema').Validator;
    var v = new Validator();
    var schema = {
	"id": "/Config",
	"type": "object",
	"properties": {
  	    "username": {"type": "string"},
  	    "password": {"type": "string"},
  	    "ipAddress": {"type": "string"}
	},
	"required": ["username", "password", "ipAddress"]
    }
    var errors = v.validate(userConfig, schema).errors
        if (errors != "")
	    console.log(errors)
	else
	    fs.writeFileSync("config/config.json", JSON.stringify(userConfig))
}

var getStatus = function () {
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

var startRecord = function (encodeIndex) {
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
            stopRecord(encodeIndex)
          }, options.recordDuration)
        } else {
          console.log('Error, starting record: ' + error.red)
        }
      })
    } else {
      console.log('the stopOptions is too short or too long...')
    }
  }

var stopRecord = function (stopIndex) {
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

var  testCall = function (optionIndex) {
    startRecord(optionIndex)
  }

var runPermanentTest = function (optionsNumber) {
    clearInterval(permanentTest)
    permanentTest = setInterval(function () {
      testCall(optionsNumber)
    }, options.permanentTestInterval)
  }

var stopPermanenTest = function () {
    clearInterval(permanentTest)
  }

var questions = [
  {
    type: 'list',
    name: 'command',
    message: 'What do you want to do?',
    choices: [
      'Get status for Matrox HD',
      'Start recording',
      'Stop recording',
      'Run permanent test',
      'Stop permanent test',
      'Exit'
    ]
  }
]

var ask = function () {
  inquirer.prompt(questions, function (answers) {
    if (answers.command === 'Exit') {
      process.exit()
    } else {
      var optionIndex = 0
      if (options.hdx) {
        optionIndex = 3
      } else {
        optionIndex = 0
      }
      switch (answers.command) {
        case 'Get status for Matrox HD':
          console.log('Getting status...')
          getStatus()
          break
        case 'Start recording':
          console.log('Start recording for ' + options.recordDuration + ' Do not forget to stop it!')
          startRecord(optionIndex)
          break
        case 'Stop recording':
          console.log('Stop recording...')
          stopRecord(optionIndex)
          break
        case 'Run permanent test':
          console.log('Run permanent test based on every ' + options.permanentTestInterval + 'ms')
          runPermanentTest(optionIndex)
          break
        case 'Stop permanent test':
          console.log('Stoping test...')
          stopPermanenTest()
          break
        default:
          console.log('Wtf ???')
      }
      ask()
    }
  })
}
//let's ask the user what he wants !
//ask()

module.exports = {
  setConfig: setConfig,
  getStatus: getStatus,
  startRecord: startRecord,
  stopRecord: stopRecord,
  testCall: testCall,
  runPermanentTest: runPermanentTest,
  stopPermanenTest: stopPermanenTest,
  ask: ask
};
