const fs = require('fs');
const path = require('path');

const detailsPath = path.join(__dirname, '..', 'src', 'data', 'resource_details.json');
const resourcesPath = path.join(__dirname, '..', 'src', 'data', 'resources.json');

const details = JSON.parse(fs.readFileSync(detailsPath, 'utf8'));

const resourceTemplates = require('./resource_templates.cjs');
const manualResources = require('./resource_manual_additions.cjs');

const resources = new Map();

const recordResource = (entry, context) => {
  const { id, name } = entry;
  const template = context.template;
  if (!template) {
    return;
  }

  if (!resources.has(id)) {
    const base = {
      id,
      name,
      category: context.category,
      subcategory: context.subcategory,
      biomes: [],
      properties: JSON.parse(JSON.stringify(template.properties)),
      cultivation: null
    };

    if (template.cultivation) {
      base.cultivation = {
        type: template.cultivation.type,
        method: template.cultivation.method,
        unlocked: false,
        note: template.cultivation.note.replace('{name}', name)
      };
    }

    resources.set(id, base);
  }

  const existing = resources.get(id);
  if (!existing.biomes.includes(context.biome)) {
    existing.biomes.push(context.biome);
  }
};

const iterateBiomes = (distribution, handler) => {
  Object.entries(distribution || {}).forEach(([biome, entries]) => {
    entries.forEach((entry) => handler(entry, biome));
  });
};

const groupProcessors = [
  {
    accessor: ['food', 'categories'],
    templateCategory: 'food'
  },
  {
    accessor: ['firewood', 'categories'],
    templateCategory: 'firewood'
  },
  {
    accessor: ['logs', 'wood_types'],
    templateCategory: 'logs'
  },
  {
    accessor: ['stone', 'categories'],
    templateCategory: 'stone'
  },
  {
    accessor: ['clay', 'categories'],
    templateCategory: 'clay'
  },
  {
    accessor: ['ore', 'categories'],
    templateCategory: 'ore'
  },
  {
    accessor: ['leather', 'hides'],
    templateCategory: 'leather'
  },
  {
    accessor: ['cloth', 'textiles'],
    templateCategory: 'cloth'
  }
];

const raw = details.raw_resources || {};

groupProcessors.forEach(({ accessor, templateCategory }) => {
  const [groupKey, subKey] = accessor;
  const group = raw[groupKey];
  if (!group || !group[subKey]) {
    return;
  }

  Object.entries(group[subKey]).forEach(([subcategory, info]) => {
    const template =
      resourceTemplates[templateCategory] &&
      resourceTemplates[templateCategory][subKey] &&
      resourceTemplates[templateCategory][subKey][subcategory];

    iterateBiomes(info.biome_distribution, (entry, biome) => {
      recordResource(entry, {
        category: templateCategory,
        subcategory,
        biome,
        template
      });
    });
  });
});

manualResources.forEach((resource) => {
  if (!resources.has(resource.id)) {
    resources.set(resource.id, resource);
  }
});

const sorted = Array.from(resources.values()).sort((a, b) => a.name.localeCompare(b.name));
fs.writeFileSync(resourcesPath, JSON.stringify(sorted, null, 2));
