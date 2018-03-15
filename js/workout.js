/*
  Barbell Tracker: javascript functions for the workout view
  these functions are used to operate an entire workout "session" consisting of
  multiple sets and then sends them to server
  3/15 Author: Chris J
  */

// sets array for this workout session (should we send individual sets or a whole package
// probably safer to send individually but easier as whole)
/*
  A set in v1 is ["liftName", weightNumber, repsNumber]
  v2 will be ["liftName", weightNumber, repsNumber, timeStampNumber]
  so sets is an array of arrays
  */
let sets = [];
// store plates added to barbell, mimicing a stack
let plates = [];
// add more exercises
let lifts = ["Squat", "Deadlift", "Bench", "OHP", "Power Clean"];

// change reps functions
function setRepsTo1() {
  $("#currReps").val(1);
}
function setRepsTo3() {
  $("#currReps").val(3);
}
function setRepsTo5() {
  $("#currReps").val(5);
}
function setRepsTo8() {
  $("#currReps").val(8);
}
function setRepsTo12() {
  $("#currReps").val(12);
}

// grab all information from page and send data to console (server) and flash a message
function enterSetBtn() {
  cl = $("#currLift").val();
  cw = parseInt($("#currWeight").val());
  cr = parseInt($("#currReps").val());
  sets.push([cl, cw, cr]);
  console.log("Workout so far:");
  sets.forEach(function(currVal) {
    console.log(currVal[0]+" "+currVal[1]+" "+currVal[2]);
  });
}

// Jquery functions
// makes sure page is loaded before running code
$(function(){

   //Add weight buttons
   $("#add45").click(function(){
     let cw = parseInt($("#currWeight").val());
     $("#currWeight").val(cw+90);
     // force change event
     $("#currWeight").change();
     plates.push(90);
   });
   $("#add25").click(function(){
     let cw = parseInt($("#currWeight").val());
     $("#currWeight").val(cw+50);
     $("#currWeight").change();
     plates.push(50);
   });
   $("#add10").click(function(){
     let cw = parseInt($("#currWeight").val());
     $("#currWeight").val(cw+20);
     $("#currWeight").change();
     plates.push(20);
   });
   $("#add5").click(function(){
     let cw = parseInt($("#currWeight").val());
     $("#currWeight").val(cw+10);
     $("#currWeight").change();
     plates.push(10);
   });
   $("#add2point5").click(function(){
     let cw = parseInt($("#currWeight").val());
     $("#currWeight").val(cw+5);
     $("#currWeight").change();
     plates.push(5);
   });

   // clear weight
   $("#barbellWeightImg").click(function(){
     if (plates.length > 0) {
       let lp = plates.pop();
       let cw = parseInt($("#currWeight").val());
       $("#currWeight").val(cw-lp);
     } else {
       $("#currWeight").val(45);
     }
     $("#currWeight").change();
   });

   // add alert to (eventually hidden) currWeight input that will change pic onchange()
   $("#currWeight").change(function() {
     // use value of weight to determine filename to change to
     if (parseInt($(this).val()) <= 405) {
       fn = "./assets/" + $(this).val() + ".jpg";
       $("#barbellWeightImg").attr("src", fn);
     } else {
       // when images exist, this unhides the input can still see and change number
       $("#barbellWeightImg").attr("src", "./assets/brokenBar.jpg");
     }
   });

});
