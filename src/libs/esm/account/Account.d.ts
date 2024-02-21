/// <reference types="node" />
import { ITransactionDetails } from "..";
import { IAccountBalanceResponse } from "./AccountBalance";
import { IAccountSignOutput } from "./AccountSign";
import { IAccount } from "./IAccount";
import { IAccountDetails } from "./IAccountDetails";
import { Args, IContractReadOperationResponse } from "@massalabs/web3-utils";

/**
 * The Account class represents a wallet account. It provides methods for interacting
 * with the account's balance and for signing messages.
 */
export declare class Account implements IAccount {
  private _providerName;
  private _address;
  private _name;
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
  constructor({ address, name }: IAccountDetails, providerName: string);
  /**
   * @returns The address of the account.
   */
  address(): string;
  /**
   * @returns The name of the account.
   */
  name(): string;
  /**
   * @returns The name of the provider.
   */
  providerName(): string;
  /**
   * Retrieves the account balance.
   *
   * @returns A promise that resolves to an object of type  IAccountBalanceResponse.
   */
  balance(): Promise<IAccountBalanceResponse>;
  /**
   * Signs a provided message.
   *
   * @param data - Message to sign.
   * @returns An  IAccountSignOutput object which contains the signature and the public key.
   */
  sign(data: Buffer | Uint8Array): Promise<IAccountSignOutput>;
  /**
   * Purchases rolls for the sender.
   *
   * @param amount - Number of rolls to purchase.
   * @param fee - Transaction execution fee (in smallest unit).
   * @returns A promise resolving to an  ITransactionDetails containing the network operation ID.
   */
  buyRolls(amount: bigint, fee: bigint): Promise<ITransactionDetails>;
  /**
   * Sells rolls on behalf of the sender.
   *
   * @param amount - Number of rolls to sell.
   * @param fee - Transaction execution fee  (in smallest unit).
   * @returns A promise resolving to an  ITransactionDetails containing the network operation ID.
   */
  sellRolls(amount: bigint, fee: bigint): Promise<ITransactionDetails>;
  /**
   * Transfers MAS from the sender to a recipient.
   *
   * @param amount - Amount of MAS to transfer (in smallest unit).
   * @param recipientAddress - Recipient's address.
   * @param fee - Transaction execution fee (in smallest unit).
   *
   * @returns A promise resolving to an  ITransactionDetails containing the network operation ID.
   */
  sendTransaction(
    amount: bigint,
    recipientAddress: string,
    fee: bigint
  ): Promise<ITransactionDetails>;
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
  callSC(
    contractAddress: string,
    functionName: string,
    parameter: Uint8Array | Args,
    amount: bigint,
    fee: bigint,
    maxGas: bigint,
    nonPersistentExecution?: boolean
  ): Promise<ITransactionDetails | IContractReadOperationResponse>;
}
//# sourceMappingURL=Account.d.ts.map
