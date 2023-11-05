class PatternType {
  static Classical = new PatternType("1", "Classical", "classic_");
  static Vincular = new PatternType("2", "Vincular", "vincular_");
  static Bivincular = new PatternType("3", "Bivincular", "bivincular_");
  static Mesh = new PatternType("4", "Mesh", "mesh_");
  static BoxedMesh = new PatternType("5", "Boxed Mesh", "boxed_mesh_");
  static ConsecutivePatterns = new PatternType("6", "Consecutive Patterns", "consecutive_");

  constructor(index, name, label) {
    this.index = index;
    this.name = name;
    this.label = label;
  }
}

class Property {
  static Simple = new Property("Simple", "prop_simple");
  static BlockwiseSimple = new Property("Block-wise Simple", "prop_block_wise_simple");
  static PlusDecomposable = new Property("Plus Decomposable", "prop_plus_decomposable");
  static MinusDecomposable = new Property("Minus Decomposable", "prop_mins_decomposable");
  static Involution = new Property("Involution", "prop_involution");
  static Derangement = new Property("Derangement", "prop_derangement");
  static NonDerangement = new Property("Non-derangement", "prop_non_derangement");

  constructor(name, label) {
    this.name = name;
    this.label = label;
  }
}

class Statistic {
  static AscentCount = new Statistic("Ascent Count", "stat_ascentCount");
  static DescentCount = new Statistic("Descent Count", "stat_descentCount");
  static ExcedanceCount = new Statistic("Excedance Count", "stat_excedanceCount");
  static InversionCount = new Statistic("Inversion Count", "stat_inversionCount");
  static MajorIndex = new Statistic("Major Index", "stat_majorIndex");

  constructor(name, label) {
    this.name = name;
    this.label = label;
  }
}

//the possible patterns that can be input (each pattern type can have avoidance and containment) 
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
  "max_patterns": 5, //the maximum number of underlying patterns that can added as part of a permutation problem
  "patterns": patterns,
}
