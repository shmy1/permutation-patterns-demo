setup();


function setup() {
    $('#deletepatternbtn').css("visibility", "hidden");
    setPermutationElements();
    setPatternChoices();
    setPatternType();
    setContainment();
    setPropertyChoices();
    setStatisticChoices();
    sessionStorage.clear();
    sessionStorage.setItem("total", 0)
    UrlToPattern();
    
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
    if (!currenturl.searchParams.get("type")) {
        currenturl.searchParams.set('type', 1);
        window.history.pushState({}, '', currenturl);
    }

}

function setPatternType() {
    var url = new URL(document.location);
    var params = url.searchParams;

    if (params.get('type')) {
        var representation = params.get('type')
        $('#permrepresentation').val(representation);
    }
}

function setContainment() {
    var url = new URL(document.location);
    var params = url.searchParams;
    if (params.get('contain')) {
        var containment = params.get('contain')
        var selection = $('input:radio[name="containment"]')
        $.each(selection, function (i, item) {
            if($(this).val() != containment) {
                $(this).prop("checked", false)
            }
            else{
                $(this).prop("checked", true)
            }
        });
    }
}

function resetParams() {
    var url = new URL(document.location);
    var urlParams = url.searchParams;

    urlParams.delete("id")
    urlParams.delete("permutation")
    urlParams.delete("contain")
    urlParams.set('type', 1);
    window.history.pushState({}, '', url);
    dispatchEvent(new PopStateEvent('popstate', {}));
}


$(document).on('change', '#permrepresentation', function () {
    var currenturl = new URL(window.location);
    currenturl.searchParams.set('type', $('#permrepresentation').find("option:selected").attr('value'));
    window.history.pushState({}, '', currenturl);

    dispatchEvent(new PopStateEvent('popstate', {}));
}
);

$(document).on('change', '#include', function () {
    var currenturl = new URL(window.location);
    currenturl.searchParams.set("contain", $('#include input:checked').attr("value"));
    window.history.pushState({}, '', currenturl);
    dispatchEvent(new PopStateEvent('popstate', {}));
}
);

