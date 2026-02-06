"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Repeat, ArrowRightLeft, Wallet, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const TOKENS = [
  { id: '1', name: 'Bitcoin', symbol: 'BTC', price: 67432.10, balance: 0.25 },
  { id: '2', name: 'Ethereum', symbol: 'ETH', price: 3542.89, balance: 4.5 },
  { id: '3', name: 'Tether', symbol: 'USDT', price: 1.00, balance: 1250.00 },
  { id: '4', name: 'BNB', symbol: 'BNB', price: 589.45, balance: 12.0 },
  { id: '5', name: 'Solana', symbol: 'SOL', price: 145.67, balance: 45.0 },
  { id: '6', name: 'XRP', symbol: 'XRP', price: 0.62, balance: 1000.0 },
  { id: '7', name: 'USDC', symbol: 'USDC', price: 1.00, balance: 500.0 },
  { id: '8', name: 'Cardano', symbol: 'ADA', price: 0.45, balance: 2500.0 },
  { id: '9', name: 'Avalanche', symbol: 'AVAX', price: 35.89, balance: 15.0 },
  { id: '10', name: 'Dogecoin', symbol: 'DOGE', price: 0.16, balance: 50000.0 },
]

export default function TradePage() {
  const searchParams = useSearchParams()
  const sourceToken = searchParams.get('token') || 'BTC'
  const { toast } = useToast()
  
  const [targetToken, setTargetToken] = useState(sourceToken === "ETH" ? "BTC" : "ETH")
  const [amount, setAmount] = useState("")

  const selectedTokenData = TOKENS.find(t => t.symbol === sourceToken) || TOKENS[0]
  const targetTokenData = TOKENS.find(t => t.symbol === targetToken) || TOKENS[1]
  
  const exchangeRate = selectedTokenData.price / targetTokenData.price

  const handleTrade = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Trade Executed",
      description: `Successfully swapped ${amount} ${sourceToken} for ${targetToken}.`,
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <Button variant="ghost" asChild className="p-0 h-auto mb-2 text-muted-foreground hover:text-primary">
          <Link href="/mytokens" className="flex items-center gap-1 text-xs">
            <ArrowLeft className="h-3 w-3" /> Back to MyTokens
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <Repeat className="h-8 w-8" /> Trade Tokens
        </h1>
        <p className="text-muted-foreground">Swap your assets instantly with zero fees</p>
      </div>

      <Card className="shadow-lg border-none">
        <CardHeader>
          <CardTitle>Instant Swap</CardTitle>
          <CardDescription>Convert {sourceToken} to any other supported asset</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTrade} className="space-y-8">
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-xl border space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <Label>Sell</Label>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Wallet className="h-3 w-3" /> Balance: {selectedTokenData.balance.toLocaleString()} {selectedTokenData.symbol}
                  </span>
                </div>
                <div className="flex gap-4">
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    className="text-2xl font-bold h-14 bg-transparent border-none focus-visible:ring-0 px-0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                  <div className="flex items-center px-4 bg-card rounded-lg border font-bold h-14">
                    {selectedTokenData.symbol}
                  </div>
                </div>
              </div>

              <div className="flex justify-center -my-6 relative z-10">
                <div className="bg-primary text-primary-foreground p-2 rounded-full shadow-lg border-4 border-background">
                  <ArrowRightLeft className="h-5 w-5 rotate-90" />
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-xl border space-y-3">
                <Label>Buy</Label>
                <div className="flex gap-4">
                  <Input 
                    readOnly
                    placeholder="0.00" 
                    className="text-2xl font-bold h-14 bg-transparent border-none focus-visible:ring-0 px-0"
                    value={amount ? (parseFloat(amount) * exchangeRate).toFixed(4) : ""}
                  />
                  <Select value={targetToken} onValueChange={setTargetToken}>
                    <SelectTrigger className="w-[140px] h-14 font-bold">
                      <SelectValue placeholder="Target" />
                    </SelectTrigger>
                    <SelectContent>
                      {TOKENS.filter(t => t.symbol !== sourceToken).map(t => (
                        <SelectItem key={t.symbol} value={t.symbol}>{t.symbol}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Exchange Rate</span>
                    <span className="font-mono font-medium">1 {sourceToken} = {exchangeRate.toFixed(6)} {targetToken}</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Fee</span>
                    <span className="text-secondary font-bold">Zero Fees</span>
                </div>
            </div>

            <Button type="submit" className="w-full h-14 text-lg bg-secondary hover:bg-secondary/90 shadow-md">
              Confirm Trade
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
