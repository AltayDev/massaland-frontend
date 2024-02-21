import { AvailableCommands } from "..";
import { connector } from "../connector/Connector";

/**
 * The Account class represents a wallet account. It provides methods for interacting
 * with the account's balance and for signing messages.
 */
export class Account {
  _providerName;
  _address;
  _name;
  /**
   * Initializes a new instance of the Account class.
   *
   * @param address - Account address.
   * @param name - Account name.
   * @param providerName - Blockchain provider name.
   *
   * @remarks
   * - Utilizes  IAccountDetails for account information and a providerName string for blockchain interaction.
   * - The providerName string identifies the provider that is used to interact with the blockchain.
   */
  constructor({ address, name }, providerName) {
    this._address = address;
    this._name = name ?? "";
    this._providerName = providerName;
  }
  /**
   * @returns The address of the account.
   */
  address() {
    return this._address;
  }
  /**
   * @returns The name of the account.
   */
  name() {
    return this._name;
  }
  /**
   * @returns The name of the provider.
   */
  providerName() {
    return this._providerName;
  }
  /**
   * Retrieves the account balance.
   *
   * @returns A promise that resolves to an object of type  IAccountBalanceResponse.
   */
  async balance() {
    return new Promise((resolve, reject) => {
      connector.sendMessageToContentScript(
        this._providerName,
        AvailableCommands.AccountBalance,
        { address: this._address },
        (result, err) => {
          if (err) return reject(err);
          return resolve(result);
        }
      );
    });
  }
  /**
   * Signs a provided message.
   *
   * @param data - Message to sign.
   * @returns An  IAccountSignOutput object which contains the signature and the public key.
   */
  async sign(data) {
    return new Promise((resolve, reject) => {
      connector.sendMessageToContentScript(
        this._providerName,
        AvailableCommands.AccountSign,
        { address: this._address, data },
        (result, err) => {
          if (err) return reject(err);
          return resolve(result);
        }
      );
    });
  }
  /**
   * Purchases rolls for the sender.
   *
   * @param amount - Number of rolls to purchase.
   * @param fee - Transaction execution fee (in smallest unit).
   * @returns A promise resolving to an  ITransactionDetails containing the network operation ID.
   */
  async buyRolls(amount, fee) {
    return new Promise((resolve, reject) => {
      connector.sendMessageToContentScript(
        this._providerName,
        AvailableCommands.AccountBuyRolls,
        {
          amount: amount.toString(),
          fee: fee.toString(),
        },
        (result, err) => {
          if (err) return reject(err);
          return resolve(result);
        }
      );
    });
  }
  /**
   * Sells rolls on behalf of the sender.
   *
   * @param amount - Number of rolls to sell.
   * @param fee - Transaction execution fee  (in smallest unit).
   * @returns A promise resolving to an  ITransactionDetails containing the network operation ID.
   */
  async sellRolls(amount, fee) {
    return new Promise((resolve, reject) => {
      connector.sendMessageToContentScript(
        this._providerName,
        AvailableCommands.AccountSellRolls,
        {
          amount: amount.toString(),
          fee: fee.toString(),
        },
        (result, err) => {
          if (err) return reject(err);
          return resolve(result);
        }
      );
    });
  }
  /**
   * Transfers MAS from the sender to a recipient.
   *
   * @param amount - Amount of MAS to transfer (in smallest unit).
   * @param recipientAddress - Recipient's address.
   * @param fee - Transaction execution fee (in smallest unit).
   *
   * @returns A promise resolving to an  ITransactionDetails containing the network operation ID.
   */
  async sendTransaction(amount, recipientAddress, fee) {
    return new Promise((resolve, reject) => {
      connector.sendMessageToContentScript(
        this._providerName,
        AvailableCommands.AccountSendTransaction,
        {
          amount: amount.toString(),
          recipientAddress,
          fee: fee.toString(),
        },
        (result, err) => {
          if (err) return reject(err);
          return resolve(result);
        }
      );
    });
  }
  /**
   * Interacts with a smart contract on the MASSA blockchain.
   *
   * @remarks
   * If dryRun is true, performs a dry run and returns an  IContractReadOperationResponse with dry run details.
   *
   * @param contractAddress - Smart contract address.
   * @param functionName - Function name to call.
   * @param parameter - Function parameters.
   * @param amount - Amount of MASSA coins to send (in smallest unit).
   * @param fee - Transaction execution fee (in smallest unit).
   * @param maxGas - Maximum gas for transaction execution.
   * @param nonPersistentExecution - Whether to perform a dry run.
   *
   * @returns A promise resolving to either:
   *  IContractReadOperationResponse (for dry runs) or ITransactionDetails (for actual transactions).
   */
  async callSC(
    contractAddress,
    functionName,
    parameter,
    amount,
    fee,
    maxGas,
    nonPersistentExecution = false
  ) {
    return new Promise((resolve, reject) => {
      connector.sendMessageToContentScript(
        this._providerName,
        AvailableCommands.AccountCallSC,
        {
          nickname: this._name,
          name: functionName,
          at: contractAddress,
          args: parameter,
          coins: amount,
          fee: fee,
          maxGas: maxGas,
          nonPersistentExecution: nonPersistentExecution,
        },
        (result, err) => {
          if (err) return reject(err);
          return resolve(nonPersistentExecution ? result : result);
        }
      );
    });
  }
}
//# sourceMappingURL=Account.js.map
