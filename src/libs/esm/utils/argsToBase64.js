/**
 * Converts an Args object to a base64 string
 *
 * @param arg - The argument to convert to base64
 * @returns The base64 string
 */
export function argsToBase64(arg) {
  const array = arg.serialize();
  return Buffer.from(array).toString("base64");
}
/**
 * Converts a Uint8Array to a base64 string
 *
 * @param arg - The Uint8Array to convert to base64
 * @returns The base64 string
 */
export function uint8ArrayToBase64(arg) {
  return Buffer.from(arg).toString("base64");
}
//# sourceMappingURL=argsToBase64.js.map
