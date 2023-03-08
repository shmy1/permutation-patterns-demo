setup();


function setup() {
    $('#deletepatternbtn').css("visibility", "hidden");
    setPermutationElements();
    setPatternChoices();
    setPatternType();
    sessionStorage.clear();
}

function setPermutationElements() {
    var url = new URL(document.location);
    var params = url.searchParams;
    if (params.get('permutation')) {
        var permutation = params.get('permutation').split(',')
        $('#permutation').val(permutation.length < 10 ? permutation.join('') : permutation.join(' '));
        $('#permutationbutton').val("Resubmit")
        $('#clearpattern').css("visibility", "visible");
        $('#addpatternbtn').css("visibility", "visible");

    }
    else {
        $('#permutationbutton').val("Submit")
        $('#permutation').val("")
        $('#clearpattern').css("visibility", "hidden");
        $('#addpatternbtn').css("visibility", "hidden");


    }
}

function addNewPattern(id, pattern) {
    const label = document.createElement("label");
    label.classList.add("btn");
    label.classList.add("mr-4");
    label.classList.add("mb-2");
    label.classList.add("patternbtn");
    label.setAttribute("value", id)
    label.setAttribute("id", "pattern-" + id)

    const input = document.createElement("input")
    input.classList.add("pattern-input")
    input.setAttribute("type", "checkbox")
    input.setAttribute("autocomplete", "off")
    input.setAttribute("data-toggle", "toggle")
    input.setAttribute("id", "input-" + id)

    var permutation = JSON.parse(pattern).permutation.split(",")

    const span = document.createElement("span")
    span.appendChild(document.createTextNode(permutation.length < 10 ? permutation.join('') : permutation.join(' ')))


    label.appendChild(span);
    label.appendChild(input)
    document.getElementById("added-patterns-container").appendChild(label);
}

function updatePatternText(id, permutation) {
    var span = $("#pattern-" + id + " span")

    var permutation = permutation.split(",")
    var text = permutation.length < 10 ? permutation.join('') : permutation.join(' ');
    span.text(text)
}

function setPatternChoices() {
    var representations = JSON.parse(`${environment.representation}`)
    $.each(representations, function (i, item) {
        $('#permrepresentation').append($('<option>', {
            value: i,
            text: item
        }));
    });

    var currenturl = new URL(window.location);
    if(window.location.pathname === "/") {
        currenturl.searchParams.set('representation', 1);
        window.history.pushState({}, '', currenturl);
    }
    
}

function setPatternType() {
    var url = new URL(document.location);
    var params = url.searchParams;

    if (params.get('representation')) {
        var representation = params.get('representation')
        $('#permrepresentation').val(representation);
    }
}

function resetParams(url, urlParams) {
    urlParams.delete("id")
    urlParams.delete("permutation")
    urlParams.set('representation', 1);
    window.history.pushState({}, '', url);
    dispatchEvent(new PopStateEvent('popstate', {}));
}


$(document).on('change', '#permrepresentation', function () {
    var currenturl = new URL(window.location);
    currenturl.searchParams.set('representation', $('#permrepresentation').find("option:selected").attr('value'));
    window.history.pushState({}, '', currenturl);
    dispatchEvent(new PopStateEvent('popstate', {}));
}
);

window.addEventListener('popstate', function (event) {
    setPermutationElements();
    setPatternType();
    var url = new URL(document.location);
    var urlParams = url.searchParams;

    if (urlParams.get("id")) {
        $('#addpatternbtn').val("update")
        $('#addpatternbtn').text("Update Pattern")
        $('#deletepatternbtn').css("visibility", "visible");
    }

    else {
        $('#addpatternbtn').val("add")
        $('#addpatternbtn').text("Add Underlying Pattern")
        $('#deletepatternbtn').css("visibility", "hidden");
    }



});


$(document).on('click', '#addpatternbtn', function () {
    var url = new URL(document.location);
    var urlParams = url.searchParams;

    var permutation = urlParams.get('permutation');
    var patterntype = urlParams.get('representation')
    var containment = $('input:radio[name="containment"]:checked').val();

    var permutationlength = permutation.split(",").length

    var array = []

    for (let i = 0; i < permutationlength + 1; i++) {
        var temp = []
        for (let j = 0; j < permutationlength + 1; j++) {
            temp[j] = 0
        }
        array[i] = temp
    }
    var grid = d3.select("#grid")
    grid.selectAll(".square").each(function (d) {
        if (d3.select(this).style("fill") != "rgb(255, 255, 255)") {
            array[d.row][d.column] = 1
        }
    })

    var pattern = JSON.stringify({ permutation: permutation, patterntype: patterntype, containment: containment, pattern: array })

    if ($(this).val() === "add") {
        var patternnumber = sessionStorage.length
        if(patternnumber >= `${environment.max_patterns}`){
            console.log($('#maxPatterns'))
            $('#maxPatterns').modal('show');
        }
        else {
            sessionStorage.setItem(
                patternnumber,
                pattern
            );
            addNewPattern(patternnumber, pattern);
        }
       

       
    }

    else {
        var patternnumber = urlParams.get("id")
        sessionStorage.setItem(
            patternnumber,
            pattern
        );
        updatePatternText(patternnumber, permutation)
        $($("#pattern-" + patternnumber)).removeClass("selected-pattern")
        $("#input-" + patternnumber).prop("checked", false)
    }


    resetParams(url, urlParams);

});

$(document).on('click', '#deletepatternbtn', function () {
    var url = new URL(document.location);
    var urlParams = url.searchParams;

    var id = urlParams.get("id");

    sessionStorage.removeItem(id)

    $("#pattern-" + id).remove();

    resetParams(url, urlParams)

});


$(document).on('click', '#solvebtn', function () {
    var numberPatterns = sessionStorage.length;

    let patterns = []
    for (let i = 0; i < numberPatterns; i++) {
        patterns[i] = JSON.parse(sessionStorage.getItem(i));
    }

    let avoiding = []
    patterns.forEach((element, index) => {
        avoiding[index] = element.permutation.split(",");
        avoiding[index].forEach((e, i) => {
            avoiding[index][i] = parseInt(e);
        })
    });

    var length = document.getElementById("length").value

    var data = JSON.stringify({ length: parseInt(length), classic_avoidance: avoiding })

    fetch("solve", {
        method: 'POST', headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify({
            data: data,
        })
    }).then(response => response.json())
        .then(json => {
            getResult(json.jobid);
        })

        
    
});

function getResult(id) {
    window.location.assign("/result?id=" + id);

}