$(document).ready(function () {


     // Initialize Firebase
     var config = {
          apiKey: "AIzaSyC0mhAaWBMZBL1Rj7gRJeTt8FOzxlX1mtE",
          authDomain: "all-aboard-e5833.firebaseapp.com",
          databaseURL: "https://all-aboard-e5833.firebaseio.com",
          projectId: "all-aboard-e5833",
          storageBucket: "",
          messagingSenderId: "281841721821"
     };

     firebase.initializeApp(config);


     //variable to reference the database

     var dataRef = firebase.database();

     //store data on click

     $("#submit-btn").on("click", function (event) {
          
          event.preventDefault();

          //stores data entered into firebase

          var name = $("#name").val().trim();
          var destination = $("#destination").val().trim();
          var firstTrain = $("#firstTrain").val().trim();
          var frequency = $("#frequency").val().trim();

          //clear input fields after submit

          $("#name").val("");
          $("#destination").val("");
          $("#firstTrain").val("");
          $("#frequency").val("");

          //push data to firebase to add to data collection

          dataRef.ref().push({
               name: name,
               destination: destination,
               time: firstTrain,
               frequency: frequency
          });
     });




     dataRef.ref().on("child_added", function (childSnapshot) {
          console.log(childSnapshot.val());


          //create new variables childSnapshot of data from firebase

          var name = childSnapshot.val().name;
          var destination = childSnapshot.val().destination;
          var frequency = childSnapshot.val().frequency;
          var time = childSnapshot.val().time;
          var key = childSnapshot.key;
          var remove = "<button class='glyphicon glyphicon-trash' id=" + key + "></button>"


          //math code, womp womp

          var firstTrainConverted = moment(time, "HH:mm").subtract(1, "years");
          console.log(firstTrainConverted);

          //current time from moment.js

          var currentTime = moment();
          console.log("Current Time: " + moment(currentTime).format("HH:mm"));

          //post current time to jumbotron

          $("#currentTime").html("Current Time: " + moment(currentTime).format("HH:mm"));

          //find the difference between the first train time and the current time

          var timeDiff = moment().diff(moment(firstTrainConverted), "minutes");
          console.log("Difference In Time: " + timeDiff);

          //find the time apart by finding the remainder of the time difference and the frequency - use modal to get whole remainder number

          var timeRemainder = timeDiff % frequency;
          console.log(timeRemainder);

          //minutes until the next train

          var nextTrainMin = frequency - timeRemainder;
          console.log("Minutes Till Train: " + nextTrainMin);

          //time of the next train arrival

          var nextTrainAdd = moment().add(nextTrainMin, "minutes");
          var nextTrainArr = moment(nextTrainAdd).format("HH:mm");
          console.log("Arrival Time: " + nextTrainArr);

          //prepend all user submitted data

          $("#schedule").prepend("<tr><td>" + name + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextTrainArr + "</td><td>" + nextTrainMin + "</td><td>" + remove + "</td></tr>");


     }, function (err) {
          console.log(err);
     });

     //on click command to delete key

     $(document).on("click", ".glyphicon-trash", deleteTrain);

     function deleteTrain() {
          var deleteKey = $(this).attr("id");
          //console.log($(this).attr("id"));
          dataRef.ref().child(deleteKey).remove();

          location.reload();

     }

});