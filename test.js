var goodrep = 0;
var totrep = 0;

var doDate = function(){
    $(".date").remove();
    var dates = [];
    var datesCtrl = [];

    var times = parseInt(document.getElementById("input1").value);

    var found = false;

    for(var i = 0; i < times; i++){
        dates[i] = Math.ceil(Math.random() * 365);
    
        var newDiv = document.createElement("div");
        newDiv.id = i;
        newDiv.innerHTML = "#" + (i + 1) + ": "  + dates[i];
        newDiv.className = "date";
    
        document.body.appendChild(newDiv);
    }

    datesCtrl = dates;
    
    for(var i = 0; i < times; i++){
        var res = datesCtrl[i];
        dates[i] = 0;
        if(dates.includes(res)){
            document.getElementById("result").style.backgroundColor = "#32c91e";
            document.getElementById(i).style.backgroundColor = "#32c91e";
            document.getElementById(datesCtrl.indexOf(res)).style.backgroundColor = "#32c91e";
            found = true;
        } 
        dates = datesCtrl;
    }

    if(!found){
        document.getElementById("result").style.backgroundColor = "#cc3c2e";
    } else {
        
    goodrep++;
    }

    totrep++;

    document.getElementById("result").innerHTML = Math.ceil((goodrep / totrep) * 100) + "%";
}

var onc = function(){
    doDate();
}

var iter = function(){
    var iterates = parseInt(document.getElementById("input2").value);

    for(i = 0; i < iterates; i++){
        doDate();
    }
}