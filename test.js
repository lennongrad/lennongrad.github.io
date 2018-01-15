var doDate = function(){
    var dates = [];
    var datesCtrl = [];

    var found = false;

    for(var i = 0; i < 23; i++){
        dates[i] = Math.ceil(Math.random() * 365);
    
        var newDiv = document.createElement("div");
        newDiv.id = i;
        newDiv.innerHTML = "#" + i + ": "  + dates[i];
        newDiv.className = "date";
    
        document.body.appendChild(newDiv);
    }

    datesCtrl = dates;
    
    for(var i = 0; i < 23; i++){
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
    }
}

var onc = function(){
    $(".date").remove();
    doDate();
}

doDate();