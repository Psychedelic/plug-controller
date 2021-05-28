export * from './api';
export * from './http';
export * from './proxy';
export function getDefaultAgent() {
    const agent = typeof window === 'undefined'
        ? typeof global === 'undefined'
            ? typeof self === 'undefined'
                ? undefined
                : self.ic.agent
            : global.ic.agent
        : window.ic.agent;
    if (!agent) {
        throw new Error('No Agent could be found.');
    }
    return agent;
}
//# sourceMappingURL=index.js.map