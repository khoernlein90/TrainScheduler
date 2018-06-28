$(document).ready(function() {
  var config = {
    apiKey: "AIzaSyDA2w0brHftqxAI-4gPZVFMLx2qTdlzNqU",
    authDomain: "trainscheduler-3bd29.firebaseapp.com",
    databaseURL: "https://trainscheduler-3bd29.firebaseio.com",
    projectId: "trainscheduler-3bd29",
    storageBucket: "trainscheduler-3bd29.appspot.com",
    messagingSenderId: "625114633789"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  var trainName = "";
  var trainTime = "";
  var trainFrequency = 0;
  var destination = "";

  $("#submitBtn").on("click", function(event) {
    event.preventDefault();

    trainName = $("#trainInput")
      .val()
      .trim();
    destination = $("#destinationInput")
      .val()
      .trim();
    trainTime = moment(
      $("#trainTimeInput")
        .val()
        .trim(),
      "hh:mm"
    ).format("X");
    trainFrequency = $("#frequencyInput")
      .val()
      .trim();

    var newTrain = {
      trainName: trainName,
      destination: destination,
      trainTime: trainTime,
      trainFrequency: trainFrequency
    };

    database.ref().push(newTrain);

    $("#trainInput").val("");
    $("#destinationInput").val("");
    $("#trainTimeInput").val("");
    $("#frequencyInput").val("");
  });

  database.ref().on("child_added", function(snapshot) {
    trainName = snapshot.val().trainName;
    destination = snapshot.val().destination;
    trainTime = moment.unix(snapshot.val().trainTime);
    trainFrequency = snapshot.val().trainFrequency;

    var firstTimeConverted = moment(trainTime, "hh:mm A").subtract(1, "years");
    var currentTime = moment();
    var diffTime = moment().diff(moment(firstTimeConverted, "X"), "minutes");
    var tRemainder = diffTime % trainFrequency;
    var tMinutesTillTrain = trainFrequency - tRemainder;
    var nextTrain = moment()
      .add(tMinutesTillTrain, "minutes")
      .format("hh:mm A");

    if (trainTime > currentTime) {
      diffTime = moment(trainTime).diff(moment(currentTime, "X"), "minutes");
      tMinutesTillTrain = diffTime;
      nextTrain = moment.unix(snapshot.val().trainTime).format("hh:mm A");
    }

    $("#trainTable > tbody").append(
      "<tr><td>" +
        trainName +
        "</td><td>" +
        destination +
        "</td><td>" +
        trainFrequency +
        "</td><td>" +
        nextTrain +
        "</td><td>" +
        tMinutesTillTrain +
        "</td></tr>"
    );
  });
});
