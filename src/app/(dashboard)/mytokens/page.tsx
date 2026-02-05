
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Award } from "lucide-react"

const TOP_10_TOKENS = [
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
]

export default function MyTokensPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <Award className="h-8 w-8" /> MyTokens
          </h1>
        </div>
      </div>

      <Card className="shadow-sm border-none">
        <CardContent className="pt-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[50px]">Rank</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Performance</TableHead>
                  <TableHead className="text-right hidden md:table-cell">Market Cap</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TOP_10_TOKENS.map((token, index) => (
                  <TableRow key={token.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono text-xs text-muted-foreground font-bold">
                      #{index + 1}
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
                      <div className={cn(
                        "inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                        token.change >= 0 ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
                      )}>
                        {token.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {Math.abs(token.change)}%
                      </div>
                    </TableCell>
                    <TableCell className="text-right hidden md:table-cell text-muted-foreground text-xs">
                      {token.marketCap}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
