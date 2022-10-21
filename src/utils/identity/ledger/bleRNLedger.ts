import LedgerIdentity from "./index";

class BluetoothRNLedgerIdentity extends LedgerIdentity {
    //TODO: make further implementation for bluetooth connection support in mobile app
    static async fromJSON(json: string): Promise<BluetoothRNLedgerIdentity> {
        const TransportClass = (await import('@ledgerhq/react-native-hw-transport-ble')).default;

        return super.fromJSON(json, TransportClass)
    }
}

export default BluetoothRNLedgerIdentity