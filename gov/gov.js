function removeElement(element) {
    element.parentNode.removeChild(element);
}

function copyToClipboard(str) {
    const tempElement = document.createElement('textarea');  // Create a <textarea> element
    tempElement.value = str;                                 // Set its value to the string that you want copied
    tempElement.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
    tempElement.style.position = 'absolute';
    tempElement.style.left = '150vw';                        // Move outside the screen to make it invisible
    document.body.appendChild(tempElement);                  // Append the <textarea> element to the HTML document
    const selected =
        document.getSelection().rangeCount > 0               // Check if there is any content selected previously
            ? document.getSelection().getRangeAt(0)          // Store selection if found
            : false;                                         // Mark as false to know no selection existed before
    tempElement.select();                                    // Select the <textarea> content
    document.execCommand('copy');                            // Copy - only works as a result of a user action (e.g. click events)
    document.body.removeChild(tempElement);                  // Remove the <textarea> element
    if (selected) {                                          // If a selection existed before copying
        document.getSelection().removeAllRanges();           // Unselect everything on the HTML document
        document.getSelection().addRange(selected);          // Restore the original selection
    }
    $("#copiedMessage").show()
    setTimeout(function(){
        $("#copiedMessage").hide()
    }, 2050)
};

var pages = [document.getElementById("page-1"), document.getElementById("page-2"), document.getElementById("page-3"), document.getElementById("page-4"), document.getElementById("page-5")]
var activePage = pages[0];

function switchPage(to) {
    if(pages[to] == undefined) {
        return
    }
    activePage = pages[to]
    for(var i = 0; i < pages.length; i++){
        $(pages[i]).hide()
        document.getElementById("page-selection-" + (i + 1)).setAttribute("activated", "false")
    }
    document.getElementById("page-selection-" + (pages.indexOf(activePage) + 1)).setAttribute("activated", "true")
    $(activePage).show()
}

var interviews = [document.getElementById("interview-1"), document.getElementById("interview-2"), document.getElementById("interview-3")]
var activeInterview = interviews[0]

function switchInterview(to) {
    if(interviews[to] == undefined) {
        return
    }
    activeInterview = interviews[to]
    for(var i = 0; i < interviews.length; i++){
        $(interviews[i]).hide()
        document.getElementById("interview-selection-" + (i + 1)).setAttribute("activated", "false")
    }
    document.getElementById("interview-selection-" + (interviews.indexOf(activeInterview) + 1)).setAttribute("activated", "true")
    $(activeInterview).show()
}

switchPage(0);
switchInterview(0)
