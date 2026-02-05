
"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Award, ArrowDownLeft, ArrowUpRight, Send, Repeat, History } from "lucide-react"

const TOP_10_TOKENS = [
  { id: '1', name: 'Bitcoin', symbol: 'BTC', price: 67432.10, balance: 0.25, marketCap: '1.32T' },
  { id: '2', name: 'Ethereum', symbol: 'ETH', price: 3542.89, balance: 4.5, marketCap: '425B' },
  { id: '3', name: 'Tether', symbol: 'USDT', price: 1.00, balance: 1250.00, marketCap: '110B' },
  { id: '4', name: 'BNB', symbol: 'BNB', price: 589.45, balance: 12.0, marketCap: '88B' },
  { id: '5', name: 'Solana', symbol: 'SOL', price: 145.67, balance: 45.0, marketCap: '65B' },
  { id: '6', name: 'XRP', symbol: 'XRP', price: 0.62, balance: 1000.0, marketCap: '34B' },
  { id: '7', name: 'USDC', symbol: 'USDC', price: 1.00, balance: 500.0, marketCap: '32B' },
  { id: '8', name: 'Cardano', symbol: 'ADA', price: 0.45, balance: 2500.0, marketCap: '16B' },
  { id: '9', name: 'Avalanche', symbol: 'AVAX', price: 35.89, balance: 15.0, marketCap: '13B' },
  { id: '10', name: 'Dogecoin', symbol: 'DOGE', price: 0.16, balance: 50000.0, marketCap: '23B' },
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
                  <TableHead>Asset</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TOP_10_TOKENS.map((token) => (
                  <TableRow key={token.id} className="hover:bg-muted/30 transition-colors">
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
                    <TableCell className="font-mono font-medium">
                      {token.balance.toLocaleString()} {token.symbol}
                      <p className="text-[10px] text-muted-foreground">
                        ≈ ${(token.balance * token.price).toLocaleString()}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Button variant="link" asChild className="text-secondary p-0 h-auto">
                        <Link href={`/deposit?token=${token.symbol}`}>
                          <ArrowDownLeft className="h-3 w-3 mr-1" /> Deposit
                        </Link>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button variant="link" asChild className="text-primary p-0 h-auto">
                        <Link href={`/withdraw?token=${token.symbol}`}>
                          <ArrowUpRight className="h-3 w-3 mr-1" /> Withdraw
                        </Link>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button variant="link" asChild className="text-secondary p-0 h-auto">
                        <Link href={`/send?token=${token.symbol}`}>
                          <Send className="h-3 w-3 mr-1" /> Send Money
                        </Link>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-4">
                        <Button variant="link" asChild className="text-primary p-0 h-auto font-bold">
                          <Link href={`/trade?token=${token.symbol}`}>
                            <Repeat className="h-3 w-3 mr-1" /> Trade
                          </Link>
                        </Button>
                        <Button variant="link" asChild className="text-muted-foreground p-0 h-auto">
                          <Link href={`/transactions?token=${token.symbol}`}>
                            <History className="h-3 w-3 mr-1" /> Txn
                          </Link>
                        </Button>
                      </div>
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
