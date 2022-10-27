import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace ic_base_types. */
export namespace ic_base_types {

    /** Namespace pb. */
    namespace pb {

        /** Namespace v1. */
        namespace v1 {

            /** Properties of a PrincipalId. */
            interface IPrincipalId {

                /** PrincipalId serializedId */
                serializedId?: (Uint8Array|null);
            }

            /** Represents a PrincipalId. */
            class PrincipalId implements IPrincipalId {

                /**
                 * Constructs a new PrincipalId.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: ic_base_types.pb.v1.IPrincipalId);

                /** PrincipalId serializedId. */
                public serializedId: Uint8Array;

                /**
                 * Creates a new PrincipalId instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns PrincipalId instance
                 */
                public static create(properties?: ic_base_types.pb.v1.IPrincipalId): ic_base_types.pb.v1.PrincipalId;

                /**
                 * Encodes the specified PrincipalId message. Does not implicitly {@link ic_base_types.pb.v1.PrincipalId.verify|verify} messages.
                 * @param message PrincipalId message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: ic_base_types.pb.v1.IPrincipalId, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified PrincipalId message, length delimited. Does not implicitly {@link ic_base_types.pb.v1.PrincipalId.verify|verify} messages.
                 * @param message PrincipalId message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: ic_base_types.pb.v1.IPrincipalId, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a PrincipalId message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns PrincipalId
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ic_base_types.pb.v1.PrincipalId;

                /**
                 * Decodes a PrincipalId message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns PrincipalId
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ic_base_types.pb.v1.PrincipalId;

                /**
                 * Verifies a PrincipalId message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a PrincipalId message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns PrincipalId
                 */
                public static fromObject(object: { [k: string]: any }): ic_base_types.pb.v1.PrincipalId;

                /**
                 * Creates a plain object from a PrincipalId message. Also converts values to other types if specified.
                 * @param message PrincipalId
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: ic_base_types.pb.v1.PrincipalId, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this PrincipalId to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for PrincipalId
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a CanisterId. */
            interface ICanisterId {

                /** CanisterId serializedId */
                serializedId?: (Uint8Array|null);
            }

            /** Represents a CanisterId. */
            class CanisterId implements ICanisterId {

                /**
                 * Constructs a new CanisterId.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: ic_base_types.pb.v1.ICanisterId);

                /** CanisterId serializedId. */
                public serializedId: Uint8Array;

                /**
                 * Creates a new CanisterId instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns CanisterId instance
                 */
                public static create(properties?: ic_base_types.pb.v1.ICanisterId): ic_base_types.pb.v1.CanisterId;

                /**
                 * Encodes the specified CanisterId message. Does not implicitly {@link ic_base_types.pb.v1.CanisterId.verify|verify} messages.
                 * @param message CanisterId message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: ic_base_types.pb.v1.ICanisterId, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified CanisterId message, length delimited. Does not implicitly {@link ic_base_types.pb.v1.CanisterId.verify|verify} messages.
                 * @param message CanisterId message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: ic_base_types.pb.v1.ICanisterId, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a CanisterId message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns CanisterId
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ic_base_types.pb.v1.CanisterId;

                /**
                 * Decodes a CanisterId message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns CanisterId
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ic_base_types.pb.v1.CanisterId;

                /**
                 * Verifies a CanisterId message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a CanisterId message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns CanisterId
                 */
                public static fromObject(object: { [k: string]: any }): ic_base_types.pb.v1.CanisterId;

                /**
                 * Creates a plain object from a CanisterId message. Also converts values to other types if specified.
                 * @param message CanisterId
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: ic_base_types.pb.v1.CanisterId, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this CanisterId to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for CanisterId
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a NeuronId. */
            interface INeuronId {

                /** NeuronId id */
                id?: (number|Long|null);
            }

            /** Represents a NeuronId. */
            class NeuronId implements INeuronId {

                /**
                 * Constructs a new NeuronId.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: ic_base_types.pb.v1.INeuronId);

                /** NeuronId id. */
                public id: (number|Long);

                /**
                 * Creates a new NeuronId instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns NeuronId instance
                 */
                public static create(properties?: ic_base_types.pb.v1.INeuronId): ic_base_types.pb.v1.NeuronId;

                /**
                 * Encodes the specified NeuronId message. Does not implicitly {@link ic_base_types.pb.v1.NeuronId.verify|verify} messages.
                 * @param message NeuronId message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: ic_base_types.pb.v1.INeuronId, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified NeuronId message, length delimited. Does not implicitly {@link ic_base_types.pb.v1.NeuronId.verify|verify} messages.
                 * @param message NeuronId message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: ic_base_types.pb.v1.INeuronId, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a NeuronId message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns NeuronId
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ic_base_types.pb.v1.NeuronId;

                /**
                 * Decodes a NeuronId message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns NeuronId
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ic_base_types.pb.v1.NeuronId;

                /**
                 * Verifies a NeuronId message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a NeuronId message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns NeuronId
                 */
                public static fromObject(object: { [k: string]: any }): ic_base_types.pb.v1.NeuronId;

                /**
                 * Creates a plain object from a NeuronId message. Also converts values to other types if specified.
                 * @param message NeuronId
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: ic_base_types.pb.v1.NeuronId, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this NeuronId to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for NeuronId
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a ProposalId. */
            interface IProposalId {

                /** ProposalId id */
                id?: (number|Long|null);
            }

            /** Represents a ProposalId. */
            class ProposalId implements IProposalId {

                /**
                 * Constructs a new ProposalId.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: ic_base_types.pb.v1.IProposalId);

                /** ProposalId id. */
                public id: (number|Long);

                /**
                 * Creates a new ProposalId instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ProposalId instance
                 */
                public static create(properties?: ic_base_types.pb.v1.IProposalId): ic_base_types.pb.v1.ProposalId;

                /**
                 * Encodes the specified ProposalId message. Does not implicitly {@link ic_base_types.pb.v1.ProposalId.verify|verify} messages.
                 * @param message ProposalId message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: ic_base_types.pb.v1.IProposalId, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ProposalId message, length delimited. Does not implicitly {@link ic_base_types.pb.v1.ProposalId.verify|verify} messages.
                 * @param message ProposalId message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: ic_base_types.pb.v1.IProposalId, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ProposalId message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ProposalId
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ic_base_types.pb.v1.ProposalId;

                /**
                 * Decodes a ProposalId message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ProposalId
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ic_base_types.pb.v1.ProposalId;

                /**
                 * Verifies a ProposalId message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ProposalId message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ProposalId
                 */
                public static fromObject(object: { [k: string]: any }): ic_base_types.pb.v1.ProposalId;

                /**
                 * Creates a plain object from a ProposalId message. Also converts values to other types if specified.
                 * @param message ProposalId
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: ic_base_types.pb.v1.ProposalId, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ProposalId to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for ProposalId
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a MethodAuthzInfo. */
            interface IMethodAuthzInfo {

                /** MethodAuthzInfo methodName */
                methodName?: (string|null);

                /** MethodAuthzInfo principalIds */
                principalIds?: (Uint8Array[]|null);
            }

            /** Represents a MethodAuthzInfo. */
            class MethodAuthzInfo implements IMethodAuthzInfo {

                /**
                 * Constructs a new MethodAuthzInfo.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: ic_base_types.pb.v1.IMethodAuthzInfo);

                /** MethodAuthzInfo methodName. */
                public methodName: string;

                /** MethodAuthzInfo principalIds. */
                public principalIds: Uint8Array[];

                /**
                 * Creates a new MethodAuthzInfo instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns MethodAuthzInfo instance
                 */
                public static create(properties?: ic_base_types.pb.v1.IMethodAuthzInfo): ic_base_types.pb.v1.MethodAuthzInfo;

                /**
                 * Encodes the specified MethodAuthzInfo message. Does not implicitly {@link ic_base_types.pb.v1.MethodAuthzInfo.verify|verify} messages.
                 * @param message MethodAuthzInfo message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: ic_base_types.pb.v1.IMethodAuthzInfo, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified MethodAuthzInfo message, length delimited. Does not implicitly {@link ic_base_types.pb.v1.MethodAuthzInfo.verify|verify} messages.
                 * @param message MethodAuthzInfo message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: ic_base_types.pb.v1.IMethodAuthzInfo, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a MethodAuthzInfo message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns MethodAuthzInfo
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ic_base_types.pb.v1.MethodAuthzInfo;

                /**
                 * Decodes a MethodAuthzInfo message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns MethodAuthzInfo
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ic_base_types.pb.v1.MethodAuthzInfo;

                /**
                 * Verifies a MethodAuthzInfo message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a MethodAuthzInfo message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns MethodAuthzInfo
                 */
                public static fromObject(object: { [k: string]: any }): ic_base_types.pb.v1.MethodAuthzInfo;

                /**
                 * Creates a plain object from a MethodAuthzInfo message. Also converts values to other types if specified.
                 * @param message MethodAuthzInfo
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: ic_base_types.pb.v1.MethodAuthzInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this MethodAuthzInfo to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for MethodAuthzInfo
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a CanisterAuthzInfo. */
            interface ICanisterAuthzInfo {

                /** CanisterAuthzInfo methodsAuthz */
                methodsAuthz?: (ic_base_types.pb.v1.IMethodAuthzInfo[]|null);
            }

            /** Represents a CanisterAuthzInfo. */
            class CanisterAuthzInfo implements ICanisterAuthzInfo {

                /**
                 * Constructs a new CanisterAuthzInfo.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: ic_base_types.pb.v1.ICanisterAuthzInfo);

                /** CanisterAuthzInfo methodsAuthz. */
                public methodsAuthz: ic_base_types.pb.v1.IMethodAuthzInfo[];

                /**
                 * Creates a new CanisterAuthzInfo instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns CanisterAuthzInfo instance
                 */
                public static create(properties?: ic_base_types.pb.v1.ICanisterAuthzInfo): ic_base_types.pb.v1.CanisterAuthzInfo;

                /**
                 * Encodes the specified CanisterAuthzInfo message. Does not implicitly {@link ic_base_types.pb.v1.CanisterAuthzInfo.verify|verify} messages.
                 * @param message CanisterAuthzInfo message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: ic_base_types.pb.v1.ICanisterAuthzInfo, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified CanisterAuthzInfo message, length delimited. Does not implicitly {@link ic_base_types.pb.v1.CanisterAuthzInfo.verify|verify} messages.
                 * @param message CanisterAuthzInfo message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: ic_base_types.pb.v1.ICanisterAuthzInfo, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a CanisterAuthzInfo message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns CanisterAuthzInfo
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ic_base_types.pb.v1.CanisterAuthzInfo;

                /**
                 * Decodes a CanisterAuthzInfo message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns CanisterAuthzInfo
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ic_base_types.pb.v1.CanisterAuthzInfo;

                /**
                 * Verifies a CanisterAuthzInfo message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a CanisterAuthzInfo message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns CanisterAuthzInfo
                 */
                public static fromObject(object: { [k: string]: any }): ic_base_types.pb.v1.CanisterAuthzInfo;

                /**
                 * Creates a plain object from a CanisterAuthzInfo message. Also converts values to other types if specified.
                 * @param message CanisterAuthzInfo
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: ic_base_types.pb.v1.CanisterAuthzInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this CanisterAuthzInfo to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for CanisterAuthzInfo
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }
    }
}

/** Namespace google. */
export namespace google {

    /** Namespace protobuf. */
    namespace protobuf {

        /** Properties of a FileDescriptorSet. */
        interface IFileDescriptorSet {

            /** FileDescriptorSet file */
            file?: (google.protobuf.IFileDescriptorProto[]|null);
        }

        /** Represents a FileDescriptorSet. */
        class FileDescriptorSet implements IFileDescriptorSet {

            /**
             * Constructs a new FileDescriptorSet.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IFileDescriptorSet);

            /** FileDescriptorSet file. */
            public file: google.protobuf.IFileDescriptorProto[];

            /**
             * Creates a new FileDescriptorSet instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FileDescriptorSet instance
             */
            public static create(properties?: google.protobuf.IFileDescriptorSet): google.protobuf.FileDescriptorSet;

            /**
             * Encodes the specified FileDescriptorSet message. Does not implicitly {@link google.protobuf.FileDescriptorSet.verify|verify} messages.
             * @param message FileDescriptorSet message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IFileDescriptorSet, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FileDescriptorSet message, length delimited. Does not implicitly {@link google.protobuf.FileDescriptorSet.verify|verify} messages.
             * @param message FileDescriptorSet message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IFileDescriptorSet, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FileDescriptorSet message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FileDescriptorSet
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.FileDescriptorSet;

            /**
             * Decodes a FileDescriptorSet message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FileDescriptorSet
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.FileDescriptorSet;

            /**
             * Verifies a FileDescriptorSet message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a FileDescriptorSet message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FileDescriptorSet
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.FileDescriptorSet;

            /**
             * Creates a plain object from a FileDescriptorSet message. Also converts values to other types if specified.
             * @param message FileDescriptorSet
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.FileDescriptorSet, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this FileDescriptorSet to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for FileDescriptorSet
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a FileDescriptorProto. */
        interface IFileDescriptorProto {

            /** FileDescriptorProto name */
            name?: (string|null);

            /** FileDescriptorProto package */
            "package"?: (string|null);

            /** FileDescriptorProto dependency */
            dependency?: (string[]|null);

            /** FileDescriptorProto publicDependency */
            publicDependency?: (number[]|null);

            /** FileDescriptorProto weakDependency */
            weakDependency?: (number[]|null);

            /** FileDescriptorProto messageType */
            messageType?: (google.protobuf.IDescriptorProto[]|null);

            /** FileDescriptorProto enumType */
            enumType?: (google.protobuf.IEnumDescriptorProto[]|null);

            /** FileDescriptorProto service */
            service?: (google.protobuf.IServiceDescriptorProto[]|null);

            /** FileDescriptorProto extension */
            extension?: (google.protobuf.IFieldDescriptorProto[]|null);

            /** FileDescriptorProto options */
            options?: (google.protobuf.IFileOptions|null);

            /** FileDescriptorProto sourceCodeInfo */
            sourceCodeInfo?: (google.protobuf.ISourceCodeInfo|null);

            /** FileDescriptorProto syntax */
            syntax?: (string|null);

            /** FileDescriptorProto edition */
            edition?: (string|null);
        }

        /** Represents a FileDescriptorProto. */
        class FileDescriptorProto implements IFileDescriptorProto {

            /**
             * Constructs a new FileDescriptorProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IFileDescriptorProto);

            /** FileDescriptorProto name. */
            public name: string;

            /** FileDescriptorProto package. */
            public package: string;

            /** FileDescriptorProto dependency. */
            public dependency: string[];

            /** FileDescriptorProto publicDependency. */
            public publicDependency: number[];

            /** FileDescriptorProto weakDependency. */
            public weakDependency: number[];

            /** FileDescriptorProto messageType. */
            public messageType: google.protobuf.IDescriptorProto[];

            /** FileDescriptorProto enumType. */
            public enumType: google.protobuf.IEnumDescriptorProto[];

            /** FileDescriptorProto service. */
            public service: google.protobuf.IServiceDescriptorProto[];

            /** FileDescriptorProto extension. */
            public extension: google.protobuf.IFieldDescriptorProto[];

            /** FileDescriptorProto options. */
            public options?: (google.protobuf.IFileOptions|null);

            /** FileDescriptorProto sourceCodeInfo. */
            public sourceCodeInfo?: (google.protobuf.ISourceCodeInfo|null);

            /** FileDescriptorProto syntax. */
            public syntax: string;

            /** FileDescriptorProto edition. */
            public edition: string;

            /**
             * Creates a new FileDescriptorProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FileDescriptorProto instance
             */
            public static create(properties?: google.protobuf.IFileDescriptorProto): google.protobuf.FileDescriptorProto;

            /**
             * Encodes the specified FileDescriptorProto message. Does not implicitly {@link google.protobuf.FileDescriptorProto.verify|verify} messages.
             * @param message FileDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IFileDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FileDescriptorProto message, length delimited. Does not implicitly {@link google.protobuf.FileDescriptorProto.verify|verify} messages.
             * @param message FileDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IFileDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FileDescriptorProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FileDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.FileDescriptorProto;

            /**
             * Decodes a FileDescriptorProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FileDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.FileDescriptorProto;

            /**
             * Verifies a FileDescriptorProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a FileDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FileDescriptorProto
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.FileDescriptorProto;

            /**
             * Creates a plain object from a FileDescriptorProto message. Also converts values to other types if specified.
             * @param message FileDescriptorProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.FileDescriptorProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this FileDescriptorProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for FileDescriptorProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a DescriptorProto. */
        interface IDescriptorProto {

            /** DescriptorProto name */
            name?: (string|null);

            /** DescriptorProto field */
            field?: (google.protobuf.IFieldDescriptorProto[]|null);

            /** DescriptorProto extension */
            extension?: (google.protobuf.IFieldDescriptorProto[]|null);

            /** DescriptorProto nestedType */
            nestedType?: (google.protobuf.IDescriptorProto[]|null);

