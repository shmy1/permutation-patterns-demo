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
