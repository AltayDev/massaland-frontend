import { EAccountDeletionResponse } from "../provider/AccountDeletion";
import { EAccountImportResponse } from "../provider/AccountImport";
import { MassaStationAccount } from "./MassaStationAccount";
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "./RequestHandler";
import EventEmitter from "events";

/**
 * MassaStation url
 */
export const MASSA_STATION_URL = "https://station.massa/";
/**
 * The MassaStation accounts url
 */
export const MASSA_STATION_ACCOUNTS_URL = `${MASSA_STATION_URL}plugin/massa-labs/massa-wallet/api/accounts`;
/**
 * MassaStation's url for importing accounts
 */
export const MASSA_STATION_IMPORT_ACCOUNTS_URL = `${MASSA_STATION_ACCOUNTS_URL}/import/`;
/**
 * MassaStation's wallet provider name
 */
export const MASSA_STATION_PROVIDER_NAME = "MASSASTATION";
/**
 * Events emitted by MassaStation
 */
const MASSA_STATION_NETWORK_CHANGED = "MASSA_STATION_NETWORK_CHANGED";
var MassaStationAccountStatus;
(function (MassaStationAccountStatus) {
  MassaStationAccountStatus["OK"] = "ok";
  MassaStationAccountStatus["CORRUPTED"] = "corrupted";
})(MassaStationAccountStatus || (MassaStationAccountStatus = {}));
/**
 * This class provides an implementation for communicating with the MassaStation wallet provider.
 * @remarks
 * This class is used as a proxy to the MassaStation server for exchanging message over https calls.
 */