            /** DescriptorProto enumType */
            enumType?: (google.protobuf.IEnumDescriptorProto[]|null);

            /** DescriptorProto extensionRange */
            extensionRange?: (google.protobuf.DescriptorProto.IExtensionRange[]|null);

            /** DescriptorProto oneofDecl */
            oneofDecl?: (google.protobuf.IOneofDescriptorProto[]|null);

            /** DescriptorProto options */
            options?: (google.protobuf.IMessageOptions|null);

            /** DescriptorProto reservedRange */
            reservedRange?: (google.protobuf.DescriptorProto.IReservedRange[]|null);

            /** DescriptorProto reservedName */
            reservedName?: (string[]|null);
        }

        /** Represents a DescriptorProto. */
        class DescriptorProto implements IDescriptorProto {

            /**
             * Constructs a new DescriptorProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IDescriptorProto);

            /** DescriptorProto name. */
            public name: string;

            /** DescriptorProto field. */
            public field: google.protobuf.IFieldDescriptorProto[];

            /** DescriptorProto extension. */
            public extension: google.protobuf.IFieldDescriptorProto[];

            /** DescriptorProto nestedType. */
            public nestedType: google.protobuf.IDescriptorProto[];

            /** DescriptorProto enumType. */
            public enumType: google.protobuf.IEnumDescriptorProto[];

            /** DescriptorProto extensionRange. */
            public extensionRange: google.protobuf.DescriptorProto.IExtensionRange[];

            /** DescriptorProto oneofDecl. */
            public oneofDecl: google.protobuf.IOneofDescriptorProto[];

            /** DescriptorProto options. */
            public options?: (google.protobuf.IMessageOptions|null);

            /** DescriptorProto reservedRange. */
            public reservedRange: google.protobuf.DescriptorProto.IReservedRange[];

            /** DescriptorProto reservedName. */
            public reservedName: string[];

            /**
             * Creates a new DescriptorProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns DescriptorProto instance
             */
            public static create(properties?: google.protobuf.IDescriptorProto): google.protobuf.DescriptorProto;

            /**
             * Encodes the specified DescriptorProto message. Does not implicitly {@link google.protobuf.DescriptorProto.verify|verify} messages.
             * @param message DescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified DescriptorProto message, length delimited. Does not implicitly {@link google.protobuf.DescriptorProto.verify|verify} messages.
             * @param message DescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DescriptorProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns DescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.DescriptorProto;

            /**
             * Decodes a DescriptorProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns DescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.DescriptorProto;

            /**
             * Verifies a DescriptorProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a DescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns DescriptorProto
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.DescriptorProto;

            /**
             * Creates a plain object from a DescriptorProto message. Also converts values to other types if specified.
             * @param message DescriptorProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.DescriptorProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this DescriptorProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for DescriptorProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace DescriptorProto {

            /** Properties of an ExtensionRange. */
            interface IExtensionRange {

                /** ExtensionRange start */
                start?: (number|null);

                /** ExtensionRange end */
                end?: (number|null);

                /** ExtensionRange options */
                options?: (google.protobuf.IExtensionRangeOptions|null);
            }

            /** Represents an ExtensionRange. */
            class ExtensionRange implements IExtensionRange {

                /**
                 * Constructs a new ExtensionRange.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.protobuf.DescriptorProto.IExtensionRange);

                /** ExtensionRange start. */
                public start: number;

                /** ExtensionRange end. */
                public end: number;

                /** ExtensionRange options. */
                public options?: (google.protobuf.IExtensionRangeOptions|null);

                /**
                 * Creates a new ExtensionRange instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ExtensionRange instance
                 */
                public static create(properties?: google.protobuf.DescriptorProto.IExtensionRange): google.protobuf.DescriptorProto.ExtensionRange;

                /**
                 * Encodes the specified ExtensionRange message. Does not implicitly {@link google.protobuf.DescriptorProto.ExtensionRange.verify|verify} messages.
                 * @param message ExtensionRange message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.protobuf.DescriptorProto.IExtensionRange, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ExtensionRange message, length delimited. Does not implicitly {@link google.protobuf.DescriptorProto.ExtensionRange.verify|verify} messages.
                 * @param message ExtensionRange message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.protobuf.DescriptorProto.IExtensionRange, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an ExtensionRange message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ExtensionRange
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.DescriptorProto.ExtensionRange;

                /**
                 * Decodes an ExtensionRange message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ExtensionRange
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.DescriptorProto.ExtensionRange;

                /**
                 * Verifies an ExtensionRange message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an ExtensionRange message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ExtensionRange
                 */
                public static fromObject(object: { [k: string]: any }): google.protobuf.DescriptorProto.ExtensionRange;

                /**
                 * Creates a plain object from an ExtensionRange message. Also converts values to other types if specified.
                 * @param message ExtensionRange
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.protobuf.DescriptorProto.ExtensionRange, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ExtensionRange to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for ExtensionRange
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a ReservedRange. */
            interface IReservedRange {

                /** ReservedRange start */
                start?: (number|null);

                /** ReservedRange end */
                end?: (number|null);
            }

            /** Represents a ReservedRange. */
            class ReservedRange implements IReservedRange {

                /**
                 * Constructs a new ReservedRange.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.protobuf.DescriptorProto.IReservedRange);

                /** ReservedRange start. */
                public start: number;

                /** ReservedRange end. */
                public end: number;

                /**
                 * Creates a new ReservedRange instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ReservedRange instance
                 */
                public static create(properties?: google.protobuf.DescriptorProto.IReservedRange): google.protobuf.DescriptorProto.ReservedRange;

                /**
                 * Encodes the specified ReservedRange message. Does not implicitly {@link google.protobuf.DescriptorProto.ReservedRange.verify|verify} messages.
                 * @param message ReservedRange message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.protobuf.DescriptorProto.IReservedRange, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ReservedRange message, length delimited. Does not implicitly {@link google.protobuf.DescriptorProto.ReservedRange.verify|verify} messages.
                 * @param message ReservedRange message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.protobuf.DescriptorProto.IReservedRange, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ReservedRange message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ReservedRange
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.DescriptorProto.ReservedRange;

                /**
                 * Decodes a ReservedRange message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ReservedRange
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.DescriptorProto.ReservedRange;

                /**
                 * Verifies a ReservedRange message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ReservedRange message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ReservedRange
                 */
                public static fromObject(object: { [k: string]: any }): google.protobuf.DescriptorProto.ReservedRange;

                /**
                 * Creates a plain object from a ReservedRange message. Also converts values to other types if specified.
                 * @param message ReservedRange
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.protobuf.DescriptorProto.ReservedRange, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ReservedRange to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for ReservedRange
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }

        /** Properties of an ExtensionRangeOptions. */
        interface IExtensionRangeOptions {

            /** ExtensionRangeOptions uninterpretedOption */
            uninterpretedOption?: (google.protobuf.IUninterpretedOption[]|null);
        }

        /** Represents an ExtensionRangeOptions. */
        class ExtensionRangeOptions implements IExtensionRangeOptions {

            /**
             * Constructs a new ExtensionRangeOptions.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IExtensionRangeOptions);

            /** ExtensionRangeOptions uninterpretedOption. */
            public uninterpretedOption: google.protobuf.IUninterpretedOption[];

            /**
             * Creates a new ExtensionRangeOptions instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ExtensionRangeOptions instance
             */
            public static create(properties?: google.protobuf.IExtensionRangeOptions): google.protobuf.ExtensionRangeOptions;

            /**
             * Encodes the specified ExtensionRangeOptions message. Does not implicitly {@link google.protobuf.ExtensionRangeOptions.verify|verify} messages.
             * @param message ExtensionRangeOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IExtensionRangeOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ExtensionRangeOptions message, length delimited. Does not implicitly {@link google.protobuf.ExtensionRangeOptions.verify|verify} messages.
             * @param message ExtensionRangeOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IExtensionRangeOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an ExtensionRangeOptions message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ExtensionRangeOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.ExtensionRangeOptions;

            /**
             * Decodes an ExtensionRangeOptions message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ExtensionRangeOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.ExtensionRangeOptions;

            /**
             * Verifies an ExtensionRangeOptions message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an ExtensionRangeOptions message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ExtensionRangeOptions
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.ExtensionRangeOptions;

            /**
             * Creates a plain object from an ExtensionRangeOptions message. Also converts values to other types if specified.
             * @param message ExtensionRangeOptions
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.ExtensionRangeOptions, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ExtensionRangeOptions to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ExtensionRangeOptions
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a FieldDescriptorProto. */
        interface IFieldDescriptorProto {

            /** FieldDescriptorProto name */
            name?: (string|null);

            /** FieldDescriptorProto number */
            number?: (number|null);

            /** FieldDescriptorProto label */
            label?: (google.protobuf.FieldDescriptorProto.Label|null);

            /** FieldDescriptorProto type */
            type?: (google.protobuf.FieldDescriptorProto.Type|null);

            /** FieldDescriptorProto typeName */
            typeName?: (string|null);

            /** FieldDescriptorProto extendee */
            extendee?: (string|null);

            /** FieldDescriptorProto defaultValue */
            defaultValue?: (string|null);

            /** FieldDescriptorProto oneofIndex */
            oneofIndex?: (number|null);

            /** FieldDescriptorProto jsonName */
            jsonName?: (string|null);

            /** FieldDescriptorProto options */
            options?: (google.protobuf.IFieldOptions|null);

            /** FieldDescriptorProto proto3Optional */
            proto3Optional?: (boolean|null);
        }

        /** Represents a FieldDescriptorProto. */
        class FieldDescriptorProto implements IFieldDescriptorProto {

            /**
             * Constructs a new FieldDescriptorProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IFieldDescriptorProto);

            /** FieldDescriptorProto name. */
            public name: string;

            /** FieldDescriptorProto number. */
            public number: number;

            /** FieldDescriptorProto label. */
            public label: google.protobuf.FieldDescriptorProto.Label;

            /** FieldDescriptorProto type. */
            public type: google.protobuf.FieldDescriptorProto.Type;

            /** FieldDescriptorProto typeName. */
            public typeName: string;

            /** FieldDescriptorProto extendee. */
            public extendee: string;

            /** FieldDescriptorProto defaultValue. */
            public defaultValue: string;

            /** FieldDescriptorProto oneofIndex. */
            public oneofIndex: number;

            /** FieldDescriptorProto jsonName. */
            public jsonName: string;

            /** FieldDescriptorProto options. */
            public options?: (google.protobuf.IFieldOptions|null);

            /** FieldDescriptorProto proto3Optional. */
            public proto3Optional: boolean;

            /**
             * Creates a new FieldDescriptorProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FieldDescriptorProto instance
             */
            public static create(properties?: google.protobuf.IFieldDescriptorProto): google.protobuf.FieldDescriptorProto;

            /**
             * Encodes the specified FieldDescriptorProto message. Does not implicitly {@link google.protobuf.FieldDescriptorProto.verify|verify} messages.
             * @param message FieldDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IFieldDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FieldDescriptorProto message, length delimited. Does not implicitly {@link google.protobuf.FieldDescriptorProto.verify|verify} messages.
             * @param message FieldDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IFieldDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FieldDescriptorProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FieldDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.FieldDescriptorProto;

            /**
             * Decodes a FieldDescriptorProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FieldDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.FieldDescriptorProto;

            /**
             * Verifies a FieldDescriptorProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a FieldDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FieldDescriptorProto
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.FieldDescriptorProto;

            /**
             * Creates a plain object from a FieldDescriptorProto message. Also converts values to other types if specified.
             * @param message FieldDescriptorProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.FieldDescriptorProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this FieldDescriptorProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for FieldDescriptorProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace FieldDescriptorProto {

            /** Type enum. */
            enum Type {
                TYPE_DOUBLE = 1,
                TYPE_FLOAT = 2,
                TYPE_INT64 = 3,
                TYPE_UINT64 = 4,
                TYPE_INT32 = 5,
                TYPE_FIXED64 = 6,
                TYPE_FIXED32 = 7,
                TYPE_BOOL = 8,
                TYPE_STRING = 9,
                TYPE_GROUP = 10,
                TYPE_MESSAGE = 11,
                TYPE_BYTES = 12,
                TYPE_UINT32 = 13,
                TYPE_ENUM = 14,
                TYPE_SFIXED32 = 15,
                TYPE_SFIXED64 = 16,
                TYPE_SINT32 = 17,
                TYPE_SINT64 = 18
            }

            /** Label enum. */
            enum Label {
                LABEL_OPTIONAL = 1,
                LABEL_REQUIRED = 2,
                LABEL_REPEATED = 3
            }
        }

        /** Properties of an OneofDescriptorProto. */
        interface IOneofDescriptorProto {

            /** OneofDescriptorProto name */
            name?: (string|null);

            /** OneofDescriptorProto options */
            options?: (google.protobuf.IOneofOptions|null);
        }

        /** Represents an OneofDescriptorProto. */
        class OneofDescriptorProto implements IOneofDescriptorProto {

            /**
             * Constructs a new OneofDescriptorProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IOneofDescriptorProto);

            /** OneofDescriptorProto name. */
            public name: string;

            /** OneofDescriptorProto options. */
            public options?: (google.protobuf.IOneofOptions|null);

            /**
             * Creates a new OneofDescriptorProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns OneofDescriptorProto instance
             */
            public static create(properties?: google.protobuf.IOneofDescriptorProto): google.protobuf.OneofDescriptorProto;

            /**
             * Encodes the specified OneofDescriptorProto message. Does not implicitly {@link google.protobuf.OneofDescriptorProto.verify|verify} messages.
             * @param message OneofDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IOneofDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified OneofDescriptorProto message, length delimited. Does not implicitly {@link google.protobuf.OneofDescriptorProto.verify|verify} messages.
             * @param message OneofDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IOneofDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an OneofDescriptorProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns OneofDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.OneofDescriptorProto;

            /**
             * Decodes an OneofDescriptorProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns OneofDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.OneofDescriptorProto;

            /**
             * Verifies an OneofDescriptorProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an OneofDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns OneofDescriptorProto
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.OneofDescriptorProto;

            /**
             * Creates a plain object from an OneofDescriptorProto message. Also converts values to other types if specified.
             * @param message OneofDescriptorProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.OneofDescriptorProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this OneofDescriptorProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for OneofDescriptorProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an EnumDescriptorProto. */
        interface IEnumDescriptorProto {

            /** EnumDescriptorProto name */
            name?: (string|null);

            /** EnumDescriptorProto value */
            value?: (google.protobuf.IEnumValueDescriptorProto[]|null);

            /** EnumDescriptorProto options */
            options?: (google.protobuf.IEnumOptions|null);

            /** EnumDescriptorProto reservedRange */
            reservedRange?: (google.protobuf.EnumDescriptorProto.IEnumReservedRange[]|null);

            /** EnumDescriptorProto reservedName */
            reservedName?: (string[]|null);
        }

        /** Represents an EnumDescriptorProto. */
        class EnumDescriptorProto implements IEnumDescriptorProto {

            /**
             * Constructs a new EnumDescriptorProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IEnumDescriptorProto);

            /** EnumDescriptorProto name. */
            public name: string;

            /** EnumDescriptorProto value. */
            public value: google.protobuf.IEnumValueDescriptorProto[];

            /** EnumDescriptorProto options. */
            public options?: (google.protobuf.IEnumOptions|null);

            /** EnumDescriptorProto reservedRange. */
            public reservedRange: google.protobuf.EnumDescriptorProto.IEnumReservedRange[];

            /** EnumDescriptorProto reservedName. */
            public reservedName: string[];

            /**
             * Creates a new EnumDescriptorProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EnumDescriptorProto instance
             */
            public static create(properties?: google.protobuf.IEnumDescriptorProto): google.protobuf.EnumDescriptorProto;

            /**
             * Encodes the specified EnumDescriptorProto message. Does not implicitly {@link google.protobuf.EnumDescriptorProto.verify|verify} messages.
             * @param message EnumDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IEnumDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EnumDescriptorProto message, length delimited. Does not implicitly {@link google.protobuf.EnumDescriptorProto.verify|verify} messages.
             * @param message EnumDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IEnumDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EnumDescriptorProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns EnumDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.EnumDescriptorProto;

            /**
             * Decodes an EnumDescriptorProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns EnumDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.EnumDescriptorProto;

            /**
             * Verifies an EnumDescriptorProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an EnumDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns EnumDescriptorProto
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.EnumDescriptorProto;

            /**
             * Creates a plain object from an EnumDescriptorProto message. Also converts values to other types if specified.
             * @param message EnumDescriptorProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.EnumDescriptorProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EnumDescriptorProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for EnumDescriptorProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace EnumDescriptorProto {

            /** Properties of an EnumReservedRange. */
            interface IEnumReservedRange {

                /** EnumReservedRange start */
                start?: (number|null);

                /** EnumReservedRange end */
                end?: (number|null);
            }

            /** Represents an EnumReservedRange. */
            class EnumReservedRange implements IEnumReservedRange {

