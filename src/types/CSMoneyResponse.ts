export interface CSMoneyResponse {
    items: Item[];
}

export interface Item {
    id: number;
    appId: number;
    seller: Seller;
    asset: Asset;
    stickers: null;
    keychains: null;
    pricing: Pricing;
    links: Links;
}

export interface Asset {
    id: number;
    names: Names;
    images: Images;
    isSouvenir: boolean;
    isStatTrak: boolean;
    quality: null;
    rarity: 'Superior';
    pattern: null;
    type: number;
    color: null;
    collection: Collection;
    float: null;
    inspect: string;
    rank: null;
}

export interface Collection {
    name: null;
    image: null;
}

export interface Images {
    steam: string;
    screenshot?: string;
    preview?: string;
}

export interface Names {
    short: 'Bloody Darryl The Strapped | The Professionals';
    full: 'Bloody Darryl The Strapped | The Professionals';
    identifier: number;
}

export interface Links {
    '3d'?: string;
}

export interface Pricing {
    default: number;
    priceBeforeDiscount: number;
    extra: null;
    discount: number;
    computed: number;
    basePrice: number;
    priceCoefficient: number;
}

export interface Seller {
    steamId64: string;
    botId: number | null;
    delivery: Delivery;
}

export interface Delivery {
    speed: Speed;
    medianTime: number | null;
    successRate: number | null;
}

export type Speed = 'instant' | 'fast' | 'slow';
