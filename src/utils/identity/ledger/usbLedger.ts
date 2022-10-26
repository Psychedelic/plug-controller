import LedgerIdentity from "./index";

class USBLedgerIdentity extends LedgerIdentity {
    static async create(path: string): Promise<USBLedgerIdentity> {
        const TransportClass = (await import('@ledgerhq/hw-transport-webhid')).default;

        return super.create(path, TransportClass)
    }

    static async fromJSON(json: string): Promise<USBLedgerIdentity> {
        const TransportClass = (await import('@ledgerhq/hw-transport-webhid')).default;

        return super.fromJSON(json, TransportClass)
    }
}

export default USBLedgerIdentity