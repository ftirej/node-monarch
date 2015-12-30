var inquirer = require('inquirer')
var Monarch = require('../monarch');

var options 

var config = require('./config/config.json')

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

var permanentTest

var monarch = new Monarch(config)

var testCall = function (optionIndex) {
    monarch.startRecord(optionIndex)
}

var runPermanentTest = function (optionsNumber) {
    this.options = monarch.getOptions
    clearInterval(permanentTest)
    permanentTest = setInterval(function () {
      testCall(optionsNumber)
    }, monarch.options.permanentTestInterval)
  }

var stopPermanenTest = function () {
    clearInterval(permanentTest)
}

var ask = function () {

   options = monarch.getOptions

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
          monarch.getStatus()
          break
        case 'Start recording':
          console.log('Start recording for ' + options.recordDuration + ' Do not forget to stop it!')
          monarch.startRecord(optionIndex)
          break
        case 'Stop recording':
          console.log('Stop recording...')
          monarch.stopRecord(optionIndex)
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

ask()
