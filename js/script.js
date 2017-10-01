var d, h, m, s;





window.onload = function() {
    localClock();
    makeGrid();
    midnight();
    deadlineCheck();
    discard();
    loadTimeout();

};

function loadTimeout() {
    myVar = setTimeout(loader, 3000);
}

function loader() {
    var loadBlack = document.getElementById("loader");
    loadBlack.style.display = "none";
    console.log("loading");
}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function localClock() {
    var now = moment();
    h = addZero(now.hours());
    m = addZero(now.minutes());
    
    document.getElementById("time").innerHTML = h + ":" + m ;
}

function makeGrid() {
    for (var i = 0; i < 1440; i++) {
        var hours = document.getElementById("clock");
        var grid = document.createElement("div");

        grid.id = "grid";
        grid.style.height = "1vh";
        grid.style.width = "1fr";
        grid.style.backgroundColor = "#F3B20E";

        hours.appendChild(grid);
    }

    return totalMinutes();
}

function totalMinutes() {
    var now = moment();
    
    var hour = now.hours();
    var minute = now.minutes();
    var total = (60 * hour) + minute;

    console.log(total);

    for (var i=0; i < total; i++) {
        var hours = document.getElementById("clock");
        var minutes = document.getElementById("grid");
        
        minutes.className = "control";
        minutes.id = "time"
        minutes.style.backgroundColor = "#F3D894";
        hours.appendChild(minutes);
        
        console.log("changed");
    }

    return addMinute();
}

function timedUpdate () {
    localClock();
    addMinute();
    midnight();
    disable();
    setTimeout(timedUpdate, 1000);
}



function addMinute() {
    var now = moment();

    var minute = now.minutes();
    var second = now.seconds();

    

    if (second === 0) {

        var hours = document.getElementById("clock");
        var minutes = document.getElementById("grid");

        minutes.className = "control";

        minutes.style.backgroundColor = "#F3D894";
        hours.appendChild(minutes);
        
        console.log("added");

        return deadlineCheck();
    }
}

function midnight() {
    var now = moment();
    
    var hour = now.hours();
    var minute = now.minutes();
    var second = now.seconds();

    if (hour === 0 && minute === 0 && second === 0) {

        var stack = document.getElementById("clock");

        if(stack.hasChildNodes()) {

            for (var i=0; i < 1440; i++) {

                stack.removeChild(stack.lastChild);

            }
        }

        makeGrid();
    }

}

function disable() {
    var now = moment();
    var hours = now.hours();
    var minutes = now.minutes();
    var disHour = parseInt(hours + 1) ;
    var disMinute = parseInt(minutes + 1) ;
    var hour = parseInt(document.getElementById("userHour").value);
    //console.log(hour + " " + (disHour-1));
    for (var i = 0; i < disHour; i++) {
        var opHour = document.getElementById("userHour").options;
        opHour[i].disabled = true;
    }
    if (hour === (disHour-1)) {
        //console.log("disableMinute");
        for (var i = 0; i < disMinute; i++) {
            var opMinute = document.getElementById("userMinute").options;
            opMinute[i].disabled = true;
        }
    }
}


function getUserValues() {
    var now = moment();

    var hours = now.hours();
    var minutes = now.minutes();
    var second = now.seconds();


    
    var hour = parseInt(document.getElementById("userHour").value);
    var minute = parseInt(document.getElementById("userMinute").value);

    var leftTotalMin = 1440 -((hours*60) + minutes);
    var deadlineMinutes = (1440 - ((hour * 60) + minute)) ;
    console.log(leftTotalMin + " " +deadlineMinutes);

    var cookieExpire =  new Date(new Date().getTime() + (leftTotalMin - deadlineMinutes) * 60 * 1000);

    if (leftTotalMin > deadlineMinutes) {

        Cookies.set('key', deadlineMinutes, { expires: cookieExpire });

        setDeadline();
        console.log(deadlineMinutes);

        console.log(Cookies.get('key'));
    }

    return discard();
}

function killAll() {
    var element = document.getElementById("clock");

    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }

    Cookies.remove('key');

}

