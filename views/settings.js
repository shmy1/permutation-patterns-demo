var representation = JSON.stringify({
  "1": "Classical",
  "2": "Vincular",
  "3": "Bivincular",
  "4": "Mesh",
  "5": "Boxed Mesh",
  "6": "Consecutive Patterns",
});

var property = JSON.stringify({
  "prop_simple": "Simple",
  "prop_block_wise_simple": "Block-wise Simple",
  "prop_plus_decomposable": "Plus Decomposable",
  "prop_mins_decomposable": "Mins Decomposable",
  "prop_involution": "Involution",
  "prop_derangement": "Derangement",
  "prop_non_derangement": "Non-derangement"
})

var pattern_names = JSON.stringify({
  "Classical": "classic_",
  "Vincular": "vincular_",
  "Bivincular": "bivincular_",
  "Mesh": "mesh_",
  "Boxed Mesh": "boxed_mesh_",
  "Consecutive Patterns": "consecutive_",
})
var patterns = JSON.stringify({
  "classic_avoidance": [],
  "classic_containment": [],
  "vincular_containment": [],
  "vincular_avoidance": [],
  "bivincular_containment": [],
  "bivincular_avoidance": [],
  "mesh_containment": [],
  "mesh_avoidance": [],
  "boxed_mesh_containment": [],
  "boxed_mesh_avoidance": [],
  "consecutive_containment": [],
  "consecutive_avoidance": [],
})

var environment = {
  "representation": representation,
  "properties": property,
  "max_patterns": 5,
  "pattern_types": patterns,
  "pattern_names":pattern_names,

}