                /**
                 * Constructs a new EnumReservedRange.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.protobuf.EnumDescriptorProto.IEnumReservedRange);

                /** EnumReservedRange start. */
                public start: number;

                /** EnumReservedRange end. */
                public end: number;

                /**
                 * Creates a new EnumReservedRange instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns EnumReservedRange instance
                 */
                public static create(properties?: google.protobuf.EnumDescriptorProto.IEnumReservedRange): google.protobuf.EnumDescriptorProto.EnumReservedRange;

                /**
                 * Encodes the specified EnumReservedRange message. Does not implicitly {@link google.protobuf.EnumDescriptorProto.EnumReservedRange.verify|verify} messages.
                 * @param message EnumReservedRange message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.protobuf.EnumDescriptorProto.IEnumReservedRange, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified EnumReservedRange message, length delimited. Does not implicitly {@link google.protobuf.EnumDescriptorProto.EnumReservedRange.verify|verify} messages.
                 * @param message EnumReservedRange message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.protobuf.EnumDescriptorProto.IEnumReservedRange, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an EnumReservedRange message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns EnumReservedRange
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.EnumDescriptorProto.EnumReservedRange;

                /**
                 * Decodes an EnumReservedRange message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns EnumReservedRange
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.EnumDescriptorProto.EnumReservedRange;

                /**
                 * Verifies an EnumReservedRange message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an EnumReservedRange message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns EnumReservedRange
                 */
                public static fromObject(object: { [k: string]: any }): google.protobuf.EnumDescriptorProto.EnumReservedRange;

                /**
                 * Creates a plain object from an EnumReservedRange message. Also converts values to other types if specified.
                 * @param message EnumReservedRange
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.protobuf.EnumDescriptorProto.EnumReservedRange, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this EnumReservedRange to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for EnumReservedRange
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }

        /** Properties of an EnumValueDescriptorProto. */
        interface IEnumValueDescriptorProto {

            /** EnumValueDescriptorProto name */
            name?: (string|null);

            /** EnumValueDescriptorProto number */
            number?: (number|null);

            /** EnumValueDescriptorProto options */
            options?: (google.protobuf.IEnumValueOptions|null);
        }

        /** Represents an EnumValueDescriptorProto. */
        class EnumValueDescriptorProto implements IEnumValueDescriptorProto {

            /**
             * Constructs a new EnumValueDescriptorProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IEnumValueDescriptorProto);

            /** EnumValueDescriptorProto name. */
            public name: string;

            /** EnumValueDescriptorProto number. */
            public number: number;

            /** EnumValueDescriptorProto options. */
            public options?: (google.protobuf.IEnumValueOptions|null);

            /**
             * Creates a new EnumValueDescriptorProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EnumValueDescriptorProto instance
             */
            public static create(properties?: google.protobuf.IEnumValueDescriptorProto): google.protobuf.EnumValueDescriptorProto;

            /**
             * Encodes the specified EnumValueDescriptorProto message. Does not implicitly {@link google.protobuf.EnumValueDescriptorProto.verify|verify} messages.
             * @param message EnumValueDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IEnumValueDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EnumValueDescriptorProto message, length delimited. Does not implicitly {@link google.protobuf.EnumValueDescriptorProto.verify|verify} messages.
             * @param message EnumValueDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IEnumValueDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EnumValueDescriptorProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns EnumValueDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.EnumValueDescriptorProto;

            /**
             * Decodes an EnumValueDescriptorProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns EnumValueDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.EnumValueDescriptorProto;

            /**
             * Verifies an EnumValueDescriptorProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an EnumValueDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns EnumValueDescriptorProto
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.EnumValueDescriptorProto;

            /**
             * Creates a plain object from an EnumValueDescriptorProto message. Also converts values to other types if specified.
             * @param message EnumValueDescriptorProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.EnumValueDescriptorProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EnumValueDescriptorProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for EnumValueDescriptorProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a ServiceDescriptorProto. */
        interface IServiceDescriptorProto {

            /** ServiceDescriptorProto name */
            name?: (string|null);

            /** ServiceDescriptorProto method */
            method?: (google.protobuf.IMethodDescriptorProto[]|null);

            /** ServiceDescriptorProto options */
            options?: (google.protobuf.IServiceOptions|null);
        }

        /** Represents a ServiceDescriptorProto. */
        class ServiceDescriptorProto implements IServiceDescriptorProto {

            /**
             * Constructs a new ServiceDescriptorProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IServiceDescriptorProto);

            /** ServiceDescriptorProto name. */
            public name: string;

            /** ServiceDescriptorProto method. */
            public method: google.protobuf.IMethodDescriptorProto[];

            /** ServiceDescriptorProto options. */
            public options?: (google.protobuf.IServiceOptions|null);

            /**
             * Creates a new ServiceDescriptorProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ServiceDescriptorProto instance
             */
            public static create(properties?: google.protobuf.IServiceDescriptorProto): google.protobuf.ServiceDescriptorProto;

            /**
             * Encodes the specified ServiceDescriptorProto message. Does not implicitly {@link google.protobuf.ServiceDescriptorProto.verify|verify} messages.
             * @param message ServiceDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IServiceDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ServiceDescriptorProto message, length delimited. Does not implicitly {@link google.protobuf.ServiceDescriptorProto.verify|verify} messages.
             * @param message ServiceDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IServiceDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ServiceDescriptorProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ServiceDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.ServiceDescriptorProto;

            /**
             * Decodes a ServiceDescriptorProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ServiceDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.ServiceDescriptorProto;

            /**
             * Verifies a ServiceDescriptorProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ServiceDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ServiceDescriptorProto
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.ServiceDescriptorProto;

            /**
             * Creates a plain object from a ServiceDescriptorProto message. Also converts values to other types if specified.
             * @param message ServiceDescriptorProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.ServiceDescriptorProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ServiceDescriptorProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ServiceDescriptorProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a MethodDescriptorProto. */
        interface IMethodDescriptorProto {

            /** MethodDescriptorProto name */
            name?: (string|null);

            /** MethodDescriptorProto inputType */
            inputType?: (string|null);

            /** MethodDescriptorProto outputType */
            outputType?: (string|null);

            /** MethodDescriptorProto options */
            options?: (google.protobuf.IMethodOptions|null);

            /** MethodDescriptorProto clientStreaming */
            clientStreaming?: (boolean|null);

            /** MethodDescriptorProto serverStreaming */
            serverStreaming?: (boolean|null);
        }

        /** Represents a MethodDescriptorProto. */
        class MethodDescriptorProto implements IMethodDescriptorProto {

            /**
             * Constructs a new MethodDescriptorProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IMethodDescriptorProto);

            /** MethodDescriptorProto name. */
            public name: string;

            /** MethodDescriptorProto inputType. */
            public inputType: string;

            /** MethodDescriptorProto outputType. */
            public outputType: string;

            /** MethodDescriptorProto options. */
            public options?: (google.protobuf.IMethodOptions|null);

            /** MethodDescriptorProto clientStreaming. */
            public clientStreaming: boolean;

            /** MethodDescriptorProto serverStreaming. */
            public serverStreaming: boolean;

            /**
             * Creates a new MethodDescriptorProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns MethodDescriptorProto instance
             */
            public static create(properties?: google.protobuf.IMethodDescriptorProto): google.protobuf.MethodDescriptorProto;

            /**
             * Encodes the specified MethodDescriptorProto message. Does not implicitly {@link google.protobuf.MethodDescriptorProto.verify|verify} messages.
             * @param message MethodDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IMethodDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified MethodDescriptorProto message, length delimited. Does not implicitly {@link google.protobuf.MethodDescriptorProto.verify|verify} messages.
             * @param message MethodDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IMethodDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a MethodDescriptorProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns MethodDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.MethodDescriptorProto;

            /**
             * Decodes a MethodDescriptorProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns MethodDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.MethodDescriptorProto;

            /**
             * Verifies a MethodDescriptorProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a MethodDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns MethodDescriptorProto
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.MethodDescriptorProto;

            /**
             * Creates a plain object from a MethodDescriptorProto message. Also converts values to other types if specified.
             * @param message MethodDescriptorProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.MethodDescriptorProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this MethodDescriptorProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for MethodDescriptorProto
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a FileOptions. */
        interface IFileOptions {

            /** FileOptions javaPackage */
            javaPackage?: (string|null);

            /** FileOptions javaOuterClassname */
            javaOuterClassname?: (string|null);

            /** FileOptions javaMultipleFiles */
            javaMultipleFiles?: (boolean|null);

            /** FileOptions javaGenerateEqualsAndHash */
            javaGenerateEqualsAndHash?: (boolean|null);

            /** FileOptions javaStringCheckUtf8 */
            javaStringCheckUtf8?: (boolean|null);

            /** FileOptions optimizeFor */
            optimizeFor?: (google.protobuf.FileOptions.OptimizeMode|null);

            /** FileOptions goPackage */
            goPackage?: (string|null);

            /** FileOptions ccGenericServices */
            ccGenericServices?: (boolean|null);

            /** FileOptions javaGenericServices */
            javaGenericServices?: (boolean|null);

            /** FileOptions pyGenericServices */
            pyGenericServices?: (boolean|null);

            /** FileOptions phpGenericServices */
            phpGenericServices?: (boolean|null);

            /** FileOptions deprecated */
            deprecated?: (boolean|null);

            /** FileOptions ccEnableArenas */
            ccEnableArenas?: (boolean|null);

            /** FileOptions objcClassPrefix */
            objcClassPrefix?: (string|null);

            /** FileOptions csharpNamespace */
            csharpNamespace?: (string|null);

            /** FileOptions swiftPrefix */
            swiftPrefix?: (string|null);

            /** FileOptions phpClassPrefix */
            phpClassPrefix?: (string|null);

            /** FileOptions phpNamespace */
            phpNamespace?: (string|null);

            /** FileOptions phpMetadataNamespace */
            phpMetadataNamespace?: (string|null);

            /** FileOptions rubyPackage */
            rubyPackage?: (string|null);

            /** FileOptions uninterpretedOption */
            uninterpretedOption?: (google.protobuf.IUninterpretedOption[]|null);
        }

        /** Represents a FileOptions. */
        class FileOptions implements IFileOptions {

            /**
             * Constructs a new FileOptions.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IFileOptions);

            /** FileOptions javaPackage. */
            public javaPackage: string;

            /** FileOptions javaOuterClassname. */
            public javaOuterClassname: string;

            /** FileOptions javaMultipleFiles. */
            public javaMultipleFiles: boolean;

            /** FileOptions javaGenerateEqualsAndHash. */
            public javaGenerateEqualsAndHash: boolean;

            /** FileOptions javaStringCheckUtf8. */
            public javaStringCheckUtf8: boolean;

            /** FileOptions optimizeFor. */
            public optimizeFor: google.protobuf.FileOptions.OptimizeMode;

            /** FileOptions goPackage. */
            public goPackage: string;

            /** FileOptions ccGenericServices. */
            public ccGenericServices: boolean;

            /** FileOptions javaGenericServices. */
            public javaGenericServices: boolean;

            /** FileOptions pyGenericServices. */
            public pyGenericServices: boolean;

            /** FileOptions phpGenericServices. */
            public phpGenericServices: boolean;

            /** FileOptions deprecated. */
            public deprecated: boolean;

            /** FileOptions ccEnableArenas. */
            public ccEnableArenas: boolean;

            /** FileOptions objcClassPrefix. */
            public objcClassPrefix: string;

            /** FileOptions csharpNamespace. */
            public csharpNamespace: string;

            /** FileOptions swiftPrefix. */
            public swiftPrefix: string;

            /** FileOptions phpClassPrefix. */
            public phpClassPrefix: string;

            /** FileOptions phpNamespace. */
            public phpNamespace: string;

            /** FileOptions phpMetadataNamespace. */
            public phpMetadataNamespace: string;

            /** FileOptions rubyPackage. */
            public rubyPackage: string;

            /** FileOptions uninterpretedOption. */
            public uninterpretedOption: google.protobuf.IUninterpretedOption[];

            /**
             * Creates a new FileOptions instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FileOptions instance
             */
            public static create(properties?: google.protobuf.IFileOptions): google.protobuf.FileOptions;

            /**
             * Encodes the specified FileOptions message. Does not implicitly {@link google.protobuf.FileOptions.verify|verify} messages.
             * @param message FileOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IFileOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FileOptions message, length delimited. Does not implicitly {@link google.protobuf.FileOptions.verify|verify} messages.
             * @param message FileOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IFileOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FileOptions message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FileOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.FileOptions;

            /**
             * Decodes a FileOptions message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FileOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.FileOptions;

            /**
             * Verifies a FileOptions message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a FileOptions message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FileOptions
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.FileOptions;

            /**
             * Creates a plain object from a FileOptions message. Also converts values to other types if specified.
             * @param message FileOptions
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.FileOptions, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this FileOptions to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for FileOptions
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace FileOptions {

            /** OptimizeMode enum. */
            enum OptimizeMode {
                SPEED = 1,
                CODE_SIZE = 2,
                LITE_RUNTIME = 3
            }
        }

        /** Properties of a MessageOptions. */
        interface IMessageOptions {

            /** MessageOptions messageSetWireFormat */
            messageSetWireFormat?: (boolean|null);

            /** MessageOptions noStandardDescriptorAccessor */
            noStandardDescriptorAccessor?: (boolean|null);

            /** MessageOptions deprecated */
            deprecated?: (boolean|null);

            /** MessageOptions mapEntry */
            mapEntry?: (boolean|null);

            /** MessageOptions uninterpretedOption */
            uninterpretedOption?: (google.protobuf.IUninterpretedOption[]|null);

            /** MessageOptions .ic_base_types.pb.v1.tuiSignedMessage */
            ".ic_base_types.pb.v1.tuiSignedMessage"?: (boolean|null);
        }

        /** Represents a MessageOptions. */
        class MessageOptions implements IMessageOptions {

            /**
             * Constructs a new MessageOptions.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IMessageOptions);

            /** MessageOptions messageSetWireFormat. */
            public messageSetWireFormat: boolean;

            /** MessageOptions noStandardDescriptorAccessor. */
            public noStandardDescriptorAccessor: boolean;

            /** MessageOptions deprecated. */
            public deprecated: boolean;

            /** MessageOptions mapEntry. */
            public mapEntry: boolean;

            /** MessageOptions uninterpretedOption. */
            public uninterpretedOption: google.protobuf.IUninterpretedOption[];

            /**
             * Creates a new MessageOptions instance using the specified properties.
             * @param [properties] Properties to set
             * @returns MessageOptions instance
             */
            public static create(properties?: google.protobuf.IMessageOptions): google.protobuf.MessageOptions;

            /**
             * Encodes the specified MessageOptions message. Does not implicitly {@link google.protobuf.MessageOptions.verify|verify} messages.
             * @param message MessageOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IMessageOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified MessageOptions message, length delimited. Does not implicitly {@link google.protobuf.MessageOptions.verify|verify} messages.
             * @param message MessageOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IMessageOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a MessageOptions message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns MessageOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.MessageOptions;

            /**
             * Decodes a MessageOptions message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns MessageOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.MessageOptions;

            /**
             * Verifies a MessageOptions message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a MessageOptions message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns MessageOptions
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.MessageOptions;

            /**
             * Creates a plain object from a MessageOptions message. Also converts values to other types if specified.
             * @param message MessageOptions
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.MessageOptions, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this MessageOptions to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for MessageOptions
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a FieldOptions. */
        interface IFieldOptions {

            /** FieldOptions ctype */
            ctype?: (google.protobuf.FieldOptions.CType|null);

            /** FieldOptions packed */
            packed?: (boolean|null);

            /** FieldOptions jstype */
            jstype?: (google.protobuf.FieldOptions.JSType|null);

            /** FieldOptions lazy */
            lazy?: (boolean|null);

            /** FieldOptions unverifiedLazy */
            unverifiedLazy?: (boolean|null);

            /** FieldOptions deprecated */
            deprecated?: (boolean|null);

            /** FieldOptions weak */
            weak?: (boolean|null);

            /** FieldOptions uninterpretedOption */
            uninterpretedOption?: (google.protobuf.IUninterpretedOption[]|null);

            /** FieldOptions .ic_base_types.pb.v1.tuiSignedDisplayQ2_2021 */
            ".ic_base_types.pb.v1.tuiSignedDisplayQ2_2021"?: (boolean|null);
        }

        /** Represents a FieldOptions. */
        class FieldOptions implements IFieldOptions {

            /**
             * Constructs a new FieldOptions.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IFieldOptions);

            /** FieldOptions ctype. */
            public ctype: google.protobuf.FieldOptions.CType;

            /** FieldOptions packed. */
            public packed: boolean;

            /** FieldOptions jstype. */
            public jstype: google.protobuf.FieldOptions.JSType;

            /** FieldOptions lazy. */
            public lazy: boolean;

            /** FieldOptions unverifiedLazy. */
            public unverifiedLazy: boolean;

            /** FieldOptions deprecated. */
            public deprecated: boolean;