function deadlineCheck() {
    var now = moment();

    var hour = now.hours();
    var minute = now.minutes();

    var checkTotal = 1440-((hour * 60) + minute);
    var deadlineMinutes = 0;
    deadlineMinutes = Cookies.get('key');
    
    console.log("fark = " + (checkTotal-deadlineMinutes));

    if (deadlineMinutes < checkTotal) {
        setDeadline();
        console.log("daha süre var " + deadlineMinutes);
    } else if (deadlineMinutes >= checkTotal) {
        console.log("remove?");
        Cookies.remove('key');
        console.log("removed inşallah " + Cookies.get('key'));
        openModal();
        killAll();
        makeGrid();

        
    }

    return discard();
}      

function discard() {
    if (Cookies.get('key') != undefined) {
        var discardButton = document.getElementById("discardDeadline");
        var setDeadlineButton = document.getElementById("myBtn");
        setDeadlineButton.style.display = "none";
        discardButton.style.display = "block";
    } else if (Cookies.get('key') === undefined) {
        var discardButton = document.getElementById("discardDeadline");
        var setDeadlineButton = document.getElementById("myBtn");
        setDeadlineButton.style.display = "block";
        discardButton.style.display = "none";
    }
}

function afterDiscard () {
    killAll();
    makeGrid();
    var valueHour = document.getElementById("userHour");
    valueHour.selectedIndex = 0;

    var valueMinute = document.getElementById("userMinute");
    valueMinute.selectedIndex = 0;

    return discard();
}


function setDeadline() {
    var parent = document.getElementById("clock");
    var child = parent.children;

    var deadlineMinutes = Cookies.get('key');

    for (var i=0; i < deadlineMinutes; i++) {
        if (child[i].tagName == "DIV") {
            child[i].style.backgroundColor = "#F3D894" ;
        }
    }

}

function setCheckedDeadline() {
    var parent = document.getElementById("clock");
    var child = parent.children;

    var deadlineCheckedMinutes = parseInt(Cookies('key'));

    for (var i=0; i < deadlineCheckedMinutes; i++) {
        if (child[i].tagName == "DIV") {
            child[i].style.backgroundColor = "#F3D894" ;
        }
    }

    console.log("setted" + " " + Cookies('key'));
}

function openModal() {
    var doneModal = document.getElementById("done");
    var done = document.getElementsByClassName("closeMessage")[0];


    doneModal.style.display = "block";

    done.onclick = function() {
        doneModal.style.display = "none";
    }
    
    window.onclick = function(event) {
        if (event.target == doneModal) {
            doneModal.style.display = "none";
        }
    }
}

localClock();
timedUpdate();
addMinute();
disable();


//Modal start

var infoModal = document.getElementById("info");
var buttonInfo = document.getElementById("infoButton");
var infoClose = document.getElementsByClassName("closeInfo");
buttonInfo.onclick = function() {
    infoModal.style.display = "block";
}

function closeInfo() {
    var infoModal = document.getElementById("info");
    infoModal.style.display = "none";
}


var modal = document.getElementById('myModal');
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];
btn.onclick = function() {
    modal.style.display = "block";
}
span.onclick = function() {
    modal.style.display = "none";

    var valueHour = document.getElementById("userHour");
    valueHour.selectedIndex = 0;

    var valueMinute = document.getElementById("userMinute");
    valueMinute.selectedIndex = 0;
}
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";

        var valueHour = document.getElementById("userHour");
        valueHour.selectedIndex = 0;

        var valueMinute = document.getElementById("userMinute");
        valueMinute.selectedIndex = 0;
    } else if (event.target == infoModal) {
        infoModal.style.display = "none";
    }
}

//Modal end


window.onblur = function() { 
    

    window.onfocus= function () { 

       var checkMinutes = document.getElementById("clock").querySelectorAll(".control");
       console.log(checkMinutes.length);
       var control = checkMinutes.length;

       var now = moment();
       var hour = now.hours();
       var minute = now.minutes();
       var focusMinutes = (hour * 60) + minute ;
       var difference = focusMinutes - control;
       console.log(difference);
        for (var i = 0; i < difference; i++) {
            var hours = document.getElementById("clock");
            var minutes = document.getElementById("grid");

            minutes.className = "control"
            minutes.style.backgroundColor = "#F3D894";
            hours.appendChild(minutes);
        
            console.log("added on blur");

        }

        return deadlineCheck();

        
    }
};



