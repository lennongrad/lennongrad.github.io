    var versionNumber = "1.13"
    
    var debug = false;

    var workers_cost_base = 20;
    var workers_cost_mult = 1.6;
    var worker_cost = workers_cost_base;
    var total_workers = 0
    var av_workers = 0

    var curYPos, curXPos, curDown;

    var currShape = 0;
    var currColor = 0

    var baseChanceSpinner = .998;

    var building_active_colour = "#eee";
    var building_inactive_colour = "#7e8c85";

    var tech_active_colour = "#111";
    var tech_inactive_colour = "#777";

    var hasUnlockedSpecial = false;
    var hasUnlockedSpecialDebug = false;

    var spinnerAlert = 0
    
    function isJSON(str) {
        try {
            return (JSON.parse(str) && !!str);
        } catch (e) {
            return false;
        }
    }

    var helpers = [
        {condition: function(){return true}, text: "^^^<br>Click on one of the big buttons to accumulate Resources, such as Science. Click multiple times to continue accumulating them. Look on the left side to see how much you have!", posX: "22vw", posY: "22vh", page: 1},
        {condition: function(){return res[4].amt >= tech[0].cost()}, text: ">>><br>Click the turquoise button when you have enough Science to unlock a Technology. This gives you access to new Resources, Buildings, and other features!", posX: "85vw", posY: "10vh"},
        {condition: function(){return res[0].amt >= worker_cost}, text: ">>><br>Click here to get more Workers when you have enough Food. Unused Workers give you boosts to how many Resources you get per click.", posX: "85vw", posY: "10vh"},
        {condition: function(){return hasUnlockedABuilding() && res[a].amt > 0}, text: "<<<<br>Click here to buy a Building if you have enough Cash. Make sure that you have enough Workers for the new Building. Buildings give you passive amounts of Resources each second while a Worker is assigned to them. You can keep clicking to buy more of the same Building and earn more Resources per second, but this will also require more Workers!", posX: "40vw", posY: "22vh", page: 1}
    ]

    for(i in helpers){
        helpers[i].finished = false
    }

    var activeHelper = 0

    function activateHelper(){
        for(var i = 0; i < helpers.length; i++){
            if(helpers[i].condition() && !helpers[i].finished){
                activeHelper = i
                spinnerCanBeActive = false
                document.getElementById("helper").style.opacity = ".8"
                document.getElementById("helper").style.left = helpers[activeHelper].posX
                document.getElementById("helper").style.top = helpers[activeHelper].posY
                document.getElementById("helper").innerHTML = helpers[activeHelper].text
                if(helpers[activeHelper].page != undefined){
                    switchPage(helpers[activeHelper].page)
                }
                document.getElementById("blocker").style.opacity = ".4"
                return
            }
        }
    }

    function hideHelper(level){
        if(level == activeHelper){
            spinnerCanBeActive = true
            document.getElementById("helper").style.opacity = "0"
            document.getElementById("blocker").style.opacity = "0"
        }
        helpers[level].finished = true
    }

    function randomIndex(arr){
        return Math.floor(arr.length * Math.random())
    }

    function randomValue(arr){
        return arr[randomIndex(arr)]
    }

    var tips = [
        "you can go to the 'Research' tab to see all of the Technologies you've completed thus far?",
        "you can assign Workers onto Buildings by pressing the arrow icons beneath the name?",
        "you accumulate more Resources per click for each level of Technology you unlock?",
        "you can turn on Auto-Conversions using the check mark boxes in the top right?",
        "you can see what each Technology unlocks in the 'Research' tab and hovering over the icons?",
        "you can Save the game in the 'Settings' tab?",
        "you can click the arrows next to the Technology buying button to see other available Technologies?",
        "a flashing icon appears next to the Worker or Technology buttons when you have enough Resources to use them?",
        "little glowing Events appear with '!' marks around the screen? You can click them to activate special Events!",
        "you can tell what happens when you click an Event by looking at the bottom of the screen and reading the box?",
        "you can tell how many Resources you accumulate per click by looking at the numbers that fly off of the button?",
        "you can see how many Resources you automatically accumulate per second in the Ledger?",
        "you can see how many Resources you automatically accumulate for each Building per second in its box?",
        "the 'ps' you see in Building boxes or in the Ledger stands for how many Resources you accumulate 'per second'?",
        "you can click this very box to move onto the next tip immediately?"
    ]

    var currentTip = randomIndex(tips)
    var tipInterval = 0

    function changeTip(){
        tipInterval = 0
        var tempTip = randomIndex(tips)
        while(currentTip == tempTip){
            tempTip = randomIndex(tips)
        }
        currentTip = tempTip
        document.getElementById("tip").innerHTML = tips[currentTip]
    }
    
    function adjustBrightness(col, amt) {
        var usePound = false;
    
        if (col[0] == "#") {
            col = col.slice(1);
            usePound = true;
        }
    
        var R = parseInt(col.substring(0,2),16);
        var G = parseInt(col.substring(2,4),16);
        var B = parseInt(col.substring(4,6),16);
    
        R = R + amt;
        G = G + amt;
        B = B + amt;
    
        if (R > 255) R = 255;
        else if (R < 0) R = 0;
    
        if (G > 255) G = 255;
        else if (G < 0) G = 0;
    
        if (B > 255) B = 255;
        else if (B < 0) B = 0;
    
        var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
        var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
        var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));
    
        return (usePound?"#":"") + RR + GG + BB;
    
    }

    $(document).ready(function(){
        spinnerCanBeActive = true;
        $('#loadingleft').toggle("slide", { direction: "left" }, 1000);
        $('#loadingright').toggle("slide", { direction: "right" }, 1000);
    })

    window.addEventListener('mousemove', function (e) {
        curYPos = e.pageY;
        curXPos = e.pageX - 80;
        if (curDown && !MouseScroller) {
            document.getElementById('page1').scrollTo(document.getElementById('page1').scrollLeft - e.movementX, document.getElementById('page1').scrollTop - e.movementY);
        }
    });

    window.addEventListener('mousedown', function (e) {
        curDown = true;
    });

    window.addEventListener('mouseup', function (e) {
        curDown = false;
    });

    var MouseScroller = false;

    var setScroll = function () {
        MouseScroller = true;
    };

    function caster(numb, tobe) {
        var numbo = numb.toString();
        while (tobe > numbo.length) {
            numbo = numbo + "0";
        }
        return numbo;
    }
    
    function storageAvailable(type) {
        try {
            var storage = window[type],
                x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        }
        catch(e) {
            return e instanceof DOMException && (
                // everything except Firefox
                e.code === 22 ||
                // Firefox
                e.code === 1014 ||
                // test name field too, because code might not be present
                // everything except Firefox
                e.name === 'QuotaExceededError' ||
                // Firefox
                e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
                // acknowledge QuotaExceededError only if there's something already stored
                storage.length !== 0;
        }
    }

    function capitalize(str){
        return str[0].toUpperCase() + str.substring(1);
    }


    function exportStr() {
        var data = [versionNumber, techUnlocked(), [], [], debug, helpers.map(function(x){return x.finished})]
        for(i in res){
            data[2].push(res[i].toString())
        }
        for(i in bldg){
            data[3].push(bldg[i].toString())
        }

        return JSON.stringify(data)
    }

    function importString(str) {
        if(!isJSON(str)){
            return false
        }
        var data = JSON.parse(str)
        if(data.length != 6 || data[0] != versionNumber){
            alert("This data is incompatible.")
            
            return false
        }
        for(i in data[1]){
            tech[i].unlock(true)
        }
        for(i in data[2]){
            res[i].fromString(data[2][i])
        }
        for(i in data[3]){
            bldg[i].fromString(data[3][i])
        }
        debug = data[4]
        for(var i = 0; i < data[5].length; i++){
            if(data[5][i]){
                hideHelper(i)
                activateHelper()
            }
        }
        return true
    }

    function saveData(){
        if (storageAvailable('localStorage')) {
            localStorage.setItem("save", exportStr())
        }
    }

    function resetData(){
        if (storageAvailable('localStorage')) {
            localStorage.removeItem("save")
            location.reload()
        }
    }

    function loadData(str){
        if (storageAvailable('localStorage')) {
            localStorage.setItem("save", str)
            location.reload()
        } else {
            importString(str)
        }
    }
    
    const copyToClipboard = str => {
        const el = document.createElement('textarea');  // Create a <textarea> element
        el.value = str;                                 // Set its value to the string that you want copied
        el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
        el.style.position = 'absolute';                 
        el.style.left = '150vw';                      // Move outside the screen to make it invisible
        document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
        const selected =            
          document.getSelection().rangeCount > 0        // Check if there is any content selected previously
            ? document.getSelection().getRangeAt(0)     // Store selection if found
            : false;                                    // Mark as false to know no selection existed before
        el.select();                                    // Select the <textarea> content
        document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
        document.body.removeChild(el);                  // Remove the <textarea> element
        if (selected) {                                 // If a selection existed before copying
          document.getSelection().removeAllRanges();    // Unselect everything on the HTML document
          document.getSelection().addRange(selected);   // Restore the original selection
        }
    };

    function Resource(name, unlocked, color, color2, base, limit) {
        this.name = name;
        this.ps = 0;
        this.click = 1;
        this.unlocked = unlocked;
        this.color = color;
        this.color2 = color2;
        this.color3 = "#" + adjustBrightness(color2.substring(1), -50)
        this.baselimit = limit;
        this.limit = limit;

        this.speed = 0

        this.onDebug = false;

        this.rates = [];
        this.auto = [];

        this.canUnlock = true;

        this.amt = base;
        this.bonuses = [];

        this.toString = function(){
            return JSON.stringify([this.amt, this.bonuses])
        }

        this.fromString = function(str){
            var data = JSON.parse(str)
            this.amt = data[0]
            this.bonuses = data[1]
        }

        this.toClick = function () {
            this.amt = this.amt + this.click;
            this.speed += 1
            clicker[rcb.get(this.name)] = 0;
            rowclicker[rcb.get(this.name)] = 0;
            specialCounter += this.click;
            last_click = rcb.get(this.name);
            
            var newAppear = $("<div class='appearer' style='left: " + curXPos + "px; top: " + curYPos + "px'>+" + this.click + ' <img src="' + this.name + '.png" class="food-icon">' + "</div>")
            $("body").append(newAppear)
            newAppear.animate(
                {top: curYPos + 100 + "px",
                left: curXPos + (50 - 100 * Math.random()) + "px",
                opacity: 0},
                400, "easeInQuad", function(){
                    this.remove()
                }
            )
        }

        this.unlocker = function () {
            this.unlocked = true;
            this.onDebug = false;
            rowclicker[rcb.get(this.name)] = 0;
        }

        this.multBy = function (times) {
            var gotRate = 0;
            var isRate = 0;

            for (var y = 0; y < res.length && gotRate == 0; y++) {
                if (this.auto[y]) {
                    gotRate = y;
                    isRate = this.rates[y].rate;
                }
            }

            if (gotRate == 0) {
                this.amt *= times;
            } else {
                res[gotRate].multBy(isRate * times);
            }
        }
    }

    function Building(name, resource, cost_base, cost_mult, efficiency, unlocked, costs) {
        this.resource = resource;
        this.unlocked = unlocked;
        this.name = name;
        this.plural = name + "s";

        this.costers = [];

        this.canUnlock = res[resource].canUnlock;
        this.canShow = true;

        switch (costs) {
            case 0:
                this.costers = [a];
                this.cost_base = 20;
                this.cost_mult = 1.5;
                this.efficiency = 1;
                break;
            case 1:
                this.costers = [a];
                this.cost_base = 600;
                this.cost_mult = 1.75;
                this.efficiency = 10;
                break;
            case 2:
                this.costers = [a, 5];
                this.cost_base = 1500;
                this.cost_mult = 2;
                this.efficiency = 100;
                break;
            case 3:
                this.costers = [a, 5, 6];
                this.cost_base = 9000;
                this.cost_mult = 2.25;
                this.efficiency = 500;
                break;
            case 4:
                this.costers = [a, 5, 6, 7];
                this.cost_base = 30000;
                this.cost_mult = 2.5;
                this.efficiency = 1500;
                //this.canUnlock = false;
                break;
        }

        this.cost_mult += 4

        if (cost_base != 0) {
            this.cost_base = cost_base;
        }
    
        if (cost_mult != 0) {
            this.cost_mult = cost_mult;
        }
    
        if (efficiency != 0) {
            this.efficiency = efficiency;
        }
    
        this.onDebug = false;

        this.fps = 0;
        this.cost = cost_base;

        this.amt = 0;
        this.working = 0;
        this.bonuses = [];

        this.toString = function(){
            return JSON.stringify([this.amt, this.working, this.bonuses])
        }

        this.fromString = function(str){
            var data = JSON.parse(str)
            this.amt = data[0]
            this.working = data[1]
            this.bonuses = data[2]
        }

        this.costfind = function () {
            this.cost = this.cost_base + (this.cost_mult * (Math.pow(1.35, (this.amt + 1)) - Math.pow(1.10, this.amt)));
        }

        this.buy = function () {
            var lesser = this.costers[0];
            var least = 0;
            for (i = 0; i < this.costers.length; i++) {
                if (!(res[this.costers[i]].amt >= this.cost)) {
                    return;
                }
                if (res[this.costers[i]].amt < lesser) {
                    lesser = this.costers[i];
                    least = i;
                }
            }
            do {
                for (i = 0; i < this.costers.length; i++) {
                    res[this.costers[i]].amt -= this.cost;
                }
                ++this.amt;
                this.costfind();
                if (av_workers > 0) {
                    --av_workers;
                    ++this.working;
                }
                findPS();
            } while (res[lesser].amt >= this.cost && all);
            init();
        }

        this.right = function () {
            if (this.working < this.amt && av_workers > 0) {
                ++this.working;
                --av_workers;
            }
            findPS();
            init();
        }

        this.left = function () {
            if (this.working > 0) {
                --this.working;
                ++av_workers;
            }
            findPS();
            init();
        }

        this.unlocker = function () {
            this.unlocked = true;
            this.onDebug = false;
        }
    }

    var recon = new Map();
    var rcb = new Map();

    var res = [];
    res[0] = new Resource("food", false, "#b6ff9e", "#4fff51", 0);
    res[1] = new Resource("housing", false, "#b6ff9e", "#4fff51", 0);
    res[2] = new Resource("gold", false, "#fff69e", "#ffc44f", .1);
    res[3] = new Resource("jewel", false, "#fff69e", "#ffc44f", 0);
    res[4] = new Resource("science", true, "#9ea7ff", "#4f6fff", 0);
    res[5] = new Resource("mineral", false, "#d8c2a4", "#A59989", 0);
    res[6] = new Resource("oil", false, "#d8c2a4", "#A59989", 0);
    res[7] = new Resource("uranium", false, "#d8c2a4", "#A59989", 0);
    res[8] = new Resource("culture", false, "#d19eff", "#ac4fff", 0);
    res[9] = new Resource("political", false, "#d19eff", "#ac4fff", 0);
    res[10] = new Resource("energy", false, "#9effd9", "#4fffa1", 0);
    res[11] = new Resource("tradition", false, "#ff8b82", "#ff5d4f", 0);
    res[12] = new Resource("equipment", false, "#ff8b82", "#ff5d4f", 0);
    res[13] = new Resource("unrest", false, "#d19eff", "#", 0);
    res[14] = new Resource("cash", false, "#d19eff", "#", 0);

    res[10].canUnlock = false;
    res[3].canUnlock = false;
    res[9].canUnlock = false;
    res[12].canUnlock = false;
    res[11].canUnlock = false;
    res[1].canUnlock = false;/*
res[7].canUnlock = false;*/

    var a = res.length - 1;
    var b = a - 1;

    for (i = 0; i < res.length; i++) {
        recon.set(i, res[i].name);
        rcb.set(res[i].name, i);
        for (e = 0; e < res.length; e++) {
            res[i].rates[e] = {unlocked: false, rate: 0};
            res[i].auto[e] = false;
        }
    }

    res[rcb.get('food')].rates[rcb.get('cash')] = {unlocked: false, isDebug: false, rate: .5}
    res[rcb.get('gold')].rates[rcb.get('cash')] = {unlocked: false, isDebug: false, rate: 1.3}
    res[rcb.get('mineral')].rates[rcb.get('cash')] = {unlocked: false, isDebug: false, rate: 1.05}
    res[rcb.get('oil')].rates[rcb.get('cash')] = {unlocked: false, isDebug: false, rate: 1.1}
    res[rcb.get('uranium')].rates[rcb.get('cash')] = {unlocked: false, isDebug: false, rate: 1.15}
    res[rcb.get('cash')].rates[rcb.get('science')] = {unlocked: false, isDebug: false, rate: 1.3}
    res[rcb.get('cash')].rates[rcb.get('food')] = {unlocked: false, isDebug: false, rate: 1.3}


    // name, resource, cost_base, cost_mult, efficiency, unlocked

    var bldg = [];
    bldg[0] = new Building("Field", rcb.get('food'), 0, 0, 0, false, 0); // farms
    bldg[1] = new Building("Farm", rcb.get('food'), 0, 0, 0, false, 1); // silos
    bldg[2] = new Building("Barn", rcb.get('food'), 0, 0, 0, false, 2); // plantations
    bldg[3] = new Building("Plantation", rcb.get('food'), 0, 0, 0, false, 3); // plantations
    bldg[52] = new Building("Greenhouse", rcb.get('food'), 0, 0, 0, false, 4);

    bldg[36] = new Building("a1", rcb.get('housing'), 0, 0, 0, false, 0);
    bldg[37] = new Building("a2", rcb.get('housing'), 0, 0, 45, false, 1);
    bldg[38] = new Building("a3", rcb.get('housing'), 0, 0, 0, false, 2);
    bldg[39] = new Building("b10", rcb.get('housing'), 0, 0, 0, false, 3);
    bldg[53] = new Building("b15", rcb.get('housing'), 0, 0, 0, false, 4);

    bldg[4] = new Building("Gold Mine", rcb.get('gold'), 0, 0, 0, false, 0); // mines
    bldg[5] = new Building("Temple", rcb.get('gold'), 0, 0, 0, false, 1); // banks
    bldg[6] = new Building("Bank", rcb.get('gold'), 0, 0, 0, false, 2); // mints
    bldg[7] = new Building("Mint", rcb.get('gold'), 0, 0, 0, false, 3); // mints
    bldg[54] = new Building("Alchemist", rcb.get('gold'), 0, 0, 0, false, 4);

    bldg[40] = new Building("a4", rcb.get('jewel'), 0, 0, 0, false, 0);
    bldg[41] = new Building("a5", rcb.get('jewel'), 0, 0, 0, false, 1);
    bldg[42] = new Building("a6", rcb.get('jewel'), 0, 0, 0, false, 2);
    bldg[43] = new Building("b11", rcb.get('jewel'), 0, 0, 0, false, 3);
    bldg[55] = new Building("b17", rcb.get('jewel'), 0, 0, 0, false, 4);

    bldg[8] = new Building("Library", rcb.get('science'), 0, 0, 0, false, 0); // labs
    bldg[9] = new Building("School", rcb.get('science'), 0, 0, 0, false, 1); // school
    bldg[10] = new Building("Lab", rcb.get('science'), 0, 0, 0, false, 2);
    bldg[11] = new Building("University", rcb.get('science'), 0, 0, 0, false, 3);
    bldg[56] = new Building("Collider", rcb.get('science'), 0, 0, 0, false, 4);

    bldg[12] = new Building("Deposit", rcb.get('mineral'), 0, 0, 0, false, 0);
    bldg[13] = new Building("Strip Mine", rcb.get('mineral'), 0, 0, 0, false, 1);
    bldg[14] = new Building("Quarry", rcb.get('mineral'), 0, 0, 0, false, 2);
    bldg[15] = new Building("Deep Mine", rcb.get('mineral'), 0, 0, 0, false, 3);
    bldg[57] = new Building("Synthetic", rcb.get('mineral'), 0, 0, 0, false, 4);

    bldg[24] = new Building("4", rcb.get('oil'), 0, 0, 0, false, 0);
    bldg[25] = new Building("Whaler", rcb.get('oil'), 0, 0, 0, false, 1);
    bldg[26] = new Building("Land Rig", rcb.get('oil'), 0, 0, 0, false, 2);
    bldg[27] = new Building("Offshore Rig", rcb.get('oil'), 0, 0, 0, false, 3);
    bldg[58] = new Building("Fracker", rcb.get('oil'), 0, 0, 0, false, 4);

    bldg[28] = new Building("1", rcb.get('uranium'), 0, 0, 0, false, 0);
    bldg[29] = new Building("2", rcb.get('uranium'), 0, 0, 0, false, 1);
    bldg[30] = new Building("U. Mine", rcb.get('uranium'), 0, 0, 0, false, 2);
    bldg[31] = new Building("Leacher", rcb.get('uranium'), 0, 0, 0, false, 3);
    bldg[59] = new Building("Xenolith", rcb.get('uranium'), 0, 0, 0, false, 4);

    bldg[16] = new Building("Theatre", rcb.get('culture'), 0, 0, 0, false, 0);
    bldg[17] = new Building("Museum", rcb.get('culture'), 0, 0, 0, false, 1);
    bldg[18] = new Building("Auditorium", rcb.get('culture'), 0, 0, 0, false, 2);
    bldg[19] = new Building("Stadium", rcb.get('culture'), 0, 0, 0, false, 3);
    bldg[60] = new Building("Broadcaster", rcb.get('culture'), 0, 0, 0, false, 4);

    bldg[44] = new Building("a7", rcb.get('political'), 0, 0, 0, false, 0);
    bldg[45] = new Building("a8", rcb.get('political'), 0, 0, 0, false, 1);
    bldg[46] = new Building("a9", rcb.get('political'), 0, 0, 0, false, 2);
    bldg[47] = new Building("b12", rcb.get('political'), 0, 0, 0, false, 3);
    bldg[61] = new Building("b23", rcb.get('political'), 0, 0, 0, false, 4);

    bldg[20] = new Building("b6", rcb.get('energy'), 0, 0, 0, false, 0);
    bldg[21] = new Building("Generator", rcb.get('energy'), 0, 0, 0, false, 1);
    bldg[22] = new Building("Accumulator", rcb.get('energy'), 0, 0, 0, false, 2);
    bldg[23] = new Building("Powerplant", rcb.get('energy'), 0, 0, 0, false, 3);
    bldg[62] = new Building("Reactor", rcb.get('energy'), 0, 0, 0, false, 4);

    bldg[32] = new Building("7", rcb.get('tradition'), 0, 0, 0, false, 0);
    bldg[33] = new Building("8", rcb.get('tradition'), 0, 0, 0, false, 1);
    bldg[34] = new Building("9", rcb.get('tradition'), 0, 0, 0, false, 2);
    bldg[35] = new Building("b9", rcb.get('tradition'), 0, 0, 0, false, 3);
    bldg[63] = new Building("b25", rcb.get('tradition'), 0, 0, 0, false, 4);

    bldg[48] = new Building("a0", rcb.get('equipment'), 0, 0, 0, false, 0);
    bldg[49] = new Building("a11", rcb.get('equipment'), 0, 0, 0, false, 1);
    bldg[50] = new Building("a12", rcb.get('equipment'), 0, 0, 0, false, 2);
    bldg[51] = new Building("b13", rcb.get('equipment'), 0, 0, 0, false, 3);
    bldg[64] = new Building("b26", rcb.get('equipment'), 0, 0, 0, false, 4);

    bldg[14].plural = "Quarries";
    bldg[8].plural = "Libraries";
    bldg[11].plural = "Universities";

    var unused = [24, 28, 29, 20];
    for (i = 0; i < unused.length; i++) {
        bldg[unused[i]].canShow = false;
    }

    var bldgtxt = new Map();
    var bs = new Map();

    for (i = 0; i < bldg.length; i++) {
        bldgtxt.set(i, bldg[i].name.toLowerCase());
        bs.set(bldg[i].name.toLowerCase(), i);
    }

    var clicker = [];
    var clickerV = [];
    var clickerO = [];
    var clickerH = [];
    var clickerHV = [];
    var rowclicker = [];

    for (var i = 0; i < b; i++) {
        clicker[i] = 1000;
        clickerV[i] = -1;
        clickerHV[i] = -1;
        clickerH[i] = -1;
        clickerO[i] = 1000;
        rowclicker[i] = 1000;

        var newcol = document.createElement("TR");
        newcol.id = res[i].name.toLowerCase() + "-column";
        newcol.className = "column"
        document.getElementById('mainbody').appendChild(newcol);

        var owos = document.createElement("TR");
        owos.innerHTML = Handlebars.compile(document.getElementById("entry-template").innerHTML)({ type: res[i].name, name: capitalize(res[i].name), abr: res[i].name.substring(0, 2) });
        owos.className = 'row' + res[i].name;
        document.getElementById('ledgerbody').appendChild(owos);
    
        var newrow = document.createElement("TD");
        newrow.id = "col" + (i + 1);
        newrow.className = "topalign";
    
        var newappear = document.createElement("TD");
        newappear.innerHTML = Handlebars.compile(document.getElementById("appear-template").innerHTML)({ name: res[i].name.toLowerCase(), ide: i, color: res[i].color2, colordark: res[i].color3 });
        newappear.className = 'clicktd';
        document.getElementById(res[i].name.toLowerCase() + "-column").appendChild(newappear);
        document.getElementById(res[i].name.toLowerCase() + "-column").appendChild(newrow);
    }

    $('.clicktd').on('mouseenter', setScroll);
    $('.clicktd').on('mouseleave', function () { MouseScroller = false });


    var into = 0;

    for (var i = 0; i < res.length; i++) {
        for (var e = 0; e < res.length; e++) {
            if (res[i].rates[e].rate != 0) {
                var owos = document.createElement("TR");
                owos.id = i + "to" + e;

                owos.innerHTML = Handlebars.compile(document.getElementById("conv-template").innerHTML)({ name1: res[i].name, name2: res[e].name, ide1: i, ide2: e });
                owos.className = "row-even"
                into++;
                document.getElementById('conver').insertBefore(owos, document.getElementById('convanchor'));
            }
        }
    }




    for (var i = 0; i < bldg.length; i++) {
        var owos = document.createElement("table");
        owos.innerHTML = Handlebars.compile(document.getElementById("bldg-template").innerHTML)({ bldg: bldg[i].name.toLowerCase(), name: bldg[i].name, ide: i });
        if (bldg[i].canShow) { owos.className = 'boxholder'; } else { owos.className = 'fakeholder' };
        owos.id = bldg[i].name.toLowerCase() + "_holder";
        owos.style.background = "url('frontlayer.png'), url('" + bldg[i].name.toLowerCase() + "_back.jpeg') no-repeat center";
        owos.style.backgroundSize = "cover";
        document.getElementById('col' + (bldg[i].resource + 1)).appendChild(owos);
 
        if (bldg[i].costers.length > 1) {
            for (var e = 1; e < bldg[i].costers.length; e++) {
                var newcost = document.createElement("img");
                newcost.setAttribute("src", res[bldg[i].costers[e]].name + ".png");
                newcost.className = "food-icon cashicon";
                document.getElementById(i + "cost").appendChild(newcost);
            }
        }
    }

    chargeamt = 3;

    for (var i = 0; i < chargeamt; i++) {
        var owos = document.createElement("TR");
        owos.innerHTML = Handlebars.compile(document.getElementById("charge-template").innerHTML)({ chargename: "doogus", chargeid: i });
        document.getElementById('chargeanchor').appendChild(owos);
    }

    function Technology(type, level, effects, name, descr) {
        this.type = type;
        this.level = level;
        this.effects = effects;
        this.descr = descr;
        this.unlocked = false;
        this.name = name;

        this.elem = document.createElement("TR")
        this.elem.className = "tech-data-row"
        this.elem.style.backgroundPosition = Math.random() * 1000 + "px " + Math.random() * 1000 + "px"
        var cells = [document.createElement("TD"), document.createElement("TD"), document.createElement("TD"), document.createElement("TD")]
        cells[0].innerHTML = '<span class="cost">456.123k</span> <img draggable="false" src="science.png" class="cashicon food-icon" style="vertical-align: middle;">'
        cells[0].className = "cost-cell"
        cells[1].innerHTML = this.name
        cells[1].className = "name-cell"
        cells[2].innerHTML = this.descr
        for(i in this.effects){
            var image = document.createElement("IMG")
            image.className = "tech-icon"
            image.onmouseover = function(){showTooltip(this)}
            image.onmouseleave = function(){hideTooltip()}
            switch(this.effects[i].type){
                case UNLOCKBLDG: image.setAttribute("message","<b>Unlock Building</b>: " + capitalize(this.effects[i].bldg)); image.src = "techUnlockBuilding.png"; break;
                case UNLOCKRES: image.setAttribute("message","<b>Unlock Resource</b>: " + capitalize(this.effects[i].res)); image.src = "techUnlockResource.png"; break;
                case UNLOCKSPECIAL: image.setAttribute("message","<b>Unlock Special Bar</b>"); image.src = "techUnlockSpecial.png"; break;
                case UNLOCKRATE: image.setAttribute("message","<b>Unlock Rate: </b>" + capitalize(res[this.effects[i].rate[0]].name) + " to " + capitalize(res[this.effects[i].rate[1]].name)); image.src = "techUnlockRate.png"; break;
                case UNLOCKPOLICY: image.setAttribute("message","<b>Unlock Policy</b>: " + capitalize(this.effects[i].policy)); image.src = "techUnlockPolicy.png"; break;
                case BONUSBLDG: image.setAttribute("message","<b>Bonus</b>: " + capitalize(this.effects[i].bldg) + " for " + (100 * this.effects[i].bonus) + "%"); image.src = "techBonusBuilding.png"; break;
                case BONUSRES: image.setAttribute("message","<b>Bonus</b>: " + capitalize(this.effects[i].res) + " for " + (100 * this.effects[i].bonus) + "%"); image.src = "techBonusResource.png"; break;
            }
            cells[3].appendChild(image)
        }
        var tech = this
        this.elem.onclick = function(){tech.unlock(); hideHelper(1)}
        cells.forEach(function(x){tech.elem.appendChild(x)})
        document.getElementById("tech-data").appendChild(this.elem)

        this.cost = function(){
            return techs_cost_base * (Math.pow(1.25, (this.level + 1)) - Math.pow(1.21, this.level)) * (Math.pow(1.25, (techLevel + 1)) - Math.pow(1.21, techLevel));
        }

        this.unlock = function(ignoreCost){
            if ((res[this.type == 0 ? 4 : 8].amt >= this.cost() || ignoreCost) && techPossible().includes(Number(this.level))){
                res[this.type == 0 ? 4 : 8].amt -= this.cost()
                for(i in this.effects){
                    switch(this.effects[i].type){
                        case UNLOCKBLDG: bldg[bs.get(this.effects[i].bldg)].unlocker(); break;
                        case UNLOCKRES: res[rcb.get(this.effects[i].res)].unlocker(); break;
                        case BONUSBLDG: bldg[bs.get(this.effects[i].bldg)].bonuses.push({type: "Permanent", detail: "From " + this.name, percent: this.effects[i].bonus}); break;
                        case BONUSRES: res[rcb.get(this.effects[i].res)].bonuses.push({type: "Permanent", detail: "From " + this.name, percent: this.effects[i].bonus}); break;
                        case UNLOCKSPECIAL: hasUnlockedSpecial = true; break;
                        case UNLOCKRATE: res[this.effects[i].rate[0]].rates[this.effects[i].rate[1]].unlocked = true; break;
                        case UNLOCKPOLICY:
                        default: console.log("Unknown tech effect: " + this.effects[i].type)
                    }
                }
                techLevel += 1;
                this.unlocked = true;
                techSelected = techEarliest()
                init()
            }
    
        }
    }

    var tech = [];
           
    var UNLOCKBLDG = 0
    var UNLOCKRES = 1
    var BONUSBLDG = 2
    var BONUSRES = 3
    var UNLOCKSPECIAL = 4
    var UNLOCKPOLICY = 5
    var UNLOCKRATE = 6

	tech[0] = new Technology(0 , 0 , [{type: UNLOCKRES     , res: "food"}]       , "Hunting/Gathering", "Allows gathering of Food");
	tech[1] = new Technology(0 , 1 , [{type: UNLOCKRES     , res: "gold"}]       , "Mining"                , "Allows gathering of Gold");
	tech[2] = new Technology(0 , 2 , [{type: UNLOCKRES     , res: "cash"}        , {type: UNLOCKRATE  , rate: [2         ,a]}] , "Bartering" , "Allows gathering of Cash");
	tech[3] = new Technology(0 , 3 , [{type: UNLOCKRATE    , rate: [a            , 0]}]               , "Trading"              , "Allows trading of Cash for Food");
	tech[4] = new Technology(0 , 4 , [{type: UNLOCKBLDG    , bldg: "field"}]     , "Sedentary Agriculture"                , "Unlocks Field to produce Food every second");
	tech[5] = new Technology(0 , 5 , [{type: UNLOCKBLDG    , bldg: "gold mine"}  , {type: UNLOCKBLDG  , bldg: "library"}], "Construction" , "Unlocks even more buildings");
	tech[6] = new Technology(0 , 6 , [{type: UNLOCKSPECIAL}, {type: BONUSRES     , res: "food"        , bonus: .1}]      , "Harvest Celebrations" , "Unlocks the Special Bar in the top-left");
	tech[7] = new Technology(0 , 7 , [{type: UNLOCKBLDG    , bldg: "farm"}       , {type: UNLOCKRATE  , rate: [0         ,a]}] , "Cities" , "Unlocks the Farm building");
	tech[8] = new Technology(0 , 8 , [{type: UNLOCKBLDG    , bldg: "temple"}]    , "Taxation"                , "Unlocks the Temple building");
	tech[9] = new Technology(0 , 9 , [{type: UNLOCKRES     , res: "culture"}     , {type: UNLOCKBLDG  , bldg: "theatre"}], "Recreation", "Allows gathering of Culture");
	tech[10] = new Technology(0, 10, [{type: UNLOCKBLDG    , bldg: "school"}     , {type: UNLOCKRATE  , rate: [a         ,4]}] , "Education", "Unlocks the School building");
	tech[11] = new Technology(0, 11, [{type: BONUSRES      , res: "food", bonus: .1}]       , "Shipbuilding"               , "Boosts Food production");
	tech[12] = new Technology(0, 12, [{type: UNLOCKRES     , res: "mineral"}]    , "Metallurgy"               , "Allows gathering of Minerals");
	tech[13] = new Technology(0, 13, [{type: UNLOCKBLDG    , bldg: "deposit"}    , {type: BONUSBLDG   , bldg: "farm", bonus: .1}]   , "Feudalism", "Unlocks the Deposit building");
	tech[14] = new Technology(0, 14, [{type: UNLOCKBLDG    , bldg: "bank"}       , {type: UNLOCKRATE  , rate: [5         ,a]}] , "Charters", "Unlocks the Bank building");
	tech[15] = new Technology(0, 15, [{type: UNLOCKBLDG    , bldg: "barn"}]      , "Crop Rotation"               , "Unlocks the Barn building");
	tech[16] = new Technology(0, 16, [{type: UNLOCKBLDG    , bldg: "strip mine"}], "Gunpowder"               , "Unlocks the Strip Mine building");
	tech[17] = new Technology(0, 17, [{type: UNLOCKBLDG    , bldg: "lab"}        , {type: BONUSRES    , res: "gold", bonus: .3}]    , "Scientific Method", "Unlocks the Lab building");
	tech[18] = new Technology(0, 18, [{type: UNLOCKRES     , res: "oil"}         , {type: UNLOCKRATE  , rate: [6         ,a]}] , "Biology", "Allows gathering of Oil");
	tech[19] = new Technology(0, 19, [{type: UNLOCKBLDG    , bldg: "whaler"}     , {type: BONUSRES    , res: "food", bonus: .3}]    , "Reinforced Ships", "Unlocks the Whaler building");

    var techLevel = 0;
    var techSelected;

    var techs_cost_base = 50;
    var techs_visible = 3;

    function techMove(direction) {
        var possible = techPossible()
        switch(direction){
            case "left":
                for(var i = possible.length - 1; i >= 0; i--){
                    if(possible[i] < techSelected){
                        techSelected = possible[i]
                        return
                    }
                }
                break;
            case "right":
                for(i in possible){
                    if(possible[i] > techSelected){
                        techSelected = possible[i]
                        return
                    }
                }
                break;
            case "earliest": break;
            case "latest":
                techSelected = possible[possible.length - 1]
                return;
        }
        techSelected = techEarliest()
    }

    function techPossible() {
        var possible = []
        for(var i = 0; i < tech.length && possible.length < techs_visible; i++){
            if(!tech[i].unlocked){
                possible.push(i)
            }
        }
        return possible
    }

    function techEarliest(){
        for(i in tech){
            if(!tech[i].unlocked){
                return Number(i)
            }
        }
        return Number(tech.length - 1)
    }
    techSelected = Number(techEarliest());

    function techLatest(){
        for(var i = tech.length - 1; i >= 0; i--){
            if(!tech[i].unlocked && techPossible().includes(Number(i))){
                return Number(i)
            }
        }
        return techEarliest()
    }

    function techUnlocked(){
        var unlocked = []
        for(i in tech){
            if(tech[i].unlocked){
                unlocked.push(i) 
            }
        }
        return unlocked
    }

    var all = false;

    var specialCounter = 99;
    var specialMax = 100;
    var last_click = 4;

    var flasher = 0;
    var flasher_interval = 70;

    var flash_tech = false;
    var flash_worker = false;

    var active_page = 2;
    var pages = 4;

    function switchPage(inter) {
        if (inter < pages + 1) {
            active_page = inter;
        }
        activatePage();

    }

    function activatePage() {
        for (r = 1; r < pages + 1; r++) {
            if (active_page == r) {
                document.getElementById('page' + r).style.display = "block";
                document.getElementById(r + 'pageclick').style.background = "#d8d6d6";
            } else {
                document.getElementById('page' + r).style.display = "none";
                document.getElementById(r + 'pageclick').style.background = "";
            }
        }
    }

    activatePage();

    // Audio
    //var snd = new Audio("click.wav");
    // snd.play();

    //document.getElementById('ledgerbody').appendChild( document.getElementsByClassName('rowfood')[0].cloneNode(true) );

    var suffixarray = ["", "k", "m", "b", "t", "qu", "qi", "sx", "sp"];

    function small_int(e) {
        var size = Math.floor(Math.log10(Math.abs(e))) + 1;
        var suffix = "";

        if (size < 4) {
            return e.toString().substring(0, 3);
        } else {
            e = e.toExponential(9);
            e = e.substring(0, 4 + size % 3 + 4);
        }
        if (size >= 4) {
            switch (size % 3) {
                case 0: e = e.substring(0, 1) + e.substring(2, 4) + "." + e.substring(4); e = e.substring(0, 7); break;
                case 1: e = e.substring(0, 5); break;
                case 2: e = e.substring(0, 1) + e.substring(2, 3) + "." + e.substring(3); e = e.substring(0, 6); break;
            }
            suffix = suffixarray[Math.floor((size - 1) / 3)]
        }
        if ((Math.floor((size - 1) / 3)) < suffixarray.length) {
            return e + suffix;
        } else {
            return e + "e" + (size - 3);
        }
    }

    function doFlasher() {
        flasher += .8;
        var flasho = document.getElementsByClassName("flashing");
        if (flasher > (flasher_interval / 2)) {
            for (i = 0; i < flasho.length; i++) {
                flasho[i].style.display = "none";
            }
        }
        if (flasher > flasher_interval) {
            flasher = 0;
            for (i = 0; i < flasho.length; i++) {
                flasho[i].style.display = "block";
            }
        }
        if (!flash_tech) {
            document.getElementById('near_tech').style.display = "none";
        }
        if (!flash_worker) {
            document.getElementById('near_worker').style.display = "none";
        }
    }

    function hasUnlockedABuilding(){
        var final = false
        for(i in bldg){
            if(bldg[i].unlocked){
                final = true
            }
        }
        return final
    }

    function init() {
    
        for (var i = 0; i < res.length; i++) {
            for (var e = 0; e < res.length; e++) {
                if (res[i].rates[e].rate != 0) {
                    document.getElementById(res[i].name + "_to_" + res[e].name + "_rate").innerHTML = caster(res[i].rates[e].rate, 4);
                }
            }
        }
    
        document.getElementById('workers_number').innerHTML = av_workers + " / " + total_workers;
        document.getElementById('worker_cost').innerHTML = small_int(Math.ceil(worker_cost));

        document.getElementById("unrest-row").style.display = res[13].unlocked ? "" : "none"
        document.getElementById("cash-row").style.display = res[14].unlocked ? "" : "none"
        document.getElementById("worker-row").style.display = res[0].unlocked ? "" : "none"
        document.getElementById("convanchor").style.display = res[0].unlocked ? "" : "none"
        document.getElementById("2pageclick").style.display = res[8].unlocked ? "" : "none"

        for (i = 0; i < bldg.length; i++) {
            if (bldg[i].unlocked) {
                document.getElementById(bldgtxt.get(i) + 's_number').innerHTML = bldg[i].amt;
                document.getElementById(bldgtxt.get(i) + 's_fps').innerHTML = "(" + small_int(bldg[i].fps) + ' /s)';
                document.getElementById(bldgtxt.get(i) + '_cost').innerHTML = small_int(Math.ceil(bldg[i].cost));
                document.getElementById(bldgtxt.get(i) + '_working').innerHTML = bldg[i].working + " / " + bldg[i].amt;

                if (bldg[i].amt != 1) {
                    document.getElementById(bldgtxt.get(i) + 'plural').innerHTML = bldg[i].plural;
                } else {
                    document.getElementById(bldgtxt.get(i) + 'plural').innerHTML = bldg[i].name;
                }
            }
        }

        document.getElementById('tech_level').innerHTML = techSelected + 1;
        document.getElementById('tech_cost').innerHTML = small_int(Math.ceil(tech[techSelected].cost()));
        document.getElementById('tech_name').innerHTML = tech[techSelected].name;      
        document.getElementById('tech_descr').innerHTML = tech[techSelected].descr;

        for(i in tech){
            tech[i].elem.getElementsByClassName("cost")[0].innerHTML = small_int(Math.ceil(tech[i].cost()))
            if(tech[i].unlocked){
                tech[i].elem.setAttribute("status", "completed")
                tech[i].elem.getElementsByClassName("cost-cell")[0].style.display = "none"
                tech[i].elem.getElementsByClassName("name-cell")[0].setAttribute("colspan", 2)
                tech[i].elem.style.opacity = 1
                tech[i].elem.style.pointerEvents = ""
                tech[i].elem.style.cursor = ""
            } else if(techPossible().includes(Number(i))){
                tech[i].elem.setAttribute("status", "available")
                tech[i].elem.style.opacity = 1
                tech[i].elem.style.pointerEvents = ""
                tech[i].elem.style.cursor = ""
            } else {
                tech[i].elem.setAttribute("status", "hidden")
                tech[i].elem.style.opacity = 1 - (i - techLatest() + 1) * .15
                if((i - techLatest() + 1) * .15 >= 1){
                    tech[i].elem.style.pointerEvents = "none"
                    tech[i].elem.style.cursor = "default"
                } else {
                    tech[i].elem.style.pointerEvents = ""
                    tech[i].elem.style.cursor = ""
                }
            }
        }

        var anyConversions = false
        for (i = 0; i < res.length; i++) {
            if (!res[i].unlocked) {
                for (var e = 0; e < res.length; e++) {
                    if (res[i].rates[e].rate != 0) {
                        document.getElementById(i + "to" + e).style.display = "none";
                    }
                    if (res[e].rates[i].rate != 0) {
                        document.getElementById(e + "to" + i).style.display = "none";
                    }
                }
            } else {
                for (var e = 0; e < res.length; e++) {
                    if (res[i].rates[e].rate != 0 && res[i].rates[e].unlocked) {
                        if(res[i].unlocked && res[e].unlocked){
                            anyConversions = true
                        }
                        document.getElementById(i + "to" + e).style.display = "";
                    }
                    if (res[e].rates[i].rate != 0 && res[i].rates[e].unlocked) {
                        if(res[i].unlocked && res[e].unlocked){
                            anyConversions = true
                        }
                        document.getElementById(e + "to" + i).style.display = "";
                    }
                }
            }
        }
        
        document.getElementById("conversion-row").style.display = anyConversions ? "" : "none"

        for (i = 0; i < b; i++) {
            if (!res[i].unlocked) {
                document.getElementById(capitalize(res[i].name)).style.display = "none";
                document.getElementById(res[i].name + '_click').style.display = "none";
                document.getElementById(res[i].name + '-column').style.background = "url('tubeback.png'), #dbdbdb";
                document.getElementById(res[i].name + '-column').style.display = "none";
                document.getElementsByClassName('row' + res[i].name)[0].style.display = "none";

                var lister = document.getElementsByClassName(res[i].name + "icon");
                for (r = 0; r < lister.length; r++) {
                    lister[r].src = "empty.png";
                }
            } else if (i != a) {
                document.getElementById(capitalize(res[i].name)).style.display = "inline";
                document.getElementById(res[i].name + '_click').style.display = "block";
                document.getElementById(res[i].name + '-column').style.background = "url('tubeback.png'), " + res[i].color;
                document.getElementsByClassName('row' + res[i].name)[0].style.backgroundColor = res[i].color;
                document.getElementById(res[i].name + '-column').style.display = "";
                document.getElementsByClassName('row' + res[i].name)[0].style.display = "table-row";

                var lister = document.getElementsByClassName(res[i].name + "icon");
                for (r = 0; r < lister.length; r++) {
                    lister[r].src = res[i].name + ".png";
                }
            }
        
        }

        if (debug) {
            spinnerChance = 0;
            for (i = 0; i < bldg.length; i++) {
                if (!bldg[i].unlocked && bldg[i].canUnlock) {
                    bldg[i].unlocked = true;
                    bldg[i].onDebug = true;
                }
                if (i < res.length && !res[i].unlocked && res[i].canUnlock) {
                    res[i].unlocked = true;
                    res[i].onDebug = true;
                }
            }
            for(i in res){
                for(e in res[i].rates){
                    if(!res[i].rates[e].unlocked){
                        res[i].rates[e].unlocked = true
                        res[i].rates[e].isDebug = true
                    }
                }
            }
            hasUnlockedSpecial = true
            hasUnlockedSpecialDebug = true
        } else {
            spinnerChance = baseChanceSpinner;
            for (i = 0; i < bldg.length; i++) {
                if (bldg[i].onDebug) {
                    bldg[i].unlocked = false;
                    bldg[i].onDebug = false;
                }
                if (i < res.length && res[i].onDebug) {
                    res[i].unlocked = false;
                    res[i].onDebug = false;
                }
            }
            if(hasUnlockedSpecialDebug){
                hasUnlockedSpecialDebug = false
                hasUnlockedSpecial = false
            }
            for(i in res){
                for(e in res.rates){
                    if(res[i].rates[e].isDebug){
                        res[i].rates[e].unlocked = false
                        res[i].rates[e].isDebug = false
                    }
                }
            }
        }
    
        for (i = 0; i < bldg.length; i++) {
            if (!bldg[i].unlocked) {
                document.getElementById(bldgtxt.get(i) + '_holder').style.display = "none";
                bldg[i].amt = 0;
                bldg[i].working = 0;
            } else {
                document.getElementById(bldgtxt.get(i) + '_holder').style.display = "inline-table";
            }
        }

        doFlasher();
    }

    document.addEventListener('keydown', function (event) {
        if (event.keyCode == 16) {
            all = true
        }
        else if (event.keyCode == 38) {
            debug = !debug;
        }
    });

    document.addEventListener('keyup', function (event) {
        if (event.keyCode == 16) {
            all = false
        }
    });

    function auto(first, second) {
        res[first].auto[second] = !res[first].auto[second];
    }

    function converter(first, second) {
        if(res[first].amt == 0){
            return;
        }
        i = (res[first].amt * res[first].rates[second].rate);
        if (i > (res[second].amt * .1)) {
            i /= 100;
        }
        res[second].amt += i;
        res[first].amt -= i / res[first].rates[second].rate;
    }

    var check_cost = new Array(chargeamt);

    for (i = 0; i < check_cost.length; i++) {
        check_cost[i] = 10 * (1 + i);
        document.getElementById('charge_cost' + i).innerHTML = check_cost[i];
    }

    function chargecost(typer) {
        check_cost[typer] = Math.floor(check_cost[typer] *= 1.1) + 10;
        document.getElementById('charge_cost' + typer).innerHTML = check_cost[typer];
    }

    function buy_charge(type) {
        if (res[10].amt >= check_cost[type]) {
            res[10].amt -= check_cost[type];
            chargecost(type);
            var sel = Math.floor(res.length * Math.random());
            var times = (5 + Math.ceil(3 * Math.random()));

            switch (type) {
                case 0: res[sel].amt *= times; break;
            }
        }
    }

    function findPS() {
        for (i = 0; i < bldg.length; i++) {
            bldg[i].fps = Math.pow(bldg[i].working,1.25) * bldg[i].efficiency * (1 + bldg[i].bonuses.reduce(function(x,y){return y.percent + x},0));
        }

        for (u = 0; u < b; u++) {
            res[u].ps = 0;
            res[u].limit = res[u].baselimit;
            for (e = 0; e < bldg.length; e++) {
                if (bldg[e].resource == u) {
                    res[u].ps += bldg[e].fps;
                }
            }
            res[u].ps *= 1 + res[u].bonuses.reduce(function(x,y){return y.percent + x},0)
        }
    }

    function decimalToHexString(number) {
        if (number < 0) {
            number = 0xFFFFFFFF + number + 1;
        }

        number = number.toString(16).toUpperCase();
        for (y = 0; y < 7 - number.toString().length; y++) {
            number = "0" + number;
        }

        return number;
    }

    function buyWorker() {
        if (!(res[0].amt >= worker_cost)) {
            return;
        }
        do {
            res[0].amt -= worker_cost;
            ++total_workers;
            ++av_workers;
            workercost();
        } while (res[0].amt >= worker_cost && all);
        init();
    }

    function workercost() {
        worker_cost = (workers_cost_base * workers_cost_mult * (Math.pow(1.073, (total_workers - 1)) - Math.pow(1.073, total_workers - 2))) / 0.15;
    }

    var spinnerActive = false;
    var spinnerCanBeActive = false;

    var rotateP = 0;
    var rotateV = .075;
    var rotateA = .995;
    var rotateSize = 60;
    var rotatePange = 4;

    var spinnerChance = baseChanceSpinner;

    function resetRotate() {
        rotateSize = Math.ceil(65 + (40 * Math.random()));
        rotateV = .065 + (.05 * Math.random());
        rotateA = .98 + (.017 * Math.random());

        var locX = (window.innerWidth - (rotateSize + 30)) * Math.random();
        var locY = (window.innerHeight - (rotateSize + 30)) * Math.random();

        document.getElementById("spinner").style.left = locX + "px";
        document.getElementById("spinner").style.top = locY + "px";

        var attempts = 50
        do {
            currColor = Math.floor(b * Math.random())
            attempts--
        } while (!res[currColor].unlocked && attempts >= 0);
        currShape = Math.floor(Math.random() * 3.99);

    }

    resetRotate();

    function showSpinner() {
        document.getElementById("spinner").style.backgroundColor = res[currColor].color2;
        document.getElementById("spinner").style.boxShadow = "0vw 0vw .25vw .25vw " +  res[currColor].color2 + ", 0vw 0vw .5vw .5vw " +  res[currColor].color2
        if (spinnerActive) {
            document.getElementById("spinner").style.display = "block";
        } else {
            document.getElementById("spinner").style.display = "none";
        }
    }

    var resnow = a;

    function clickSpinner() {
        spinnerActive = !spinnerActive;
        res[currColor].multBy(1 + (rotateSize / 500));
        spinnerAlert = 1
        document.getElementById("spinnerAlert").innerHTML = capitalize(res[currColor].name) + " increased by " + (rotateSize / 5) + "%"
        document.getElementById("spinnerAlert").style.background = 'url("weatheredbackground.png"), ' + res[currColor].color3 + " repeat" ;
        resetRotate();

    }

    function showTooltip(elem){
        document.getElementById("tooltip").innerHTML = elem.getAttribute("message")
        document.getElementById("tooltip").style.left = elem.getBoundingClientRect().left + elem.getBoundingClientRect().width / 2 + "px"
        document.getElementById("tooltip").style.top = elem.getBoundingClientRect().top - window.innerHeight / 22 + "px"
        document.getElementById("tooltip").style.opacity = .92
    }

    function hideTooltip(){
        document.getElementById("tooltip").style.opacity = 0
    }


    //var setter = prompt("hi", "hi");
    //alert(res[2].amt.toString(36) + "ȧ");
    //alert(parseInt(setter, 36));
    //alert(setter);

    if (storageAvailable('localStorage')) {
        if(localStorage.getItem("save") != undefined){
            if(!importString(localStorage.getItem("save"))){
                localStorage.removeItem("save")
                location.reload()
            }
        }
    }

    hideTooltip()
    switchPage(1);
    auto(0, a);
    auto(0, a);
    auto(2, a);
    auto(4, a);
    auto(4, a);
    auto(5, a);
    auto(5, a);
    
    setInterval(function(){
        activateHelper()

        if(tipInterval % 2000 == 0){
            changeTip()
        }
        tipInterval++;

        for (i = 0; i < res.length; i++) {
            if (res[i].amt < 0) {
                res[i].amt = 0;
            }
            if(res[i].speed > 0){
                res[i].speed -= .001
            }
            document.getElementById(res[i].name + "-column").style.animation = "column " + (100 / res[i].speed) + "s linear infinite"
            if (res[i].unlocked && i < b) {
                document.getElementById(res[i].name.substring(0, 2) + 'ps').innerHTML = "(" + small_int((res[i].ps)) + ' /s)';
                document.getElementById(capitalize(res[i].name)).innerHTML = small_int(Math.floor(res[i].amt));
            }
            for (e = 0; e < res.length; e++) {
                if (res[i].auto[e] && res[i].rates[e].rate != 0) {
                    document.getElementById(res[i].name + res[e].name + 'convo').innerHTML = '☑';
                } else if (res[i].rates[e].rate != 0) {
                    document.getElementById(res[i].name + res[e].name + 'convo').innerHTML = ' ☐';
                }
            }
        }
        document.getElementById('cash').innerHTML = small_int(Math.floor(res[a].amt));
        document.getElementById('unrest').innerHTML = small_int(Math.floor(res[b].amt));

        showSpinner();
        rotateP += rotateV;

        if (rotateV >= .005) {
            rotateV *= rotateA;
        }

        if(spinnerAlert >= 0){
            spinnerAlert -= 0.0025
            document.getElementById("spinnerAlert").style.opacity = Math.pow(spinnerAlert,1/2);
            document.getElementById("spinnerAlert").style.bottom = (4 + 2 * spinnerAlert) + "vh";
        }

        if (Math.random() > spinnerChance && spinnerCanBeActive) {
            spinnerActive = true;
        }

        if(hasUnlockedABuilding()){
            for (i = 0; i < bldg.length; i++) {
                bldg[i].costfind();
                for (e = 0; e < bldg[i].costers.length; e++) {
                    if (res[bldg[i].costers[e]].amt >= bldg[i].cost) {
                        document.getElementById(bldgtxt.get(i) + "_cost").style.color = building_active_colour;
                    } else {
                        document.getElementById(bldgtxt.get(i) + "_cost").style.color = building_inactive_colour;
                        break;
                    }
                }
            }
            for (i = 0; i < b; i++) {
                document.getElementById(res[i].name.substring(0, 2) + "ps").style.display = "inline";
            }
        } else {
            for (i = 0; i < b; i++) {
                document.getElementById(res[i].name.substring(0, 2) + "ps").style.display = "none";
            }
        }
    
        for (i = 0; i < b; i++) {
            if (res[i].amt + res[i].ps / 103 > -1) {
                res[i].amt += res[i].ps / 103;
            }
            res[i].click = 1 + (techLevel / 10) + (av_workers / 4);
            //document.getElementById(res[i].name + "appear").innerHTML = "+" + res[i].click + ' <img src="' + res[i].name + '.png" class="food-icon">';
        }

        if(hasUnlockedSpecial){
            if (specialCounter > specialMax) {
                specialCounter = 0;
                specialMax = Math.ceil(specialMax * 1.1);
                if (last_click == 1) { last_click = 5 };
    
                var rec = (res[last_click].amt * ((res[last_click].click * 20 / specialMax) + 1) - res[last_click].amt);
                res[last_click].amt += rec;
    
                clicker[5] = 0;
            }
            document.getElementById('specialRow').style.display = "";
            document.getElementById('special').style.width = (specialCounter / (specialMax + 1)) * 100 + "%";
            document.getElementById('specialback').style.backgroundColor = res[last_click].color3;
            document.getElementById('special').style.backgroundColor = res[last_click].color2;
        } else{
            document.getElementById('specialRow').style.display = "none";
        }

        findPS();
        workercost();

        for (y = 0; y < res.length; y++) {
            for (e = 0; e < res.length; e++) {
                if (res[y].auto[e]) {
                    converter(y, e);
                }
            }
        }
    

        if (res[0].amt >= worker_cost) {
            document.getElementById("worker_cost").style.color = tech_active_colour;
            flash_worker = true;
        } else {
            document.getElementById("worker_cost").style.color = tech_inactive_colour;
            flash_worker = false;
        }

        if (res[4].amt >= tech[techSelected].cost()) {
            document.getElementById("tech_cost").style.color = tech_active_colour;
            flash_tech = true;
        } else {
            document.getElementById("tech_cost").style.color = tech_inactive_colour;
            flash_tech = false;
        }

        init();
    }, 1)