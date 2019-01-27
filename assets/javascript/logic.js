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
 var trainLine = "";
 var destination = "";
 var startTime = "";
 var frequency = 0;

 function currentTime() {
   var current = moment().format('LT');
   $("#currentTime").html(current);
   setTimeout(currentTime, 1000);
 };

 $(".formBox").on("keyup", function () {
   var traintemp = $("#trainLine").val().trim();
   var citytemp = $("#destination").val().trim();
   var timetemp = $("#firstTrain").val().trim();
   var freqtemp = $("#frequency").val().trim();

   sessionStorage.setItem("train", traintemp);
   sessionStorage.setItem("city", citytemp);
   sessionStorage.setItem("time", timetemp);
   sessionStorage.setItem("freq", freqtemp);
 });

 $("#trainLine").val(sessionStorage.getItem("train"));
 $("#destination").val(sessionStorage.getItem("city"));
 $("#firstTrain").val(sessionStorage.getItem("time"));
 $("#frequency").val(sessionStorage.getItem("freq"));

 $("#userSubmit").on("click", function (event) {
   event.preventDefault();

   if ($("#trainLine").val().trim() === "" ||
     $("#destination").val().trim() === "" ||
     $("#firstTrain").val().trim() === "" ||
     $("#frequency").val().trim() === "") {

     alert("Add Your Next Destination!");

   } else {

     trainLine = $("#trainLine").val().trim();
     destination = $("#destination").val().trim();
     startTime = $("#firstTrain").val().trim();
     frequency = $("#frequency").val().trim();

     $(".formBox").val("");

     database.ref().push({
       trainLine: trainLine,
       destination: destination,
       frequency: frequency,
       startTime: startTime,
       dateAdded: firebase.database.ServerValue.TIMESTAMP
     });

     sessionStorage.clear();
   }

 });

 database.ref().on("child_added", function (childSnapshot) {
   var startTimeConverted = moment(childSnapshot.val().startTime, "hh:mm").subtract(1, "years");
   var timeDiff = moment().diff(moment(startTimeConverted), "minutes");
   var timeRemain = timeDiff % childSnapshot.val().frequency;
   var minToArrival = childSnapshot.val().frequency - timeRemain;
   var nextTrain = moment().add(minToArrival, "minutes");
   var key = childSnapshot.key;

   var newrow = $("<tr>");
   newrow.append($("<td>" + childSnapshot.val().trainLine + "</td>"));
   newrow.append($("<td>" + childSnapshot.val().destination + "</td>"));
   newrow.append($("<td class='recurrence'>" + childSnapshot.val().frequency + "</td>"));
   newrow.append($("<td class='nextArrival'>" + moment(nextTrain).format("LT") + "</td>"));
   newrow.append($("<td class='eta'>" + minToArrival + "</td>"));
   newrow.append($("<td class='text-center'><button class='arrival btn btn-danger btn-xs' data-key='" + key + "'>X</button></td>"));

   if (minToArrival < 6) {
     newrow.addClass("info");
   }

   $("#trainTbody").append(newrow);

 });

 $(document).on("click", ".arrival", function () {
   keyref = $(this).attr("data-key");
   database.ref().child(keyref).remove();
   window.location.reload();
 });

 currentTime();