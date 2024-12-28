import fs from 'node:fs';

import { request, fetch } from 'undici';

import slug from 'slug';

import { logger } from './logger.js';
import type { CSGOAPIResponse } from './types/CSGOAPIResponse.js';
import type { CSMoneyIds } from './types/CSMoneyIds.js';
import type { CSMoneyResponse, Item as ItemTrade } from './types/CSMoneyResponse.js';
import type { CSMoneyMarketResponse } from './types/CSMoneyMarket.response.js';
import type { Item as ItemMarket } from './types/CSMoneyMarket.response.js';

const MAX_DOWNLOAD = 500;

async function loadAllCS2Items() {
    const response = await request('https://bymykel.github.io/CSGO-API/api/en/all.json').then(
        (res) => res.body.json() as Promise<CSGOAPIResponse>,
    );

    return response;
}

function loadCSMoneyIds() {
    const response = fs.readFileSync('./csmoney-ids.json', 'utf-8');

    return JSON.parse(response) as CSMoneyIds;
}

function writeCSMoneyIds(data: CSMoneyIds) {
    fs.writeFileSync('./csmoney-ids.json', JSON.stringify(data, null, 2));
}

function writeMissingIds(data: Set<string>) {
    fs.writeFileSync('./missing-ids.json', JSON.stringify(Array.from(data), null, 2));
}

async function loadFromCSMoneyTrade(name: string) {
    return fetch(`https://cs.money/1.0/market/sell-orders?limit=60&offset=0&name=${name}`, {
        headers: {
            accept: 'application/json, text/plain, */*',
            'accept-language': 'en-US,en-GB;q=0.9,en;q=0.8,pl-PL;q=0.7,pl;q=0.6',
            'cache-control': 'no-cache',
            pragma: 'no-cache',
            priority: 'u=1, i',
            'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'x-client-app': 'web',
            Referer: 'https://cs.money/pl/market/buy/',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
        body: null,
        method: 'GET',
    })
        .then((res) => res.json() as Promise<CSMoneyResponse>)
        .catch((err) => {
            logger.error({ err }, 'loadFromCSMoneyTrade');

            return Promise.resolve({
                items: [],
            });
        });
}

async function loadFromCSMoneyMarket(name: string) {
    return fetch(`https://cs.money/5.0/load_bots_inventory/730?limit=60&name=${name}&offset=0`, {
        headers: {
            accept: 'application/json, text/plain, */*',
            'accept-language': 'en-US,en-GB;q=0.9,en;q=0.8,pl-PL;q=0.7,pl;q=0.6',
            'cache-control': 'no-cache',
            pragma: 'no-cache',
            priority: 'u=1, i',
            'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'x-client-app': 'web',
            Referer: 'https://cs.money/csgo/trade/',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
        body: null,
        method: 'GET',
    })
        .then((res) => res.json() as Promise<CSMoneyMarketResponse>)
        .catch((err) => {
            logger.error({ err }, 'loadFromCSMoneyMarket');

            return Promise.resolve({
                items: [],
            });
        });
}

const nameIdRegex = /"nameId":\s*(\d+)/;
const fullNameRegex = /"fullName":\s*"([^"]+)"/;

async function loadFromCSMoneyPage(market_hash_name: string) {
    const slugName = slug(market_hash_name);

    return fetch(`https://cs.money/pl/csgo/${slugName}/`, {
        headers: {
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'accept-language': 'en-US,en-GB;q=0.9,en;q=0.8,pl-PL;q=0.7,pl;q=0.6',
            'cache-control': 'no-cache',
            pragma: 'no-cache',
            priority: 'u=0, i',
            'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
        },
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: null,
        method: 'GET',
    })
        .then((res) => res.text() as Promise<string>)
        .then((res) => {
            // Extract nameId
            const nameIdMatch = nameIdRegex.exec(res);
            const nameId = nameIdMatch ? nameIdMatch[1] : null;

            // Extract fullName
            const fullNameMatch = fullNameRegex.exec(res);
            const fullName = fullNameMatch ? fullNameMatch[1] : null;

            // Print results
            logger.info({ nameId, fullName }, 'Extracted nameId and fullName');

            return {
                nameId: nameId?.trim(),
                fullName: fullName?.trim(),
            };
        })
        .catch((err) => {
            logger.error({ err }, 'loadItemFromCSMoneyPage');

            return Promise.resolve(null);
        });
}

