export interface CSMoneyMarketResponse {
    items: Item[];
}

export interface Item {
    appId: number;
    assetId: number;
    float: null;
    hasHighDemand: boolean;
    hasTradeLock: boolean;
    id: number;
    img: string;
    name: string;
    nameId: number;
    price: number;
    quality: null;
    rarity: string;
    steamId: string;
    steamImg: string;
    tradeLock: number;
    type: number;
    '3d': null;
    preview: string;
    screenshot: string;
    priceWithBonus: number;
    userId: null;
    pattern: null;
    rank: null;
    overpay: null;
    stickers: null;
    inspect: string;
    fullName: string;
    hasConcreteSkinPage: boolean;
    shortName: string;
    fullSlug: string;
    wiki: string;
    defaultPrice: number;
    lockMarkup: number;
    steam: string;
    bot: string;
    seller: string;
    shortSlug: string;
    inGameView: string;
    floatRange: null;
    collection: null;
    collectionInfo: null;
}
