module.exports = {
  food: {
    categories: {
      meat: {
        properties: {
          edible: true,
          craftingMaterial: true,
          tool: false,
          flammable: false,
          spoilage: {
            wet: 'Contaminates quickly; must be dried or smoked.',
            heat: 'Spoils within hours without chilling.',
            age: 'Keeps 2-3 days fresh, longer when cured.'
          }
        }
      },
      fish: {
        properties: {
          edible: true,
          craftingMaterial: true,
          tool: false,
          flammable: false,
          spoilage: {
            wet: 'Delicate flesh breaks down in standing water.',
            heat: 'Turns quickly in warm climates; smoke to preserve.',
            age: 'Best eaten within a day unless dried.'
          }
        }
      },
      fruit: {
        properties: {
          edible: true,
          craftingMaterial: true,
          tool: false,
          flammable: false,
          spoilage: {
            wet: 'Bruises and molds if left damp.',
            heat: 'Ferments rapidly in heat; keep shaded.',
            age: 'Stores a few days fresh; longer when dried.'
          }
        },
        cultivation: {
          type: 'orchard or bush',
          method: 'cuttings or seed',
          note: 'Unlocked once gatherers collect {name}, enabling cultivation in orchards or berry thickets.'
        }
      },
      grain: {
        properties: {
          edible: true,
          craftingMaterial: true,
          tool: false,
          flammable: false,
          spoilage: {
            wet: 'Molds if stored damp; keep aired and dry.',
            heat: 'Heat can cause sprouting; store in cool granaries.',
            age: 'Keeps for seasons when properly dried.'
          }
        },
        cultivation: {
          type: 'field crop',
          method: 'seed broadcast',
          note: 'Unlocked once gatherers collect {name}; allows sowing grain plots.'
        }
      },
      legumes: {
        properties: {
          edible: true,
          craftingMaterial: true,
          tool: false,
          flammable: false,
          spoilage: {
            wet: 'Beans swell and split when soaked too long.',
            heat: 'High heat dries pods but can crack seed coats.',
            age: 'Stores for months if kept dry and pest-free.'
          }
        },
        cultivation: {
          type: 'field crop',
          method: 'seed planting',
          note: 'Unlocked once gatherers collect {name}; enables legume fields and trellises.'
        }
      },
      pasta: {
        properties: {
          edible: true,
          craftingMaterial: true,
          tool: false,
          flammable: false,
          spoilage: {
            wet: 'Fresh pasta turns slimy; dry immediately.',
            heat: 'Keeps only a day in warmth unless dried.',
            age: 'Dried pasta stores for months.'
          }
        }
      },
      dairy: {
        properties: {
          edible: true,
          craftingMaterial: true,
          tool: false,
          flammable: false,
          spoilage: {
            wet: 'Prone to contamination; store sealed.',
            heat: 'Sours rapidly in heat; keep in cool cellars.',
            age: 'Varies by product; hard cheeses age well, milk spoils quickly.'
          }
        }
      },
      eggs: {
        properties: {
          edible: true,
          craftingMaterial: true,
          tool: false,
          flammable: false,
          spoilage: {
            wet: 'Shells become porous; avoid washing until use.',
            heat: 'Coagulates and spoils; keep in cool storage.',
            age: 'Lasts weeks if kept cool and unwashed.'
          }
        }
      },
      herbs: {
        properties: {
          edible: true,
          craftingMaterial: true,
          tool: false,
          flammable: false,
          spoilage: {
            wet: 'Wilts and decays; dry in airy bundles.',
            heat: 'Heat strips aromatics; dry gently.',
            age: 'Potency fades over months unless sealed.'
          }
        },
        cultivation: {
          type: 'garden plot',
          method: 'seed or transplant',
          note: 'Unlocked once gatherers collect {name}; unlocks herb garden cultivation.'
        }
      },
      spices: {
        properties: {
          edible: true,
          craftingMaterial: true,
          tool: false,
          flammable: false,
          spoilage: {
            wet: 'Clumps and molds when damp.',
            heat: 'Roasts and loses volatile oils.',
            age: 'Flavor dulls gradually; store sealed.'
          }
        },
        cultivation: {
          type: 'garden or trade good',
          method: 'seed planting',
          note: 'Unlocked once gatherers collect {name}; enables spice beds or trade cultivation.'
        }
      },
      oils: {
        properties: {
          edible: true,
          craftingMaterial: true,
          tool: false,
          flammable: true,
          spoilage: {
            wet: 'Separates when contaminated with water.',
            heat: 'Rancidifies quickly if overheated.',
            age: 'Stays usable for months in sealed containers.'
          }
        },
        cultivation: {
          type: 'press crop',
          method: 'seed pressing',
          note: 'Unlocked once gatherers collect {name}; unlocks oilseed planting.'
        }
      },
      stocks: {
        properties: {
          edible: true,
          craftingMaterial: true,
          tool: false,
          flammable: false,
          spoilage: {
            wet: 'Already liquid; contamination risk.',
            heat: 'Keeps longer when simmered and sealed.',
            age: 'Spoils within days unless preserved.'
          }
        }
      },
      doughs: {
        properties: {
          edible: true,
          craftingMaterial: true,
          tool: false,
          flammable: false,
          spoilage: {
            wet: 'Overproofs and becomes sticky.',
            heat: 'Bakes solid; must be used promptly.',
            age: 'Ferments after a day; best used fresh.'
          }
        }
      },
      sweeteners: {
        properties: {
          edible: true,
          craftingMaterial: true,
          tool: false,
          flammable: true,
          spoilage: {
            wet: 'Crystallizes or ferments with moisture.',
            heat: 'Can caramelize; monitor boiling.',
            age: 'Stores indefinitely if sealed.'
          }
        },
        cultivation: {
          type: 'sap or cane harvest',
          method: 'tree tap or cane press',
          note: 'Unlocked once gatherers collect {name}; enables tapping or planting for sweetener production.'
        }
      },
      honey: {
        properties: {
          edible: true,
          craftingMaterial: true,
          tool: false,
          flammable: false,
          spoilage: {
            wet: 'Absorbs moisture and ferments.',
            heat: 'High heat destroys enzymes.',
            age: 'Keeps indefinitely when sealed.'
          }
        }
      },
      sauces: {
        properties: {
          edible: true,
          craftingMaterial: true,
          tool: false,
          flammable: false,
          spoilage: {
            wet: 'Already liquid; risk of dilution.',
            heat: 'Reduces or scorches depending on recipe.',
            age: 'Keeps for weeks if sealed; some require smoking.'
          }
        }
      }
    }
  },
  firewood: {
    categories: {
      kindling: {
        properties: {
          edible: false,
          craftingMaterial: true,
          tool: false,
          flammable: true,
          spoilage: {
            wet: 'Loses ignition potential when soaked.',
            heat: 'Dries quickly; store away from sparks.',
            age: 'Becomes brittle but usable for years.'
          }
        },
        cultivation: {
          type: 'forestry',
          method: 'sapling management',
          note: 'Unlocked once gatherers collect {name}; enables coppicing for kindling.'
        }
      },
      seasoned_logs: {
        properties: {
          edible: false,
          craftingMaterial: true,
          tool: false,
          flammable: true,
          spoilage: {
            wet: 'Absorbs moisture; reduce efficiency.',
            heat: 'Sun-cured logs burn hotter.',
            age: 'Improves with seasoning if kept dry.'
          }
        },
        cultivation: {
          type: 'forestry',
          method: 'managed harvest',
          note: 'Unlocked once gatherers collect {name}; enables scheduling of cordwood harvests.'
        }
      },
      charcoal: {
        properties: {
          edible: false,
          craftingMaterial: true,
          tool: false,
          flammable: true,
          spoilage: {
            wet: 'Crumbles when waterlogged.',
            heat: 'Stores well if kept dry.',
            age: 'Stable for years if sheltered.'
          }
        }
      }
    }
  },
  logs: {
    wood_types: {
      softwood: {
        properties: {
          edible: false,
          craftingMaterial: true,
          tool: false,
          flammable: true,
          spoilage: {
            wet: 'Resin protects but adds weight.',
            heat: 'Air drying is essential to prevent warp.',
            age: 'Can check if left unsealed for years.'
          }
        },
        cultivation: {
          type: 'forestry',
          method: 'sapling planting',
          note: 'Unlocked once gatherers collect {name}; enables planting of softwood groves.'
        }
      },
      wood: {
        properties: {
          edible: false,
          craftingMaterial: true,
          tool: false,
          flammable: true,
          spoilage: {
            wet: 'Prone to rot if waterlogged.',
            heat: 'Cures faster in warm breezes.',
            age: 'Stabilizes over seasons when stacked properly.'
          }
        },
        cultivation: {
          type: 'forestry',
          method: 'mixed stand planting',
          note: 'Unlocked once gatherers collect {name}; enables mixed woodland cultivation.'
        }
      },
      hardwood: {
        properties: {
          edible: false,
          craftingMaterial: true,
          tool: false,
          flammable: true,
          spoilage: {
            wet: 'Warp resistant but can mold if stacked poorly.',
            heat: 'Slow to season; keep sheltered.',
            age: 'Becomes extremely stable as it cures over years.'
          }
        },
        cultivation: {
          type: 'forestry',
          method: 'sapling tending',
          note: 'Unlocked once gatherers collect {name}; enables hardwood orchard management.'
        }
      }
    }
  },
  stone: {
    categories: {
      rubble: {
        properties: {
          edible: false,
          craftingMaterial: true,
          tool: false,
          flammable: false,
          spoilage: {
            wet: 'No effect aside from moss growth.',
            heat: 'Stable under heat.',
            age: 'Remains intact indefinitely.'
          }
        }
      },
      fieldstone: {
        properties: {
          edible: false,
          craftingMaterial: true,
          tool: false,
          flammable: false,
          spoilage: {
            wet: 'May become slick but not damaged.',
            heat: 'Unaffected.',
            age: 'Weathers slowly over decades.'
          }
        }
      },
      block: {
        properties: {
          edible: false,
          craftingMaterial: true,
          tool: false,
          flammable: false,
          spoilage: {
            wet: 'Needs drainage to avoid frost heave.',
            heat: 'Stable in kilns and sun.',
            age: 'Durable for centuries when set properly.'
          }
        }
      },
      slab: {
        properties: {
          edible: false,
          craftingMaterial: true,
          tool: false,
          flammable: false,
          spoilage: {
            wet: 'Surface may slick; otherwise stable.',
            heat: 'Unaffected.',
            age: 'Maintains shape when supported.'
          }
        }
      }
    }
  },
  clay: {
    categories: {
      earthenware: {
        properties: {
          edible: false,
          craftingMaterial: true,
          tool: false,
          flammable: false,
          spoilage: {
            wet: 'Softens and becomes workable; cover to prevent drying.',
            heat: 'Hardens when fired.',
            age: 'Keep damp to remain workable.'
          }
        }
      },
      stoneware: {
        properties: {
          edible: false,
          craftingMaterial: true,
          tool: false,
          flammable: false,
          spoilage: {
            wet: 'Requires wedging if it dries unevenly.',
            heat: 'Matures at high kiln temperatures.',
            age: 'Store sealed to retain moisture.'
          }
        }
      },
      refractory: {
        properties: {
          edible: false,
          craftingMaterial: true,
          tool: false,
          flammable: false,
          spoilage: {
            wet: 'Can crumble if soaked then dried rapidly.',
            heat: 'Designed to withstand extreme temperatures.',
            age: 'Keeps indefinitely if stored covered.'
          }
        }
      }
    }
  },
  ore: {
    categories: {
      ferrous: {
        properties: {
          edible: false,
          craftingMaterial: true,
          tool: false,
          flammable: false,
          spoilage: {
            wet: 'Oxidizes on the surface; cover to reduce rust.',
            heat: 'Requires smelting to refine.',
            age: 'Stable as raw ore.'
          }
        }
      },
      nonferrous: {
        properties: {
          edible: false,
          craftingMaterial: true,
          tool: false,
          flammable: false,
          spoilage: {
            wet: 'Some ores tarnish when damp.',
            heat: 'Needs controlled smelting temperatures.',
            age: 'Stores indefinitely.'
          }
        }
      },
      precious: {
        properties: {
          edible: false,
          craftingMaterial: true,
          tool: false,
          flammable: false,
          spoilage: {
            wet: 'Generally inert though may dull.',
            heat: 'Can be melted and recast.',
            age: 'Highly stable over time.'
          }
        }
      }
    }
  },
  leather: {
    hides: {
      thin: {
        properties: {
          edible: false,
          craftingMaterial: true,
          tool: false,
          flammable: false,
          spoilage: {
            wet: 'Mildews quickly; dry in shade.',
            heat: 'Hardens if over-dried.',
            age: 'Becomes brittle without conditioning.'
          }
        }
      },
      medium: {
        properties: {
          edible: false,
          craftingMaterial: true,
          tool: false,
          flammable: false,
          spoilage: {
            wet: 'Needs smoking or oiling to prevent rot.',
            heat: 'Can shrink if overheated.',
            age: 'Remains durable with periodic oiling.'
          }
        }
      },
      thick: {
        properties: {
          edible: false,
          craftingMaterial: true,
          tool: false,
          flammable: false,
          spoilage: {
            wet: 'Heavy hides mold if not stretched dry.',
            heat: 'Shrinks when scorched.',
            age: 'Stiffens but remains strong when conditioned.'
          }
        }
      }
    }
  },
  cloth: {
    textiles: {
      wool: {
        properties: {
          edible: false,
          craftingMaterial: true,
          tool: false,
          flammable: false,
          spoilage: {
            wet: 'Felts when agitated in water.',
            heat: 'Can scorch; dry gently.',
            age: 'Resists wear; lanolin preserves fibers.'
          }
        }
      },
      linen: {
        properties: {
          edible: false,
          craftingMaterial: true,
          tool: false,
          flammable: false,
          spoilage: {
            wet: 'Dries quickly but can mildew.',
            heat: 'Resists heat; iron while damp.',
            age: 'Softens with use; fibers weaken over years.'
          }
        },
        cultivation: {
          type: 'fiber crop',
          method: 'flax field',
          note: 'Unlocked once gatherers collect {name}; enables flax field cultivation.'
        }
      },
      silk: {
        properties: {
          edible: false,
          craftingMaterial: true,
          tool: false,
          flammable: false,
          spoilage: {
            wet: 'Water spots the sheen; dry flat.',
            heat: 'Scorches easily; low iron heat.',
            age: 'Fibers weaken with sun exposure.'
          }
        }
      },
      blends: {
        properties: {
          edible: false,
          craftingMaterial: true,
          tool: false,
          flammable: false,
          spoilage: {
            wet: 'Behavior varies by blend; typically dries evenly.',
            heat: 'Generally resilient; avoid open flame.',
            age: 'Combines longevity of component fibers.'
          }
        }
      }
    }
  }
};
