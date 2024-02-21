import { IAccount } from "../account/IAccount";
import { IAccountDetails } from "../account/IAccountDetails";
import { IAccountDeletionResponse } from "./AccountDeletion";
import { IAccountImportResponse } from "./AccountImport";
import { IProvider } from "./IProvider";

/**
 * The Provider class provides a simple and intuitive interface for interacting with a specific
 * wallet service.
 *
 */
export declare class Provider implements IProvider {
  private providerName;
  /**
   * Provider constructor
   *
   * @param providerName - The name of the provider.
   * @returns An instance of the Provider class.
   */
  constructor(providerName: string);
  /**
   * This method returns the name of the provider.
   * @returns The name of the provider.
   */
  name(): string;
  /**
   * This method sends a message to the content script to get the list of accounts for the provider.
   * It returns a Promise that resolves to an array of Account instances.
   *
   * @returns A promise that resolves to an array of Account instances.
   */
  accounts(): Promise<IAccount[]>;
  /**
   * This method sends a message to the content script to import an account with the given publicKey and privateKey.
   *
   * @remarks
   * - The IAccountImportResponse object contains the address of the imported account.
   * - The address is generated from the public key.
   *
   * @param publicKey - The public key of the account.
   * @param privateKey - The private key of the account.
   * @returns a Promise that resolves to an instance of IAccountImportResponse.
   *
   */
  importAccount(
    publicKey: string,
    privateKey: string
  ): Promise<IAccountImportResponse>;
  /**
   * This method sends a message to the content script to delete the account associated with the given address.
   *
   * @param address - The address of the account.
   * @returns a Promise that resolves to an instance of IAccountDeletionResponse.
   */
  deleteAccount(address: string): Promise<IAccountDeletionResponse>;
  /**
   * This method sends a message to the content script to get the list of nodes urls
   * used to connect the front end to the Massa network.
   *
   * @returns a Promise that resolves to an array of nodes urls (string).
   *
   */
  getNodesUrls(): Promise<string[]>;
  /**
   * Returns the name of the network the provider is connected to.
   *
   * @returns a Promise that resolves to the network name (string).
   */
  getNetwork(): Promise<string>;
  /**
   * This method generates a new account by a given name and adds it to the wallet.
   *
   * @param name - The account name
   * @returns a Promise that resolves to an instance of IAccountDetails.
   */
  generateNewAccount(name?: string): Promise<IAccountDetails>;
  listenAccountChanges(callback: (address: string) => void):
    | {
        unsubscribe: () => void;
      }
    | undefined;
  listenNetworkChanges(callback: (network: string) => void):
    | {
        unsubscribe: () => void;
      }
    | undefined;
  connect(): Promise<boolean>;
  disconnect(): Promise<boolean>;
  connected(): boolean;
  enabled(): boolean;
}
//# sourceMappingURL=Provider.d.ts.map
