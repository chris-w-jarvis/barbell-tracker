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

/*
    Set: { lift, reps, weight }
    rm'd time stamp, don't think I need
  */
let setProto = {
    lift: '',
    reps: 0,
    weight: 45
  },
  set = function set (options) {
    return $.extend(Object.create(setProto), options)
  },
  sets = [],
  // like a stack, add and remove weights from barbell
  plates = [],
  // change reps functions
  repsAPI = {
    to1: function setRepsTo1 () {
      $('#currReps').val(1)
    },

    to3: function setRepsTo3 () {
      $('#currReps').val(3)
    },

    to5: function setRepsTo5 () {
      $('#currReps').val(5)
    },

    to8: function setRepsTo8 () {
      $('#currReps').val(8)
    },

    to12: function setRepsto12 () {
      $('#currReps').val(12)
    }
  },
  lifts,
  // other button functions
  buttons = {
    enterSet: function enterSetBtn () {
      // alert that button was pressed
      $("#enterSetBtn").text("100%");
      setTimeout(function () {
        $("#enterSetBtn").text("Enter Set");
      }, 2000);
      // store
      var newSet = set({
        lift: $('#currLift').val().trim(),
        reps: parseInt($('#currReps').val()),
        weight: parseInt($('#currWeight').val())
      })
      // if currWorkout exists and has anything yet
      if (localStorage.getItem('currWorkout') && localStorage.getItem('currWorkout').length > 0) {
        sets = JSON.parse(localStorage.getItem('currWorkout'))
      }
      sets.push(newSet)
      console.log(JSON.stringify(sets))
      // overwrite (or init) sets in localStorage
      localStorage.setItem('currWorkout', JSON.stringify(sets))
      // store last set of this exercise for pre-load
      localStorage.setItem('last' + newSet.lift, newSet.reps + 'x' + newSet.weight)
    },
    newLift: function showNewLiftInput () {
      $('#addNewLift').show()
      $('#addNewLift').focus()
    },
    end: function endWorkout () {
      // save this session
      if (localStorage) {
        localStorage.setItem(Date.now().toString(), JSON.stringify(sets))
        localStorage.setItem('currWorkout', '')
      } else {
        console.log('No local storage')
      }
      // server side
      alert('Good job! See ya next time.')
      location = location
    }
  },
  otherFunctions = {
    determinePlates: function (weight) {
      weight -= 45
      let np = []
      if (Math.floor(weight / 90) > 0) {
        p90 = Math.floor(weight / 90)
        for (i = 0; i < p90; i++) {
          np.push(90)
        }
        weight = weight % 90
      }
      if (Math.floor(weight / 50) > 0) {
        // can't be >1
        np.push(50)
        weight = weight % 50
      }
      if (Math.floor(weight / 20) > 0) {
        p20 = Math.floor(weight / 20)
        for (i = 0; i < p20; i++) {
          np.push(20)
        }
        weight = weight % 20
      }
      if (Math.floor(weight / 10) > 0) {
        // can't be >1
        np.push(10)
        weight = weight % 10
      }
      if (Math.floor(weight / 5) > 0) {
        // can't be >1
        np.push(5)
        weight = weight % 5
      }
      return np
    },
    loadLastLift: function () {
      if (localStorage.getItem('last' + $('#currLift').val())) {
        console.log('Loading last lift')
        var last = localStorage.getItem('last' + $('#currLift').val()).split('x')
        $('#currReps').val(last[0])
        $('#currWeight').val(last[1])
        plates.length = 0
        // possible error
        plates = this.determinePlates(parseInt(last[1]))
      }
      $('#currWeight').change()
    }
  },
  pl8 = false,
  pl8message

// check if local storage is open
if (localStorage) {
  console.log('local storage exists, good to go')
} else {
  alert('Local storage not allowed, app won\'t work')
}

// check if lifts have been saved before, if not initialize lifts array
if (localStorage.getItem('lifts')) {
  lifts = JSON.parse(localStorage.getItem('lifts'))
} else {
  lifts = ['Squat', 'Bench', 'Deadlift', 'OHP', 'PowerClean']
}

