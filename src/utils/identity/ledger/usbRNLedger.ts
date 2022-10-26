import LedgerIdentity from "./index";

class USBRNLedgerIdentity extends LedgerIdentity {
    //TODO: make further implementation for usb connection support in mobile app
    // static async fromJSON(json: string): Promise<USBRNLedgerIdentity> {
    //     const TransportClass = (await import('@ledgerhq/react-native-hid')).default;

    //     return super.fromJSON(json, TransportClass)
    // }
}

export default USBRNLedgerIdentity