import { SignIdentity } from '@dfinity/agent';
import { JsonnableKeyPair } from './../../interfaces/identity'


export abstract class GenericSignIdentity extends SignIdentity {
   /**
    * Serialize this key to JSON.
    */
    abstract toJSON(): JsonnableKeyPair;

   /**
    *  Return private key in a pem file
    */
    abstract getPem(): string;
}
