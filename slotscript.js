var counter = new Array();
counter[0] = 0;
counter[1] = 30;
counter[2] = 60;

var counterspeed = 10 * Math.random();
var done = false;

var reroll = function () {
    counter[0] = 0;
    counter[1] = 30;
    counter[2] = 60;
    counterspeed = 10 * Math.random();
    done = false;
}


var repeat = function () {
    for (i = 0; i < counter.length; i++) {
        counter[i] += counterspeed;
        if (counter[i] > 89) {
            counter[i] = 0;
            counterspeed -= .3;
        }
        if(counterspeed <= 0){
            counterspeed = 0;
            if (counter[i] < 60 && counter[i] > 30) {
                counter[i] = 50;
                if (!done) {
                    alert("You get " + i);
                    done = true;
                }
            } else {
                document.getElementById('wheel0-' + i).style.display = "none";
            }
        }
        if (counter[i] >= 30 && counter[i] < 68) {
            document.getElementById('wheel0-' + i).style.display = "block";
        } else {
            document.getElementById('wheel0-' + i).style.display = "none";
        }
        document.getElementById('wheel0-' + i).style.transform = "translateY(" + counter[i] + "px)";
    }
    setTimeout(repeat, 10);
}

repeat();