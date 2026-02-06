
export type Token = {
  id: string
  name: string
  symbol: string
  price: number
  change: number
  marketCap: string
}

export const TOP_30_TOKENS: Token[] = [
  { id: '1', name: 'Bitcoin', symbol: 'BTC', price: 67432.10, change: 2.45, marketCap: '1.32T' },
  { id: '2', name: 'Ethereum', symbol: 'ETH', price: 3542.89, change: -1.12, marketCap: '425B' },
  { id: '3', name: 'Tether', symbol: 'USDT', price: 1.00, change: 0.01, marketCap: '110B' },
  { id: '4', name: 'BNB', symbol: 'BNB', price: 589.45, change: 0.78, marketCap: '88B' },
  { id: '5', name: 'Solana', symbol: 'SOL', price: 145.67, change: 5.23, marketCap: '65B' },
  { id: '6', name: 'XRP', symbol: 'XRP', price: 0.62, change: -2.34, marketCap: '34B' },
  { id: '7', name: 'USDC', symbol: 'USDC', price: 1.00, change: 0.00, marketCap: '32B' },
  { id: '8', name: 'Cardano', symbol: 'ADA', price: 0.45, change: 1.15, marketCap: '16B' },
  { id: '9', name: 'Avalanche', symbol: 'AVAX', price: 35.89, change: -4.56, marketCap: '13B' },
  { id: '10', name: 'Dogecoin', symbol: 'DOGE', price: 0.16, change: 8.92, marketCap: '23B' },
  { id: '11', name: 'TRON', symbol: 'TRX', price: 0.12, change: 0.45, marketCap: '10B' },
  { id: '12', name: 'Polkadot', symbol: 'DOT', price: 7.23, change: -1.89, marketCap: '9.8B' },
  { id: '13', name: 'Chainlink', symbol: 'LINK', price: 14.56, change: 2.34, marketCap: '8.5B' },
  { id: '14', name: 'Polygon', symbol: 'MATIC', price: 0.68, change: -3.21, marketCap: '6.7B' },
  { id: '15', name: 'Shiba Inu', symbol: 'SHIB', price: 0.000025, change: 12.45, marketCap: '14.8B' },
  { id: '16', name: 'Litecoin', symbol: 'LTC', price: 82.34, change: 0.12, marketCap: '6.1B' },
  { id: '17', name: 'Bitcoin Cash', symbol: 'BCH', price: 456.78, change: -2.45, marketCap: '9.0B' },
  { id: '18', name: 'NEAR Protocol', symbol: 'NEAR', price: 5.67, change: 4.12, marketCap: '6.0B' },
  { id: '19', name: 'Uniswap', symbol: 'UNI', price: 7.89, change: -5.67, marketCap: '4.7B' },
  { id: '20', name: 'Dai', symbol: 'DAI', price: 1.00, change: 0.02, marketCap: '4.9B' },
  { id: '21', name: 'Stellar', symbol: 'XLM', price: 0.11, change: 1.56, marketCap: '3.2B' },
  { id: '22', name: 'Kaspa', symbol: 'KAS', price: 0.15, change: 3.21, marketCap: '3.6B' },
  { id: '23', name: 'Pepe', symbol: 'PEPE', price: 0.000008, change: 15.67, marketCap: '3.4B' },
  { id: '24', name: 'Monero', symbol: 'XMR', price: 124.56, change: -0.89, marketCap: '2.3B' },
  { id: '25', name: 'Cosmos', symbol: 'ATOM', price: 8.45, change: -1.23, marketCap: '3.3B' },
  { id: '26', name: 'Algorand', symbol: 'ALGO', price: 0.18, change: 2.1, marketCap: '1.5B' },
  { id: '27', name: 'Aave', symbol: 'AAVE', price: 89.45, change: -1.5, marketCap: '1.3B' },
  { id: '28', name: 'Arbitrum', symbol: 'ARB', price: 0.98, change: 4.2, marketCap: '2.6B' },
  { id: '29', name: 'Optimism', symbol: 'OP', price: 2.34, change: -2.8, marketCap: '2.4B' },
  { id: '30', name: 'Stacks', symbol: 'STX', price: 2.12, change: 5.6, marketCap: '3.1B' },
]
