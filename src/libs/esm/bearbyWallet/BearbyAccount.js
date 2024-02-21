import { postRequest } from "../massaStation/RequestHandler";
import { JSON_RPC_REQUEST_METHOD } from "./jsonRpcMethods";
import { web3 } from "@hicaru/bearby.js";
import axios from "axios";

/**
 * The maximum allowed gas for a read operation
 */
const MAX_READ_BLOCK_GAS = BigInt(4_294_967_295);
/**
 * The RPC we are using to query the node
 */
export const PUBLIC_NODE_RPC = "https://buildnet.massa.net/api/v2";
export var OperationsType;
(function (OperationsType) {
  OperationsType[(OperationsType["Payment"] = 0)] = "Payment";
  OperationsType[(OperationsType["RollBuy"] = 1)] = "RollBuy";
  OperationsType[(OperationsType["RollSell"] = 2)] = "RollSell";
  OperationsType[(OperationsType["ExecuteSC"] = 3)] = "ExecuteSC";
  OperationsType[(OperationsType["CallSC"] = 4)] = "CallSC";
})(OperationsType || (OperationsType = {}));
/**
 * Associates an operation type with a number.
 */
export var OperationTypeId;
(function (OperationTypeId) {
  OperationTypeId[(OperationTypeId["Transaction"] = 0)] = "Transaction";
  OperationTypeId[(OperationTypeId["RollBuy"] = 1)] = "RollBuy";
  OperationTypeId[(OperationTypeId["RollSell"] = 2)] = "RollSell";
  OperationTypeId[(OperationTypeId["ExecuteSC"] = 3)] = "ExecuteSC";
  OperationTypeId[(OperationTypeId["CallSC"] = 4)] = "CallSC";
})(OperationTypeId || (OperationTypeId = {}));
const requestHeaders = {
  Accept:
    "application/json,text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Content-Type": "application/json",
};
export class BearbyAccount {
  _providerName;
  _address;
  _name;
  _nodeUrl = PUBLIC_NODE_RPC;
  constructor({ address, name }, providerName) {
    this._address = address;
    this._name = name ?? "Bearby_account";
    this._providerName = providerName;
  }
  address() {
    return this._address;
  }
  name() {
    return this._name;
  }
  providerName() {
    return this._providerName;
  }
  // TODO: Should be removed from account interface as it more a provider method
  async connect() {
    try {
      await web3.wallet.connect();
    } catch (ex) {
      console.log("Bearby connection error: ", ex);
    }
  }
  // needs testing
  async balance() {
    await this.connect();
    // Not available on bearby. we have to manually call the api
    const body = {
      jsonrpc: "2.0",
      method: "get_addresses",
      params: [[this._address]],
      id: 0,
    };
    const addressInfos = await postRequest(PUBLIC_NODE_RPC, body);
    if (addressInfos.isError || addressInfos.error) {
      throw addressInfos.error.message;
    }
    return {
      finalBalance: addressInfos.result.result[0].final_balance,
      candidateBalance: addressInfos.result.result[0].candidate_balance,
    };
  }
  // need testing
  async sign(data) {
    await this.connect();
    let strData;
    if (data instanceof Uint8Array) {
      strData = new TextDecoder().decode(data);
    }
    if (data instanceof Buffer) {
      strData = data.toString();
    }
    const signature = await web3.wallet.signMessage(strData);
    return {
      publicKey: signature.publicKey,
      base58Encoded: signature.signature,
    };
  }
  // need testing
  async buyRolls(amount, fee) {
    await this.connect();
    const operationId = await web3.massa.buyRolls(amount.toString());
    return {
      operationId,
    };
  }
  // need testing
  async sellRolls(amount, fee) {
    await this.connect();
    const operationId = await web3.massa.sellRolls(amount.toString());
    return {
      operationId,
    };
  }
  async sendTransaction(amount, recipientAddress, fee) {
    await this.connect();
    const operationId = await web3.massa.payment(
      amount.toString(),
      recipientAddress
    );
    return {
      operationId,
    };
  }
  async callSC(
    contractAddress,
    functionName,
    parameter,
    amount,
    fee,
    maxGas,
    nonPersistentExecution = false
  ) {
    await this.connect();
    if (nonPersistentExecution) {
      return this.nonPersistentCallSC(
        contractAddress,
        functionName,
        parameter,
        amount,
        fee,
        maxGas
      );
    }
    let unsafeParameters;
    if (parameter instanceof Uint8Array) {
      unsafeParameters = parameter;
    } else {
      unsafeParameters = Uint8Array.from(parameter.serialize());
    }
    const operationId = await web3.contract.call({
      maxGas: Number(maxGas),
      coins: Number(amount),
      fee: Number(fee),
      targetAddress: contractAddress,
      functionName: functionName,
      unsafeParameters,
    });
    return { operationId };
  }
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
  async getNodeStatus() {
    const jsonRpcRequestMethod = JSON_RPC_REQUEST_METHOD.GET_STATUS;
    return await this.sendJsonRPCRequest(jsonRpcRequestMethod, []);
  }
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
  async sendJsonRPCRequest(resource, params) {
    let resp = null;
    resp = await this.promisifyJsonRpcCall(resource, params);
    // in case of rpc error, rethrow the error.
    if (resp.isError || resp.error) {
      throw resp.error;
    }
    return resp.result;
  }
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
  async promisifyJsonRpcCall(resource, params) {
    let resp = null;
    const body = {
      jsonrpc: "2.0",
      method: resource,
      params: params,
      id: 0,
    };
    try {
      resp = await axios.post(this._nodeUrl, body, { headers: requestHeaders });
    } catch (ex) {
      return {
        isError: true,
        result: null,
        error: new Error("JSON.parse error: " + String(ex)),
      };
    }
    const responseData = resp.data;
    if (responseData.error) {
      return {
        isError: true,
        result: null,
        error: new Error(responseData.error.message),
      };
    }
    return {
      isError: false,
      result: responseData.result,
      error: null,
    };
  }
  async nonPersistentCallSC(
    contractAddress,
    functionName,
    parameter,
    amount,
    fee,
    maxGas
  ) {
    // not clean but bearby doesn't allow us to get its node urls
    const node = PUBLIC_NODE_RPC;
    // Gas amount check
    if (maxGas > MAX_READ_BLOCK_GAS) {
      throw new Error(`
        The gas submitted ${maxGas.toString()} exceeds the max. allowed block gas of 
        ${MAX_READ_BLOCK_GAS.toString()}
        `);
    }
    // convert parameter to an array of numbers
    let argumentArray = [];
    if (parameter instanceof Uint8Array) {
      argumentArray = Array.from(parameter);
    } else {
      argumentArray = Array.from(parameter.serialize());
    }
    // setup the request body
    const data = {
      max_gas: Number(maxGas),
      target_address: contractAddress,
      target_function: functionName,
      parameter: argumentArray,
      caller_address: this._address,
      coins: Number(amount),
      fee: Number(fee),
    };
    const body = [
      {
        jsonrpc: "2.0",
        method: "execute_read_only_call",
        params: [[data]],
        id: 0,
      },
    ];
    // returns operation ids
    let jsonRpcCallResult = [];
    try {
      let resp = await postRequest(node, body);
      if (resp.isError || resp.error) {
        throw resp.error.message;
      }
      jsonRpcCallResult = resp.result;
    } catch (ex) {
      throw new Error(
        `MassaStation account: error while interacting with smart contract: ${ex}`
      );
    }
    if (jsonRpcCallResult.length <= 0) {
      throw new Error(
        `Read operation bad response. No results array in json rpc response. Inspect smart contract`
      );
    }
    if (jsonRpcCallResult[0].result.Error) {
      throw new Error(jsonRpcCallResult[0].result.Error);
    }
    return {
      returnValue: new Uint8Array(jsonRpcCallResult[0].result[0].result.Ok),
      info: jsonRpcCallResult[0],
    };
  }
}
//# sourceMappingURL=BearbyAccount.js.map
