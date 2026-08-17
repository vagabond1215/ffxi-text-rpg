export const PORTABLE_LOGISTICS_CATALOG_VERSION = 1;

const DEFINITIONS = Object.freeze({
    'field-satchel': Object.freeze({
        id: 'field-satchel',
        name: 'Make a Field Satchel',
        projectKind: 'portable-logistics.field-satchel',
        description: 'Fit a reinforced field satchel that keeps more tools and supplies within reach on the road.',
        motivation: 'More portable space supports longer field loops, but everything in the satchel still counts as carried transport load.',
        laborSeconds: 1800,
        materials: Object.freeze([
            Object.freeze({ itemId: 'item-elderwood-hide-binding', name: 'Resin-Cured Hide Binding', quantity: 2 }),
            Object.freeze({ itemId: 'item-copper-trail-clasp', name: 'Copper Trail Clasp', quantity: 1 }),
        ]),
        benefit: Object.freeze({
            containerId: 'mogSatchel',
            containerName: 'Field Satchel',
            portableSlots: 8,
        }),
        benefitSummary: 'Unlocks 8 portable Field Satchel slots. Satchel contents still count toward scheduled-transport cargo limits.',
    }),
});

export function getPortableLogisticsDefinition(definitionId) {
    return DEFINITIONS[String(definitionId ?? '').trim()] ?? null;
}

export function listPortableLogisticsDefinitions() {
    return Object.values(DEFINITIONS);
}
