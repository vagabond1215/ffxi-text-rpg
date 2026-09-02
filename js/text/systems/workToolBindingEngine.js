export const WORK_TOOL_BINDING_ENGINE_VERSION = 1;

export function findActiveWorkToolBinding(state, itemId, options = {}) {
    const expectedItemId = String(itemId ?? '').trim();
    if (!expectedItemId) return null;
    const sourceType = options.sourceType ? String(options.sourceType) : null;
    const sourceId = options.sourceId ? String(options.sourceId) : null;

    for (const record of state?.work?.records ?? []) {
        if (record?.status !== 'active') continue;
        for (const binding of record?.data?.toolBindings ?? []) {
            if (binding?.itemId !== expectedItemId) continue;
            if (sourceType && binding.sourceType !== sourceType) continue;
            if (sourceId && binding.sourceId !== sourceId) continue;
            return {
                workId: record.id,
                workLabel: record.label,
                binding,
            };
        }
    }
    return null;
}

export function describeActiveWorkToolBinding(state, itemId, options = {}) {
    const match = findActiveWorkToolBinding(state, itemId, options);
    if (!match) return '';
    const itemName = match.binding.itemName ?? itemId;
    return `${itemName} is in use by ${match.workLabel}.`;
}