            /** FieldOptions weak. */
            public weak: boolean;

            /** FieldOptions uninterpretedOption. */
            public uninterpretedOption: google.protobuf.IUninterpretedOption[];

            /**
             * Creates a new FieldOptions instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FieldOptions instance
             */
            public static create(properties?: google.protobuf.IFieldOptions): google.protobuf.FieldOptions;

            /**
             * Encodes the specified FieldOptions message. Does not implicitly {@link google.protobuf.FieldOptions.verify|verify} messages.
             * @param message FieldOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IFieldOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FieldOptions message, length delimited. Does not implicitly {@link google.protobuf.FieldOptions.verify|verify} messages.
             * @param message FieldOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IFieldOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FieldOptions message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FieldOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.FieldOptions;

            /**
             * Decodes a FieldOptions message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FieldOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.FieldOptions;

            /**
             * Verifies a FieldOptions message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a FieldOptions message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FieldOptions
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.FieldOptions;

            /**
             * Creates a plain object from a FieldOptions message. Also converts values to other types if specified.
             * @param message FieldOptions
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.FieldOptions, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this FieldOptions to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for FieldOptions
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace FieldOptions {

            /** CType enum. */
            enum CType {
                STRING = 0,
                CORD = 1,
                STRING_PIECE = 2
            }

            /** JSType enum. */
            enum JSType {
                JS_NORMAL = 0,
                JS_STRING = 1,
                JS_NUMBER = 2
            }
        }

        /** Properties of an OneofOptions. */
        interface IOneofOptions {

            /** OneofOptions uninterpretedOption */
            uninterpretedOption?: (google.protobuf.IUninterpretedOption[]|null);
        }

        /** Represents an OneofOptions. */
        class OneofOptions implements IOneofOptions {

            /**
             * Constructs a new OneofOptions.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IOneofOptions);

            /** OneofOptions uninterpretedOption. */
            public uninterpretedOption: google.protobuf.IUninterpretedOption[];

            /**
             * Creates a new OneofOptions instance using the specified properties.
             * @param [properties] Properties to set
             * @returns OneofOptions instance
             */
            public static create(properties?: google.protobuf.IOneofOptions): google.protobuf.OneofOptions;

            /**
             * Encodes the specified OneofOptions message. Does not implicitly {@link google.protobuf.OneofOptions.verify|verify} messages.
             * @param message OneofOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IOneofOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified OneofOptions message, length delimited. Does not implicitly {@link google.protobuf.OneofOptions.verify|verify} messages.
             * @param message OneofOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IOneofOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an OneofOptions message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns OneofOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.OneofOptions;

            /**
             * Decodes an OneofOptions message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns OneofOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.OneofOptions;

            /**
             * Verifies an OneofOptions message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an OneofOptions message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns OneofOptions
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.OneofOptions;

            /**
             * Creates a plain object from an OneofOptions message. Also converts values to other types if specified.
             * @param message OneofOptions
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.OneofOptions, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this OneofOptions to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for OneofOptions
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an EnumOptions. */
        interface IEnumOptions {

            /** EnumOptions allowAlias */
            allowAlias?: (boolean|null);

            /** EnumOptions deprecated */
            deprecated?: (boolean|null);

            /** EnumOptions uninterpretedOption */
            uninterpretedOption?: (google.protobuf.IUninterpretedOption[]|null);
        }

        /** Represents an EnumOptions. */
        class EnumOptions implements IEnumOptions {

            /**
             * Constructs a new EnumOptions.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IEnumOptions);

            /** EnumOptions allowAlias. */
            public allowAlias: boolean;

            /** EnumOptions deprecated. */
            public deprecated: boolean;

            /** EnumOptions uninterpretedOption. */
            public uninterpretedOption: google.protobuf.IUninterpretedOption[];

            /**
             * Creates a new EnumOptions instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EnumOptions instance
             */
            public static create(properties?: google.protobuf.IEnumOptions): google.protobuf.EnumOptions;

            /**
             * Encodes the specified EnumOptions message. Does not implicitly {@link google.protobuf.EnumOptions.verify|verify} messages.
             * @param message EnumOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IEnumOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EnumOptions message, length delimited. Does not implicitly {@link google.protobuf.EnumOptions.verify|verify} messages.
             * @param message EnumOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IEnumOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EnumOptions message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns EnumOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.EnumOptions;

            /**
             * Decodes an EnumOptions message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns EnumOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.EnumOptions;

            /**
             * Verifies an EnumOptions message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an EnumOptions message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns EnumOptions
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.EnumOptions;

            /**
             * Creates a plain object from an EnumOptions message. Also converts values to other types if specified.
             * @param message EnumOptions
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.EnumOptions, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EnumOptions to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for EnumOptions
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an EnumValueOptions. */
        interface IEnumValueOptions {

            /** EnumValueOptions deprecated */
            deprecated?: (boolean|null);

            /** EnumValueOptions uninterpretedOption */
            uninterpretedOption?: (google.protobuf.IUninterpretedOption[]|null);
        }

        /** Represents an EnumValueOptions. */
        class EnumValueOptions implements IEnumValueOptions {

            /**
             * Constructs a new EnumValueOptions.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IEnumValueOptions);

            /** EnumValueOptions deprecated. */
            public deprecated: boolean;

            /** EnumValueOptions uninterpretedOption. */
            public uninterpretedOption: google.protobuf.IUninterpretedOption[];

            /**
             * Creates a new EnumValueOptions instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EnumValueOptions instance
             */
            public static create(properties?: google.protobuf.IEnumValueOptions): google.protobuf.EnumValueOptions;

            /**
             * Encodes the specified EnumValueOptions message. Does not implicitly {@link google.protobuf.EnumValueOptions.verify|verify} messages.
             * @param message EnumValueOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IEnumValueOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EnumValueOptions message, length delimited. Does not implicitly {@link google.protobuf.EnumValueOptions.verify|verify} messages.
             * @param message EnumValueOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IEnumValueOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EnumValueOptions message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns EnumValueOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.EnumValueOptions;

            /**
             * Decodes an EnumValueOptions message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns EnumValueOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.EnumValueOptions;

            /**
             * Verifies an EnumValueOptions message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an EnumValueOptions message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns EnumValueOptions
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.EnumValueOptions;

            /**
             * Creates a plain object from an EnumValueOptions message. Also converts values to other types if specified.
             * @param message EnumValueOptions
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.EnumValueOptions, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EnumValueOptions to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for EnumValueOptions
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a ServiceOptions. */
        interface IServiceOptions {

            /** ServiceOptions deprecated */
            deprecated?: (boolean|null);

            /** ServiceOptions uninterpretedOption */
            uninterpretedOption?: (google.protobuf.IUninterpretedOption[]|null);
        }

        /** Represents a ServiceOptions. */
        class ServiceOptions implements IServiceOptions {

            /**
             * Constructs a new ServiceOptions.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IServiceOptions);

            /** ServiceOptions deprecated. */
            public deprecated: boolean;

            /** ServiceOptions uninterpretedOption. */
            public uninterpretedOption: google.protobuf.IUninterpretedOption[];

            /**
             * Creates a new ServiceOptions instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ServiceOptions instance
             */
            public static create(properties?: google.protobuf.IServiceOptions): google.protobuf.ServiceOptions;

            /**
             * Encodes the specified ServiceOptions message. Does not implicitly {@link google.protobuf.ServiceOptions.verify|verify} messages.
             * @param message ServiceOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IServiceOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ServiceOptions message, length delimited. Does not implicitly {@link google.protobuf.ServiceOptions.verify|verify} messages.
             * @param message ServiceOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IServiceOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ServiceOptions message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ServiceOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.ServiceOptions;

            /**
             * Decodes a ServiceOptions message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ServiceOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.ServiceOptions;

            /**
             * Verifies a ServiceOptions message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ServiceOptions message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ServiceOptions
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.ServiceOptions;

            /**
             * Creates a plain object from a ServiceOptions message. Also converts values to other types if specified.
             * @param message ServiceOptions
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.ServiceOptions, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ServiceOptions to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ServiceOptions
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a MethodOptions. */
        interface IMethodOptions {

            /** MethodOptions deprecated */
            deprecated?: (boolean|null);

            /** MethodOptions idempotencyLevel */
            idempotencyLevel?: (google.protobuf.MethodOptions.IdempotencyLevel|null);

            /** MethodOptions uninterpretedOption */
            uninterpretedOption?: (google.protobuf.IUninterpretedOption[]|null);
        }

        /** Represents a MethodOptions. */
        class MethodOptions implements IMethodOptions {

            /**
             * Constructs a new MethodOptions.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IMethodOptions);

            /** MethodOptions deprecated. */
            public deprecated: boolean;

            /** MethodOptions idempotencyLevel. */
            public idempotencyLevel: google.protobuf.MethodOptions.IdempotencyLevel;

            /** MethodOptions uninterpretedOption. */
            public uninterpretedOption: google.protobuf.IUninterpretedOption[];

            /**
             * Creates a new MethodOptions instance using the specified properties.
             * @param [properties] Properties to set
             * @returns MethodOptions instance
             */
            public static create(properties?: google.protobuf.IMethodOptions): google.protobuf.MethodOptions;

            /**
             * Encodes the specified MethodOptions message. Does not implicitly {@link google.protobuf.MethodOptions.verify|verify} messages.
             * @param message MethodOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IMethodOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified MethodOptions message, length delimited. Does not implicitly {@link google.protobuf.MethodOptions.verify|verify} messages.
             * @param message MethodOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IMethodOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a MethodOptions message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns MethodOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.MethodOptions;

            /**
             * Decodes a MethodOptions message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns MethodOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.MethodOptions;

            /**
             * Verifies a MethodOptions message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a MethodOptions message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns MethodOptions
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.MethodOptions;

            /**
             * Creates a plain object from a MethodOptions message. Also converts values to other types if specified.
             * @param message MethodOptions
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.MethodOptions, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this MethodOptions to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for MethodOptions
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace MethodOptions {

            /** IdempotencyLevel enum. */
            enum IdempotencyLevel {
                IDEMPOTENCY_UNKNOWN = 0,
                NO_SIDE_EFFECTS = 1,
                IDEMPOTENT = 2
            }
        }

        /** Properties of an UninterpretedOption. */
        interface IUninterpretedOption {

            /** UninterpretedOption name */
            name?: (google.protobuf.UninterpretedOption.INamePart[]|null);

            /** UninterpretedOption identifierValue */
            identifierValue?: (string|null);

            /** UninterpretedOption positiveIntValue */
            positiveIntValue?: (number|Long|null);

            /** UninterpretedOption negativeIntValue */
            negativeIntValue?: (number|Long|null);

            /** UninterpretedOption doubleValue */
            doubleValue?: (number|null);

            /** UninterpretedOption stringValue */
            stringValue?: (Uint8Array|null);

            /** UninterpretedOption aggregateValue */
            aggregateValue?: (string|null);
        }

        /** Represents an UninterpretedOption. */
        class UninterpretedOption implements IUninterpretedOption {

            /**
             * Constructs a new UninterpretedOption.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IUninterpretedOption);

            /** UninterpretedOption name. */
            public name: google.protobuf.UninterpretedOption.INamePart[];

            /** UninterpretedOption identifierValue. */
            public identifierValue: string;

            /** UninterpretedOption positiveIntValue. */
            public positiveIntValue: (number|Long);

            /** UninterpretedOption negativeIntValue. */
            public negativeIntValue: (number|Long);

            /** UninterpretedOption doubleValue. */
            public doubleValue: number;

            /** UninterpretedOption stringValue. */
            public stringValue: Uint8Array;

            /** UninterpretedOption aggregateValue. */
            public aggregateValue: string;

            /**
             * Creates a new UninterpretedOption instance using the specified properties.
             * @param [properties] Properties to set
             * @returns UninterpretedOption instance
             */
            public static create(properties?: google.protobuf.IUninterpretedOption): google.protobuf.UninterpretedOption;

            /**
             * Encodes the specified UninterpretedOption message. Does not implicitly {@link google.protobuf.UninterpretedOption.verify|verify} messages.
             * @param message UninterpretedOption message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IUninterpretedOption, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified UninterpretedOption message, length delimited. Does not implicitly {@link google.protobuf.UninterpretedOption.verify|verify} messages.
             * @param message UninterpretedOption message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IUninterpretedOption, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an UninterpretedOption message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns UninterpretedOption
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.UninterpretedOption;

            /**
             * Decodes an UninterpretedOption message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns UninterpretedOption
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.UninterpretedOption;

            /**
             * Verifies an UninterpretedOption message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an UninterpretedOption message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns UninterpretedOption
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.UninterpretedOption;

            /**
             * Creates a plain object from an UninterpretedOption message. Also converts values to other types if specified.
             * @param message UninterpretedOption
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.UninterpretedOption, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this UninterpretedOption to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for UninterpretedOption
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace UninterpretedOption {

            /** Properties of a NamePart. */
            interface INamePart {

                /** NamePart namePart */
                namePart: string;

                /** NamePart isExtension */
                isExtension: boolean;
            }

            /** Represents a NamePart. */
            class NamePart implements INamePart {

                /**
                 * Constructs a new NamePart.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.protobuf.UninterpretedOption.INamePart);

                /** NamePart namePart. */
                public namePart: string;

                /** NamePart isExtension. */
                public isExtension: boolean;

                /**
                 * Creates a new NamePart instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns NamePart instance
                 */
                public static create(properties?: google.protobuf.UninterpretedOption.INamePart): google.protobuf.UninterpretedOption.NamePart;

                /**
                 * Encodes the specified NamePart message. Does not implicitly {@link google.protobuf.UninterpretedOption.NamePart.verify|verify} messages.
                 * @param message NamePart message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.protobuf.UninterpretedOption.INamePart, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified NamePart message, length delimited. Does not implicitly {@link google.protobuf.UninterpretedOption.NamePart.verify|verify} messages.
                 * @param message NamePart message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.protobuf.UninterpretedOption.INamePart, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a NamePart message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns NamePart
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.UninterpretedOption.NamePart;

                /**
                 * Decodes a NamePart message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns NamePart
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.UninterpretedOption.NamePart;

                /**
                 * Verifies a NamePart message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a NamePart message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns NamePart
                 */
                public static fromObject(object: { [k: string]: any }): google.protobuf.UninterpretedOption.NamePart;

                /**
                 * Creates a plain object from a NamePart message. Also converts values to other types if specified.
                 * @param message NamePart
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.protobuf.UninterpretedOption.NamePart, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this NamePart to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for NamePart
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }

        /** Properties of a SourceCodeInfo. */
        interface ISourceCodeInfo {

            /** SourceCodeInfo location */
            location?: (google.protobuf.SourceCodeInfo.ILocation[]|null);
        }

        /** Represents a SourceCodeInfo. */
        class SourceCodeInfo implements ISourceCodeInfo {

            /**
             * Constructs a new SourceCodeInfo.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.ISourceCodeInfo);

            /** SourceCodeInfo location. */
            public location: google.protobuf.SourceCodeInfo.ILocation[];

            /**
             * Creates a new SourceCodeInfo instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SourceCodeInfo instance
             */
            public static create(properties?: google.protobuf.ISourceCodeInfo): google.protobuf.SourceCodeInfo;

            /**
             * Encodes the specified SourceCodeInfo message. Does not implicitly {@link google.protobuf.SourceCodeInfo.verify|verify} messages.
             * @param message SourceCodeInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.ISourceCodeInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified SourceCodeInfo message, length delimited. Does not implicitly {@link google.protobuf.SourceCodeInfo.verify|verify} messages.
             * @param message SourceCodeInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.ISourceCodeInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SourceCodeInfo message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SourceCodeInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.SourceCodeInfo;

            /**
             * Decodes a SourceCodeInfo message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SourceCodeInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.SourceCodeInfo;

            /**
             * Verifies a SourceCodeInfo message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a SourceCodeInfo message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SourceCodeInfo
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.SourceCodeInfo;

            /**
             * Creates a plain object from a SourceCodeInfo message. Also converts values to other types if specified.
             * @param message SourceCodeInfo
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.SourceCodeInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SourceCodeInfo to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for SourceCodeInfo
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace SourceCodeInfo {

            /** Properties of a Location. */
            interface ILocation {

                /** Location path */
                path?: (number[]|null);

                /** Location span */
                span?: (number[]|null);

                /** Location leadingComments */
                leadingComments?: (string|null);

                /** Location trailingComments */
                trailingComments?: (string|null);

                /** Location leadingDetachedComments */
                leadingDetachedComments?: (string[]|null);
            }

            /** Represents a Location. */
            class Location implements ILocation {

                /**
                 * Constructs a new Location.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.protobuf.SourceCodeInfo.ILocation);

                /** Location path. */
                public path: number[];

                /** Location span. */
                public span: number[];

                /** Location leadingComments. */
                public leadingComments: string;

                /** Location trailingComments. */
                public trailingComments: string;

                /** Location leadingDetachedComments. */
                public leadingDetachedComments: string[];

