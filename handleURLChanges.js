/**
* Handles if the pattern type changes
*/
$(document).on('change', '#permrepresentation', function () {
    var newPatternType = $('#permrepresentation').find("option:selected").attr('value')
    updateURLParam('type', newPatternType);
}
);

/**
* Handles if the containment choice changes
*/
$(document).on('change', '#include', function () {
    var newChoice = $('#include input:checked').attr("value")
    updateURLParam('contain', newChoice);
}
);

/**
* Handles if the length input changes
*/
$(document).on('change', '#length', function () {
    var newLength = $(this).val()
    updateURLParam('length', newLength);
}
);

/**
* Handles if there is a change in the URL relating to the underlying pattern inputs 
*/
window.addEventListener('popstate', function (event) {
    setUnderlyingPatternFields();
    
    var id = getURLParam("id");
    var button = $('#addpatternbtn');

    if (id) {
        button.text("Update Pattern")
        changeButtonVisiblity($('#deletepatternbtn'), true)
    }

    else {
        button.text("Add Underlying Pattern")
        changeButtonVisiblity($('#deletepatternbtn'), false)
    }
});