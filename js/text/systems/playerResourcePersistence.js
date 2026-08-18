export function validatePersistedPlayerResources(resources) {
    if (!isObject(resources)) return ['resources must be an object.'];

    const issues = [];
    for (const key of ['hp', 'mp', 'tp']) {
        if (!Number.isInteger(resources[key]) || resources[key] < 0) {
            issues.push(`resources.${key} must be a non-negative integer.`);
        }
    }
    return issues;
}

function isObject(value) {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}
