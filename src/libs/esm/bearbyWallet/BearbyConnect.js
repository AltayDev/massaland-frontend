import { web3 } from "@hicaru/bearby.js";

export async function detectBearby() {
  return !!globalThis?.window?.bearby;
}
export async function connectBearby() {
  try {
    await web3.wallet.connect();
  } catch (ex) {
    console.log(ex);
  }
}
export async function disconnectBearby() {
  await web3.wallet.disconnect();
  console.log("Bearby disconnected");
}
//# sourceMappingURL=BearbyConnect.js.map
