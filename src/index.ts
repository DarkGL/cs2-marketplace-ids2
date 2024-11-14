import fs from 'node:fs';

import { request, fetch } from 'undici'

import type { CSGOAPIResponse } from './types/CSGOAPIResponse.js';
import type { CSMoneyIds } from './types/CSMoneyIds.js';
import type { CSMoneyResponse, Item as ItemTrade } from './types/CSMoneyResponse.js';
import type { CSMoneyMarketResponse } from './types/CSMoneyMarket.response.js';
import type { Item as ItemMarket } from './types/CSMoneyMarket.response.js';

const MAX_DOWNLOAD = 500;

async function loadAllCS2Items() {
    const response = await request('https://bymykel.github.io/CSGO-API/api/en/all.json').then((res) => res.body.json() as Promise<CSGOAPIResponse>);

    return response;
}

function loadCSMoneyIds() {
    const response = fs.readFileSync('./csmoney-ids.json', 'utf-8');

    return JSON.parse(response) as CSMoneyIds;
}

function writeCSMoneyIds(data: CSMoneyIds) {
    fs.writeFileSync('./csmoney-ids.json', JSON.stringify(data, null, 2));
}

async function loadFromCSMoneyTrade(name: string) {
    return fetch(`https://cs.money/1.0/market/sell-orders?limit=60&offset=0&name=${name}`, {
        "headers": {
          "accept": "application/json, text/plain, */*",
          "accept-language": "en-US,en-GB;q=0.9,en;q=0.8,pl-PL;q=0.7,pl;q=0.6",
          "cache-control": "no-cache",
          "pragma": "no-cache",
          "priority": "u=1, i",
          "sec-ch-ua": "\"Chromium\";v=\"130\", \"Google Chrome\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-client-app": "web",
          "Referer": "https://cs.money/pl/market/buy/",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
      }).then((res) => res.json() as Promise<CSMoneyResponse>);
}

async function loadFromCSMoneyMarket(name: string) {
    return fetch(`https://cs.money/5.0/load_bots_inventory/730?limit=60&name=${name}&offset=0`, {
        "headers": {
          "accept": "application/json, text/plain, */*",
          "accept-language": "en-US,en-GB;q=0.9,en;q=0.8,pl-PL;q=0.7,pl;q=0.6",
          "cache-control": "no-cache",
          "pragma": "no-cache",
          "priority": "u=1, i",
          "sec-ch-ua": "\"Chromium\";v=\"130\", \"Google Chrome\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-client-app": "web",
          "Referer": "https://cs.money/csgo/trade/",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
      }).then((res) => res.json() as Promise<CSMoneyMarketResponse>);
    }

function findItemTrade(name: string, items: ItemTrade[]) {
    return items.find((item) => item.asset.names.full === name);
}

function findItemMarket(name: string, items: ItemMarket[]) {
    return items.find((item) => item.fullName === name);
}

async function loadItemFromCSMoneyTrade(market_hash_name: string) {
    const responseMoney = await loadFromCSMoneyTrade(market_hash_name);

    if(!responseMoney || !responseMoney?.items || responseMoney?.items?.length === 0) {
        console.log(`Item ${market_hash_name} has no CSMoney sell orders`);

        return;
    }

    const itemMoney = findItemTrade(market_hash_name, responseMoney.items);

    if(!itemMoney) {
        console.log(`Item ${market_hash_name} has no CSMoney sell orders`);

        return;
    }

    return itemMoney.asset.names.identifier;
}

async function loadItemFromCSMoneyMarket(market_hash_name: string) {
    const responseMoney = await loadFromCSMoneyMarket(market_hash_name);

    if(!responseMoney || !responseMoney?.items || responseMoney?.items?.length === 0) {
        console.log(`Item ${market_hash_name} has no CSMoney market trade`);

        return;
    }

    const itemMoney = findItemMarket(market_hash_name, responseMoney.items);

    if(!itemMoney) {
        console.log(`Item ${market_hash_name} has no CSMoney market trade`);

        return;
    }

    return itemMoney.nameId;
}

async function main() {
    const allCS2Items = await loadAllCS2Items();
    
    console.log('Loaded all CS2 items', Object.keys(allCS2Items).length);

    const csmoneyIds = loadCSMoneyIds();

    console.log('Loaded CSMoney ids', Object.keys(csmoneyIds).length);

    let amountToDownload = 0;

    const csmoneyIdsKeys = Object.keys(csmoneyIds);

    for (const item in allCS2Items) {
        const currentItem = allCS2Items[item];

        if(!currentItem) {
            continue;
        }

        if(!currentItem.market_hash_name) {
            continue;
        }

        if(csmoneyIdsKeys.includes(currentItem.market_hash_name)) {
            continue;
        }

        amountToDownload++;
    }

    console.log('Amount of items to download', amountToDownload);

    let downloaded = 0;

    for (const item in allCS2Items) {
        const currentItem = allCS2Items[item];

        if(!currentItem) {
            continue;
        }

        if(!currentItem.market_hash_name) {
            continue;
        }

        if(csmoneyIdsKeys.includes(currentItem.market_hash_name)) {
            continue;
        }   

        let itemMoneyId = await loadItemFromCSMoneyTrade(currentItem.market_hash_name);

        if(!itemMoneyId) {
            itemMoneyId = await loadItemFromCSMoneyMarket(currentItem.market_hash_name);
        }

        if(!itemMoneyId) {
            continue;
        }

        console.log(`Item ${currentItem.market_hash_name} is on CSMoney`, itemMoneyId);

        csmoneyIds[currentItem.market_hash_name] = {
            name: currentItem.market_hash_name,
            nameId: itemMoneyId
        };

        writeCSMoneyIds(csmoneyIds);

        downloaded++;

        if(downloaded >= MAX_DOWNLOAD) {
            break;
        }
    }

    writeCSMoneyIds(csmoneyIds);
}

main();