import got from 'got'
import { sendBarkMessage } from './notification.js'
import { beep } from './beep.js'
import { loge, singleLineLog } from './log.js'

export const loopRun = async (freq, action) => {
    await action()
    setTimeout(() => {
        loopRun(freq, action)
    }, freq)
}

export const checkStock = async (sku, givenSkuName, baseMall, baseCity) => {
    let availableStores
    let skuName = givenSkuName
    let checkSuccess = true
    try {
        const resp = await got(
            `https://www.apple.com.cn/shop/fulfillment-messages?store=${baseMall}&little=false&parts.0=${sku}&mts.0=regular&mts.1=compat&fts=true&searchNearby=true`)
        availableStores = JSON.parse(resp.body).body.content['pickupMessage']['stores']
            .filter((it) => it['city'] === baseCity)
            .filter((it) => {
                skuName = it['partsAvailability'][sku]['messageTypes']['regular']['storePickupProductTitle']
                return it['partsAvailability'][sku]['messageTypes']['regular']['storeSelectionEnabled']
            })
    } catch (t) {
        loge(t)
        checkSuccess = false
        availableStores = []
    }
    if (availableStores.length === 0) {
        return {
            available: false,
            shops: [],
            sku,
            skuName,
            checkSuccess
        }
    } else {
        return {
            available: true,
            shops: availableStores.map(it => it['storeName']),
            sku,
            skuName,
            checkSuccess
        }
    }
}

export const loopCheck = (freq, skuArray, needBeep, baseShop, baseCity, barkConfig) => {
    let workStatistics = {}
    skuArray.forEach((it) => {
        workStatistics[it] = {
            runTimes: 0,
            successTimes: 0,
            hitTimes: 0,
            skuName: it.sku
        }
    })

    const printStatistics = () => {
        const msg = `查询 Apple Store 库存结果：\n${Object.keys(workStatistics).map((sku) => {
            const s = workStatistics[sku]
            return `* ${s.skuName}(${sku}): 轮询${s.runTimes}次，成功${s.successTimes}次，发现库存${s.hitTimes}次`
        }).join('\n')}`
        singleLineLog(msg)
    }

    loopRun(freq, async () => {
        const results = await Promise.all(skuArray.map((it => {
            workStatistics[it].runTimes++
            return checkStock(it, workStatistics[it].skuName, baseShop, baseCity)
        })))
        results.forEach((it) => {
            const s = workStatistics[it.sku]
            s.skuName = it.skuName
            if (it.checkSuccess) {
                s.successTimes++
            }
            if (it.available) {
                s.hitTimes++
            }
        })
        await Promise.all(results.filter(it => it.available)
            .map(it => {
                if (needBeep) {
                    beep()
                }
                sendBarkMessage(`${it.skuName}有库存了！`, it.shops.join(','), barkConfig)
            }))
        printStatistics()
    })
}