                /**
                 * Creates a new Location instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Location instance
                 */
                public static create(properties?: google.protobuf.SourceCodeInfo.ILocation): google.protobuf.SourceCodeInfo.Location;

                /**
                 * Encodes the specified Location message. Does not implicitly {@link google.protobuf.SourceCodeInfo.Location.verify|verify} messages.
                 * @param message Location message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.protobuf.SourceCodeInfo.ILocation, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Location message, length delimited. Does not implicitly {@link google.protobuf.SourceCodeInfo.Location.verify|verify} messages.
                 * @param message Location message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.protobuf.SourceCodeInfo.ILocation, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Location message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Location
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.SourceCodeInfo.Location;

                /**
                 * Decodes a Location message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Location
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.SourceCodeInfo.Location;

                /**
                 * Verifies a Location message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Location message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Location
                 */
                public static fromObject(object: { [k: string]: any }): google.protobuf.SourceCodeInfo.Location;

                /**
                 * Creates a plain object from a Location message. Also converts values to other types if specified.
                 * @param message Location
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.protobuf.SourceCodeInfo.Location, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Location to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Location
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }

        /** Properties of a GeneratedCodeInfo. */
        interface IGeneratedCodeInfo {

            /** GeneratedCodeInfo annotation */
            annotation?: (google.protobuf.GeneratedCodeInfo.IAnnotation[]|null);
        }

        /** Represents a GeneratedCodeInfo. */
        class GeneratedCodeInfo implements IGeneratedCodeInfo {

            /**
             * Constructs a new GeneratedCodeInfo.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IGeneratedCodeInfo);

            /** GeneratedCodeInfo annotation. */
            public annotation: google.protobuf.GeneratedCodeInfo.IAnnotation[];

            /**
             * Creates a new GeneratedCodeInfo instance using the specified properties.
             * @param [properties] Properties to set
             * @returns GeneratedCodeInfo instance
             */
            public static create(properties?: google.protobuf.IGeneratedCodeInfo): google.protobuf.GeneratedCodeInfo;

            /**
             * Encodes the specified GeneratedCodeInfo message. Does not implicitly {@link google.protobuf.GeneratedCodeInfo.verify|verify} messages.
             * @param message GeneratedCodeInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IGeneratedCodeInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified GeneratedCodeInfo message, length delimited. Does not implicitly {@link google.protobuf.GeneratedCodeInfo.verify|verify} messages.
             * @param message GeneratedCodeInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IGeneratedCodeInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a GeneratedCodeInfo message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns GeneratedCodeInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.GeneratedCodeInfo;

            /**
             * Decodes a GeneratedCodeInfo message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns GeneratedCodeInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.GeneratedCodeInfo;

            /**
             * Verifies a GeneratedCodeInfo message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a GeneratedCodeInfo message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns GeneratedCodeInfo
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.GeneratedCodeInfo;

            /**
             * Creates a plain object from a GeneratedCodeInfo message. Also converts values to other types if specified.
             * @param message GeneratedCodeInfo
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.GeneratedCodeInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this GeneratedCodeInfo to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for GeneratedCodeInfo
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace GeneratedCodeInfo {

            /** Properties of an Annotation. */
            interface IAnnotation {

                /** Annotation path */
                path?: (number[]|null);

                /** Annotation sourceFile */
                sourceFile?: (string|null);

                /** Annotation begin */
                begin?: (number|null);

                /** Annotation end */
                end?: (number|null);

                /** Annotation semantic */
                semantic?: (google.protobuf.GeneratedCodeInfo.Annotation.Semantic|null);
            }

            /** Represents an Annotation. */
            class Annotation implements IAnnotation {

                /**
                 * Constructs a new Annotation.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.protobuf.GeneratedCodeInfo.IAnnotation);

                /** Annotation path. */
                public path: number[];

                /** Annotation sourceFile. */
                public sourceFile: string;

                /** Annotation begin. */
                public begin: number;

                /** Annotation end. */
                public end: number;

                /** Annotation semantic. */
                public semantic: google.protobuf.GeneratedCodeInfo.Annotation.Semantic;

                /**
                 * Creates a new Annotation instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Annotation instance
                 */
                public static create(properties?: google.protobuf.GeneratedCodeInfo.IAnnotation): google.protobuf.GeneratedCodeInfo.Annotation;

                /**
                 * Encodes the specified Annotation message. Does not implicitly {@link google.protobuf.GeneratedCodeInfo.Annotation.verify|verify} messages.
                 * @param message Annotation message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.protobuf.GeneratedCodeInfo.IAnnotation, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Annotation message, length delimited. Does not implicitly {@link google.protobuf.GeneratedCodeInfo.Annotation.verify|verify} messages.
                 * @param message Annotation message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.protobuf.GeneratedCodeInfo.IAnnotation, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an Annotation message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Annotation
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.GeneratedCodeInfo.Annotation;

                /**
                 * Decodes an Annotation message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Annotation
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.GeneratedCodeInfo.Annotation;

                /**
                 * Verifies an Annotation message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an Annotation message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Annotation
                 */
                public static fromObject(object: { [k: string]: any }): google.protobuf.GeneratedCodeInfo.Annotation;

                /**
                 * Creates a plain object from an Annotation message. Also converts values to other types if specified.
                 * @param message Annotation
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.protobuf.GeneratedCodeInfo.Annotation, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Annotation to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Annotation
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            namespace Annotation {

                /** Semantic enum. */
                enum Semantic {
                    NONE = 0,
                    SET = 1,
                    ALIAS = 2
                }
            }
        }
    }
}

/** Namespace ic_ledger. */
export namespace ic_ledger {

    /** Namespace pb. */
    namespace pb {

        /** Namespace v1. */
        namespace v1 {

            /** Properties of a SendRequest. */
            interface ISendRequest {

                /** SendRequest memo */
                memo?: (ic_ledger.pb.v1.IMemo|null);

                /** SendRequest payment */
                payment?: (ic_ledger.pb.v1.IPayment|null);

                /** SendRequest maxFee */
                maxFee?: (ic_ledger.pb.v1.IICPTs|null);

                /** SendRequest fromSubaccount */
                fromSubaccount?: (ic_ledger.pb.v1.ISubaccount|null);

                /** SendRequest to */
                to?: (ic_ledger.pb.v1.IAccountIdentifier|null);

                /** SendRequest createdAt */
                createdAt?: (ic_ledger.pb.v1.IBlockHeight|null);

                /** SendRequest createdAtTime */
                createdAtTime?: (ic_ledger.pb.v1.ITimeStamp|null);
            }

            /** Represents a SendRequest. */
            class SendRequest implements ISendRequest {

                /**
                 * Constructs a new SendRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: ic_ledger.pb.v1.ISendRequest);

                /** SendRequest memo. */
                public memo?: (ic_ledger.pb.v1.IMemo|null);

                /** SendRequest payment. */
                public payment?: (ic_ledger.pb.v1.IPayment|null);

                /** SendRequest maxFee. */
                public maxFee?: (ic_ledger.pb.v1.IICPTs|null);

                /** SendRequest fromSubaccount. */
                public fromSubaccount?: (ic_ledger.pb.v1.ISubaccount|null);

                /** SendRequest to. */
                public to?: (ic_ledger.pb.v1.IAccountIdentifier|null);

                /** SendRequest createdAt. */
                public createdAt?: (ic_ledger.pb.v1.IBlockHeight|null);

                /** SendRequest createdAtTime. */
                public createdAtTime?: (ic_ledger.pb.v1.ITimeStamp|null);

                /**
                 * Creates a new SendRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns SendRequest instance
                 */
                public static create(properties?: ic_ledger.pb.v1.ISendRequest): ic_ledger.pb.v1.SendRequest;

                /**
                 * Encodes the specified SendRequest message. Does not implicitly {@link ic_ledger.pb.v1.SendRequest.verify|verify} messages.
                 * @param message SendRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: ic_ledger.pb.v1.ISendRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified SendRequest message, length delimited. Does not implicitly {@link ic_ledger.pb.v1.SendRequest.verify|verify} messages.
                 * @param message SendRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: ic_ledger.pb.v1.ISendRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a SendRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns SendRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ic_ledger.pb.v1.SendRequest;

                /**
                 * Decodes a SendRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns SendRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ic_ledger.pb.v1.SendRequest;

                /**
                 * Verifies a SendRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a SendRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns SendRequest
                 */
                public static fromObject(object: { [k: string]: any }): ic_ledger.pb.v1.SendRequest;

                /**
                 * Creates a plain object from a SendRequest message. Also converts values to other types if specified.
                 * @param message SendRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: ic_ledger.pb.v1.SendRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this SendRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for SendRequest
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a SendResponse. */
            interface ISendResponse {

                /** SendResponse resultingHeight */
                resultingHeight?: (ic_ledger.pb.v1.IBlockHeight|null);
            }

            /** Represents a SendResponse. */
            class SendResponse implements ISendResponse {

                /**
                 * Constructs a new SendResponse.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: ic_ledger.pb.v1.ISendResponse);

                /** SendResponse resultingHeight. */
                public resultingHeight?: (ic_ledger.pb.v1.IBlockHeight|null);

                /**
                 * Creates a new SendResponse instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns SendResponse instance
                 */
                public static create(properties?: ic_ledger.pb.v1.ISendResponse): ic_ledger.pb.v1.SendResponse;

                /**
                 * Encodes the specified SendResponse message. Does not implicitly {@link ic_ledger.pb.v1.SendResponse.verify|verify} messages.
                 * @param message SendResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: ic_ledger.pb.v1.ISendResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified SendResponse message, length delimited. Does not implicitly {@link ic_ledger.pb.v1.SendResponse.verify|verify} messages.
                 * @param message SendResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: ic_ledger.pb.v1.ISendResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a SendResponse message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns SendResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ic_ledger.pb.v1.SendResponse;

                /**
                 * Decodes a SendResponse message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns SendResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ic_ledger.pb.v1.SendResponse;

                /**
                 * Verifies a SendResponse message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a SendResponse message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns SendResponse
                 */
                public static fromObject(object: { [k: string]: any }): ic_ledger.pb.v1.SendResponse;

                /**
                 * Creates a plain object from a SendResponse message. Also converts values to other types if specified.
                 * @param message SendResponse
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: ic_ledger.pb.v1.SendResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this SendResponse to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for SendResponse
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a NotifyRequest. */
            interface INotifyRequest {

                /** NotifyRequest blockHeight */
                blockHeight?: (ic_ledger.pb.v1.IBlockHeight|null);

                /** NotifyRequest maxFee */
                maxFee?: (ic_ledger.pb.v1.IICPTs|null);

                /** NotifyRequest fromSubaccount */
                fromSubaccount?: (ic_ledger.pb.v1.ISubaccount|null);

                /** NotifyRequest toCanister */
                toCanister?: (ic_base_types.pb.v1.IPrincipalId|null);

                /** NotifyRequest toSubaccount */
                toSubaccount?: (ic_ledger.pb.v1.ISubaccount|null);
            }

            /** Represents a NotifyRequest. */
            class NotifyRequest implements INotifyRequest {

                /**
                 * Constructs a new NotifyRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: ic_ledger.pb.v1.INotifyRequest);

                /** NotifyRequest blockHeight. */
                public blockHeight?: (ic_ledger.pb.v1.IBlockHeight|null);

                /** NotifyRequest maxFee. */
                public maxFee?: (ic_ledger.pb.v1.IICPTs|null);

                /** NotifyRequest fromSubaccount. */
                public fromSubaccount?: (ic_ledger.pb.v1.ISubaccount|null);

                /** NotifyRequest toCanister. */
                public toCanister?: (ic_base_types.pb.v1.IPrincipalId|null);

                /** NotifyRequest toSubaccount. */
                public toSubaccount?: (ic_ledger.pb.v1.ISubaccount|null);

                /**
                 * Creates a new NotifyRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns NotifyRequest instance
                 */
                public static create(properties?: ic_ledger.pb.v1.INotifyRequest): ic_ledger.pb.v1.NotifyRequest;

                /**
                 * Encodes the specified NotifyRequest message. Does not implicitly {@link ic_ledger.pb.v1.NotifyRequest.verify|verify} messages.
                 * @param message NotifyRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: ic_ledger.pb.v1.INotifyRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified NotifyRequest message, length delimited. Does not implicitly {@link ic_ledger.pb.v1.NotifyRequest.verify|verify} messages.
                 * @param message NotifyRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: ic_ledger.pb.v1.INotifyRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a NotifyRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns NotifyRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ic_ledger.pb.v1.NotifyRequest;

                /**
                 * Decodes a NotifyRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns NotifyRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ic_ledger.pb.v1.NotifyRequest;

                /**
                 * Verifies a NotifyRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a NotifyRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns NotifyRequest
                 */
                public static fromObject(object: { [k: string]: any }): ic_ledger.pb.v1.NotifyRequest;

                /**
                 * Creates a plain object from a NotifyRequest message. Also converts values to other types if specified.
                 * @param message NotifyRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: ic_ledger.pb.v1.NotifyRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this NotifyRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for NotifyRequest
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a NotifyResponse. */
            interface INotifyResponse {
            }

            /** Represents a NotifyResponse. */
            class NotifyResponse implements INotifyResponse {

                /**
                 * Constructs a new NotifyResponse.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: ic_ledger.pb.v1.INotifyResponse);

                /**
                 * Creates a new NotifyResponse instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns NotifyResponse instance
                 */
                public static create(properties?: ic_ledger.pb.v1.INotifyResponse): ic_ledger.pb.v1.NotifyResponse;

                /**
                 * Encodes the specified NotifyResponse message. Does not implicitly {@link ic_ledger.pb.v1.NotifyResponse.verify|verify} messages.
                 * @param message NotifyResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: ic_ledger.pb.v1.INotifyResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified NotifyResponse message, length delimited. Does not implicitly {@link ic_ledger.pb.v1.NotifyResponse.verify|verify} messages.
                 * @param message NotifyResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: ic_ledger.pb.v1.INotifyResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a NotifyResponse message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns NotifyResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ic_ledger.pb.v1.NotifyResponse;

                /**
                 * Decodes a NotifyResponse message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns NotifyResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ic_ledger.pb.v1.NotifyResponse;

                /**
                 * Verifies a NotifyResponse message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a NotifyResponse message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns NotifyResponse
                 */
                public static fromObject(object: { [k: string]: any }): ic_ledger.pb.v1.NotifyResponse;

                /**
                 * Creates a plain object from a NotifyResponse message. Also converts values to other types if specified.
                 * @param message NotifyResponse
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: ic_ledger.pb.v1.NotifyResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this NotifyResponse to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for NotifyResponse
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a TransactionNotificationRequest. */
            interface ITransactionNotificationRequest {

                /** TransactionNotificationRequest from */
                from?: (ic_base_types.pb.v1.IPrincipalId|null);

                /** TransactionNotificationRequest fromSubaccount */
                fromSubaccount?: (ic_ledger.pb.v1.ISubaccount|null);

                /** TransactionNotificationRequest to */
                to?: (ic_base_types.pb.v1.IPrincipalId|null);

                /** TransactionNotificationRequest toSubaccount */
                toSubaccount?: (ic_ledger.pb.v1.ISubaccount|null);

                /** TransactionNotificationRequest blockHeight */
                blockHeight?: (ic_ledger.pb.v1.IBlockHeight|null);

                /** TransactionNotificationRequest amount */
                amount?: (ic_ledger.pb.v1.IICPTs|null);

                /** TransactionNotificationRequest memo */
                memo?: (ic_ledger.pb.v1.IMemo|null);
            }

            /** Represents a TransactionNotificationRequest. */
            class TransactionNotificationRequest implements ITransactionNotificationRequest {

                /**
                 * Constructs a new TransactionNotificationRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: ic_ledger.pb.v1.ITransactionNotificationRequest);

                /** TransactionNotificationRequest from. */
                public from?: (ic_base_types.pb.v1.IPrincipalId|null);

                /** TransactionNotificationRequest fromSubaccount. */
                public fromSubaccount?: (ic_ledger.pb.v1.ISubaccount|null);

                /** TransactionNotificationRequest to. */
                public to?: (ic_base_types.pb.v1.IPrincipalId|null);

                /** TransactionNotificationRequest toSubaccount. */
                public toSubaccount?: (ic_ledger.pb.v1.ISubaccount|null);

                /** TransactionNotificationRequest blockHeight. */
                public blockHeight?: (ic_ledger.pb.v1.IBlockHeight|null);

                /** TransactionNotificationRequest amount. */
                public amount?: (ic_ledger.pb.v1.IICPTs|null);

                /** TransactionNotificationRequest memo. */
                public memo?: (ic_ledger.pb.v1.IMemo|null);

                /**
                 * Creates a new TransactionNotificationRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns TransactionNotificationRequest instance
                 */
                public static create(properties?: ic_ledger.pb.v1.ITransactionNotificationRequest): ic_ledger.pb.v1.TransactionNotificationRequest;

