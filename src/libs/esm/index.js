/** Polyfills */
import { detectBearby } from "./bearbyWallet/BearbyConnect";
import { BearbyProvider } from "./bearbyWallet/BearbyProvider";
import { MASSA_WINDOW_OBJECT, connector } from "./connector/Connector";
import {
  MASSA_STATION_PROVIDER_NAME,
  MassaStationProvider,
} from "./massaStation/MassaStationProvider";
import { Provider } from "./provider/Provider";
import { wait } from "./utils/time";
import { Buffer } from "buffer";

// Check if we are on browser
if (typeof window !== "undefined") {
  window.Buffer = Buffer;
}

export var AvailableCommands;
(function (AvailableCommands) {
  AvailableCommands["ProviderListAccounts"] = "LIST_ACCOUNTS";
  AvailableCommands["ProviderDeleteAccount"] = "DELETE_ACCOUNT";
  AvailableCommands["ProviderImportAccount"] = "IMPORT_ACCOUNT";
  AvailableCommands["ProviderGetNodesUrls"] = "GET_NODES_URLS";
  AvailableCommands["ProviderGetNetwork"] = "GET_NETWORK";
  AvailableCommands["AccountBalance"] = "ACCOUNT_BALANCE";
  AvailableCommands["AccountSign"] = "ACCOUNT_SIGN";
  AvailableCommands["ProviderGenerateNewAccount"] = "GENERATE_NEW_ACCOUNT";
  AvailableCommands["AccountSellRolls"] = "ACCOUNT_SELL_ROLLS";
  AvailableCommands["AccountBuyRolls"] = "ACCOUNT_BUY_ROLLS";
  AvailableCommands["AccountSendTransaction"] = "ACCOUNT_SEND_TRANSACTION";
  AvailableCommands["AccountCallSC"] = "ACCOUNT_CALL_SC";
})(AvailableCommands || (AvailableCommands = {}));
/**
 * Get the list of providers that are available to interact with.
 *
 * @param retry - If true, will retry to get the list of providers if none are available.
 * @param pollInterval - The timeout in milliseconds to wait between retries. default is 2000ms.
 * @param timeout - The timeout in milliseconds to wait before giving up. default is 3000ms.
 *
 * @returns An array of providers.
 */
export async function providers(
  retry = true,
  timeout = 3000,
  pollInterval = 500
) {
  const startTime = Date.now();
  await connector.startMassaStationDiscovery();
  let bearby;
  if (await detectBearby()) {
    bearby = new BearbyProvider("BEARBY");
  }
  while (Date.now() - startTime < timeout) {
    const providerInstances = getProviderInstances();
    if (bearby) providerInstances.push(bearby);
    if (!retry || providerInstances.length > 0) {
      return providerInstances;
    }
    await wait(pollInterval);
  }
  return [];
}
function getProviderInstances() {
  const availableProviders = Object.keys(connector.getWalletProviders());
  const providerInstances = availableProviders.map((providerName) => {
    if (providerName === MASSA_STATION_PROVIDER_NAME) {
      return new MassaStationProvider(connector.getProviderInfo(providerName));
    } else {
      return new Provider(providerName);
    }
  });
  return providerInstances;
}
/**
 * Manually register a provider to interact with.
 *
 * @param name - The name of the provider.
 * @param id - The id of the HTML element that is used to communicate with the provider.
 */
export function registerProvider(name, id = MASSA_WINDOW_OBJECT) {
  if (typeof document !== "undefined") {
    const registerEvent = new CustomEvent("register", {
      detail: { providerName: name },
    });
    const element = document?.getElementById(id);
    if (element) {
      element.dispatchEvent(registerEvent);
    }
  }
}
export async function getProviderByName(providerName) {
  const providersList = await providers();
  return providersList.find((p) => p.name() === providerName);
}
export { Account } from "./account";
export {
  EAccountDeletionResponse,
  EAccountImportResponse,
  Provider,
} from "./provider";
export { MassaStationAccount } from "./massaStation/MassaStationAccount";
export { connectBearby, disconnectBearby } from "./bearbyWallet/BearbyConnect";
//# sourceMappingURL=index.js.map
