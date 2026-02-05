
"use client"

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
import { Repeat, ArrowRightLeft, Wallet } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const TOKENS = [
  { symbol: 'BTC', name: 'Bitcoin', balance: 0.25 },
  { symbol: 'ETH', name: 'Ethereum', balance: 4.5 },
  { symbol: 'USDT', name: 'Tether', balance: 1250.0 },
  { symbol: 'SOL', name: 'Solana', balance: 45.0 },
  { symbol: 'ADA', name: 'Cardano', balance: 2500.0 },
]

export default function TradePage() {
  const searchParams = useSearchParams()
  const sourceToken = searchParams.get('token') || 'BTC'
  const { toast } = useToast()
  
  const [targetToken, setTargetToken] = useState("ETH")
  const [amount, setAmount] = useState("")

  const selectedTokenData = TOKENS.find(t => t.symbol === sourceToken) || TOKENS[0]

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
                    <Wallet className="h-3 w-3" /> Balance: {selectedTokenData.balance} {selectedTokenData.symbol}
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
                    value={amount ? (parseFloat(amount) * 15).toFixed(4) : ""}
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

            <Button type="submit" className="w-full h-14 text-lg bg-secondary hover:bg-secondary/90 shadow-md">
              Confirm Trade
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
