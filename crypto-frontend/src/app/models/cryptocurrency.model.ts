export interface Cryptocurrency {
    id: string;
    symbol: string;
    name: string;
    currentPrice: number;
    marketCap: number;
    volume24h: number;
    priceChangePercentage24h: number;
    imageUrl: string;
    lastUpdated: string;
} 