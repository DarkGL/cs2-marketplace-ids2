import fs from 'node:fs';

import { request, fetch } from 'undici'

import type { CSGOAPIResponse } from './types/CSGOAPIResponse.js';
import type { CSMoneyIds } from './types/CSMoneyIds.js';
import type { CSMoneyResponse, Item } from './types/CSMoneyResponse.js';

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

async function loadFromCSMoney(name: string) {
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

function findItem(name: string, items: Item[]) {
    return items.find((item) => item.asset.names.full === name);
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

        const responseMoney = await loadFromCSMoney(currentItem.market_hash_name);

        if(!responseMoney || !responseMoney?.items || responseMoney?.items?.length === 0) {
            console.log(`Item ${item} has no CSMoney sell orders`);

            continue;
        }

        const itemMoney = findItem(currentItem.market_hash_name, responseMoney.items);

        if(!itemMoney) {
            console.log(`Item ${item} ${currentItem.market_hash_name} has no CSMoney sell orders`);

            continue;
        }

        console.log(`Item ${currentItem.market_hash_name} has CSMoney sell orders`, itemMoney.asset.names.identifier);

        csmoneyIds[currentItem.market_hash_name] = {
            name: currentItem.market_hash_name,
            nameId: itemMoney.asset.names.identifier
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