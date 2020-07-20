import {
    pvmLoadArgs,
    pvmRet,
    pvmSetStorage,
    pvmGetStorage,
    pvmDebug,
    pvmRetStr,
} from "./env";

const errMessage = "wrong args, should be like 'set [key] [value]' or 'get [key]'";


export function _start(): i64 {
    let argsBuf = pvmLoadArgs()
    let argsStr = String.UTF8.decode(argsBuf.buffer, true)
    let argsArr = argsStr.split(" ")
    if (argsArr.length < 2) {
        pvmRetStr(errMessage)
        return 1
    }
    if (argsArr[0] == "set") {
        if (argsArr.length != 3) {
            pvmRetStr(errMessage)
            return 1
        }
        pvmSetStorage(Uint8Array.wrap(String.UTF8.encode(argsArr[1], false)), Uint8Array.wrap(String.UTF8.encode(argsArr[2], false)))
        pvmDebug("set success")
    } else if (argsArr[0] == "get") {
        let r = pvmGetStorage(Uint8Array.wrap(String.UTF8.encode(argsArr[1], false)))
        pvmRet(r)
        pvmDebug("get success")
    } else {
        pvmRetStr(errMessage)
        return 1
    }
    return 0
}
