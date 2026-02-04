
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowUpRight, AlertCircle, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function WithdrawPage() {
  const [address, setAddress] = useState("")
  const [amount, setAmount] = useState("")
  const { toast } = useToast()

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Withdrawal Initiated",
      description: `Sending ${amount} to ${address.substring(0, 6)}...`,
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-primary">Withdraw Funds</h1>
        <p className="text-muted-foreground">Transfer your balance to an external Ethereum wallet</p>
      </div>

      <Card className="shadow-lg border-none">
        <CardHeader>
          <CardTitle>Transfer Details</CardTitle>
          <CardDescription>Available Balance: $12,450.00</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleWithdraw} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="address">Destination ETH Address</Label>
              <Input 
                id="address" 
                placeholder="0x..." 
                required 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input 
                  id="amount" 
                  type="number" 
                  placeholder="0.00" 
                  required 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-7"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground px-1">
                <span>Network Fee: $2.50</span>
                <button type="button" className="text-secondary font-semibold hover:underline" onClick={() => setAmount("12447.50")}>Max Amount</button>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 flex gap-3 items-start">
              <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 leading-relaxed">
                Please verify the destination address carefully. Transactions on the Ethereum network are irreversible. BCMoney cannot recover funds sent to the wrong address.
              </p>
            </div>

            <Button type="submit" className="w-full bg-primary h-12 gap-2 text-lg">
              <ArrowUpRight className="h-5 w-5" /> Confirm Withdrawal
            </Button>
          </form>
        </CardContent>
        <CardFooter className="bg-muted/30 text-xs text-muted-foreground flex items-center justify-center py-4 border-t">
          <Info className="h-4 w-4 mr-2" /> 
          Transfers typically take 5-15 minutes to process.
        </CardFooter>
      </Card>
    </div>
  )
}
