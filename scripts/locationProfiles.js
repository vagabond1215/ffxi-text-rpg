import {
    describeLocationProfileCatalog,
    listLocationProfiles,
    listRegionProfiles,
    listSettlementProfiles,
    validateLocationProfileCatalog,
} from '../js/text/data/locationProfileCatalog.js';

const issues = validateLocationProfileCatalog();
if (issues.length) {
    console.error('Location profile validation failed:');
    for (const issue of issues) console.error(`- ${issue}`);
    process.exitCode = 1;
} else if (process.argv.includes('--json')) {
    console.log(JSON.stringify({
        locations: listLocationProfiles(),
        settlements: listSettlementProfiles(),
        regions: listRegionProfiles(),
    }, null, 2));
} else {
    console.log(describeLocationProfileCatalog());
}
