import { ITEM_KINDS, normalizeItem, validateItemConsumption } from './itemSchema.js';

export const MATERIAL_FOUNDATION_PRODUCTION_ITEM_VERSION = 1;

const DEFINITIONS = Object.freeze({
    'item-material-tin-ingot': item('item-material-tin-ingot','Tin Ingot',['metal','tin','ingot','stock'],32,'process-material-tin-ingot'),
    'item-material-lead-ingot': item('item-material-lead-ingot','Lead Ingot',['metal','lead','ingot','stock','weight'],28,'process-material-lead-ingot'),
    'item-material-silver-ingot': item('item-material-silver-ingot','Silver Ingot',['metal','silver','ingot','stock','decorative','conductive'],96,'process-material-silver-ingot'),
    'item-material-gold-ingot': item('item-material-gold-ingot','Gold Ingot',['metal','gold','ingot','stock','decorative','conductive','luxury'],148,'process-material-gold-ingot'),
    'item-material-bronze-ingot': item('item-material-bronze-ingot','Bronze Ingot',['metal','bronze','alloy','ingot','stock','corrosion-resistant'],58,'process-material-bronze-ingot'),
    'item-material-brass-ingot': item('item-material-brass-ingot','Brass Ingot',['metal','brass','alloy','ingot','stock','decorative','corrosion-resistant'],62,'process-material-brass-ingot'),
    'item-material-pewter-ingot': item('item-material-pewter-ingot','Pewter Ingot',['metal','pewter','alloy','ingot','stock','tableware'],48,'process-material-pewter-ingot'),
    'item-material-solder-bar': item('item-material-solder-bar','Soft Solder Bar',['metal','solder','alloy','joining','component'],44,'process-material-solder-bar'),
    'item-material-steel-bar': item('item-material-steel-bar','Forge Steel Bar',['metal','steel','bar','stock','strong','edge-holding'],82,'process-material-steel-bar'),
    'item-material-copper-wire': item('item-material-copper-wire','Drawn Copper Wire',['metal','copper','wire','stock','conductive'],44,'process-material-copper-wire'),
    'item-material-silver-wire': item('item-material-silver-wire','Drawn Silver Wire',['metal','silver','wire','stock','conductive','fine-craft'],122,'process-material-silver-wire'),
    'item-material-bronze-sheet': item('item-material-bronze-sheet','Hammered Bronze Sheet',['metal','bronze','sheet','stock','hardware'],72,'process-material-bronze-sheet'),
    'item-material-brass-sheet': item('item-material-brass-sheet','Hammered Brass Sheet',['metal','brass','sheet','stock','decorative','hardware'],76,'process-material-brass-sheet'),
    'item-material-iron-nail-set': item('item-material-iron-nail-set','Iron Nail Set',['metal','iron','fastener','nails','construction'],34,'craft-material-iron-nail-set'),
    'item-material-iron-hinge-set': item('item-material-iron-hinge-set','Iron Hinge Set',['metal','iron','hardware','hinge','construction'],48,'craft-material-iron-hinge-set'),
    'item-material-iron-buckle-ring-set': item('item-material-iron-buckle-ring-set','Iron Buckle and Ring Set',['metal','iron','hardware','buckle','ring','harness'],46,'craft-material-iron-buckle-ring-set'),
    'item-material-iron-ferrule-socket-set': item('item-material-iron-ferrule-socket-set','Iron Ferrule and Socket Set',['metal','iron','hardware','ferrule','socket','tool-component'],48,'craft-material-iron-ferrule-socket-set'),
    'item-material-iron-chain-length': item('item-material-iron-chain-length','Iron Chain Length',['metal','iron','chain','rigging','hardware'],62,'craft-material-iron-chain-length'),
    'item-material-iron-hoop-set': item('item-material-iron-hoop-set','Iron Hoop Set',['metal','iron','hoop','cooperage','wheelwright'],52,'craft-material-iron-hoop-set'),
    'item-material-iron-tool-head-blank': item('item-material-iron-tool-head-blank','Iron Tool-Head Blank',['metal','iron','tool-component','blank','smithing'],56,'craft-material-iron-tool-head-blank'),
    'item-material-steel-blade-blank': item('item-material-steel-blade-blank','Steel Blade Blank',['metal','steel','blade','blank','edge-tool'],96,'craft-material-steel-blade-blank'),
    'item-material-silver-setting-kit': item('item-material-silver-setting-kit','Silver Setting Kit',['metal','silver','setting','bezel','jewelry','fine-craft'],138,'craft-material-silver-setting-kit'),
    'item-material-cloudsilver-spellwire': item('item-material-cloudsilver-spellwire','Cloudsilver Spellwire',['metal','silver','wire','arcane-conductor','magical','fine-craft'],228,'craft-material-cloudsilver-spellwire'),

    'item-material-charcoal': item('item-material-charcoal','Hardwood Charcoal',['fuel','charcoal','forge','kiln','industrial'],22,'process-material-charcoal'),
    'item-material-ash-handle-blank': item('item-material-ash-handle-blank','Ash Handle Blank',['wood','ash','handle','tool-component','flexible'],28,'craft-material-ash-handle-blank'),
    'item-material-oak-plank': item('item-material-oak-plank','Crown Oak Plank',['wood','oak','plank','structural','wide-board'],36,'craft-material-oak-plank'),
    'item-material-oak-beam': item('item-material-oak-beam','Crown Oak Beam',['wood','oak','beam','structural','construction'],42,'craft-material-oak-beam'),
    'item-material-maple-fine-board': item('item-material-maple-fine-board','Silvermaple Fine Board',['wood','maple','board','pale','fine-craft','decorative'],40,'craft-material-maple-fine-board'),
    'item-material-yew-bow-stave': item('item-material-yew-bow-stave','Seasoned Yew Bow Stave',['wood','yew','stave','bowwood','elastic','fine-craft'],52,'craft-material-yew-bow-stave'),
    'item-material-hazel-hoop-bundle': item('item-material-hazel-hoop-bundle','Hazel Hoop Bundle',['wood','hazel','hoop','cooperage','basketry','flexible'],24,'craft-material-hazel-hoop-bundle'),
    'item-material-spruce-spar': item('item-material-spruce-spar','Slatewater Spruce Spar',['wood','spruce','spar','mast','rigging','straight'],44,'craft-material-spruce-spar'),
    'item-material-cedar-board': item('item-material-cedar-board','Fragrant Cedar Board',['wood','cedar','board','fragrant','rot-resistant','fine-craft'],46,'craft-material-cedar-board'),
    'item-material-applewood-block': item('item-material-applewood-block','Seasoned Applewood Block',['wood','fruitwood','apple','carving','fine-grain'],28,'craft-material-applewood-block'),
    'item-material-giant-cane-poles': item('item-material-giant-cane-poles','Dressed Giant Cane Poles',['cane','pole','lightweight','hollow','construction','fishing'],26,'craft-material-giant-cane-poles'),
    'item-material-oak-dowel-set': item('item-material-oak-dowel-set','Oak Peg and Dowel Set',['wood','oak','fastener','peg','dowel','joinery'],30,'craft-material-oak-dowel-set'),
    'item-material-oak-wheel-spoke-set': item('item-material-oak-wheel-spoke-set','Oak Wheel-Spoke Set',['wood','oak','wheel','spoke','wheelwright','component'],48,'craft-material-oak-wheel-spoke-set'),
    'item-material-oak-cooper-stave-set': item('item-material-oak-cooper-stave-set','Oak Cooper Stave Set',['wood','oak','stave','cooperage','barrel','component'],44,'craft-material-oak-cooper-stave-set'),
    'item-material-silvermaple-syrup': item('item-material-silvermaple-syrup','Reduced Silvermaple Syrup',['food','syrup','sweetener','preserve','elderwood'],26,'cook-material-silvermaple-syrup',{ kind: ITEM_KINDS.CONSUMABLE, consumption: { mode: 'direct', hazard: 'none', preparation: [], notes: 'Sap has been reduced over heat into a keeping syrup and may be eaten or used in cooking.' }, sinks: ['consume','craftIngredient','trade'] }),

    'item-material-hemp-fiber': item('item-material-hemp-fiber','Dressed Hemp Fiber',['fiber','hemp','bast','textile','cordage'],18,'process-material-hemp-fiber'),
    'item-material-hemp-yarn': item('item-material-hemp-yarn','Spun Hemp Yarn',['fiber','hemp','yarn','textile','cordage'],26,'process-material-hemp-yarn'),
    'item-material-hemp-twine': item('item-material-hemp-twine','Hemp Twine',['fiber','hemp','twine','cordage','netting'],34,'process-material-hemp-twine'),
    'item-material-hemp-cord': item('item-material-hemp-cord','Hemp Cord',['fiber','hemp','cord','cordage','binding'],44,'process-material-hemp-cord'),
    'item-material-hemp-rope': item('item-material-hemp-rope','Hemp Rope',['fiber','hemp','rope','cordage','rigging'],58,'process-material-hemp-rope'),
    'item-material-hemp-hawser': item('item-material-hemp-hawser','Heavy Hemp Hawser',['fiber','hemp','rope','hawser','heavy-rigging'],86,'process-material-hemp-hawser'),
    'item-material-hemp-canvas': item('item-material-hemp-canvas','Hemp Canvas',['fiber','hemp','canvas','textile','sailcloth','tarpaulin'],64,'process-material-hemp-canvas'),
    'item-material-hemp-net-webbing': item('item-material-hemp-net-webbing','Knotted Hemp Net Webbing',['fiber','hemp','netting','fishing','cargo','component'],54,'craft-material-hemp-net-webbing'),
    'item-material-flax-lamp-wick': item('item-material-flax-lamp-wick','Braided Flax Lamp Wick',['fiber','flax','wick','lighting','component'],20,'craft-material-flax-lamp-wick'),
    'item-material-nettle-thread': item('item-material-nettle-thread','Starfen Nettle Thread',['fiber','bast','nettle','thread','textile','netting'],24,'process-material-nettle-thread'),

    'item-material-quicklime': item('item-material-quicklime','Slatewater Quicklime',['mineral','lime','masonry','mortar','glass','industrial'],26,'process-material-quicklime'),
    'item-material-whetstone': item('item-material-whetstone','Slatewater Whetstone',['stone','abrasive','sharpening','maintenance','tool'],30,'craft-material-whetstone'),
    'item-material-alum-mordant': item('item-material-alum-mordant','Refined Alum Mordant',['mineral','alum','mordant','dye','tanning','industrial'],28,'process-material-alum-mordant'),
    'item-material-wood-ash-potash': item('item-material-wood-ash-potash','Wood-Ash Potash',['ash','alkali','glass','soap','dye','industrial'],24,'process-material-wood-ash-potash'),
    'item-material-clear-glass-batch': item('item-material-clear-glass-batch','Clear Glass Batch',['glass','silica','batch','industrial','fine-craft'],58,'process-material-clear-glass-batch'),
    'item-material-pine-tar': item('item-material-pine-tar','Slatewater Pine Tar',['resin','tar','sealant','rigging','woodwork','industrial'],34,'process-material-pine-tar'),
    'item-material-hide-glue': item('item-material-hide-glue','Hide Glue',['glue','adhesive','woodwork','bookbinding','component'],38,'process-material-hide-glue'),
});

