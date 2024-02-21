import { AvailableCommands } from "..";
import { Account } from "../account/Account";
import { connector } from "../connector/Connector";

/**
 * The Provider class provides a simple and intuitive interface for interacting with a specific
 * wallet service.
 *
 */
export class Provider {
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
  /**
   * This method returns the name of the provider.
   * @returns The name of the provider.
   */
  name() {
    return this.providerName;
  }
  /**
   * This method sends a message to the content script to get the list of accounts for the provider.
   * It returns a Promise that resolves to an array of Account instances.
   *
   * @returns A promise that resolves to an array of Account instances.
   */
  async accounts() {
    const providersPromise = new Promise((resolve, reject) => {
      connector.sendMessageToContentScript(
        this.providerName,
        AvailableCommands.ProviderListAccounts,
        {},
        (result, err) => {
          if (err) return reject(err);
          return resolve(result);
        }
      );
    });
    const providerAccounts = await providersPromise;
    let accounts = [];
    for (const providerAccount of providerAccounts) {
      const accInstance = new Account(providerAccount, this.providerName);
      accounts.push(accInstance);
    }
    return accounts;
  }
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
  async importAccount(publicKey, privateKey) {
    const accountImportRequest = {
      publicKey,
      privateKey,
    };
    return new Promise((resolve, reject) => {
      connector.sendMessageToContentScript(
        this.providerName,
        AvailableCommands.ProviderImportAccount,
        accountImportRequest,
        (result, err) => {
          if (err) return reject(err);
          return resolve(result);
        }
      );
    });
  }
  /**
   * This method sends a message to the content script to delete the account associated with the given address.
   *
   * @param address - The address of the account.
   * @returns a Promise that resolves to an instance of IAccountDeletionResponse.
   */
  async deleteAccount(address) {
    const accountDeletionRequest = { address };
    return new Promise((resolve, reject) => {
      connector.sendMessageToContentScript(
        this.providerName,
        AvailableCommands.ProviderDeleteAccount,
        accountDeletionRequest,
        (result, err) => {
          if (err) return reject(err);
          return resolve(result);
        }
      );
    });
  }
  /**
   * This method sends a message to the content script to get the list of nodes urls
   * used to connect the front end to the Massa network.
   *
   * @returns a Promise that resolves to an array of nodes urls (string).
   *
   */
  async getNodesUrls() {
    return new Promise((resolve, reject) => {
      connector.sendMessageToContentScript(
        this.providerName,
        AvailableCommands.ProviderGetNodesUrls,
        {},
        (result, err) => {
          if (err) return reject(err);
          return resolve(result);
        }
      );
    });
  }
  /**
   * Returns the name of the network the provider is connected to.
   *
   * @returns a Promise that resolves to the network name (string).
   */
  async getNetwork() {
    return new Promise((resolve, reject) => {
      connector.sendMessageToContentScript(
        this.providerName,
        AvailableCommands.ProviderGetNetwork,
        {},
        (result, err) => {
          if (err) return reject(err);
          else if (typeof result !== "string") {
            return reject(
              new Error(`Expected a string but got ${typeof result} instead`)
            );
          }
          return resolve(result);
        }
      );
    });
  }
  /**
   * This method generates a new account by a given name and adds it to the wallet.
   *
   * @param name - The account name
   * @returns a Promise that resolves to an instance of IAccountDetails.
   */
  async generateNewAccount(name) {
    const accountGenerationRequest = { name };
    return new Promise((resolve, reject) => {
      connector.sendMessageToContentScript(
        this.providerName,
        AvailableCommands.ProviderGenerateNewAccount,
        accountGenerationRequest,
        (result, err) => {
          if (err) return reject(err);
          return resolve(result);
        }
      );
    });
  }
  listenAccountChanges(callback) {
    throw new Error(
      "listenAccountChanges is not yet implemented for the current provider."
    );
  }
  listenNetworkChanges(callback) {
    throw new Error(
      "listenNetworkChanges is not yet implemented for the current provider."
    );
  }
  async connect() {
    throw new Error(
      "connect functionality is not yet implemented for the current provider."
    );
  }
  async disconnect() {
    throw new Error(
      "disconnect functionality is not yet implemented for the current provider."
    );
  }
  connected() {
    throw new Error(
      "connected functionality is not yet implemented for the current provider."
    );
  }
  enabled() {
    throw new Error(
      "enabled functionality is not yet implemented for the current provider."
    );
  }
}
//# sourceMappingURL=Provider.js.map
