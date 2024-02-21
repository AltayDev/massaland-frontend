/// <reference types="node" />
import { ITransactionDetails } from "..";
import { IAccountBalanceResponse, IAccountDetails } from "../account";
import { IAccountSignOutput } from "../account/AccountSign";
import { IAccount } from "../account/IAccount";
import { NodeStatus } from "./NodeStatus";
import { JSON_RPC_REQUEST_METHOD } from "./jsonRpcMethods";
import { Args, IContractReadOperationResponse } from "@massalabs/web3-utils";

/**
 * The RPC we are using to query the node
 */
export declare const PUBLIC_NODE_RPC = "https://buildnet.massa.net/api/v2";
export declare enum OperationsType {
  Payment = 0,
  RollBuy = 1,
  RollSell = 2,
  ExecuteSC = 3,
  CallSC = 4,
}
/**
 * Associates an operation type with a number.
 */
export declare enum OperationTypeId {
  Transaction = 0,
  RollBuy = 1,
  RollSell = 2,
  ExecuteSC = 3,
  CallSC = 4,
}
export declare class BearbyAccount implements IAccount {
  private _providerName;
  private _address;
  private _name;
  private _nodeUrl;
  constructor({ address, name }: IAccountDetails, providerName: string);
  address(): string;
  name(): string;
  providerName(): string;
  connect(): Promise<void>;
  balance(): Promise<IAccountBalanceResponse>;
  sign(data: Buffer | Uint8Array | string): Promise<IAccountSignOutput>;
  buyRolls(amount: bigint, fee: bigint): Promise<ITransactionDetails>;
  sellRolls(amount: bigint, fee: bigint): Promise<ITransactionDetails>;
  sendTransaction(
    amount: bigint,
    recipientAddress: string,
    fee: bigint
  ): Promise<ITransactionDetails>;
  callSC(
    contractAddress: string,
    functionName: string,
    parameter: Args | Uint8Array,
    amount: bigint,
    fee: bigint,
    maxGas: bigint,
    nonPersistentExecution?: boolean
  ): Promise<ITransactionDetails | IContractReadOperationResponse>;
  /**
   * Retrieves the node's status.
   *
   * @remarks
   * The returned information includes:
   * - Whether the node is reachable
   * - The number of connected peers
   * - The node's version
   * - The node's configuration parameters
   *
   * @returns A promise that resolves to the node's status information.
   */
  getNodeStatus(): Promise<NodeStatus>;
  /**
   * Sends a post JSON rpc request to the node.
   *
   * @param resource - The rpc method to call.
   * @param params - The parameters to pass to the rpc method.
   *
   * @throws An error if the rpc method returns an error.
   *
   * @returns A promise that resolves as the result of the rpc method.
   */
  protected sendJsonRPCRequest<T>(
    resource: JSON_RPC_REQUEST_METHOD,
    params: object
  ): Promise<T>;
  /**
   * Converts a json rpc call to a promise that resolves as a JsonRpcResponseData
   *
   * @privateRemarks
   * If there is an error while sending the request, the function catches the error, the isError
   * property is set to true, the result property set to null, and the error property set to a
   * new Error object with a message indicating that there was an error.
   *
   * @param resource - The rpc method to call.
   * @param params - The parameters to pass to the rpc method.
   *
   * @returns A promise that resolves as a JsonRpcResponseData.
   */
  private promisifyJsonRpcCall;
  nonPersistentCallSC(
    contractAddress: string,
    functionName: string,
    parameter: Uint8Array | Args,
    amount: bigint,
    fee: bigint,
    maxGas: bigint
  ): Promise<IContractReadOperationResponse>;
}
//# sourceMappingURL=BearbyAccount.d.ts.map
