#!/usr/bin/env node
import { readFile } from 'fs/promises'
import { Command } from 'commander/esm.mjs'
import { loopCheck } from './watch.js'
import { setDebug } from './log.js'

const program = new Command()
const packageJson = JSON.parse(await readFile(new URL('./package.json', import.meta.url)))
program.version(packageJson.version)

program.command('watch <sku>')
    .option('-f --frequency <freq_in_sec>', '轮询的时间间隔，单位为秒，默认 2 秒', 2)
    .option('--base-shop <shop>', '基于哪个 Apple Store 编号查询周边库存，请自行抓接口获取，默认为五角场（R581）', 'R581')
    .option('--base-city <city>', '基于哪个城市过滤 Apple Store，默认为上海', '上海')
    .option('--bark-auth <bark_auth_key>', '采用 Bark 推送通知，需传入用户 auth')
    .option('--bark-sound <sound>', '采用 Bark 推送通知时的通知声，详见 Bark 文档，默认为 alarm')
    .option('--bark-level <level>', '采用 Bark 推送通知时的通知优先级，默认为 timeSensitive，可选：active/passive')
    .option('--bark-icon <icon>', '采用 Bark 推送通知时的推送图标')
    .option('--no-beep', '查到库存后是否禁用蜂鸣提示')
    .option('--debug', 'Debug 模式，输出日志，默认关闭', false)
    .action(async (sku, options) => {
        const freq = options.frequency * 1000
        const skus = sku.trim().split(',')
        const beep = options.beep
        const baseMall = options.baseShop
        const baseCity = options.baseCity
        const barkConfig = {
            auth: options.barkAuth,
            sound: options.barkSound,
            level: options.barkLevel,
            icon: options.barkIcon
        }
        setDebug(options.debug)
        loopCheck(freq, skus, beep, baseMall, baseCity, barkConfig)
    })
    .description('轮询 Apple Store 中给定 SKU 的线下库存情况，同时查询多个 SKU 请以逗号进行分隔')

program.parseAsync(process.argv)