// Jquery functions
// makes sure page is loaded before running code
$(function () {

  $('#currWeight').val(45)

  // hide new lift button
  $('#addNewLift').hide()

  // hide current weight input
  $('#currWeight').hide()

  // hide max weight
  $('#barbellWeightImg').hide()

  // add in lift options
  $('#currLift').append('<option value=' + lifts[0] + ' selected>' + lifts[0] + '</option>')
  lifts.slice(1).forEach(function (lift) {
    $('#currLift').append('<option value=' + lift + '>' + lift + '</option>')
  })

  // pre-load last weights used
  otherFunctions.loadLastLift();

  // block double-click zoom
  $('.no-zoom').bind('touchend', function(e) {
    e.preventDefault();
    // Add your code here.
    $(this).click();
  });

  //Add weight buttons
  $('#add45').click(function () {
    let cw = parseInt($('#currWeight').val())
    $('#currWeight').val(cw + 90)
    // force change event
    $('#currWeight').change()
    plates.push(90)
  })
  $('#add25').click(function () {
    let cw = parseInt($('#currWeight').val())
    $('#currWeight').val(cw + 50)
    $('#currWeight').change()
    plates.push(50)
  })
  $('#add10').click(function () {
    let cw = parseInt($('#currWeight').val())
    $('#currWeight').val(cw + 20)
    $('#currWeight').change()
    plates.push(20)
  })
  $('#add5').click(function () {
    let cw = parseInt($('#currWeight').val())
    $('#currWeight').val(cw + 10)
    $('#currWeight').change()
    plates.push(10)
  })
  $('#add2point5').click(function () {
    let cw = parseInt($('#currWeight').val())
    $('#currWeight').val(cw + 5)
    $('#currWeight').change()
    plates.push(5)
  })

  // clear weight (keep this for when max image is shown)
  $('#barbellWeightImg').click(function () {
    if (plates.length > 0) {
      let lp = plates.pop()
      let cw = parseInt($('#currWeight').val())
      $('#currWeight').val(cw - lp)
    } else {
      $('#currWeight').val(45)
    }
    $('#currWeight').change()
  })

  // add alert to (eventually hidden) currWeight input that will change pic onchange()
  $('#currWeight').change(function () {
    // use value of weight to determine filename to change to
    if (parseInt($(this).val()) <= 405) {
      // hide currWeight if showing
      if ($(this).is(':visible')) {
        $(this).hide()
      }
      // show canvas if weight went back down
      if ($('#sketch-holder').is(':hidden')) {
        $('#sketch-holder').show()
      }
      // hide max weight
      if ($('#barbellWeightImg').is(':visible')) {
        $('#barbellWeightImg').hide()
      }
    } else {
      // when images exist, this unhides the input can still see and change number
      $('#barbellWeightImg').show()
      $('#sketch-holder').hide()
      $('#currWeight').show()
    }

    // fix plates if user being stupid
    if (plates.length > 4) {
      plates.length = 0
      plates = otherFunctions.determinePlates(parseInt($(this).val()))
    }
    // set funny pl8 message
    if ((parseInt($(this).val()) - 45) % 90 == 0 && parseInt($(this).val()) > 45) {
      pl8 = true
      pl8message = ((parseInt($(this).val()) - 45) / 90).toString() + 'PL8'
      if (pl8message === '2PL8') {
        pl8message = 'lmao2pl8'
      }
    } else {
      pl8 = false
    }
  })

  // add new lift to select options when enter is pressed
  $('#addNewLift').keypress(function (e) {
    if (e.which == 13) {
      nl = $(this).val()
      $('#currLift').append('<option value=' + nl + ' selected>' + nl + '</option>')
      // may need: $("#currLift").change();
      $(this).val('')
      $('#addNewLift').hide()
      // save lift lists into ls
      lifts.push(nl)
      localStorage.setItem('lifts', JSON.stringify(lifts))
    }
  })

  // on change to currLift attempt to pre-load data
  // BELOW IS WRONG, won't do what you think! maybe fix weight img bug?
  //$("#currLift").change(otherFunctions.loadLastLift());
  $('#currLift').change(function () {
    otherFunctions.loadLastLift()
  })

  // add remove plate functionality to canvas
  $('#sketch-holder').click(function () {
    if (plates.length > 0) {
      let lp = plates.pop()
      let cw = parseInt($('#currWeight').val())
      $('#currWeight').val(cw - lp)
    } else {
      $('#currWeight').val(45)
    }
    $('#currWeight').change()
    //draw();
  })

  $('#currWeight').change();

  // scroll page to lift select
  $('html, body').animate({
    scrollTop: $(".newSet").offset().top
  }, 1000);
})
