var counter = new Array();
counter[0] = 0;
counter[1] = 30;
counter[2] = 60;

var repeat = function () {
    for (i = 0; i < counter.length; i++) {
        counter[i] += .5;
        if (counter[i] > 89) {
            counter[i] = 0;
        }
        if (counter[i] > 30 && counter[i] < 68) {
            document.getElementById('wheel0-' + i).style.display = "block";
        } else {
            document.getElementById('wheel0-' + i).style.display = "none";
        }
        document.getElementById('wheel0-' + i).style.transform = "translateY(" + counter[i] + "px)";
    }
    setTimeout(repeat, 10);
}

repeat();