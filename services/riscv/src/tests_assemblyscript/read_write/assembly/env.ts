// System call provides the services of the blockchain to the user dapp via Application Program Interface(API).
export declare function syscall(n: i64, a: i64, b: i64, c: i64, d: i64, e: i64, f: i64, mode: i64): i64

// System call code
const SYSCODE_DEBUG = 2000
const SYSCODE_LOAD_ARGS = 2001
const SYSCODE_RET = 2002
const SYSCODE_ASSERT = 2003
const SYSCODE_CYCLE_LIMIT = 3000
const SYSCODE_IS_INIT = 3001
const SYSCODE_ORIGIN = 3002
const SYSCODE_CALLER = 3003
const SYSCODE_ADDRESS = 3004
const SYSCODE_BLOCK_HEIGHT = 3005
const SYSCODE_CYCLE_USED = 3006
const SYSCODE_CYCLE_PRICE = 3007
const SYSCODE_EXTRA = 3008
const SYSCODE_TIMESTAMP = 3009
const SYSCODE_EMIT_EVENT = 3010
const SYSCODE_TX_HASH = 3011
const SYSCODE_TX_NONCE = 3012
const SYSCODE_GET_STORAGE = 4000
const SYSCODE_SET_STORAGE = 4001
const SYSCODE_CONTRACT_CALL = 4002
const SYSCODE_SERVICE_CALL = 4003
const SYSCODE_SERVICE_WRITE = 4004
const SYSCODE_SERVICE_READ = 4005

// The maximum length allowed for a data exchange with the host environment
const BUF_SIZE = 1024
// Although it is const, it is allowed to be modified by the host
const BUF = new Uint8Array(BUF_SIZE)

export function pvmDebug(msg: string): void {
    let strEncoded = String.UTF8.encode(msg, true)
    syscall(SYSCODE_DEBUG, changetype<usize>(strEncoded), 0, 0, 0, 0, 0, 0b100000)
}

export function pvmAssert(statement: boolean, msg: string): void {
    let strEncoded = String.UTF8.encode(msg, true)
    syscall(SYSCODE_ASSERT, statement ? 1 : 0, changetype<usize>(strEncoded), 0, 0, 0, 0, 0b010000)
}

export function pvmLoadArgs(): Uint8Array {
    let l = syscall(SYSCODE_LOAD_ARGS, changetype<usize>(BUF.buffer), 0, 0, 0, 0, 0, 0b100000)
    return BUF.slice(0, i32(l))
}

export function pvmRet(data: Uint8Array): void {
    syscall(SYSCODE_RET, changetype<usize>(data.buffer), data.buffer.byteLength, 0, 0, 0, 0, 0b100000)
}

export function pvmCycleLimit(): i64 {
    return syscall(SYSCODE_CYCLE_LIMIT, 0, 0, 0, 0, 0, 0, 0b000000)
}

export function pvmCycleUsed(): i64 {
    return syscall(SYSCODE_CYCLE_USED, 0, 0, 0, 0, 0, 0, 0b000000)
}

export function pvmCyclePrice(): i64 {
    return syscall(SYSCODE_CYCLE_PRICE, 0, 0, 0, 0, 0, 0, 0b000000)
}

export function pvmOrigin(): Uint8Array {
    let l = syscall(SYSCODE_ORIGIN, changetype<usize>(BUF.buffer), 0, 0, 0, 0, 0, 0b100000)
    return BUF.slice(0, i32(l))
}

export function pvmCaller(): Uint8Array {
    let l = syscall(SYSCODE_CALLER, changetype<usize>(BUF.buffer), 0, 0, 0, 0, 0, 0b100000)
    return BUF.slice(0, i32(l))
}

export function pvmAddress(): Uint8Array {
    let l = syscall(SYSCODE_ADDRESS, changetype<usize>(BUF.buffer), 0, 0, 0, 0, 0, 0b100000)
    return BUF.slice(0, i32(l))
}

export function pvmIsInit(): i64 {
    return syscall(SYSCODE_IS_INIT, 0, 0, 0, 0, 0, 0, 0b000000)
}

export function pvmBlockHeight(): i64 {
    return syscall(SYSCODE_BLOCK_HEIGHT, 0, 0, 0, 0, 0, 0, 0b000000)
}

