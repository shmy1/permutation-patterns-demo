var url = new URL(document.location);
var urlParams = url.searchParams;
var id = urlParams.get("id")

getResult();

function getResult() {
    var solverDone = false;

    if (!solverDone) {
        fetch("getJob", {
            method: 'POST', headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({
                data: id,
            })
        }).then(response => response.json())
            .then(json => {
                if (json.status == "wait") {
                    setTimeout(getResult, 2000);
                    document.getElementById("result-container").textContent = "Loading";
                }
                else {
                    solverDone = true;
                    if (json.status == "ok") {
                        document.getElementById("result-container").textContent = "";
                        showResults(json);
                    }
                    else {
                        document.getElementById("result-container").textContent = JSON.stringify(json, undefined, 2);
                    }

                }

            })
    }

}

function showResults(results) {
    var url = new URL(document.location);
    var urlParams = url.searchParams;
    var stats = urlParams.get("stats")

    if (stats) {
        stats = stats.split(",")
    }

    $.each(results.solution, function (i, item) {
        showSolution(item, stats)
    });
}

function showSolution(solution, stats) {
    var statistics = JSON.parse(`${environment.statistics}`)

    var label = document.createElement("label")
    label.appendChild(document.createTextNode("Permutation: " + solution.perm))

    var div = document.createElement("div")
    div.classList.add("mb-3")
    div.appendChild(label)

    if (stats) {
        for (var i = 0; i < stats.length; i++) {
            var label = document.createElement("label")
            var statdiv = document.createElement("div")
            label.appendChild(document.createTextNode(statistics["stat_" + stats[i]] + ": " + solution[stats[i]]))
            statdiv.appendChild(label)
            div.appendChild(statdiv)
        }
    }
    $('#solutioncontainer').append(div);

}