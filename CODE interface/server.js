// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var favicon  = require('serve-favicon');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var nodemailer   = require('nodemailer');

var configDB = require('./config/database.js');

global._ = require('underscore');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
//app.use(bodyParser()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Body parser use JSON data

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);


// WEB SOCKET ===============================================================================================
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8081 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('Received: %s', message);

    var [start, type, collar_id] = message.split(',', 3);

    if (start == '$'){
      switch (type){

        case 'G' :
          var gpsController = require('./app/controllers/gpsController');
          var gpsMethods = new gpsController();
          gpsMethods.addPositionToDB(message, function(response){
            return;
          });
        break;

        case 'U' :
            var statsController = require('./app/controllers/statsController');
            var statsMethods = new statsController();
            statsMethods.logUnlock(collar_id, function(){
                return;
            });
        break;

        case 'L' :
          console.log("Locked door for dog with collar :", collar_id);
        break;

        case 'T' :
          var sleep = require('sleep-promise');
          sleep(2000).then(function() {
            var epoch_time = (new Date() / 1000) - 14400;
            var time_message = "$,T," + epoch_time.toFixed();
            try { ws.send(time_message); }
            catch (e) { console.log("Error : Client disconected"); }
            console.log("Sent epoch timestamp to mbed");
          });
        break;

        case 'R' :
          var sleep = require('sleep-promise');
          var dogController = require('./app/controllers/dogController');
          var dogMethods = new dogController();

          dogMethods.getDogId(collar_id, function(dog_id){
            if (dog_id) {
              dogMethods.getOwnerEmail(dog_id, function(email){

                var calendarController = require('./app/controllers/calendarController');
                var calendarMethods = new calendarController();

                var days = [1,2,3,4,5,6,7];
                console.log("Sending events data for dog with collar :", collar_id);
                days.forEach(function(day) {
                  sleep(day * 3000).then(function() {
                    calendarMethods.getCalendar(dog_id, email, day, collar_id, function(response){
                      if (response.split(',', 5).length == 5){
                        try { ws.send(response); }
                        catch (e) { console.log("Error : Client disconected"); }
                      };
                      return;
                    });
                  });
                });
                var gpsController = require('./app/controllers/gpsController');
                var gpsMethods = new gpsController();

                gpsMethods.getGpsZone(collar_id, function(zone){
                  if (zone){
                    console.log("Sending zone data for dog with collar :", collar_id);
                    var zone_message = "$,Z," + collar_id + "," + zone.center.lat.toFixed(6) + "," + zone.center.lng.toFixed(6) + "," + zone.radius.toFixed(6);
                    sleep(24000).then(function() {
                      try { ws.send(zone_message); }
                      catch (e) { console.log("Error : Client disconected"); }
                    });
                  }
                });
              });
            };
          });
        break;
      }
    }
  });

  ws.send('Established connection');
});
