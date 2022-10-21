import LedgerIdentity from "./index";

class USBLedgerIdentity extends LedgerIdentity {
    static async fromJSON(json: string): Promise<USBLedgerIdentity> {
        const TransportClass = (await import('@ledgerhq/hw-transport-webhid')).default;

        return super.fromJSON(json, TransportClass)
    }
}

export default USBLedgerIdentity