import { IAccount, IAccountDetails } from "../account";
import {
  IAccountDeletionResponse,
  IAccountImportResponse,
  IProvider,
} from "../provider";

export declare class BearbyProvider implements IProvider {
  private providerName;
  /**
   * Provider constructor
   *
   * @param providerName - The name of the provider.
   * @returns An instance of the Provider class.
   */
  constructor(providerName: string);
  name(): string;
  accounts(): Promise<IAccount[]>;
  importAccount(
    publicKey: string,
    privateKey: string
  ): Promise<IAccountImportResponse>;
  deleteAccount(address: string): Promise<IAccountDeletionResponse>;
  getNodesUrls(): Promise<string[]>;
  getNetwork(): Promise<string>;
  generateNewAccount(name: string): Promise<IAccountDetails>;
  /**
   * Subscribes to account changes.
   *
   * @param callback - Callback to be called when the account changes.
   *
   * @returns A promise that resolves to a function that can be called to unsubscribe.
   *
   * @remarks
   * Don't forget to unsubscribe to avoid memory leaks.
   *
   * @example
   * ```typescript
   * // Subscribe
   * const observer = await provider.listenAccountChanges((base58) => {
   *  console.log(base58);
   * });
   *
   * // Unsubscribe
   * observer.unsubscribe();
   * ```
   */
  listenAccountChanges(callback: (base58: string) => void): {
    unsubscribe: () => void;
  };
  /**
   * Subscribes to network changes.
   *
   * @param callback - Callback to be called when the network changes.
   *
   * @returns A promise that resolves to a function that can be called to unsubscribe.
   *
   * @remarks
   * Don't forget to unsubscribe to avoid memory leaks.
   *
   * @example
   * ```typescript
   * // Subscribe
   * const observer = await provider.listenNetworkChanges((network) => {
   *  console.log(network);
   * });
   *
   * // Unsubscribe
   * observer.unsubscribe();
   * ```
   */
  listenNetworkChanges(callback: (network: string) => void): {
    unsubscribe: () => void;
  };
  /**
   * Connects to the wallet.
   *
   * @remarks
   * This method will attempt to establish a connection with the wallet.
   * If the connection fails, it will log the error message.
   */
  connect(): Promise<boolean>;
  /**
   * Disconnects from the wallet.
   *
   * @remarks
   * This method will attempt to disconnect from the wallet.
   * If the disconnection fails, it will log the error message.
   */
  disconnect(): Promise<boolean>;
  /**
   * Checks if the wallet is connected.
   *
   * @returns a boolean indicating whether the wallet is connected.
   */
  connected(): boolean;
  /**
   * Checks if the wallet is enabled.
   *
   * @returns a boolean indicating whether the wallet is enabled.
   */
  enabled(): boolean;
}
//# sourceMappingURL=BearbyProvider.d.ts.map