function findItemTrade(name: string, items: ItemTrade[]) {
    return items.find((item) => item.asset.names.full === name);
}

function findItemMarket(name: string, items: ItemMarket[]) {
    return items.find((item) => item.fullName === name);
}

async function loadItemFromCSMoneyTrade(market_hash_name: string) {
    const responseMoney = await loadFromCSMoneyTrade(market_hash_name);

    if (!responseMoney || !responseMoney?.items || responseMoney?.items?.length === 0) {
        logger.info(`Item ${market_hash_name} has no CSMoney sell orders`);

        return;
    }

    const itemMoney = findItemTrade(market_hash_name, responseMoney.items);

    if (!itemMoney) {
        logger.info(`Item ${market_hash_name} has no CSMoney sell orders`);

        return;
    }

    return itemMoney.asset.names.identifier;
}

async function loadItemFromCSMoneyMarket(market_hash_name: string) {
    const responseMoney = await loadFromCSMoneyMarket(market_hash_name);

    if (!responseMoney || !responseMoney?.items || responseMoney?.items?.length === 0) {
        logger.info(`Item ${market_hash_name} has no CSMoney market trade`);

        return;
    }

    const itemMoney = findItemMarket(market_hash_name, responseMoney.items);

    if (!itemMoney) {
        logger.info(`Item ${market_hash_name} has no CSMoney market trade`);

        return;
    }

    return itemMoney.nameId;
}

async function loadItemFromCSMoneyPage(market_hash_name: string) {
    const responseMoney = await loadFromCSMoneyPage(market_hash_name);

    if (
        !responseMoney ||
        !responseMoney?.nameId ||
        !responseMoney?.fullName ||
        responseMoney?.fullName !== market_hash_name
    ) {
        logger.info(
            `Item ${market_hash_name} has no CSMoney page ${responseMoney?.fullName} with nameId ${responseMoney?.nameId}`,
        );

        return;
    }

    return Number.parseInt(responseMoney.nameId, 10);
}

async function main() {
    const allCS2Items = await loadAllCS2Items();

    logger.info({ length: Object.keys(allCS2Items).length }, 'Loaded all CS2 items');

    const csmoneyIds = loadCSMoneyIds();

    logger.info({ length: Object.keys(csmoneyIds).length }, 'Loaded CSMoney ids');

    const missingIds = new Set<string>();

    let amountToDownload = 0;

    const csmoneyIdsKeys = Object.keys(csmoneyIds);

    for (const item in allCS2Items) {
        const currentItem = allCS2Items[item];

        if (!currentItem) {
            continue;
        }

        if (!currentItem.market_hash_name) {
            continue;
        }

        if (csmoneyIdsKeys.includes(currentItem.market_hash_name)) {
            continue;
        }

        missingIds.add(currentItem.market_hash_name);

        amountToDownload++;
    }

    writeMissingIds(missingIds);

    logger.info({ amountToDownload }, 'Amount of items to download');

    let downloaded = 0;

    const keys = Object.keys(allCS2Items);

    const shuffledKeys = keys.sort(() => Math.random() - 0.5);

    for (const item of shuffledKeys) {
        const currentItem = allCS2Items[item];

        if (!currentItem) {
            continue;
        }

        if (!currentItem.market_hash_name) {
            continue;
        }

        if (csmoneyIdsKeys.includes(currentItem.market_hash_name)) {
            continue;
        }

        let itemMoneyId = await loadItemFromCSMoneyTrade(currentItem.market_hash_name);

        if (!itemMoneyId) {
            itemMoneyId = await loadItemFromCSMoneyMarket(currentItem.market_hash_name);
        }

        if (!itemMoneyId) {
            itemMoneyId = await loadItemFromCSMoneyPage(currentItem.market_hash_name);
        }

        if (!itemMoneyId) {
            await sleep(5000);

            continue;
        }

        logger.info({ itemMoneyId }, `Item ${currentItem.market_hash_name} is on CSMoney`);

        csmoneyIds[currentItem.market_hash_name] = {
            name: currentItem.market_hash_name,
            nameId: itemMoneyId,
        };

        missingIds.delete(currentItem.market_hash_name);

        writeCSMoneyIds(csmoneyIds);
        writeMissingIds(missingIds);

        downloaded++;

        if (downloaded >= MAX_DOWNLOAD) {
            break;
        }
    }

    writeCSMoneyIds(csmoneyIds);
    writeMissingIds(missingIds);
}

async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

main();
