var url = new URL(document.location);
var urlParams = url.searchParams;
var id = urlParams.get("id")

fetch("getJob", {
    method: 'POST', headers: {
        'Content-Type': 'application/json'
    }, body: JSON.stringify({
        data: id,
    })
}).then(response => response.json())
    .then(json => {
        document.getElementById("result-container").textContent = JSON.stringify(json, undefined, 2);
})