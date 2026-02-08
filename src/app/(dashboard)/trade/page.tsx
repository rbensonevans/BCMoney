
"use client"

import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
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
import { Repeat, ArrowRightLeft, Wallet, ArrowLeft, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirebase, useDoc, useMemoFirebase } from "@/firebase"
import { doc, collection } from "firebase/firestore"
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { TOP_30_TOKENS } from "@/lib/market-data"

export default function TradePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sourceTokenSymbol = searchParams.get('token') || 'BTC'
  const { toast } = useToast()
  const { user } = useUser()
  const { firestore } = useFirebase()
  
  const [targetTokenSymbol, setTargetTokenSymbol] = useState(sourceTokenSymbol === "ETH" ? "BTC" : "ETH")
  const [amount, setAmount] = useState("")

  const sourceTokenData = TOP_30_TOKENS.find(t => t.symbol === sourceTokenSymbol) || TOP_30_TOKENS[0]
  const targetTokenData = TOP_30_TOKENS.find(t => t.symbol === targetTokenSymbol) || TOP_30_TOKENS[1]
  
  const exchangeRate = sourceTokenData.price / targetTokenData.price

  // Fetch balances
  const sourceBalanceRef = useMemoFirebase(() => {
    if (!firestore || !user || !sourceTokenData.id) return null;
    return doc(firestore, 'user_profiles', user.uid, 'balances', sourceTokenData.id);
  }, [firestore, user, sourceTokenData.id]);

  const targetBalanceRef = useMemoFirebase(() => {
    if (!firestore || !user || !targetTokenData.id) return null;
    return doc(firestore, 'user_profiles', user.uid, 'balances', targetTokenData.id);
  }, [firestore, user, targetTokenData.id]);

  const { data: sourceBalanceData, isLoading: isSourceLoading } = useDoc(sourceBalanceRef);
  const { data: targetBalanceData, isLoading: isTargetLoading } = useDoc(targetBalanceRef);

  const currentSourceBalance = sourceBalanceData?.balance ?? 0;
  const currentTargetBalance = targetBalanceData?.balance ?? 0;

  const handleTrade = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !firestore) return;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    if (numAmount > currentSourceBalance) {
        toast({
            variant: "destructive",
            title: "Insufficient balance",
            description: `You only have ${currentSourceBalance.toLocaleString()} ${sourceTokenSymbol} available.`
        })
        return;
    }

    const targetAmount = numAmount * exchangeRate;

    // 1. Record the "Sell" part of the trade (Nested under Source Token)
    const sellTxnsRef = collection(firestore, 'user_profiles', user.uid, 'balances', sourceTokenData.id, 'transactions');
    const sellTxnRef = doc(sellTxnsRef);
    setDocumentNonBlocking(sellTxnRef, {
      id: sellTxnRef.id,
      tokenBalanceId: sourceTokenData.id,
      transactionDate: new Date().toISOString(),
      amount: -numAmount,
      transactionType: 'trade',
      tokenSymbol: sourceTokenSymbol,
      recipientAccountId: `Bought ${targetTokenSymbol}`
    }, { merge: true });

    // 2. Record the "Buy" part of the trade (Nested under Target Token)
    const buyTxnsRef = collection(firestore, 'user_profiles', user.uid, 'balances', targetTokenData.id, 'transactions');
    const buyTxnRef = doc(buyTxnsRef);
    setDocumentNonBlocking(buyTxnRef, {
      id: buyTxnRef.id,
      tokenBalanceId: targetTokenData.id,
      transactionDate: new Date().toISOString(),
      amount: targetAmount,
      transactionType: 'trade',
      tokenSymbol: targetTokenSymbol,
      recipientAccountId: `Sold ${sourceTokenSymbol}`
    }, { merge: true });

    // 3. Update Balances
    if (sourceBalanceRef) {
        setDocumentNonBlocking(sourceBalanceRef, {
            balance: currentSourceBalance - numAmount
        }, { merge: true });
    }
    if (targetBalanceRef) {
        setDocumentNonBlocking(targetBalanceRef, {
            balance: currentTargetBalance + targetAmount
        }, { merge: true });
    }

    toast({
      title: "Trade Executed",
      description: `Successfully swapped ${amount} ${sourceTokenSymbol} for ${targetTokenSymbol}.`,
    })

    setTimeout(() => {
      router.push(`/transactions?token=${sourceTokenSymbol}&tokenId=${sourceTokenData.id}`);
    }, 1000);
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
          <CardDescription>Convert {sourceTokenSymbol} to any other supported asset</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTrade} className="space-y-8">
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-xl border space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <Label>Sell</Label>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Wallet className="h-3 w-3" /> Balance: {isSourceLoading ? "..." : currentSourceBalance.toLocaleString()} {sourceTokenSymbol}
                  </span>
                </div>
                <div className="flex gap-4">
                  <Input 
                    type="number" 
                    step="any"
                    placeholder="0.00" 
                    className="text-2xl font-bold h-14 bg-transparent border-none focus-visible:ring-0 px-0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                  <div className="flex items-center px-4 bg-card rounded-lg border font-bold h-14">
                    {sourceTokenSymbol}
                  </div>
                </div>
              </div>

              <div className="flex justify-center -my-6 relative z-10">
                <div className="bg-primary text-primary-foreground p-2 rounded-full shadow-lg border-4 border-background">
                  <ArrowRightLeft className="h-5 w-5 rotate-90" />
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-xl border space-y-3">
                <div className="flex justify-between items-center text-sm">
                   <Label>Buy</Label>
                   <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Wallet className="h-3 w-3" /> Balance: {isTargetLoading ? "..." : currentTargetBalance.toLocaleString()} {targetTokenSymbol}
                  </span>
                </div>
                <div className="flex gap-4">
                  <Input 
                    readOnly
                    placeholder="0.00" 
                    className="text-2xl font-bold h-14 bg-transparent border-none focus-visible:ring-0 px-0"
                    value={amount ? (parseFloat(amount) * exchangeRate).toFixed(4) : ""}
                  />
                  <Select value={targetTokenSymbol} onValueChange={setTargetTokenSymbol}>
                    <SelectTrigger className="w-[140px] h-14 font-bold">
                      <SelectValue placeholder="Target" />
                    </SelectTrigger>
                    <SelectContent>
                      {TOP_30_TOKENS.filter(t => t.symbol !== sourceTokenSymbol).map(t => (
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
                    <span className="font-mono font-medium">1 {sourceTokenSymbol} = {exchangeRate.toFixed(6)} {targetTokenSymbol}</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Fee</span>
                    <span className="text-secondary font-bold">Zero Fees</span>
                </div>
            </div>

            <Button type="submit" className="w-full h-14 text-lg bg-secondary hover:bg-secondary/90 shadow-md" disabled={isSourceLoading || isTargetLoading}>
              Confirm Trade
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
