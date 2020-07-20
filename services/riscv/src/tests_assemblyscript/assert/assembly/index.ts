import {
  pvmAssert,
  pvmLoadArgs,
  pvmRetStr,
  pvmServiceRead,
} from "./env";

const ERROR_METHOD_NOT_FOUND = 1000;
const ERROR_GET_ADDRESS = 1001;


function getAddress(): Uint8Array {
  return pvmLoadArgs().slice(1);
}

function a(): void {
  pvmAssert(1 > 2, "1 should never bigger than 2");
}


function b(contract_address: Uint8Array): i64 {
  const contractAddressStr = String.UTF8.decode(contract_address.buffer, true);
  const service = "riscv";
  const method = "call";
  const payloadStr = "{\"address\": \"" + contractAddressStr + "\", \"args\": \"a\"}";
  const payloadBuf = String.UTF8.encode(payloadStr, false);
  pvmServiceRead(service, method, Uint8Array.wrap(payloadBuf));
  return 0;
}

export function _start(): i64 {
  let argsBuf = pvmLoadArgs();

  if (argsBuf.byteLength == 0) {
    pvmRetStr("method not found");
    return ERROR_METHOD_NOT_FOUND;
  }

  if (String.fromCharCode(argsBuf[0]) == 'a') {
    a();
  } else if (String.fromCharCode(argsBuf[0]) == 'b') {
    let address = getAddress();
    if (address.byteLength < 42) {
      return ERROR_GET_ADDRESS;
    }
    return b(address);
  } else {
    pvmRetStr("method not found");
    return ERROR_METHOD_NOT_FOUND;
  }

  return 0
}
