import got from 'got'
import { loge } from './log.js'

export const sendBarkMessage = async (title, message, barkConfig) => {
    const auth = barkConfig.auth
    const icon = barkConfig.icon || 'https://imgs.kyangc.com/2022-09-11-dbf998c9-d7be-4b19-83d1-2fae26739c4d.png'
    const sound = barkConfig.sound || 'alarm'
    const level = barkConfig.level || 'timeSensitive'
    if (auth.length === 0) return
    try {
        await got(
            `https://api.day.app/${auth}/${title}/${message}?level=${level}&sound=${sound}&icon=${icon}`)
    } catch (t) {
        loge(t)
    }
}
