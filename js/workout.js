/*
  Barbell Tracker: javascript functions for the workout view
  these functions are used to operate an entire workout "session" consisting of
  multiple sets and then sends them to server
  3/15 Author: Chris J
  */

//    How sets and workout session are handled:
//    each time a set is input, the localStorage['sets'] is read in
//    and the new set is pushed to that array then the array is overwritten is ls
//    At end of workout, sets is written to ls[Date.now().toString] and currWorkout is cleared
//    Since local storage objects will be in the order they are input, I don't need to worry about ordering,
//    searching for last sets should be easy

// sets array for this workout session (should we send individual sets or a whole package
// probably safer to send individually but easier as whole)
/*
    Set: { lift, reps, weight }
    rm'd time stamp, don't think I need
  */
let setProto = {
        lift: '',
        reps: 0,
        weight: 45
    },
    set = function set(options) {
        return $.extend(Object.create(setProto), options);
    },
    sets = [],
    // like a stack, add and remove weights from barbell
    plates = [],
    // change reps functions
    repsAPI = {
        to1: function setRepsTo1() {
            $("#currReps").val(1);
        },

        to3: function setRepsTo3() {
            $("#currReps").val(3);
        },

        to5: function setRepsTo5() {
            $("#currReps").val(5);
        },

        to8: function setRepsTo8() {
            $("#currReps").val(8);
        },

        to12: function setRepsto12() {
            $("#currReps").val(12);
        }
    };

// check if local storage is open
if (localStorage) {
    console.log("local storage exists, good to go");
} else {
    alert("Local storage not allowed, app won't work")
}

// add more exercises, not needed till we have persistence

function enterSetBtn() {
    var newSet = set({
        lift: $("#currLift").val().trim(),
        reps: parseInt($("#currReps").val()),
        weight: parseInt($("#currWeight").val())
    });
    // if currWorkout exists and has anything yet
    if (localStorage.getItem('currWorkout') && localStorage.getItem('currWorkout').length > 0) {
        sets = JSON.parse(localStorage.getItem('currWorkout'))
    }
    sets.push(newSet);
    console.log(JSON.stringify(sets));
    // overwrite (or init) sets in localStorage
    localStorage.setItem('currWorkout', JSON.stringify(sets));
}

// show new lift input and focus it
function showNewLiftInput() {
    $("#addNewLift").show();
    $("#addNewLift").focus();
}

// end workout, send sets array to server?
function endWorkout() {
    // save this session
    if (localStorage) {
        localStorage.setItem(Date.now().toString(), JSON.stringify(sets));
        localStorage.setItem('currWorkout', '');
    } else {
        console.log("No local storage");
    }
    // server side
    alert("Good job! See ya next time.")
    location = location;
}

// Jquery functions
// makes sure page is loaded before running code
$(function () {

    // hide new lift button
    $("#addNewLift").hide();

    // hide current weight input
    $("#currWeight").hide();

    //Add weight buttons
    $("#add45").click(function () {
        let cw = parseInt($("#currWeight").val());
        $("#currWeight").val(cw + 90);
        // force change event
        $("#currWeight").change();
        plates.push(90);
    });
    $("#add25").click(function () {
        let cw = parseInt($("#currWeight").val());
        $("#currWeight").val(cw + 50);
        $("#currWeight").change();
        plates.push(50);
    });
    $("#add10").click(function () {
        let cw = parseInt($("#currWeight").val());
        $("#currWeight").val(cw + 20);
        $("#currWeight").change();
        plates.push(20);
    });
    $("#add5").click(function () {
        let cw = parseInt($("#currWeight").val());
        $("#currWeight").val(cw + 10);
        $("#currWeight").change();
        plates.push(10);
    });
    $("#add2point5").click(function () {
        let cw = parseInt($("#currWeight").val());
        $("#currWeight").val(cw + 5);
        $("#currWeight").change();
        plates.push(5);
    });

    // clear weight
    $("#barbellWeightImg").click(function () {
        if (plates.length > 0) {
            let lp = plates.pop();
            let cw = parseInt($("#currWeight").val());
            $("#currWeight").val(cw - lp);
        } else {
            $("#currWeight").val(45);
        }
        $("#currWeight").change();
    });

    // add alert to (eventually hidden) currWeight input that will change pic onchange()
    $("#currWeight").change(function () {
        // use value of weight to determine filename to change to
        if (parseInt($(this).val()) <= 405) {
            fn = "./assets/" + $(this).val() + ".jpg";
            $("#barbellWeightImg").attr("src", fn);
            // hide currWeight if showing
            if ($(this).is(":visible")) {
                $(this).hide();
            }
        } else {
            // when images exist, this unhides the input can still see and change number
            $("#barbellWeightImg").attr("src", "./assets/lightweight.png");
            $("#currWeight").show();
        }
    });

    // add new lift to select options when enter is pressed
    $("#addNewLift").keypress(function (e) {
        if (e.which == 13) {
            nl = $(this).val();
            $("#currLift").append("<option value=" + nl + " selected>" + nl + "</option>");
            $(this).val("");
            $("#addNewLift").hide();
        }
    });
});
