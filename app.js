const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const socketio = require('socket.io');
const Vonage = require('@vonage/server-sdk');
const EventEmitter = require('events');
const emitter = new EventEmitter();


// Init Vonage

const vonage = new Vonage({
  apiKey: "330a9f8e",
  apiSecret: "IlxBLdTFzhwfB5aN"
})

//Init App

const app = express();

//Template engine set up
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

//Public folder setup
app.use(express.static(__dirname + '/public'));

//Body Parser Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Index route
app.get('/', (req, res) => {
  res.render('index');
})

// Catch form submission
app.post('/', (req, res) => {

  const {
    from,
    number,
    text
  } = req.body;

  vonage.message.sendSms(from, number, text, (err, responseData) => {
    if (err) {
      console.log(err);
    } else {
      if (responseData.messages[0]['status'] === "0") {
        console.log("Message sent successfully.");
      } else {
        console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
      }
    }
  })
})

// Define PORT
const PORT = 5000;


app.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`)
})

// Set server interval every 15 minutes to check for sms

// Register listener for schedule event -- ACTION
emitter.on('checkSchedule', () => {
  console.log('15 minute check for scheduled SMS...');

  // Send text

  fetch('/', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'Liam Imray',
      number: '447309008594',
      text: 'Message sent from express server automatically every 15 minutes'
    })
  }).then((res) => {
    console.log(res);
  }).catch((err) => {
    console.log(err)
  })
})

// Raise schedule event every 15 minutes -- TIMER
setInterval(function () {
  emitter.emit('checkSchedule');
}, 15 * 60 * 1000);
