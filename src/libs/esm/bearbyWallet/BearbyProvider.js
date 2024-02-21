import { BearbyAccount } from "./BearbyAccount";
import { web3 } from "@hicaru/bearby.js";

export class BearbyProvider {
  providerName;
  /**
   * Provider constructor
   *
   * @param providerName - The name of the provider.
   * @returns An instance of the Provider class.
   */
  constructor(providerName) {
    this.providerName = providerName;
  }
  name() {
    return this.providerName;
  }
  async accounts() {
    // check if bearby is unlocked
    if (!web3.wallet.connected) {
      await web3.wallet.connect();
    }
    const account = {
      address: await web3.wallet.account.base58,
      name: "BEARBY",
    };
    return [new BearbyAccount(account, this.providerName)];
  }
  async importAccount(publicKey, privateKey) {
    throw new Error("Method not implemented.");
  }
  async deleteAccount(address) {
    throw new Error("Method not implemented.");
  }
  async getNodesUrls() {
    return ["https://buildnet.massa.net/api/v2"];
  }
  async getNetwork() {
    const network = await web3.wallet.network;
    return network.net;
  }
  async generateNewAccount(name) {
    throw new Error("Method not implemented.");
  }
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
  listenAccountChanges(callback) {
    return web3.wallet.account.subscribe((base58) => callback(base58));
  }
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
  listenNetworkChanges(callback) {
    return web3.wallet.network.subscribe((network) => callback(network));
  }
  /**
   * Connects to the wallet.
   *
   * @remarks
   * This method will attempt to establish a connection with the wallet.
   * If the connection fails, it will log the error message.
   */
  async connect() {
    return web3.wallet.connect();
  }
  /**
   * Disconnects from the wallet.
   *
   * @remarks
   * This method will attempt to disconnect from the wallet.
   * If the disconnection fails, it will log the error message.
   */
  async disconnect() {
    return web3.wallet.disconnect();
  }
  /**
   * Checks if the wallet is connected.
   *
   * @returns a boolean indicating whether the wallet is connected.
   */
  connected() {
    return web3.wallet.connected;
  }
  /**
   * Checks if the wallet is enabled.
   *
   * @returns a boolean indicating whether the wallet is enabled.
   */
  enabled() {
    return web3.wallet.enabled;
  }
}
//# sourceMappingURL=BearbyProvider.js.map