                /**
                 * Encodes the specified TransactionNotificationRequest message. Does not implicitly {@link ic_ledger.pb.v1.TransactionNotificationRequest.verify|verify} messages.
                 * @param message TransactionNotificationRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: ic_ledger.pb.v1.ITransactionNotificationRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified TransactionNotificationRequest message, length delimited. Does not implicitly {@link ic_ledger.pb.v1.TransactionNotificationRequest.verify|verify} messages.
                 * @param message TransactionNotificationRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: ic_ledger.pb.v1.ITransactionNotificationRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a TransactionNotificationRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns TransactionNotificationRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ic_ledger.pb.v1.TransactionNotificationRequest;

                /**
                 * Decodes a TransactionNotificationRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns TransactionNotificationRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ic_ledger.pb.v1.TransactionNotificationRequest;

                /**
                 * Verifies a TransactionNotificationRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a TransactionNotificationRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns TransactionNotificationRequest
                 */
                public static fromObject(object: { [k: string]: any }): ic_ledger.pb.v1.TransactionNotificationRequest;

                /**
                 * Creates a plain object from a TransactionNotificationRequest message. Also converts values to other types if specified.
                 * @param message TransactionNotificationRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: ic_ledger.pb.v1.TransactionNotificationRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this TransactionNotificationRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for TransactionNotificationRequest
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a TransactionNotificationResponse. */
            interface ITransactionNotificationResponse {

                /** TransactionNotificationResponse response */
                response?: (Uint8Array|null);
            }

            /** Represents a TransactionNotificationResponse. */
            class TransactionNotificationResponse implements ITransactionNotificationResponse {

                /**
                 * Constructs a new TransactionNotificationResponse.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: ic_ledger.pb.v1.ITransactionNotificationResponse);

                /** TransactionNotificationResponse response. */
                public response: Uint8Array;

                /**
                 * Creates a new TransactionNotificationResponse instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns TransactionNotificationResponse instance
                 */
                public static create(properties?: ic_ledger.pb.v1.ITransactionNotificationResponse): ic_ledger.pb.v1.TransactionNotificationResponse;

                /**
                 * Encodes the specified TransactionNotificationResponse message. Does not implicitly {@link ic_ledger.pb.v1.TransactionNotificationResponse.verify|verify} messages.
                 * @param message TransactionNotificationResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: ic_ledger.pb.v1.ITransactionNotificationResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified TransactionNotificationResponse message, length delimited. Does not implicitly {@link ic_ledger.pb.v1.TransactionNotificationResponse.verify|verify} messages.
                 * @param message TransactionNotificationResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: ic_ledger.pb.v1.ITransactionNotificationResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a TransactionNotificationResponse message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns TransactionNotificationResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ic_ledger.pb.v1.TransactionNotificationResponse;

                /**
                 * Decodes a TransactionNotificationResponse message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns TransactionNotificationResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ic_ledger.pb.v1.TransactionNotificationResponse;

                /**
                 * Verifies a TransactionNotificationResponse message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a TransactionNotificationResponse message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns TransactionNotificationResponse
                 */
                public static fromObject(object: { [k: string]: any }): ic_ledger.pb.v1.TransactionNotificationResponse;

                /**
                 * Creates a plain object from a TransactionNotificationResponse message. Also converts values to other types if specified.
                 * @param message TransactionNotificationResponse
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: ic_ledger.pb.v1.TransactionNotificationResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this TransactionNotificationResponse to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for TransactionNotificationResponse
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a CyclesNotificationResponse. */
            interface ICyclesNotificationResponse {

                /** CyclesNotificationResponse createdCanisterId */
                createdCanisterId?: (ic_base_types.pb.v1.IPrincipalId|null);

                /** CyclesNotificationResponse refund */
                refund?: (ic_ledger.pb.v1.IRefund|null);

                /** CyclesNotificationResponse toppedUp */
                toppedUp?: (ic_ledger.pb.v1.IToppedUp|null);
            }

            /** Represents a CyclesNotificationResponse. */
            class CyclesNotificationResponse implements ICyclesNotificationResponse {

                /**
                 * Constructs a new CyclesNotificationResponse.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: ic_ledger.pb.v1.ICyclesNotificationResponse);

                /** CyclesNotificationResponse createdCanisterId. */
                public createdCanisterId?: (ic_base_types.pb.v1.IPrincipalId|null);

                /** CyclesNotificationResponse refund. */
                public refund?: (ic_ledger.pb.v1.IRefund|null);

                /** CyclesNotificationResponse toppedUp. */
                public toppedUp?: (ic_ledger.pb.v1.IToppedUp|null);

                /** CyclesNotificationResponse response. */
                public response?: ("createdCanisterId"|"refund"|"toppedUp");

                /**
                 * Creates a new CyclesNotificationResponse instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns CyclesNotificationResponse instance
                 */
                public static create(properties?: ic_ledger.pb.v1.ICyclesNotificationResponse): ic_ledger.pb.v1.CyclesNotificationResponse;

                /**
                 * Encodes the specified CyclesNotificationResponse message. Does not implicitly {@link ic_ledger.pb.v1.CyclesNotificationResponse.verify|verify} messages.
                 * @param message CyclesNotificationResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: ic_ledger.pb.v1.ICyclesNotificationResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified CyclesNotificationResponse message, length delimited. Does not implicitly {@link ic_ledger.pb.v1.CyclesNotificationResponse.verify|verify} messages.
                 * @param message CyclesNotificationResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: ic_ledger.pb.v1.ICyclesNotificationResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a CyclesNotificationResponse message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns CyclesNotificationResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ic_ledger.pb.v1.CyclesNotificationResponse;

                /**
                 * Decodes a CyclesNotificationResponse message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns CyclesNotificationResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ic_ledger.pb.v1.CyclesNotificationResponse;

                /**
                 * Verifies a CyclesNotificationResponse message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a CyclesNotificationResponse message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns CyclesNotificationResponse
                 */
                public static fromObject(object: { [k: string]: any }): ic_ledger.pb.v1.CyclesNotificationResponse;

                /**
                 * Creates a plain object from a CyclesNotificationResponse message. Also converts values to other types if specified.
                 * @param message CyclesNotificationResponse
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: ic_ledger.pb.v1.CyclesNotificationResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this CyclesNotificationResponse to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for CyclesNotificationResponse
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of an AccountBalanceRequest. */
            interface IAccountBalanceRequest {

                /** AccountBalanceRequest account */
                account?: (ic_ledger.pb.v1.IAccountIdentifier|null);
            }

            /** Represents an AccountBalanceRequest. */
            class AccountBalanceRequest implements IAccountBalanceRequest {

                /**
                 * Constructs a new AccountBalanceRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: ic_ledger.pb.v1.IAccountBalanceRequest);

                /** AccountBalanceRequest account. */
                public account?: (ic_ledger.pb.v1.IAccountIdentifier|null);

                /**
                 * Creates a new AccountBalanceRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns AccountBalanceRequest instance
                 */
                public static create(properties?: ic_ledger.pb.v1.IAccountBalanceRequest): ic_ledger.pb.v1.AccountBalanceRequest;

                /**
                 * Encodes the specified AccountBalanceRequest message. Does not implicitly {@link ic_ledger.pb.v1.AccountBalanceRequest.verify|verify} messages.
                 * @param message AccountBalanceRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: ic_ledger.pb.v1.IAccountBalanceRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified AccountBalanceRequest message, length delimited. Does not implicitly {@link ic_ledger.pb.v1.AccountBalanceRequest.verify|verify} messages.
                 * @param message AccountBalanceRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: ic_ledger.pb.v1.IAccountBalanceRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an AccountBalanceRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns AccountBalanceRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ic_ledger.pb.v1.AccountBalanceRequest;

                /**
                 * Decodes an AccountBalanceRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns AccountBalanceRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ic_ledger.pb.v1.AccountBalanceRequest;

                /**
                 * Verifies an AccountBalanceRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an AccountBalanceRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns AccountBalanceRequest
                 */
                public static fromObject(object: { [k: string]: any }): ic_ledger.pb.v1.AccountBalanceRequest;

                /**
                 * Creates a plain object from an AccountBalanceRequest message. Also converts values to other types if specified.
                 * @param message AccountBalanceRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: ic_ledger.pb.v1.AccountBalanceRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this AccountBalanceRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for AccountBalanceRequest
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of an AccountBalanceResponse. */
            interface IAccountBalanceResponse {

                /** AccountBalanceResponse balance */
                balance?: (ic_ledger.pb.v1.IICPTs|null);
            }

            /** Represents an AccountBalanceResponse. */
            class AccountBalanceResponse implements IAccountBalanceResponse {

                /**
                 * Constructs a new AccountBalanceResponse.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: ic_ledger.pb.v1.IAccountBalanceResponse);

                /** AccountBalanceResponse balance. */
                public balance?: (ic_ledger.pb.v1.IICPTs|null);

                /**
                 * Creates a new AccountBalanceResponse instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns AccountBalanceResponse instance
                 */
                public static create(properties?: ic_ledger.pb.v1.IAccountBalanceResponse): ic_ledger.pb.v1.AccountBalanceResponse;

                /**
                 * Encodes the specified AccountBalanceResponse message. Does not implicitly {@link ic_ledger.pb.v1.AccountBalanceResponse.verify|verify} messages.
                 * @param message AccountBalanceResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: ic_ledger.pb.v1.IAccountBalanceResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified AccountBalanceResponse message, length delimited. Does not implicitly {@link ic_ledger.pb.v1.AccountBalanceResponse.verify|verify} messages.
                 * @param message AccountBalanceResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: ic_ledger.pb.v1.IAccountBalanceResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an AccountBalanceResponse message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns AccountBalanceResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ic_ledger.pb.v1.AccountBalanceResponse;

                /**
                 * Decodes an AccountBalanceResponse message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns AccountBalanceResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ic_ledger.pb.v1.AccountBalanceResponse;

                /**
                 * Verifies an AccountBalanceResponse message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an AccountBalanceResponse message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns AccountBalanceResponse
                 */
                public static fromObject(object: { [k: string]: any }): ic_ledger.pb.v1.AccountBalanceResponse;

                /**
                 * Creates a plain object from an AccountBalanceResponse message. Also converts values to other types if specified.
                 * @param message AccountBalanceResponse
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: ic_ledger.pb.v1.AccountBalanceResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this AccountBalanceResponse to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for AccountBalanceResponse
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a TipOfChainRequest. */
            interface ITipOfChainRequest {
            }

            /** Represents a TipOfChainRequest. */
            class TipOfChainRequest implements ITipOfChainRequest {

                /**
                 * Constructs a new TipOfChainRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: ic_ledger.pb.v1.ITipOfChainRequest);

                /**
                 * Creates a new TipOfChainRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns TipOfChainRequest instance
                 */
                public static create(properties?: ic_ledger.pb.v1.ITipOfChainRequest): ic_ledger.pb.v1.TipOfChainRequest;

                /**
                 * Encodes the specified TipOfChainRequest message. Does not implicitly {@link ic_ledger.pb.v1.TipOfChainRequest.verify|verify} messages.
                 * @param message TipOfChainRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: ic_ledger.pb.v1.ITipOfChainRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified TipOfChainRequest message, length delimited. Does not implicitly {@link ic_ledger.pb.v1.TipOfChainRequest.verify|verify} messages.
                 * @param message TipOfChainRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: ic_ledger.pb.v1.ITipOfChainRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a TipOfChainRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns TipOfChainRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ic_ledger.pb.v1.TipOfChainRequest;

                /**
                 * Decodes a TipOfChainRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns TipOfChainRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ic_ledger.pb.v1.TipOfChainRequest;

                /**
                 * Verifies a TipOfChainRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a TipOfChainRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns TipOfChainRequest
                 */
                public static fromObject(object: { [k: string]: any }): ic_ledger.pb.v1.TipOfChainRequest;

                /**
                 * Creates a plain object from a TipOfChainRequest message. Also converts values to other types if specified.
                 * @param message TipOfChainRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: ic_ledger.pb.v1.TipOfChainRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this TipOfChainRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for TipOfChainRequest
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a TipOfChainResponse. */
            interface ITipOfChainResponse {

                /** TipOfChainResponse certification */
                certification?: (ic_ledger.pb.v1.ICertification|null);

                /** TipOfChainResponse chainLength */
                chainLength?: (ic_ledger.pb.v1.IBlockHeight|null);
            }

            /** Represents a TipOfChainResponse. */
            class TipOfChainResponse implements ITipOfChainResponse {

                /**
                 * Constructs a new TipOfChainResponse.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: ic_ledger.pb.v1.ITipOfChainResponse);

                /** TipOfChainResponse certification. */
                public certification?: (ic_ledger.pb.v1.ICertification|null);

                /** TipOfChainResponse chainLength. */
                public chainLength?: (ic_ledger.pb.v1.IBlockHeight|null);

                /**
                 * Creates a new TipOfChainResponse instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns TipOfChainResponse instance
                 */
                public static create(properties?: ic_ledger.pb.v1.ITipOfChainResponse): ic_ledger.pb.v1.TipOfChainResponse;

                /**
                 * Encodes the specified TipOfChainResponse message. Does not implicitly {@link ic_ledger.pb.v1.TipOfChainResponse.verify|verify} messages.
                 * @param message TipOfChainResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: ic_ledger.pb.v1.ITipOfChainResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified TipOfChainResponse message, length delimited. Does not implicitly {@link ic_ledger.pb.v1.TipOfChainResponse.verify|verify} messages.
                 * @param message TipOfChainResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: ic_ledger.pb.v1.ITipOfChainResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a TipOfChainResponse message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns TipOfChainResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ic_ledger.pb.v1.TipOfChainResponse;

                /**
                 * Decodes a TipOfChainResponse message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns TipOfChainResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ic_ledger.pb.v1.TipOfChainResponse;

                /**
                 * Verifies a TipOfChainResponse message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a TipOfChainResponse message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns TipOfChainResponse
                 */
                public static fromObject(object: { [k: string]: any }): ic_ledger.pb.v1.TipOfChainResponse;

                /**
                 * Creates a plain object from a TipOfChainResponse message. Also converts values to other types if specified.
                 * @param message TipOfChainResponse
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: ic_ledger.pb.v1.TipOfChainResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this TipOfChainResponse to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for TipOfChainResponse
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of an EncodedBlock. */
            interface IEncodedBlock {

                /** EncodedBlock block */
                block?: (Uint8Array|null);
            }

            /** Represents an EncodedBlock. */
            class EncodedBlock implements IEncodedBlock {

                /**
                 * Constructs a new EncodedBlock.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: ic_ledger.pb.v1.IEncodedBlock);

                /** EncodedBlock block. */
                public block: Uint8Array;

                /**
                 * Creates a new EncodedBlock instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns EncodedBlock instance
                 */
                public static create(properties?: ic_ledger.pb.v1.IEncodedBlock): ic_ledger.pb.v1.EncodedBlock;

                /**
                 * Encodes the specified EncodedBlock message. Does not implicitly {@link ic_ledger.pb.v1.EncodedBlock.verify|verify} messages.
                 * @param message EncodedBlock message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: ic_ledger.pb.v1.IEncodedBlock, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified EncodedBlock message, length delimited. Does not implicitly {@link ic_ledger.pb.v1.EncodedBlock.verify|verify} messages.
                 * @param message EncodedBlock message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: ic_ledger.pb.v1.IEncodedBlock, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an EncodedBlock message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns EncodedBlock
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ic_ledger.pb.v1.EncodedBlock;

                /**
                 * Decodes an EncodedBlock message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns EncodedBlock
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ic_ledger.pb.v1.EncodedBlock;

                /**
                 * Verifies an EncodedBlock message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an EncodedBlock message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns EncodedBlock
                 */
                public static fromObject(object: { [k: string]: any }): ic_ledger.pb.v1.EncodedBlock;

                /**
                 * Creates a plain object from an EncodedBlock message. Also converts values to other types if specified.
                 * @param message EncodedBlock
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: ic_ledger.pb.v1.EncodedBlock, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this EncodedBlock to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for EncodedBlock
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a GetBlocksRequest. */
            interface IGetBlocksRequest {

                /** GetBlocksRequest start */
                start?: (number|Long|null);

                /** GetBlocksRequest length */
                length?: (number|Long|null);
            }

            /** Represents a GetBlocksRequest. */
            class GetBlocksRequest implements IGetBlocksRequest {

                /**
                 * Constructs a new GetBlocksRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: ic_ledger.pb.v1.IGetBlocksRequest);

                /** GetBlocksRequest start. */
                public start: (number|Long);

                /** GetBlocksRequest length. */
                public length: (number|Long);

                /**
                 * Creates a new GetBlocksRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns GetBlocksRequest instance
                 */
                public static create(properties?: ic_ledger.pb.v1.IGetBlocksRequest): ic_ledger.pb.v1.GetBlocksRequest;

