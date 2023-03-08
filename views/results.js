var url = new URL(document.location);
var urlParams = url.searchParams;
var id = urlParams.get("id")

getResult();

function getResult() {
    var solverDone = false;

    if(!solverDone) {
        fetch("getJob", {
            method: 'POST', headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({
                data: id,
            })
        }).then(response => response.json())
            .then(json => {
                if(json.status == "wait") {
                    setTimeout(getResult, 2000);
                    document.getElementById("result-container").textContent = "Loading";
                }
                else {
                    solverDone = true;
                    document.getElementById("result-container").textContent = JSON.stringify(json, undefined, 2);
                }
               
        })
    }
    
}