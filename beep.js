import * as _player from 'play-sound'
import { loge } from './log.js'
import * as path from 'path'
import { fileURLToPath } from 'url'

const player = _player.default()

export const beep = () => {
    const wavFilePath = path.dirname(fileURLToPath(import.meta.url)) + '/beep.wav'
    player.play(wavFilePath, function (err) {
        loge(err)
    })
}