                /**
                 * Encodes the specified GetBlocksRequest message. Does not implicitly {@link ic_ledger.pb.v1.GetBlocksRequest.verify|verify} messages.
                 * @param message GetBlocksRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: ic_ledger.pb.v1.IGetBlocksRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified GetBlocksRequest message, length delimited. Does not implicitly {@link ic_ledger.pb.v1.GetBlocksRequest.verify|verify} messages.
                 * @param message GetBlocksRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: ic_ledger.pb.v1.IGetBlocksRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a GetBlocksRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns GetBlocksRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ic_ledger.pb.v1.GetBlocksRequest;

                /**
                 * Decodes a GetBlocksRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns GetBlocksRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ic_ledger.pb.v1.GetBlocksRequest;

                /**
                 * Verifies a GetBlocksRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a GetBlocksRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns GetBlocksRequest
                 */
                public static fromObject(object: { [k: string]: any }): ic_ledger.pb.v1.GetBlocksRequest;

                /**
                 * Creates a plain object from a GetBlocksRequest message. Also converts values to other types if specified.
                 * @param message GetBlocksRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: ic_ledger.pb.v1.GetBlocksRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this GetBlocksRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for GetBlocksRequest
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Refund. */
            interface IRefund {

                /** Refund refund */
                refund?: (ic_ledger.pb.v1.IBlockHeight|null);

                /** Refund error */
                error?: (string|null);
            }

            /** Represents a Refund. */
            class Refund implements IRefund {

                /**
                 * Constructs a new Refund.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: ic_ledger.pb.v1.IRefund);

                /** Refund refund. */
                public refund?: (ic_ledger.pb.v1.IBlockHeight|null);

                /** Refund error. */
                public error: string;

                /**
                 * Creates a new Refund instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Refund instance
                 */
                public static create(properties?: ic_ledger.pb.v1.IRefund): ic_ledger.pb.v1.Refund;

                /**
                 * Encodes the specified Refund message. Does not implicitly {@link ic_ledger.pb.v1.Refund.verify|verify} messages.
                 * @param message Refund message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: ic_ledger.pb.v1.IRefund, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Refund message, length delimited. Does not implicitly {@link ic_ledger.pb.v1.Refund.verify|verify} messages.
                 * @param message Refund message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: ic_ledger.pb.v1.IRefund, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Refund message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Refund
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ic_ledger.pb.v1.Refund;

                /**
                 * Decodes a Refund message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Refund
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ic_ledger.pb.v1.Refund;

                /**
                 * Verifies a Refund message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Refund message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Refund
                 */
                public static fromObject(object: { [k: string]: any }): ic_ledger.pb.v1.Refund;

                /**
                 * Creates a plain object from a Refund message. Also converts values to other types if specified.
                 * @param message Refund
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: ic_ledger.pb.v1.Refund, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Refund to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Refund
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a ToppedUp. */
            interface IToppedUp {
            }

            /** Represents a ToppedUp. */
            class ToppedUp implements IToppedUp {

                /**
                 * Constructs a new ToppedUp.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: ic_ledger.pb.v1.IToppedUp);

                /**
                 * Creates a new ToppedUp instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ToppedUp instance
                 */
                public static create(properties?: ic_ledger.pb.v1.IToppedUp): ic_ledger.pb.v1.ToppedUp;

                /**
                 * Encodes the specified ToppedUp message. Does not implicitly {@link ic_ledger.pb.v1.ToppedUp.verify|verify} messages.
                 * @param message ToppedUp message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: ic_ledger.pb.v1.IToppedUp, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ToppedUp message, length delimited. Does not implicitly {@link ic_ledger.pb.v1.ToppedUp.verify|verify} messages.
                 * @param message ToppedUp message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: ic_ledger.pb.v1.IToppedUp, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ToppedUp message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ToppedUp
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ic_ledger.pb.v1.ToppedUp;

                /**
                 * Decodes a ToppedUp message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ToppedUp
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ic_ledger.pb.v1.ToppedUp;

                /**
                 * Verifies a ToppedUp message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ToppedUp message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ToppedUp
                 */
                public static fromObject(object: { [k: string]: any }): ic_ledger.pb.v1.ToppedUp;

                /**
                 * Creates a plain object from a ToppedUp message. Also converts values to other types if specified.
                 * @param message ToppedUp
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: ic_ledger.pb.v1.ToppedUp, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ToppedUp to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for ToppedUp
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of an EncodedBlocks. */
            interface IEncodedBlocks {

                /** EncodedBlocks blocks */
                blocks?: (ic_ledger.pb.v1.IEncodedBlock[]|null);
            }

            /** Represents an EncodedBlocks. */
            class EncodedBlocks implements IEncodedBlocks {

                /**
                 * Constructs a new EncodedBlocks.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: ic_ledger.pb.v1.IEncodedBlocks);

                /** EncodedBlocks blocks. */
                public blocks: ic_ledger.pb.v1.IEncodedBlock[];

                /**
                 * Creates a new EncodedBlocks instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns EncodedBlocks instance
                 */
                public static create(properties?: ic_ledger.pb.v1.IEncodedBlocks): ic_ledger.pb.v1.EncodedBlocks;

                /**
                 * Encodes the specified EncodedBlocks message. Does not implicitly {@link ic_ledger.pb.v1.EncodedBlocks.verify|verify} messages.
                 * @param message EncodedBlocks message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: ic_ledger.pb.v1.IEncodedBlocks, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified EncodedBlocks message, length delimited. Does not implicitly {@link ic_ledger.pb.v1.EncodedBlocks.verify|verify} messages.
                 * @param message EncodedBlocks message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: ic_ledger.pb.v1.IEncodedBlocks, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an EncodedBlocks message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns EncodedBlocks
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ic_ledger.pb.v1.EncodedBlocks;

                /**
                 * Decodes an EncodedBlocks message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns EncodedBlocks
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ic_ledger.pb.v1.EncodedBlocks;

                /**
                 * Verifies an EncodedBlocks message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an EncodedBlocks message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns EncodedBlocks
                 */
                public static fromObject(object: { [k: string]: any }): ic_ledger.pb.v1.EncodedBlocks;

                /**
                 * Creates a plain object from an EncodedBlocks message. Also converts values to other types if specified.
                 * @param message EncodedBlocks
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: ic_ledger.pb.v1.EncodedBlocks, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this EncodedBlocks to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for EncodedBlocks
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a GetBlocksResponse. */
            interface IGetBlocksResponse {

                /** GetBlocksResponse blocks */
                blocks?: (ic_ledger.pb.v1.IEncodedBlocks|null);

                /** GetBlocksResponse error */
                error?: (string|null);
            }

            /** Represents a GetBlocksResponse. */
            class GetBlocksResponse implements IGetBlocksResponse {

                /**
                 * Constructs a new GetBlocksResponse.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: ic_ledger.pb.v1.IGetBlocksResponse);

                /** GetBlocksResponse blocks. */
                public blocks?: (ic_ledger.pb.v1.IEncodedBlocks|null);

                /** GetBlocksResponse error. */
                public error?: (string|null);

                /** GetBlocksResponse getBlocksContent. */
                public getBlocksContent?: ("blocks"|"error");

                /**
                 * Creates a new GetBlocksResponse instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns GetBlocksResponse instance
                 */
                public static create(properties?: ic_ledger.pb.v1.IGetBlocksResponse): ic_ledger.pb.v1.GetBlocksResponse;

                /**
                 * Encodes the specified GetBlocksResponse message. Does not implicitly {@link ic_ledger.pb.v1.GetBlocksResponse.verify|verify} messages.
                 * @param message GetBlocksResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: ic_ledger.pb.v1.IGetBlocksResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified GetBlocksResponse message, length delimited. Does not implicitly {@link ic_ledger.pb.v1.GetBlocksResponse.verify|verify} messages.
                 * @param message GetBlocksResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: ic_ledger.pb.v1.IGetBlocksResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a GetBlocksResponse message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns GetBlocksResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ic_ledger.pb.v1.GetBlocksResponse;

                /**
                 * Decodes a GetBlocksResponse message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns GetBlocksResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ic_ledger.pb.v1.GetBlocksResponse;

                /**
                 * Verifies a GetBlocksResponse message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a GetBlocksResponse message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns GetBlocksResponse
                 */
                public static fromObject(object: { [k: string]: any }): ic_ledger.pb.v1.GetBlocksResponse;

                /**
                 * Creates a plain object from a GetBlocksResponse message. Also converts values to other types if specified.
                 * @param message GetBlocksResponse
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: ic_ledger.pb.v1.GetBlocksResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this GetBlocksResponse to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for GetBlocksResponse
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a ICPTs. */
            interface IICPTs {

                /** ICPTs e8s */
                e8s?: (number|Long|null);
            }

            /** Represents a ICPTs. */
            class ICPTs implements IICPTs {

                /**
                 * Constructs a new ICPTs.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: ic_ledger.pb.v1.IICPTs);

                /** ICPTs e8s. */
                public e8s: (number|Long);

                /**
                 * Creates a new ICPTs instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ICPTs instance
                 */
                public static create(properties?: ic_ledger.pb.v1.IICPTs): ic_ledger.pb.v1.ICPTs;

                /**
                 * Encodes the specified ICPTs message. Does not implicitly {@link ic_ledger.pb.v1.ICPTs.verify|verify} messages.
                 * @param message ICPTs message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: ic_ledger.pb.v1.IICPTs, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ICPTs message, length delimited. Does not implicitly {@link ic_ledger.pb.v1.ICPTs.verify|verify} messages.
                 * @param message ICPTs message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: ic_ledger.pb.v1.IICPTs, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ICPTs message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ICPTs
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ic_ledger.pb.v1.ICPTs;

                /**
                 * Decodes a ICPTs message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ICPTs
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ic_ledger.pb.v1.ICPTs;

                /**
                 * Verifies a ICPTs message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ICPTs message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ICPTs
                 */
                public static fromObject(object: { [k: string]: any }): ic_ledger.pb.v1.ICPTs;

                /**
                 * Creates a plain object from a ICPTs message. Also converts values to other types if specified.
                 * @param message ICPTs
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: ic_ledger.pb.v1.ICPTs, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ICPTs to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for ICPTs
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Payment. */
            interface IPayment {

                /** Payment receiverGets */
                receiverGets?: (ic_ledger.pb.v1.IICPTs|null);
            }

            /** Represents a Payment. */
            class Payment implements IPayment {

                /**
                 * Constructs a new Payment.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: ic_ledger.pb.v1.IPayment);

                /** Payment receiverGets. */
                public receiverGets?: (ic_ledger.pb.v1.IICPTs|null);

                /**
                 * Creates a new Payment instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Payment instance
                 */
                public static create(properties?: ic_ledger.pb.v1.IPayment): ic_ledger.pb.v1.Payment;

                /**
                 * Encodes the specified Payment message. Does not implicitly {@link ic_ledger.pb.v1.Payment.verify|verify} messages.
                 * @param message Payment message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: ic_ledger.pb.v1.IPayment, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Payment message, length delimited. Does not implicitly {@link ic_ledger.pb.v1.Payment.verify|verify} messages.
                 * @param message Payment message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: ic_ledger.pb.v1.IPayment, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Payment message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Payment
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ic_ledger.pb.v1.Payment;

                /**
                 * Decodes a Payment message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Payment
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ic_ledger.pb.v1.Payment;

                /**
                 * Verifies a Payment message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Payment message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Payment
                 */
                public static fromObject(object: { [k: string]: any }): ic_ledger.pb.v1.Payment;

                /**
                 * Creates a plain object from a Payment message. Also converts values to other types if specified.
                 * @param message Payment
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: ic_ledger.pb.v1.Payment, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Payment to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Payment
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a BlockHeight. */
            interface IBlockHeight {

                /** BlockHeight height */
                height?: (number|Long|null);
            }

            /** Represents a BlockHeight. */
            class BlockHeight implements IBlockHeight {

                /**
                 * Constructs a new BlockHeight.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: ic_ledger.pb.v1.IBlockHeight);

                /** BlockHeight height. */
                public height: (number|Long);

                /**
                 * Creates a new BlockHeight instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns BlockHeight instance
                 */
                public static create(properties?: ic_ledger.pb.v1.IBlockHeight): ic_ledger.pb.v1.BlockHeight;

                /**
                 * Encodes the specified BlockHeight message. Does not implicitly {@link ic_ledger.pb.v1.BlockHeight.verify|verify} messages.
                 * @param message BlockHeight message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: ic_ledger.pb.v1.IBlockHeight, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified BlockHeight message, length delimited. Does not implicitly {@link ic_ledger.pb.v1.BlockHeight.verify|verify} messages.
                 * @param message BlockHeight message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: ic_ledger.pb.v1.IBlockHeight, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a BlockHeight message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns BlockHeight
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ic_ledger.pb.v1.BlockHeight;

                /**
                 * Decodes a BlockHeight message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns BlockHeight
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ic_ledger.pb.v1.BlockHeight;

                /**
                 * Verifies a BlockHeight message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a BlockHeight message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns BlockHeight
                 */
                public static fromObject(object: { [k: string]: any }): ic_ledger.pb.v1.BlockHeight;

                /**
                 * Creates a plain object from a BlockHeight message. Also converts values to other types if specified.
                 * @param message BlockHeight
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: ic_ledger.pb.v1.BlockHeight, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this BlockHeight to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for BlockHeight
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Block. */
            interface IBlock {

                /** Block parentHash */
                parentHash?: (ic_ledger.pb.v1.IHash|null);

                /** Block timestamp */
                timestamp?: (ic_ledger.pb.v1.ITimeStamp|null);

                /** Block transaction */
                transaction?: (ic_ledger.pb.v1.ITransaction|null);
            }

            /** Represents a Block. */
            class Block implements IBlock {

                /**
                 * Constructs a new Block.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: ic_ledger.pb.v1.IBlock);

                /** Block parentHash. */
                public parentHash?: (ic_ledger.pb.v1.IHash|null);

                /** Block timestamp. */
                public timestamp?: (ic_ledger.pb.v1.ITimeStamp|null);

                /** Block transaction. */
                public transaction?: (ic_ledger.pb.v1.ITransaction|null);

                /**
                 * Creates a new Block instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Block instance
                 */
                public static create(properties?: ic_ledger.pb.v1.IBlock): ic_ledger.pb.v1.Block;

                /**
                 * Encodes the specified Block message. Does not implicitly {@link ic_ledger.pb.v1.Block.verify|verify} messages.
                 * @param message Block message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: ic_ledger.pb.v1.IBlock, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Block message, length delimited. Does not implicitly {@link ic_ledger.pb.v1.Block.verify|verify} messages.
                 * @param message Block message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: ic_ledger.pb.v1.IBlock, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Block message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Block
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ic_ledger.pb.v1.Block;

                /**
                 * Decodes a Block message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Block
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ic_ledger.pb.v1.Block;

                /**
                 * Verifies a Block message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Block message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Block
                 */
                public static fromObject(object: { [k: string]: any }): ic_ledger.pb.v1.Block;

                /**
                 * Creates a plain object from a Block message. Also converts values to other types if specified.
                 * @param message Block
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: ic_ledger.pb.v1.Block, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Block to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Block
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Hash. */
            interface IHash {

                /** Hash hash */
                hash?: (Uint8Array|null);
            }

            /** Represents a Hash. */
            class Hash implements IHash {

                /**
                 * Constructs a new Hash.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: ic_ledger.pb.v1.IHash);

                /** Hash hash. */
                public hash: Uint8Array;

                /**
                 * Creates a new Hash instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Hash instance
                 */
                public static create(properties?: ic_ledger.pb.v1.IHash): ic_ledger.pb.v1.Hash;

                /**
                 * Encodes the specified Hash message. Does not implicitly {@link ic_ledger.pb.v1.Hash.verify|verify} messages.
                 * @param message Hash message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: ic_ledger.pb.v1.IHash, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Hash message, length delimited. Does not implicitly {@link ic_ledger.pb.v1.Hash.verify|verify} messages.
                 * @param message Hash message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: ic_ledger.pb.v1.IHash, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Hash message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Hash
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ic_ledger.pb.v1.Hash;

                /**
                 * Decodes a Hash message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Hash
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ic_ledger.pb.v1.Hash;

                /**
                 * Verifies a Hash message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Hash message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Hash
                 */
                public static fromObject(object: { [k: string]: any }): ic_ledger.pb.v1.Hash;

                /**
                 * Creates a plain object from a Hash message. Also converts values to other types if specified.
                 * @param message Hash
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: ic_ledger.pb.v1.Hash, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Hash to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Hash
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of an Account. */
            interface IAccount {

                /** Account identifier */
                identifier?: (ic_ledger.pb.v1.IAccountIdentifier|null);

                /** Account balance */
                balance?: (ic_ledger.pb.v1.IICPTs|null);
            }

            /** Represents an Account. */
            class Account implements IAccount {

                /**
                 * Constructs a new Account.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: ic_ledger.pb.v1.IAccount);

                /** Account identifier. */
                public identifier?: (ic_ledger.pb.v1.IAccountIdentifier|null);

                /** Account balance. */
                public balance?: (ic_ledger.pb.v1.IICPTs|null);

                /**
                 * Creates a new Account instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Account instance
                 */
                public static create(properties?: ic_ledger.pb.v1.IAccount): ic_ledger.pb.v1.Account;