export function pvmExtra(): Uint8Array {
    let l = syscall(SYSCODE_EXTRA, changetype<usize>(BUF.buffer), 0, 0, 0, 0, 0, 0b100000)
    return BUF.slice(0, i32(l))
}

export function pvmTimestamp(): i64 {
    return syscall(SYSCODE_TIMESTAMP, 0, 0, 0, 0, 0, 0, 0b000000)
}

export function pvmEmitEvent(name: string, event: string): void {
    let nameEncoded = String.UTF8.encode(name, true)
    let eventEncoded = String.UTF8.encode(event, true)
    syscall(SYSCODE_EMIT_EVENT, changetype<usize>(nameEncoded), nameEncoded.byteLength, changetype<usize>(eventEncoded), eventEncoded.byteLength, 0, 0, 0b101000)
}

export function pvmTxHash(): Uint8Array {
    let l = syscall(SYSCODE_TX_HASH, changetype<usize>(BUF.buffer), 0, 0, 0, 0, 0, 0b100000)
    return BUF.slice(0, i32(l))
}

export function pvmTxNonce(): Uint8Array {
    let l = syscall(SYSCODE_TX_NONCE, changetype<usize>(BUF.buffer), 0, 0, 0, 0, 0, 0b100000)
    return BUF.slice(0, i32(l))
}

export function pvmGetStorage(k: Uint8Array): Uint8Array {
    let l = syscall(
        SYSCODE_GET_STORAGE,
        changetype<usize>(k.buffer),
        k.byteLength,
        changetype<usize>(BUF.buffer),
        BUF.byteLength,
        0,
        0,
        0b101000
    )
    return BUF.slice(0, i32(l))
}

export function pvmSetStorage(k: Uint8Array, v: Uint8Array): void {
    syscall(
        SYSCODE_SET_STORAGE,
        changetype<usize>(k.buffer),
        k.byteLength,
        changetype<usize>(v.buffer),
        v.byteLength,
        0,
        0,
        0b101000
    )
}

export function pvmContractCall(addr: Uint8Array, args: Uint8Array): Uint8Array {
    let l = syscall(
        SYSCODE_CONTRACT_CALL,
        changetype<usize>(addr.buffer),
        changetype<usize>(args.buffer),
        args.byteLength,
        changetype<usize>(BUF.buffer),
        0,
        0,
        0b110100
    )
    return BUF.slice(0, i32(l))
}

export function pvmServiceCall(service: string, method: string, payload: Uint8Array): Uint8Array {
    let serviceEncoded = String.UTF8.encode(service, true)
    let methodEncoded = String.UTF8.encode(method, true)
    let l = syscall(
        SYSCODE_SERVICE_CALL,
        changetype<usize>(serviceEncoded),
        changetype<usize>(methodEncoded),
        changetype<usize>(payload.buffer),
        payload.byteLength,
        changetype<usize>(BUF.buffer),
        0,
        0b111010
    )
    return BUF.slice(0, i32(l))
}

export function pvmServiceWrite(service: string, method: string, payload: Uint8Array): Uint8Array {
    let serviceEncoded = String.UTF8.encode(service, true)
    let methodEncoded = String.UTF8.encode(method, true)
    let l = syscall(
        SYSCODE_SERVICE_WRITE,
        changetype<usize>(serviceEncoded),
        changetype<usize>(methodEncoded),
        changetype<usize>(payload.buffer),
        payload.byteLength,
        changetype<usize>(BUF.buffer),
        0,
        0b111010
    )
    return BUF.slice(0, i32(l))
}

export function pvmServiceRead(service: string, method: string, payload: Uint8Array): Uint8Array {
    let serviceEncoded = String.UTF8.encode(service, true)
    let methodEncoded = String.UTF8.encode(method, true)
    let l = syscall(
        SYSCODE_SERVICE_READ,
        changetype<usize>(serviceEncoded),
        changetype<usize>(methodEncoded),
        changetype<usize>(payload.buffer),
        payload.byteLength,
        changetype<usize>(BUF.buffer),
        0,
        0b111010
    )
    return BUF.slice(0, i32(l))
}

// More helpful functions. It's not a main part of the muta dapp sdk.
export function pvmRetStr(data: string): void {
    pvmRet(Uint8Array.wrap(String.UTF8.encode(data, true)));
}


export function pvmRetU64Str(n: i64): void {
    pvmRetStr(n.toString())
}
