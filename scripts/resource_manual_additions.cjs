module.exports = [
  {
    id: 'bronze_ingot',
    name: 'bronze ingot',
    category: 'metals',
    subcategory: 'ingot',
    biomes: [],
    properties: {
      edible: false,
      craftingMaterial: true,
      tool: false,
      flammable: false,
      spoilage: {
        wet: 'Corrodes slowly in damp storage; oil to protect.',
        heat: 'Can be remelted for casting without quality loss.',
        age: 'Stable for generations if kept dry.'
      }
    },
    cultivation: null
  },
  {
    id: 'iron_ingot',
    name: 'iron ingot',
    category: 'metals',
    subcategory: 'ingot',
    biomes: [],
    properties: {
      edible: false,
      craftingMaterial: true,
      tool: false,
      flammable: false,
      spoilage: {
        wet: 'Rusts when exposed; coat in oil or wax.',
        heat: 'Tempering adjusts hardness; remelt as needed.',
        age: 'Remains solid indefinitely when stored dry.'
      }
    },
    cultivation: null
  },
  {
    id: 'thin_leather_panel',
    name: 'thin leather panel',
    category: 'leather',
    subcategory: 'processed',
    biomes: [],
    properties: {
      edible: false,
      craftingMaterial: true,
      tool: false,
      flammable: false,
      spoilage: {
        wet: 'Mildews and stretches; dry flat.',
        heat: 'Hardens if baked; keep below curing temperatures.',
        age: 'Needs oiling every season to avoid cracking.'
      }
    },
    cultivation: null
  },
  {
    id: 'wool_batting',
    name: 'wool batting',
    category: 'cloth',
    subcategory: 'padding',
    biomes: [],
    properties: {
      edible: false,
      craftingMaterial: true,
      tool: false,
      flammable: false,
      spoilage: {
        wet: 'Felts and compacts when soaked.',
        heat: 'Can scorch if exposed to flame.',
        age: 'Retains loft if aired regularly.'
      }
    },
    cultivation: null
  },
  {
    id: 'linen_thread',
    name: 'linen thread',
    category: 'cloth',
    subcategory: 'thread',
    biomes: [],
    properties: {
      edible: false,
      craftingMaterial: true,
      tool: false,
      flammable: false,
      spoilage: {
        wet: 'Dries quickly; may mildew if left damp.',
        heat: 'Stable under moderate heat.',
        age: 'Fibers weaken slowly; store in sealed spools.'
      }
    },
    cultivation: null
  },
  {
    id: 'caribou_longbone',
    name: 'caribou longbone',
    category: 'bone',
    subcategory: 'weapon_core',
    biomes: ['boreal', 'alpine'],
    properties: {
      edible: false,
      craftingMaterial: true,
      tool: false,
      flammable: false,
      spoilage: {
        wet: 'Can soften or crack when dried too fast.',
        heat: 'Brittles in open flame; steam to shape.',
        age: 'Cures to a hard, carvable core over months.'
      }
    },
    cultivation: null
  }
];
