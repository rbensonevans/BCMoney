
"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Plus, 
  Star, 
  TrendingUp, 
  TrendingDown,
  Coins,
  Bitcoin
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

// Mock Data for Top 25 Cryptos
const INITIAL_TOP_25 = [
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
  { id: '25', name: 'Cosmos', symbol: 'ATOM', price: 8.45, change: -1.23, marketCap: '3.3B' }
]

// Extended Searchable Database
const DISCOVERABLE_TOKENS = [
  ...INITIAL_TOP_25,
  { id: '26', name: 'Algorand', symbol: 'ALGO', price: 0.18, change: 2.1, marketCap: '1.5B' },
  { id: '27', name: 'Aave', symbol: 'AAVE', price: 89.45, change: -1.5, marketCap: '1.3B' },
  { id: '28', name: 'Arbitrum', symbol: 'ARB', price: 0.98, change: 4.2, marketCap: '2.6B' },
  { id: '29', name: 'Optimism', symbol: 'OP', price: 2.34, change: -2.8, marketCap: '2.4B' },
  { id: '30', name: 'Stacks', symbol: 'STX', price: 2.12, change: 5.6, marketCap: '3.1B' },
]

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [watchlist, setWatchlist] = useState<string[]>(['1', '2', '5']) // Default: BTC, ETH, SOL
  const { toast } = useToast()

  const filteredTokens = useMemo(() => {
    return DISCOVERABLE_TOKENS.filter(token => 
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const toggleWatchlist = (tokenId: string, tokenName: string) => {
    setWatchlist(prev => {
      const isAlreadyAdded = prev.includes(tokenId)
      if (isAlreadyAdded) {
        toast({
          title: "Removed from Watchlist",
          description: `${tokenName} has been removed.`
        })
        return prev.filter(id => id !== tokenId)
      } else {
        toast({
          title: "Added to Watchlist",
          description: `${tokenName} is now being tracked.`
        })
        return [...prev, tokenId]
      }
    })
  }

  const watchlistTokens = useMemo(() => {
    return DISCOVERABLE_TOKENS.filter(t => watchlist.includes(t.id))
  }, [watchlist])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <Coins className="h-8 w-8" /> Crypto Market
          </h1>
          <p className="text-muted-foreground">Track top assets and manage your favorites</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search tokens (e.g. BTC, Solana)..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {watchlistTokens.length > 0 && !searchQuery && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {watchlistTokens.map(token => (
            <Card key={token.id} className="shadow-sm border-l-4 border-l-secondary overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary font-bold">
                      {token.symbol[0]}
                    </div>
                    <div>
                      <p className="font-bold">{token.name}</p>
                      <p className="text-xs text-muted-foreground">{token.symbol}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-yellow-500"
                    onClick={() => toggleWatchlist(token.id, token.name)}
                  >
                    <Star className="h-4 w-4 fill-current" />
                  </Button>
                </div>
                <div className="flex items-end justify-between">
                  <div className="text-2xl font-bold">${token.price.toLocaleString()}</div>
                  <div className={cn(
                    "flex items-center text-xs font-bold px-2 py-1 rounded-full",
                    token.change >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  )}>
                    {token.change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {Math.abs(token.change)}%
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="shadow-sm border-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{searchQuery ? "Search Results" : "Top 25 Market Overview"}</CardTitle>
              <CardDescription>
                {searchQuery ? `Found ${filteredTokens.length} tokens` : "Current rankings by market capitalization"}
              </CardDescription>
            </div>
            {!searchQuery && (
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Plus className="h-4 w-4 mr-2" /> Custom Token
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">24h Change</TableHead>
                  <TableHead className="text-right hidden md:table-cell">Market Cap</TableHead>
                  <TableHead className="text-right w-[80px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTokens.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No results found for "{searchQuery}"
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTokens.map((token, index) => (
                    <TableRow key={token.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center text-primary text-[10px] font-bold">
                            {token.symbol}
                          </div>
                          <div>
                            <p className="text-sm font-bold">{token.name}</p>
                            <p className="text-[10px] text-muted-foreground uppercase">{token.symbol}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono font-medium">
                        ${token.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={cn(
                          "text-xs font-bold inline-flex items-center",
                          token.change >= 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {token.change >= 0 ? "+" : ""}{token.change}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right hidden md:table-cell text-muted-foreground text-xs">
                        {token.marketCap}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className={cn(
                            "h-8 w-8 transition-colors",
                            watchlist.includes(token.id) ? "text-yellow-500 hover:text-yellow-600" : "text-muted-foreground hover:text-primary"
                          )}
                          onClick={() => toggleWatchlist(token.id, token.name)}
                        >
                          <Star className={cn("h-4 w-4", watchlist.includes(token.id) && "fill-current")} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
