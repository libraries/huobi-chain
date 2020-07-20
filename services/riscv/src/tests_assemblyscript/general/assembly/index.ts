// The entry file of your WebAssembly module.

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
} from "./env";

const ERROR_METHOD_NOT_FOUND = 69


export function _start(): i64 {
  let args = pvmLoadArgs();
  let argsStr = String.UTF8.decode(args.buffer, true);
  let argsLen = args.byteLength;

  if (argsLen == 0) {
    pvmRetStr("method not found");
    return ERROR_METHOD_NOT_FOUND;
  }
  if (pvmIsInit()) {
    pvmRet(args);
    return 0;
  }

  if (argsStr == "pvm_load_args") {
    pvmRetStr("pvm_load_args")
  } else if (argsStr == "pvm_ret") {
    pvmRetStr("pvm_ret")
  } else if (argsStr == "pvm_cycle_limit") {
    pvmRetU64Str(pvmCycleLimit())
  } else if (argsStr == "pvm_cycle_used") {
    pvmRetU64Str(pvmCycleUsed())
  } else if (argsStr == "pvm_cycle_price") {
    pvmRetU64Str(pvmCyclePrice())
  } else if (argsStr == "pvm_origin") {
    pvmRetStr(String.UTF8.decode(pvmOrigin().buffer, true))
  } else if (argsStr == "pvm_caller") {
    pvmRetStr(String.UTF8.decode(pvmCaller().buffer, true))
  } else if (argsStr == "pvm_address") {
    pvmRetStr(String.UTF8.decode(pvmAddress().buffer, true))
  } else if (argsStr == "pvm_block_height") {
    pvmRetU64Str(pvmBlockHeight())
  } else if (argsStr == "pvm_extra") {
    pvmRetStr(String.UTF8.decode(pvmExtra().buffer, true))
  } else if (argsStr == "pvm_timestamp") {
    pvmRetU64Str(pvmTimestamp());
  } else if (argsStr == "pvm_emit_event") {
    pvmEmitEvent("event_name", "event_data")
    pvmRetStr("")
  } else if (argsStr == "pvm_tx_hash") {
    pvmRetStr(String.UTF8.decode(pvmTxHash().buffer, true));
  } else if (argsStr == "pvm_tx_nonce") {
    pvmRetStr(String.UTF8.decode(pvmTxNonce().buffer, true));
  } else {
    pvmRetStr("not match test case");
  }
  return 0;
}
