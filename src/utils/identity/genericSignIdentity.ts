import { SignIdentity } from '@dfinity/agent';


export abstract class GenericSignIdentity extends SignIdentity {
   /**
    * Serialize this key to JSON.
    */
    abstract toJSON(): string;

   /**
    *  Return private key in a pem file
    */
    abstract getPem(): string;
}