window.addEventListener('popstate', function (event) {
    setPermutationElements();
    setPatternType();
    setContainment();
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
    var patterntype = urlParams.get('type')
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

    if ($(this).text().trim() === "Add Underlying Pattern") {
        var patternnumber = sessionStorage.getItem("total")
        if (patternnumber >= `${environment.max_patterns}`) {
            $('#maxPatterns').modal('show');
        }
        else {
            sessionStorage.setItem(
                patternnumber,
                pattern
            );
            var count = sessionStorage.getItem("total");
            count = parseInt(count) + 1;
            sessionStorage.setItem("total", count)

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

    patternToUrl(JSON.parse(pattern))
    resetParams(url, urlParams);

});

$(document).on('click', '#deletepatternbtn', function () {
    var url = new URL(document.location);
    var urlParams = url.searchParams;

    var id = urlParams.get("id");

    sessionStorage.removeItem(id)

    $("#pattern-" + id).remove();

    resetParams()

});


$(document).on('click', '#solvebtn', function () {
    var numberPatterns = sessionStorage.getItem("total");
    let patterns = []
    for (let i = 0; i < numberPatterns; i++) {
        patterns[i] = JSON.parse(sessionStorage.getItem(i));
    }
    var length = document.getElementById("length").value

    if (!isValidLength(patterns, length)) {
        document.getElementById("length").classList.add('is-invalid')
    }

    else {
        var props = getCheckedBoxes(JSON.parse(`${environment.properties}`), null, "property");
        var statistics = getCheckedBoxes(JSON.parse(`${environment.statistics}`), "#all-statistic", "statistic");
        var underlying = getPatterns(patterns);


        var inputs = $.extend({ length: parseInt(length) }, props, underlying)
        fetch("empty.json")
            .then(response => response.json())
            .then(json => {
                var emptyData = json
                fetch('/combined.essence')
                    .then(response => response.text())
                    .then((data) => {
                        var details = {
                            model: data,
                            data: JSON.stringify(Object.assign(emptyData, inputs)),
                            solver: "minion",
                            conjure_options: ["--number-of-solutions", "10000"]
                        }
                        fetch("https://demos.constraintmodelling.org/server/submit", {
                            method: 'POST', headers: {
                                'Content-Type': 'application/json'
                            }, body: JSON.stringify(details)
                        })
                            .then(response => response.json())
                            .then(json => {
                                sessionStorage.clear();
                                localStorage.setItem(json.jobid, new URL(document.location));
                                getResult(json.jobid, statistics);
                            })
                            .catch((err) => {
                                console.error(err);
                            });
                    })
            });
    }

});

function getResult(id, statistics) {
    var stats = []
    for (var stat in statistics) {
        if (statistics[stat]) {
            stats.push(stat.split("_")[1])
        }
    }
    var url = "/result.html?id=" + id
    if (stats.length > 0) {
        url += "&stats=" + stats
    }
    window.location.assign(url);

}

function setPropertyChoices() {
    var properties = JSON.parse(`${environment.properties}`)
    $.each(properties, function (i, item) {

        var input = document.createElement("input")
        input.classList.add("form-check-input")
        input.setAttribute("type", "checkbox")
        input.setAttribute("name", "property")
        input.setAttribute("id", i)
        input.setAttribute("value", i)

        var label = document.createElement("label")
        label.classList.add("form-check-label")
        label.appendChild(input)
        label.appendChild(document.createTextNode(item))

        var div = document.createElement("div")
        div.classList.add("form-check-inline")
        div.appendChild(label)
        $('#property_choices').append(div);

    });

}

function setStatisticChoices() {
    var statistics = JSON.parse(`${environment.statistics}`)
    $.each(statistics, function (i, item) {

        var input = document.createElement("input")
        input.classList.add("form-check-input")
        input.setAttribute("type", "checkbox")
        input.setAttribute("name", "property")
        input.setAttribute("id", i)
        input.setAttribute("value", i)

        var label = document.createElement("label")
        label.classList.add("form-check-label")
        label.appendChild(input)
        label.appendChild(document.createTextNode(item))

        var div = document.createElement("div")
        div.classList.add("form-check-inline")
        div.appendChild(label)
        $('#statistic_choices').append(div);

    });

}

$(document).on('change', ':checkbox', function () {
    if ($(this).attr("id") === "all-statistic") {
        var check = false;
        if ($("#all-statistic").is(':checked')) {
            check = true;
        }
        $('input:checkbox[id^="stat_"]').each(function () {
            $(this).prop('checked', check);
        });
    }

    else if ($(this).not(':checked')) {
        var id = $(this).attr("id")
        if (id.includes("stat")) {
            $("#all-statistic").prop('checked', false);
        }

    }

}
);

function getCheckedBoxes(list, all, id) {
    var checked = false;
    if (all) {
        if ($(all).is(':checked')) {
            checked = true;
        }
    }

    $.each(list, function (i, item) {
        list[i] = checked;
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


function getPatterns(patterns) {
    var pattern_types = JSON.parse(`${environment.pattern_types}`)
    var representation = JSON.parse(`${environment.representation}`)
    var names = JSON.parse(`${environment.pattern_names}`)


    patterns.forEach((element, index) => {
        var containment = "containment";
        if (element.containment === "false") {
            containment = "avoidance";
        }

        var perm = element.permutation.split(",");
        perm.forEach((e, i) => {
            perm[i] = parseInt(e);
        })
        patterns[index].permutation = perm

        var representation_name = representation[element.patterntype]
        var grid_pattern = getGridPattern(representation_name, element)

        var pattern = perm
        if (grid_pattern) {
            pattern = [perm, grid_pattern]
        }

        pattern_types[names[representation_name] + containment].push(pattern);

    });

    return pattern_types
}

function getGridPattern(name, pattern) {
    switch (name) {
        case "Vincular":
            return getColumns(pattern.pattern)
        case "Bivincular":
            return getColumns(pattern.pattern)
        case "Mesh":
            return getCells(pattern.pattern)

    }
}


function getColumns(grid) {
    var columns = []
    for (var col = 0; col < grid[0].length; col++) {
        if (grid[0][col] == 1) {
            columns.push(col)
        }
    }

    return columns;
}

function getCells(grid) {
    var cells = []
    for (var col = 0; col < grid.length; col++) {
        for (var row = 0; row < grid[col].length; row++) {
            if (grid[col][row] == 1) {
                cells.push([row, grid.length - 1 - col])
            }
        }
    }
    return cells;
}

function patternToUrl(pattern) {
    var currenturl = new URL(window.location);
    var array = ["-", pattern.permutation, pattern.patterntype, pattern.containment]

    if (currenturl.searchParams.get("patterns")) {
        array = currenturl.searchParams.get("patterns").concat(array)
    }

    currenturl.searchParams.set('patterns', array);
    window.history.pushState({}, '', currenturl);

}

function UrlToPattern() {
    var currenturl = new URL(window.location);
    var patterns = currenturl.searchParams.get("patterns");

    var count = 0;

    if (patterns) {
        patterns = patterns.split("-").filter(item => item.trim().length > 0)
        $.each(patterns, function (i, item) {
            var temp = item.split(",").filter(item => item.trim().length > 0)
            var pattern = JSON.stringify({ permutation: temp.slice(0, -2).toString(), patterntype: temp.slice(-2, -1).toString(), containment: temp.slice(-1).toString() })
            sessionStorage.setItem(
                i,
                pattern
            )
            count++;
            
            addNewPattern(i, pattern);
        });
    }
    sessionStorage.setItem("total", count)

}

function isValidLength(patterns, length) {
    var arr = [];

    $.each(patterns, function (i, item) {
        arr[i] = item.permutation
    });

    var min = (arr.reduce((a, b) => a.length <= b.length ? a : b)).split(",").length
    return min < length


}