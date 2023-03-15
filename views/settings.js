var representation = JSON.stringify({
    "1" : "Classical",
    "2" : "Vincular",
    "3" : "Bivincular",
    "4" : "Mesh",
    "5" : "Boxed Mesh",
    "6" : "Consecutive Patterns",
});

var property = JSON.stringify({
    "prop_simple" : "Simple",
    "prop_block_wise_simple" : "Block-wise Simple",
    "prop_plus_decomposable": "Plus Decomposable",
    "prop_mins_decomposable": "Mins Decomposable",
    "prop_involution": "Involution",
    "prop_derangement": "Derangement",
    "prop_non_derangement": "Non-derangement"
})
   
var environment = {
    "representation": representation,
    "properties": property,
    "max_patterns": 5,
}