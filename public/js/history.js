/*
    The primary purpose of this file is to query localStorage
    and then show all the users previous workout sessions in reverse
    chronological order (most recent first)

    I think I will need to use a template engine to build the page?
 */

// get things working in console first
// check if local storage is open
if (localStorage) {
    console.log("local storage exists, good to go");
} else {
    alert("Local storage not allowed, app won't work")
}

// jquery functions
$(function () {

    // history exists?
    if (localStorage.length < 2) {
        $("#historyTopMessage").text("No history to show, DYEL");
    } else {
        // build page
        var divs = [];
        for (prop in localStorage) {
            if (parseInt(prop)) {
                var date = new Date(parseInt(prop)),
                divBuilder = '<div><h3>'+date.toDateString()+'</h3><table style="width:100%">';
                JSON.parse(localStorage.getItem(prop)).forEach(function (set) {
                    divBuilder += '<tr><td>'+set.lift+" : "+set.reps+" x "+set.weight+'</td></tr>';
                });

                divBuilder += '</tr></table></div>';
                divs.push(divBuilder);
            }
        }
        divs.reverse().forEach(function (div) {
            $("#workoutsGoHere").append(div);
        });
    }
});