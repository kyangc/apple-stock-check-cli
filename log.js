import * as _sll from 'single-line-log'

const singleLog = _sll.stderr

let debugMode = false

export const isDebug = () => {
    return debugMode
}

export const setDebug = (isDebug) => {
    debugMode = isDebug
}

export const singleLineLog = (msg) => {
    singleLog(msg)
}

export const logi = (msg) => {
    if (isDebug()) {
        console.log(msg)
    }
}

export const loge = (e) => {
    if (isDebug()) {
        console.error(e)
    }
}
