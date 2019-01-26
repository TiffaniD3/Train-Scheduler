 // Initialize Firebase
 var config = {
    apiKey: "AIzaSyDB2uDnwXDfsajs1cquSyK5MWm_E1fNSjU",
    authDomain: "train-scheduler-91942.firebaseapp.com",
    databaseURL: "https://train-scheduler-91942.firebaseio.com",
    projectId: "train-scheduler-91942",
    storageBucket: "train-scheduler-91942.appspot.com",
    messagingSenderId: "196357538317"
  };
  firebase.initializeApp(config);
  
  var database = firebase.database();
  
 // Store user data in database
  var trainName = "";
  var destination = "";
  var startTime = "";
  var frequency = 0;
  
  function currentTime() {
    var current = moment().format('LT');
    $("#currentTime").html(current);
    setTimeout(currentTime, 1000);
  };
  
  $(".formBox").on("keyup", function() {
    var traintemp = $("#trainName").val().trim();
    var citytemp = $("#destination").val().trim();
    var timetemp = $("#firstTrain").val().trim();
    var freqtemp = $("#frequency").val().trim();
  
    sessionStorage.setItem("train", traintemp);
    sessionStorage.setItem("city", citytemp);
    sessionStorage.setItem("time", timetemp);
    sessionStorage.setItem("freq", freqtemp);
  });
  
  $("#trainName").val(sessionStorage.getItem("train"));
  $("#destination").val(sessionStorage.getItem("city"));
  $("#firstTrain").val(sessionStorage.getItem("time"));
  $("#frequency").val(sessionStorage.getItem("freq"));
  
  $("#userSubmit").on("click", function(event) {
    event.preventDefault();
  
    if ($("#trainName").val().trim() === "" ||
      $("#destination").val().trim() === "" ||
      $("#firstTrain").val().trim() === "" ||
      $("#frequency").val().trim() === "") {
  
      alert("Please fill in all details to add new train");
  
    } else {
  
      trainName = $("#trainName").val().trim();
      destination = $("#destination").val().trim();
      startTime = $("#firstTrain").val().trim();
      frequency = $("#frequency").val().trim();
  
      $(".formBox").val("");
  
      database.ref().push({
        trainName: trainName,
        destination: destination,
        frequency: frequency,
        startTime: startTime,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
  
      sessionStorage.clear();
    }
  
  });
  
  database.ref().on("child_added", function(childSnapshot) {
    var startTimeConverted = moment(childSnapshot.val().startTime, "hh:mm").subtract(1, "years");
    var timeDiff = moment().diff(moment(startTimeConverted), "minutes");
    var timeRemain = timeDiff % childSnapshot.val().frequency;
    var minToArrival = childSnapshot.val().frequency - timeRemain;
    var nextTrain = moment().add(minToArrival, "minutes");
    var key = childSnapshot.key;
  
    var newrow = $("<tr>");
    newrow.append($("<td>" + childSnapshot.val().trainName + "</td>"));
    newrow.append($("<td>" + childSnapshot.val().destination + "</td>"));
    newrow.append($("<td class='text-center'>" + childSnapshot.val().frequency + "</td>"));
    newrow.append($("<td class='text-center'>" + moment(nextTrain).format("LT") + "</td>"));
    newrow.append($("<td class='text-center'>" + minToArrival + "</td>"));
    newrow.append($("<td class='text-center'><button class='arrival btn btn-danger btn-xs' data-key='" + key + "'>X</button></td>"));
  
    if (minToArrival < 6) {
      newrow.addClass("info");
    }
  
    $("#train-table-rows").append(newrow);
  
  });
  
  $(document).on("click", ".arrival", function() {
    keyref = $(this).attr("data-key");
    database.ref().child(keyref).remove();
    window.location.reload();
  });
  
  currentTime();
  
//   setInterval(function() {
//     window.location.reload();
//   });