export function getMaterialFoundationProductionItem(id) {
    const entry = DEFINITIONS[String(id ?? '').trim()] ?? null;
    return entry ? normalizeItem(entry) : null;
}
export function listMaterialFoundationProductionItems() {
    return Object.values(DEFINITIONS).map((entry) => normalizeItem(entry));
}
export function validateMaterialFoundationProductionItems() {
    const issues = [];
    const ids = new Set();
    for (const entry of listMaterialFoundationProductionItems()) {
        if (ids.has(entry.id)) issues.push(`Duplicate material-foundation production item ${entry.id}.`);
        ids.add(entry.id);
        for (const issue of validateItemConsumption(entry)) issues.push(`${entry.id} ${issue}`);
    }
    return issues;
}

function item(id, name, tags, valueGil, sourceId, options = {}) {
    const kind = options.kind ?? ITEM_KINDS.MATERIAL;
    const sinks = options.sinks ?? ['craftIngredient','processInput','construction','repair','trade'];
    return Object.freeze({
        id,
        name,
        kind,
        quantity: 1,
        maxStack: kind === ITEM_KINDS.EQUIPMENT ? 1 : 99,
        valueGil,
        tags: Object.freeze([...tags]),
        consumption: options.consumption ?? null,
        provenance: Object.freeze([Object.freeze({
            type: 'crafting',
            sourceId,
            placeId: null,
            action: sourceId.startsWith('cook-') ? 'craft' : sourceId.startsWith('craft-') ? 'craft' : 'process',
            data: Object.freeze({ catalogVersion: MATERIAL_FOUNDATION_PRODUCTION_ITEM_VERSION }),
        })]),
        sinks: Object.freeze(sinks.map((type) => Object.freeze({ type, data: Object.freeze({}) }))),
        equipmentSlot: null,
        allowedSlots: Object.freeze([]),
        requirements: Object.freeze({ minLevel: 1, allowedJobs: [], allowedRaces: [] }),
        flags: Object.freeze([]),
        modifiers: Object.freeze({}),
        metadata: Object.freeze({
            confidence: 'intentionalSimplification',
            source: 'Hearth & Horizon material foundations',
            notes: 'Reusable shared stock or component intended to connect multiple professions before finished occupational tools are authored.',
        }),
    });
}
