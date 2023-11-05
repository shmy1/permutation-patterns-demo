populateFields();
/**
* Populates all the input fields
*/
function populateFields() {
    //Dynamically adds all the options to the input fields that have a set of choices to select from.
    setPatternChoices();
    setPropertyChoices();
    setStatisticChoices();

    //Automatically fills the input field in with a value if indicated by the URL
    setUnderlyingPatternFields();
    setLength();
}

function setUnderlyingPatternFields() {
    setPermutationElements();
    setPatternType();
    setContainment();
}

/**
* Deals with the `Pattern Type` dropdown field
*/
function setPatternChoices() {
    //Dynamically adds all the different pattern types to the selection field
    Object.values(PatternType).forEach(type => {
        $('#permrepresentation').append($('<option>', {
            value: type.index,
            text: type.name
        }));
    });

    //Deals with URL params relating to `Pattern Type`
    var currenturl = new URL(window.location);
    if (!currenturl.searchParams.get("type")) { //Automatically fills in the input if the data is in the URL
        currenturl.searchParams.set('type', PatternType.Classical.index); //Default options is "Classical"
        window.history.pushState({}, '', currenturl);
    }

}

/**
* Deals with the `Properties` input group
*/
function setPropertyChoices() {
    //Dynamically adds all the different properties that can be selected
    Object.values(Property).forEach(property => {
        appendCheckbox(property, '#property_choices')
    });

    //Deals with URL params relating to `Properties`
    var url = new URL(document.location);
    var chosen = url.searchParams.get("property")

    //automatically fills in the input if data is in the URL 
    if (chosen) {
        chosen = chosen.split(",").filter(item => item.trim().length > 0)
        $.each(chosen, function (i, item) {
            $("#" + item).prop("checked", true)
        });
    }

}

/**
* Deals with the `Statistics` input group
*/
function setStatisticChoices() {
    //Dynamically adds all the different statistics that can be selected
    Object.values(Statistic).forEach(stat => {
        appendCheckbox(stat, '#statistic_choices')
    });

}

function appendCheckbox(element, divName) {
    var checkbox = createCheckbox(element.label, element.name)

    var div = document.createElement("div")
    div.classList.add("form-check-inline")
    div.appendChild(checkbox)

    $(divName).append(div); //adds it to the corresponding div
}

function createCheckbox(value, text) {
    //The actual checkbox input
    var input = document.createElement("input")
    input.classList.add("form-check-input")
    input.classList.add("me-2")
    input.setAttribute("type", "checkbox")
    input.setAttribute("name", "property")
    input.setAttribute("id", value)
    input.setAttribute("value", value)

    //The label for the input
    var label = document.createElement("label")
    label.classList.add("form-check-label")
    label.appendChild(input)
    label.appendChild(document.createTextNode(text))

    return label;
}

/**
* Automatically fills the permutation input field if indicated by the URL
*/
function setPermutationElements() {
    var urlPermutation = getURLParam('permutation');
    var permInput = $('#permutation')
    urlPermutation ? setElementValue(permInput, formatPermutation(urlPermutation.split(','))) : setElementValue(permInput, "");
    showPermutationButtons(urlPermutation)
}

/**
* Automatically fills the pattern type input field if indicated by the URL
*/
function setPatternType() {
    var urlType = getURLParam('type');
    urlType ? setElementValue($('#permrepresentation'), urlType) : "";
}

/**
* Automatically fills the containment input field if indicated by the URL
*/
function setContainment() {
    var urlContainment = getURLParam('contain');
    if (urlContainment) {
        var selection = $('input:radio[name="containment"]') //the containment and avoidance radio buttons
        $.each(selection, function (i, item) {
            if ($(this).val() != urlContainment) { //if its not what is indicated in the URL
                $(this).prop("checked", false)
            }
            else {
                $(this).prop("checked", true)
            }
        });
    }
}

/**
* Automatically fills the length input field if indicated by the URL
*/
function setLength() {
    var urlLength = getURLParam('length');
    urlLength ? setElementValue($('#length'), urlLength) : "";
}