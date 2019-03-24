#!/usr/bin/env nodejs

var http = require('http');
var fs = require("fs");
const ical = require('node-ical');

var url = 'https://calendar.google.com/calendar/ical/mast3rs.com_a3a2nec0cbcjbraou0bjon3r6s%40group.calendar.google.com/private-b2c71ea20224a6ff13f8f0923bcf54fd/basic.ics';
var arrayDates = [];

http.createServer(function (req, res) {

  var top = fs.readFileSync("index-top.html").toString();
  var bottom = fs.readFileSync("index-bottom.html").toString();

  console.log("Paged Loaded!!!");

  ical.fromURL(url, {}, function(err, data){

    arrayDates = [];
    for (let k in data) {
      if (data.hasOwnProperty(k)) {
        var ev = data[k];
        if (data[k].type == 'VEVENT') {
          var dateStart = new Date(ev.start.getTime());
          var dateEnd = new Date(ev.end.getTime());

          if ( (dateEnd.getTime() - Date.now()) > 0){
            arrayDates.push([ev.summary, dateStart, dateEnd]);
          }
        }
      }
    }
    arrayDates.sort(function(a, b){return a[2].getTime() - b[2].getTime()});

  });

  if (arrayDates.length > 0){

    if( (arrayDates[0][1].getTime() - Date.now()) < 0){
      var nextEvent = arrayDates[0][2].getTime();
      var eventStatus = "Game in Progress! Time left...";
    }
    else {
      var nextEvent = arrayDates[0][1].getTime();
      var eventStatus = "Englands next game is...";
    }
    var nextEventName = arrayDates[0][0];

    res.end(top + "  \n  var countDownDate = " + nextEvent + ";\n" + "  \n  var eventName = '" + nextEventName + "';\n" + "  \n var eventStatus = '" + eventStatus + "';\n" + bottom);
  }
  else {
    res.end("Loading!!!!");
  }

}).listen(8081);
console.log('Server running at http://localhost:8081/');