export class MassaStationProvider {
  infos;
  providerName = MASSA_STATION_PROVIDER_NAME;
  massaStationEventsListener = new EventEmitter();
  currentNetwork;
  /**
   * Provider constructor
   *
   * @param providerName - The name of the provider.
   * @returns An instance of the Provider class.
   */
  constructor(infos) {
    this.infos = infos;
  }
  /**
   * This method returns the name of the provider.
   * @returns The name of the provider.
   */
  name() {
    return this.providerName;
  }
  /**
   * This method sends a message to the MassaStation server to get the list of accounts for the provider.
   * It returns a Promise that resolves to an array of Account instances.
   *
   * @returns A promise that resolves to an array of Account instances.
   */
  async accounts() {
    let massaStationAccountsResponse = null;
    try {
      massaStationAccountsResponse = await getRequest(
        MASSA_STATION_ACCOUNTS_URL
      );
    } catch (ex) {
      console.error(`MassaStation accounts retrieval error`);
      throw ex;
    }
    if (
      massaStationAccountsResponse.isError ||
      massaStationAccountsResponse.error
    ) {
      throw massaStationAccountsResponse.error.message;
    }
    return massaStationAccountsResponse.result
      .filter((massaStationAccount) => {
        return massaStationAccount.status === MassaStationAccountStatus.OK;
      })
      .map((massaStationAccount) => {
        return new MassaStationAccount(
          {
            address: massaStationAccount.address,
            name: massaStationAccount.nickname,
          },
          this.providerName
        );
      });
  }
  /**
   * This method makes an http call to the MassaStation server to import an account with
   * the given publicKey and privateKey.
   *
   * @param publicKey - The public key of the account.
   * @param privateKey - The private key of the account.
   *
   * @returns a Promise that resolves to an instance of IAccountImportResponse.
   */
  async importAccount(publicKey, privateKey) {
    const accountImportRequest = {
      publicKey,
      privateKey,
    };
    let massaStationAccountsResponse = null;
    try {
      massaStationAccountsResponse = await putRequest(
        MASSA_STATION_ACCOUNTS_URL,
        accountImportRequest
      );
    } catch (ex) {
      console.log(`MassaStation accounts retrieval error: ${ex}`);
      throw ex;
    }
    if (
      massaStationAccountsResponse.isError ||
      massaStationAccountsResponse.error
    ) {
      throw massaStationAccountsResponse.error.message;
    }
    return {
      response: EAccountImportResponse.OK,
      message: "Account imported successfully",
    };
  }
  /**
   * This method sends an http call to the MassaStation server to delete the account associated with the given address.
   *
   * @param address - The address of the account.
   * @returns a Promise that resolves to an instance of IAccountDeletionResponse.
   */
  async deleteAccount(address) {
    // get all accounts
    let allAccounts = null;
    try {
      allAccounts = await getRequest(MASSA_STATION_ACCOUNTS_URL);
    } catch (ex) {
      console.log(`MassaStation accounts retrieval error: ${ex}`);
      throw ex;
    }
    if (allAccounts.isError || allAccounts.error) {
      throw allAccounts.error.message;
    }
    // find the account with the desired address
    const accountToDelete = allAccounts.result.find(
      (account) => account.address.toLowerCase() === address.toLowerCase()
    );
    // delete the account in question
    let massaStationAccountsResponse = null;
    try {
      massaStationAccountsResponse = await deleteRequest(
        `${MASSA_STATION_ACCOUNTS_URL}/${accountToDelete.nickname}`
      );
    } catch (ex) {
      console.log(`MassaStation accounts deletion error`, ex);
      return {
        response: EAccountDeletionResponse.ERROR,
      };
    }
    if (
      massaStationAccountsResponse.isError ||
      massaStationAccountsResponse.error
    ) {
      console.log(
        `MassaStation accounts deletion error`,
        massaStationAccountsResponse.error.message
      );
      return {
        response: EAccountDeletionResponse.ERROR,
      };
    }
    return {
      response: EAccountDeletionResponse.OK,
    };
  }
  /**
   * This method sends an http call to the MassaStation server to obtain node urls.
   *
   * @throws an error if the call fails.
   *
   * @returns a Promise that resolves to a list of node urls.
   */
  async getNodesUrls() {
    let nodesResponse = null;
    try {
      nodesResponse = await getRequest(`${MASSA_STATION_URL}massa/node`);
      if (nodesResponse.isError || nodesResponse.error) {
        throw nodesResponse.error.message;
      }
      // transform nodesResponse.result to a json and then get the "url" property
      const nodes = nodesResponse.result;
      return Array(nodes.url);
    } catch (ex) {
      console.error(`MassaStation nodes retrieval error`, ex);
      throw ex;
    }
  }
  /**
   * Returns the name of the network MassaStation is connected to.
   *
   * @throws an error if the call fails.
   *
   * @returns a Promise that resolves to a network.
   */
  async getNetwork() {
    try {
      const nodesResponse = await getRequest(`${MASSA_STATION_URL}massa/node`);
      if (nodesResponse.isError || nodesResponse.error) {
        throw nodesResponse.error.message;
      }
      if (this.currentNetwork?.name !== nodesResponse.result.network) {
        this.currentNetwork = {
          name: nodesResponse.result.network,
          url: nodesResponse.result.url,
          chainId: BigInt(nodesResponse.result.chainId),
        };
      }
      const nodes = nodesResponse.result;
      return nodes.network;
    } catch (ex) {
      console.error(`MassaStation nodes retrieval error`, ex);
      throw ex;
    }
  }
  /**
   * This method sends an http call to the MassaStation server to create a new random account.
   *
   * @returns a Promise that resolves to the details of the newly generated account.
   */
  async generateNewAccount(name) {
    let massaStationAccountsResponse = null;
    console.log(MASSA_STATION_ACCOUNTS_URL + "/" + name);
    try {
      massaStationAccountsResponse = await postRequest(
        MASSA_STATION_ACCOUNTS_URL + "/" + name,
        {}
      );
      if (
        massaStationAccountsResponse.isError ||
        massaStationAccountsResponse.error
      ) {
        throw massaStationAccountsResponse.error.message;
      }
      return {
        address: massaStationAccountsResponse.result.address,
        name: massaStationAccountsResponse.result.nickname,
      };
    } catch (ex) {
      console.error(`Error while generating account: ${ex}`);
      throw ex;
    }
  }
  listenAccountChanges(callback) {
    throw new Error(
      "listenAccountChanges is not yet implemented for the current provider."
    );
  }
  listenNetworkChanges(callback) {
    this.massaStationEventsListener.on(MASSA_STATION_NETWORK_CHANGED, (evt) =>
      callback(evt)
    );
    // check periodically if network changed
    const intervalId = setInterval(async () => {
      const currentNetwork = this.currentNetwork?.name;
      const network = await this.getNetwork();
      if (currentNetwork !== network) {
        this.massaStationEventsListener.emit(
          MASSA_STATION_NETWORK_CHANGED,
          network
        );
      }
    }, 500);
    return {
      unsubscribe: () => {
        clearInterval(intervalId);
        this.massaStationEventsListener.removeListener(
          MASSA_STATION_NETWORK_CHANGED,
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          () => {}
        );
      },
    };
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
//# sourceMappingURL=MassaStationProvider.js.map
