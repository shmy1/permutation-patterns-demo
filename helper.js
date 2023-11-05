/**
* Formats the permutation appropriately 
* @param permutation the permutation in the form of an array
* @return the formatted permutation string
*/
function formatPermutation(permutation) {
    return (permutation.length < 10 ? permutation.join('') : permutation.join(' '));
}

/**
* Changes the visibility of a button
* @param button the button whose visibility is to be changed
* @param shouldShow whether the button should be visible or not
*/
function changeButtonVisiblity(button, shouldShow) {
    if (shouldShow) {
        button.css("visibility", "visible")
    }
    else {
        button.css("visibility", "hidden");
    }

}

/**
* Gets the value of a given search parameter from the URL
* @param parameter the search parameter
* @return the value associated to the given search parameter
*/
function getURLParam(parameter) {
    var url = new URL(document.location);
    var params = url.searchParams;

    return params.get(parameter);
}

/**
* Deals with the `Add Underlying Pattern` and `Clear Pattern` buttons which rely on a permutation having been submitted
* @param shouldShow whether these two buttons should be shown or not
*/
function showPermutationButtons(shouldShow) {
    var submitPermBtn = $('#permutationbutton')
    shouldShow ? setElementValue(submitPermBtn, "Resubmit") : setElementValue(submitPermBtn, "Submit");
    changeButtonVisiblity($('#clearpattern'), shouldShow);
    changeButtonVisiblity($('#addpatternbtn'), shouldShow);
}

/**
* Sets the value of an HTML element
* @param element the element whose value needs to be set
* @param value the value to be set
*/
function setElementValue(element, value) {
    element.val(value);
}

/**
* Updates the value of a given search parameter from the URL
* @param param the search parameter
* @param newValue the new value to be associated to the given search parameter
*/
function updateURLParam(param, newValue) {
    var currenturl = new URL(window.location);
    currenturl.searchParams.set(param, newValue);

    if (newValue == "") { //if new value is empty then delete param
        currenturl.searchParams.delete(param)
    }

    window.history.pushState({}, '', currenturl); //update the url

    dispatchEvent(new PopStateEvent('popstate', {}));
}

/**
* Gets all the checkboxes that have been checked for a certain input field
* @param list   all the checkboxes for that input field
* @param all    the all checkbox if it exists for that input field
* @param id     which input field it is
*/
function getCheckedBoxes(list, all, id) {
    var checked = false;
    if (all) {
        if ($(all).is(':checked')) {
            checked = true;
        }
    }

    $.each(list, function (i, item) {
        list[item] = checked;
    });

    var selection = 'input:checkbox[id^="prop_"]:checked'
    if (id === "statistic") {
        selection = 'input:checkbox[id^="stat_"]:checked'
    }

    $(selection).each(function () {
        list[$(this).attr("id")] = true;
    });

    return list;
}