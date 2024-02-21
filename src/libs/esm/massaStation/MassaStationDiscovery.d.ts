/**
 * This file defines a TypeScript class named MassaStationDiscovery.
 * The class is being used to recursively search for a connection to MassaStation's server
 * and if so report this via emitting messages.
 *
 * @remarks
 * - If you are only looking to use our library, the connector MassaStationDiscovery will not be useful to you.
 * - If you want to work on this repo, you will probably be interested in this object
 *
 */
/// <reference types="node" />
import { EventEmitter } from "events";

/**
 * Url used for the MassaStation discovery and pinging the MassaStation server's index.html
 */
export declare const MASSA_STATION_DISCOVERY_URL =
  "https://station.massa/plugin-manager";
/**
 * A message emitted on successful MassaStation discovery
 */
export declare const ON_MASSA_STATION_DISCOVERED =
  "ON_MASSA_STATION_DISCOVERED";
/**
 * A message emitted on MassaStation disconnect
 */
export declare const ON_MASSA_STATION_DISCONNECTED =
  "ON_MASSA_STATION_DISCONNECTED";
/**
 * This file defines a TypeScript class named MassaStation.
 * The class is being used to recursively ping MassaStation's server
 * and if a response is received emit a message so MassaStation can be enlisted as
 * a wallet provider in the `Connector` class.
 */
export declare class MassaStationDiscovery extends EventEmitter {
  private isDiscovered;
  /**
   * MassaStation constructor
   *
   * @remarks
   * - It creates a timeout using the given `pollIntervalMillis` argument on every trigger of which
   *  the MassaStation pinging is triggered and if a successful response is fetched,
   * a message `ON_MASSA_STATION_DISCOVERED` is emitted that MassaStation has been discovered
   * as a wallet provider upon which the `Connector` class will enlist MassaStation as a wallet provider
   * - If once found, but then disconnected the following message `ON_MASSA_STATION_DISCONNECTED` is being emitted
   *  so that the `Connector` class delists MassaStation as a wallet provider
   *
   * @returns An instance of the MassaStation class.
   *
   */
  constructor();
  /**
   * A method to start listening for a connection to MassaStation's server.
   *
   * @returns void
   */
  startListening(): Promise<void>;
}
//# sourceMappingURL=MassaStationDiscovery.d.ts.map
