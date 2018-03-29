// Build barbell image based on plates from workout.js

var img,
    plateDrawInfo = {
    // x is done by loop, this is [y, w, h, rounded radius]
        90: [25, 18, 150, 5],
        50: [60, 18, 85, 5],
        20: [80, 15, 50, 5],
        10: [90, 10, 25, 5],
        5: [95, 10, 15, 5]
    };

function preload() {
    img = loadImage('../assets/45.jpg');
}

function setup() {
    var canvas = createCanvas(400, 200);

    // Move the canvas so it’s inside our <div id="sketch-holder">.
    canvas.parent('sketch-holder');

    background(255);
}

function draw() {
    background(255);
    image(img, 0, 0, 400, 200);
    fill(220);
    var startX_l = 70, startX_r = 330;
    plates.forEach(function (plate) {
        var currP = plateDrawInfo[plate.toString()];
        rect(startX_l - currP[1], currP[0], currP[1], currP[2], currP[3]);
        rect(startX_r, currP[0], currP[1], currP[2], currP[3]);
        startX_l -= currP[1];
        startX_r += currP[1];
    });
}

// function drawPlates(plates) {
//     fill(220);
//     var startX_l = 70, startX_r = 330;
//     plates.forEach(function (plate) {
//         var currP = plateDrawInfo[plate.toString()];
//         rect(startX_l - currP[1], currP[0], currP[1], currP[2], currP[3]);
//         rect(startX_r, currP[0], currP[1], currP[2], currP[3]);
//         startX_l -= currP[1];
//         startX_r += currP[1];
//     });
// }