                /**
                 * Encodes the specified Account message. Does not implicitly {@link ic_ledger.pb.v1.Account.verify|verify} messages.
                 * @param message Account message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: ic_ledger.pb.v1.IAccount, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Account message, length delimited. Does not implicitly {@link ic_ledger.pb.v1.Account.verify|verify} messages.
                 * @param message Account message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: ic_ledger.pb.v1.IAccount, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an Account message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Account
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ic_ledger.pb.v1.Account;

                /**
                 * Decodes an Account message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Account
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ic_ledger.pb.v1.Account;

                /**
                 * Verifies an Account message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an Account message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Account
                 */
                public static fromObject(object: { [k: string]: any }): ic_ledger.pb.v1.Account;

                /**
                 * Creates a plain object from an Account message. Also converts values to other types if specified.
                 * @param message Account
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: ic_ledger.pb.v1.Account, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Account to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Account
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Transaction. */
            interface ITransaction {

                /** Transaction burn */
                burn?: (ic_ledger.pb.v1.IBurn|null);

                /** Transaction mint */
                mint?: (ic_ledger.pb.v1.IMint|null);

                /** Transaction send */
                send?: (ic_ledger.pb.v1.ISend|null);

                /** Transaction memo */
                memo?: (ic_ledger.pb.v1.IMemo|null);

                /** Transaction createdAt */
                createdAt?: (ic_ledger.pb.v1.IBlockHeight|null);

                /** Transaction createdAtTime */
                createdAtTime?: (ic_ledger.pb.v1.ITimeStamp|null);
            }

            /** Represents a Transaction. */
            class Transaction implements ITransaction {

                /**
                 * Constructs a new Transaction.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: ic_ledger.pb.v1.ITransaction);

                /** Transaction burn. */
                public burn?: (ic_ledger.pb.v1.IBurn|null);

                /** Transaction mint. */
                public mint?: (ic_ledger.pb.v1.IMint|null);

                /** Transaction send. */
                public send?: (ic_ledger.pb.v1.ISend|null);

                /** Transaction memo. */
                public memo?: (ic_ledger.pb.v1.IMemo|null);

                /** Transaction createdAt. */
                public createdAt?: (ic_ledger.pb.v1.IBlockHeight|null);

                /** Transaction createdAtTime. */
                public createdAtTime?: (ic_ledger.pb.v1.ITimeStamp|null);

                /** Transaction transfer. */
                public transfer?: ("burn"|"mint"|"send");

                /**
                 * Creates a new Transaction instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Transaction instance
                 */
                public static create(properties?: ic_ledger.pb.v1.ITransaction): ic_ledger.pb.v1.Transaction;

                /**
                 * Encodes the specified Transaction message. Does not implicitly {@link ic_ledger.pb.v1.Transaction.verify|verify} messages.
                 * @param message Transaction message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: ic_ledger.pb.v1.ITransaction, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Transaction message, length delimited. Does not implicitly {@link ic_ledger.pb.v1.Transaction.verify|verify} messages.
                 * @param message Transaction message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: ic_ledger.pb.v1.ITransaction, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Transaction message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Transaction
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ic_ledger.pb.v1.Transaction;

                /**
                 * Decodes a Transaction message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Transaction
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ic_ledger.pb.v1.Transaction;

                /**
                 * Verifies a Transaction message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Transaction message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Transaction
                 */
                public static fromObject(object: { [k: string]: any }): ic_ledger.pb.v1.Transaction;

                /**
                 * Creates a plain object from a Transaction message. Also converts values to other types if specified.
                 * @param message Transaction
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: ic_ledger.pb.v1.Transaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Transaction to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Transaction
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Send. */
            interface ISend {

                /** Send from */
                from?: (ic_ledger.pb.v1.IAccountIdentifier|null);

                /** Send to */
                to?: (ic_ledger.pb.v1.IAccountIdentifier|null);

                /** Send amount */
                amount?: (ic_ledger.pb.v1.IICPTs|null);

                /** Send maxFee */
                maxFee?: (ic_ledger.pb.v1.IICPTs|null);
            }

            /** Represents a Send. */
            class Send implements ISend {

                /**
                 * Constructs a new Send.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: ic_ledger.pb.v1.ISend);

                /** Send from. */
                public from?: (ic_ledger.pb.v1.IAccountIdentifier|null);

                /** Send to. */
                public to?: (ic_ledger.pb.v1.IAccountIdentifier|null);

                /** Send amount. */
                public amount?: (ic_ledger.pb.v1.IICPTs|null);

                /** Send maxFee. */
                public maxFee?: (ic_ledger.pb.v1.IICPTs|null);

                /**
                 * Creates a new Send instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Send instance
                 */
                public static create(properties?: ic_ledger.pb.v1.ISend): ic_ledger.pb.v1.Send;

                /**
                 * Encodes the specified Send message. Does not implicitly {@link ic_ledger.pb.v1.Send.verify|verify} messages.
                 * @param message Send message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: ic_ledger.pb.v1.ISend, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Send message, length delimited. Does not implicitly {@link ic_ledger.pb.v1.Send.verify|verify} messages.
                 * @param message Send message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: ic_ledger.pb.v1.ISend, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Send message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Send
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ic_ledger.pb.v1.Send;

                /**
                 * Decodes a Send message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Send
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ic_ledger.pb.v1.Send;

                /**
                 * Verifies a Send message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Send message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Send
                 */
                public static fromObject(object: { [k: string]: any }): ic_ledger.pb.v1.Send;

                /**
                 * Creates a plain object from a Send message. Also converts values to other types if specified.
                 * @param message Send
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: ic_ledger.pb.v1.Send, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Send to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Send
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Mint. */
            interface IMint {

                /** Mint to */
                to?: (ic_ledger.pb.v1.IAccountIdentifier|null);

                /** Mint amount */
                amount?: (ic_ledger.pb.v1.IICPTs|null);
            }

            /** Represents a Mint. */
            class Mint implements IMint {

                /**
                 * Constructs a new Mint.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: ic_ledger.pb.v1.IMint);

                /** Mint to. */
                public to?: (ic_ledger.pb.v1.IAccountIdentifier|null);

                /** Mint amount. */
                public amount?: (ic_ledger.pb.v1.IICPTs|null);

                /**
                 * Creates a new Mint instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Mint instance
                 */
                public static create(properties?: ic_ledger.pb.v1.IMint): ic_ledger.pb.v1.Mint;

                /**
                 * Encodes the specified Mint message. Does not implicitly {@link ic_ledger.pb.v1.Mint.verify|verify} messages.
                 * @param message Mint message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: ic_ledger.pb.v1.IMint, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Mint message, length delimited. Does not implicitly {@link ic_ledger.pb.v1.Mint.verify|verify} messages.
                 * @param message Mint message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: ic_ledger.pb.v1.IMint, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Mint message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Mint
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ic_ledger.pb.v1.Mint;

                /**
                 * Decodes a Mint message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Mint
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ic_ledger.pb.v1.Mint;

                /**
                 * Verifies a Mint message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Mint message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Mint
                 */
                public static fromObject(object: { [k: string]: any }): ic_ledger.pb.v1.Mint;

                /**
                 * Creates a plain object from a Mint message. Also converts values to other types if specified.
                 * @param message Mint
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: ic_ledger.pb.v1.Mint, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Mint to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Mint
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Burn. */
            interface IBurn {

                /** Burn from */
                from?: (ic_ledger.pb.v1.IAccountIdentifier|null);

                /** Burn amount */
                amount?: (ic_ledger.pb.v1.IICPTs|null);
            }

            /** Represents a Burn. */
            class Burn implements IBurn {

                /**
                 * Constructs a new Burn.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: ic_ledger.pb.v1.IBurn);

                /** Burn from. */
                public from?: (ic_ledger.pb.v1.IAccountIdentifier|null);

                /** Burn amount. */
                public amount?: (ic_ledger.pb.v1.IICPTs|null);

                /**
                 * Creates a new Burn instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Burn instance
                 */
                public static create(properties?: ic_ledger.pb.v1.IBurn): ic_ledger.pb.v1.Burn;

                /**
                 * Encodes the specified Burn message. Does not implicitly {@link ic_ledger.pb.v1.Burn.verify|verify} messages.
                 * @param message Burn message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: ic_ledger.pb.v1.IBurn, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Burn message, length delimited. Does not implicitly {@link ic_ledger.pb.v1.Burn.verify|verify} messages.
                 * @param message Burn message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: ic_ledger.pb.v1.IBurn, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Burn message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Burn
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ic_ledger.pb.v1.Burn;

                /**
                 * Decodes a Burn message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Burn
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ic_ledger.pb.v1.Burn;

                /**
                 * Verifies a Burn message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Burn message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Burn
                 */
                public static fromObject(object: { [k: string]: any }): ic_ledger.pb.v1.Burn;

                /**
                 * Creates a plain object from a Burn message. Also converts values to other types if specified.
                 * @param message Burn
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: ic_ledger.pb.v1.Burn, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Burn to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Burn
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of an AccountIdentifier. */
            interface IAccountIdentifier {

                /** AccountIdentifier hash */
                hash?: (Uint8Array|null);
            }

            /** Represents an AccountIdentifier. */
            class AccountIdentifier implements IAccountIdentifier {

                /**
                 * Constructs a new AccountIdentifier.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: ic_ledger.pb.v1.IAccountIdentifier);

                /** AccountIdentifier hash. */
                public hash: Uint8Array;

                /**
                 * Creates a new AccountIdentifier instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns AccountIdentifier instance
                 */
                public static create(properties?: ic_ledger.pb.v1.IAccountIdentifier): ic_ledger.pb.v1.AccountIdentifier;

                /**
                 * Encodes the specified AccountIdentifier message. Does not implicitly {@link ic_ledger.pb.v1.AccountIdentifier.verify|verify} messages.
                 * @param message AccountIdentifier message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: ic_ledger.pb.v1.IAccountIdentifier, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified AccountIdentifier message, length delimited. Does not implicitly {@link ic_ledger.pb.v1.AccountIdentifier.verify|verify} messages.
                 * @param message AccountIdentifier message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: ic_ledger.pb.v1.IAccountIdentifier, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an AccountIdentifier message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns AccountIdentifier
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ic_ledger.pb.v1.AccountIdentifier;

                /**
                 * Decodes an AccountIdentifier message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns AccountIdentifier
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ic_ledger.pb.v1.AccountIdentifier;

                /**
                 * Verifies an AccountIdentifier message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an AccountIdentifier message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns AccountIdentifier
                 */
                public static fromObject(object: { [k: string]: any }): ic_ledger.pb.v1.AccountIdentifier;

                /**
                 * Creates a plain object from an AccountIdentifier message. Also converts values to other types if specified.
                 * @param message AccountIdentifier
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: ic_ledger.pb.v1.AccountIdentifier, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this AccountIdentifier to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for AccountIdentifier
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Subaccount. */
            interface ISubaccount {

                /** Subaccount subAccount */
                subAccount?: (Uint8Array|null);
            }

            /** Represents a Subaccount. */
            class Subaccount implements ISubaccount {

                /**
                 * Constructs a new Subaccount.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: ic_ledger.pb.v1.ISubaccount);

                /** Subaccount subAccount. */
                public subAccount: Uint8Array;

                /**
                 * Creates a new Subaccount instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Subaccount instance
                 */
                public static create(properties?: ic_ledger.pb.v1.ISubaccount): ic_ledger.pb.v1.Subaccount;

                /**
                 * Encodes the specified Subaccount message. Does not implicitly {@link ic_ledger.pb.v1.Subaccount.verify|verify} messages.
                 * @param message Subaccount message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: ic_ledger.pb.v1.ISubaccount, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Subaccount message, length delimited. Does not implicitly {@link ic_ledger.pb.v1.Subaccount.verify|verify} messages.
                 * @param message Subaccount message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: ic_ledger.pb.v1.ISubaccount, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Subaccount message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Subaccount
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ic_ledger.pb.v1.Subaccount;

                /**
                 * Decodes a Subaccount message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Subaccount
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ic_ledger.pb.v1.Subaccount;

                /**
                 * Verifies a Subaccount message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Subaccount message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Subaccount
                 */
                public static fromObject(object: { [k: string]: any }): ic_ledger.pb.v1.Subaccount;

                /**
                 * Creates a plain object from a Subaccount message. Also converts values to other types if specified.
                 * @param message Subaccount
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: ic_ledger.pb.v1.Subaccount, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Subaccount to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Subaccount
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Memo. */
            interface IMemo {

                /** Memo memo */
                memo?: (number|Long|null);
            }

            /** Represents a Memo. */
            class Memo implements IMemo {

                /**
                 * Constructs a new Memo.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: ic_ledger.pb.v1.IMemo);

                /** Memo memo. */
                public memo: (number|Long);

                /**
                 * Creates a new Memo instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Memo instance
                 */
                public static create(properties?: ic_ledger.pb.v1.IMemo): ic_ledger.pb.v1.Memo;

                /**
                 * Encodes the specified Memo message. Does not implicitly {@link ic_ledger.pb.v1.Memo.verify|verify} messages.
                 * @param message Memo message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: ic_ledger.pb.v1.IMemo, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Memo message, length delimited. Does not implicitly {@link ic_ledger.pb.v1.Memo.verify|verify} messages.
                 * @param message Memo message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: ic_ledger.pb.v1.IMemo, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Memo message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Memo
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ic_ledger.pb.v1.Memo;

                /**
                 * Decodes a Memo message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Memo
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ic_ledger.pb.v1.Memo;

                /**
                 * Verifies a Memo message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Memo message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Memo
                 */
                public static fromObject(object: { [k: string]: any }): ic_ledger.pb.v1.Memo;

                /**
                 * Creates a plain object from a Memo message. Also converts values to other types if specified.
                 * @param message Memo
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: ic_ledger.pb.v1.Memo, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Memo to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Memo
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a TimeStamp. */
            interface ITimeStamp {

                /** TimeStamp timestampNanos */
                timestampNanos?: (number|Long|null);
            }

            /** Represents a TimeStamp. */
            class TimeStamp implements ITimeStamp {

                /**
                 * Constructs a new TimeStamp.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: ic_ledger.pb.v1.ITimeStamp);

                /** TimeStamp timestampNanos. */
                public timestampNanos: (number|Long);

                /**
                 * Creates a new TimeStamp instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns TimeStamp instance
                 */
                public static create(properties?: ic_ledger.pb.v1.ITimeStamp): ic_ledger.pb.v1.TimeStamp;

                /**
                 * Encodes the specified TimeStamp message. Does not implicitly {@link ic_ledger.pb.v1.TimeStamp.verify|verify} messages.
                 * @param message TimeStamp message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: ic_ledger.pb.v1.ITimeStamp, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified TimeStamp message, length delimited. Does not implicitly {@link ic_ledger.pb.v1.TimeStamp.verify|verify} messages.
                 * @param message TimeStamp message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: ic_ledger.pb.v1.ITimeStamp, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a TimeStamp message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns TimeStamp
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ic_ledger.pb.v1.TimeStamp;

                /**
                 * Decodes a TimeStamp message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns TimeStamp
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ic_ledger.pb.v1.TimeStamp;

                /**
                 * Verifies a TimeStamp message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a TimeStamp message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns TimeStamp
                 */
                public static fromObject(object: { [k: string]: any }): ic_ledger.pb.v1.TimeStamp;

                /**
                 * Creates a plain object from a TimeStamp message. Also converts values to other types if specified.
                 * @param message TimeStamp
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: ic_ledger.pb.v1.TimeStamp, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this TimeStamp to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for TimeStamp
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Certification. */
            interface ICertification {

                /** Certification certification */
                certification?: (Uint8Array|null);
            }

            /** Represents a Certification. */
            class Certification implements ICertification {

                /**
                 * Constructs a new Certification.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: ic_ledger.pb.v1.ICertification);

                /** Certification certification. */
                public certification: Uint8Array;

                /**
                 * Creates a new Certification instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Certification instance
                 */
                public static create(properties?: ic_ledger.pb.v1.ICertification): ic_ledger.pb.v1.Certification;

                /**
                 * Encodes the specified Certification message. Does not implicitly {@link ic_ledger.pb.v1.Certification.verify|verify} messages.
                 * @param message Certification message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: ic_ledger.pb.v1.ICertification, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Certification message, length delimited. Does not implicitly {@link ic_ledger.pb.v1.Certification.verify|verify} messages.
                 * @param message Certification message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: ic_ledger.pb.v1.ICertification, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Certification message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Certification
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ic_ledger.pb.v1.Certification;

                /**
                 * Decodes a Certification message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Certification
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ic_ledger.pb.v1.Certification;

                /**
                 * Verifies a Certification message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Certification message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Certification
                 */
                public static fromObject(object: { [k: string]: any }): ic_ledger.pb.v1.Certification;

                /**
                 * Creates a plain object from a Certification message. Also converts values to other types if specified.
                 * @param message Certification
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: ic_ledger.pb.v1.Certification, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Certification to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Certification
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }
    }
}
