/**
* Formats the permutation appropriately 
*/
function formatPermutation(permutation) {
    return (permutation.length < 10 ? permutation.join('') : permutation.join(' '));
}

/**
* Changes the visibility of a button
*/
function changeButtonVisiblity(button, show) {
    if (show) {
        button.css("visibility", "visible")
    }
    else {
        button.css("visibility", "hidden");
    }

}

function getURLParam(parameter) {
    var url = new URL(document.location);
    var params = url.searchParams;

    return params.get(parameter);
}

function showPermutationButtons(show) {
    var submitPermBtn = $('#permutationbutton')
    show ? setElementValue(submitPermBtn, "Resubmit") : setElementValue(submitPermBtn, "Submit");
    changeButtonVisiblity($('#clearpattern'), show);
    changeButtonVisiblity($('#addpatternbtn'), show);
}

function setElementValue(element, value) {
    element.val(value);
}