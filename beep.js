import * as _player from 'play-sound'
import { loge } from './log.js'

const player = _player.default()

export const beep = () => {
    player.play('beep.wav', function (err) {
        loge(err)
    })
}
