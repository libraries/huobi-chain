import {
  pvmRet,
  pvmLoadArgs,
  pvmRetStr,
  pvmIsInit,
  pvmRetU64Str,
  pvmCycleLimit,
  pvmCycleUsed,
  pvmCyclePrice,
  pvmOrigin,
  pvmCaller,
  pvmAddress,
  pvmBlockHeight,
  pvmExtra,
  pvmTimestamp,
  pvmEmitEvent,
  pvmTxHash,
  pvmTxNonce,
  pvmServiceWrite,
  pvmServiceRead,
  pvmGetStorage,
  pvmSetStorage,
} from "./env";

const ERROR_METHOD_NOT_FOUND = 1000
const ERROR_GET_ADDRESS = 1001

function getAddress(): Uint8Array {
  return pvmLoadArgs().slice(1);
}

function doWrite(contract_address: Uint8Array, args: string): i64 {
  const contractAddressStr = String.UTF8.decode(contract_address.buffer, true);
  const service = "riscv";
  const method = "exec";
  const payloadStr = "{\"address\": \"" + contractAddressStr + "\", \"args\": \"" + args + "\"}";
  const payloadBuf = String.UTF8.encode(payloadStr, false);
  pvmRet(pvmServiceWrite(service, method, Uint8Array.wrap(payloadBuf)));

  return 0;
}

function doRead(contract_address: Uint8Array, args: string): i64 {
  const contractAddressStr = String.UTF8.decode(contract_address.buffer, true);
  const service = "riscv";
  const method = "call";
  const payloadStr = "{\"address\": \"" + contractAddressStr + "\", \"args\": \"" + args + "\"}";
  const payloadBuf = String.UTF8.encode(payloadStr, false);
  pvmRet(pvmServiceRead(service, method, Uint8Array.wrap(payloadBuf)));
  return 0;
}

function write(target: string, append: bool): i64 {
  let address = getAddress();
  var r: string
  if (append) {
    r = target + String.UTF8.decode(address.buffer, true)
  } else {
    r = target
  }
  return doWrite(address, r)
}

function read(target: string, append: bool): i64 {
  let address = getAddress();
  var r: string
  if (append) {
    r = target + String.UTF8.decode(address.buffer, true)
  } else {
    r = target
  }
  return doRead(address, r)
}

function msg(): i64 {
  let buf = String.UTF8.encode("1vz411b7WB", false);
  let u8buf = Uint8Array.wrap(buf);
  pvmRet(u8buf);
  return 0;
}

function r(): i64 {
  pvmRet(pvmGetStorage(Uint8Array.wrap(String.UTF8.encode("crpd", true))));
  return 0;
}

function w(): i64 {
  pvmSetStorage(Uint8Array.wrap(String.UTF8.encode("crpd", true)), Uint8Array.wrap(String.UTF8.encode("1vz411b7WB")));
  return 0;
}

/*
*          write                write
* c() ---------------> b() ---------------> w()
*/
function b(): i64 {
  return write("w", false);
}


function c(): i64 {
  return write("b", true);
}

/*
*          read                 write
* f() ---------------> e() ---------------> w()
*/

function e(): i64 {
  return write("w", false);
}
function f(): i64 {
  return read("e", true);
}

/*
*          read                  read
* y() ---------------> x() ---------------> r()
*/
function x(): i64 {
  return read("r", false);
}

function y(): i64 {
  return read("x", true);
}

export function _start(): i64 {
  let argsBuf = pvmLoadArgs()

  if (argsBuf.byteLength == 0) {
    pvmRetStr("method not found");
    return ERROR_METHOD_NOT_FOUND;
  }

  var ret: i64;
  let method = String.fromCharCode(argsBuf[0]);

  if (method == 'r') {
    ret = r();
  } else if (method == 'w') {
    ret = w();
  } else if (method == 'b') {
    ret = b();
  } else if (method == 'c') {
    ret = c();
  } else if (method == 'e') {
    ret = e();
  } else if (method == 'f') {
    ret = f();
  } else if (method == 'x') {
    ret = x();
  } else if (method == 'y') {
    ret = y();
  } else if (method == 'm') {
    ret = msg();
  } else {
    pvmRetStr("method not found");
    return ERROR_METHOD_NOT_FOUND;
  }

  return ret;
}
