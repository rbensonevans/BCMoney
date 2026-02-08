
"use client"

import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowUpRight, AlertCircle, Info, ArrowLeft, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirebase, useDoc, useMemoFirebase } from "@/firebase"
import { doc, collection } from "firebase/firestore"
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { TOP_30_TOKENS } from "@/lib/market-data"

export default function WithdrawPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tokenSymbol = searchParams.get('token') || 'ETH'
  const { user } = useUser()
  const { firestore } = useFirebase()
  
  const [address, setAddress] = useState("")
  const [amount, setAmount] = useState("")
  const { toast } = useToast()

  // Find token ID
  const currentToken = TOP_30_TOKENS.find(t => t.symbol === tokenSymbol)
  const tokenId = currentToken?.id

  const balanceRef = useMemoFirebase(() => {
    if (!firestore || !user || !tokenId) return null;
    return doc(firestore, 'user_profiles', user.uid, 'balances', tokenId);
  }, [firestore, user, tokenId]);

  const { data: balanceData, isLoading: isBalanceLoading } = useDoc(balanceRef);
  const currentBalance = balanceData?.balance ?? 0;

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !firestore || !tokenId) return;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    if (numAmount > currentBalance) {
        toast({
            variant: "destructive",
            title: "Insufficient balance",
            description: `You only have ${currentBalance.toLocaleString()} ${tokenSymbol} available.`
        })
        return;
    }

    // 1. Record the transaction in the new nested path
    const transactionsRef = collection(firestore, 'user_profiles', user.uid, 'balances', tokenId, 'transactions');
    const txnRef = doc(transactionsRef);
    setDocumentNonBlocking(txnRef, {
      id: txnRef.id,
      tokenBalanceId: tokenId,
      transactionDate: new Date().toISOString(),
      amount: -numAmount,
      transactionType: 'withdrawal',
      tokenSymbol: tokenSymbol,
      recipientAccountId: address // External address
    }, { merge: true });

    // 2. Update balance
    if (balanceRef) {
        setDocumentNonBlocking(balanceRef, {
            balance: currentBalance - numAmount,
            tokenId: tokenId,
            id: tokenId
        }, { merge: true });
    }

    toast({
      title: "Withdrawal Initiated",
      description: `Sending ${amount} ${tokenSymbol} to ${address.substring(0, 6)}...`,
    })

    setTimeout(() => {
      router.push(`/transactions?token=${tokenSymbol}&tokenId=${tokenId}`);
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
        <h1 className="text-3xl font-bold text-primary">Withdraw {tokenSymbol}</h1>
        <p className="text-muted-foreground">Transfer your {tokenSymbol} balance to an external wallet</p>
      </div>

      <Card className="shadow-lg border-none overflow-hidden">
        <div className="bg-primary/5 p-6 border-b flex flex-col items-center">
          <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Available Balance</p>
          {isBalanceLoading ? (
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          ) : (
            <p className="text-2xl font-black text-primary">{currentBalance.toLocaleString()} {tokenSymbol}</p>
          )}
        </div>
        <CardContent className="pt-6">
          <form onSubmit={handleWithdraw} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="address">Destination {tokenSymbol} Address</Label>
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
              <Label htmlFor="amount">Amount ({tokenSymbol})</Label>
              <div className="relative">
                <Input 
                  id="amount" 
                  type="number" 
                  step="any"
                  placeholder="0.00" 
                  required 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold">
                  {tokenSymbol}
                </span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground px-1">
                <span>Network Fee included</span>
                <button type="button" className="text-secondary font-semibold hover:underline" onClick={() => setAmount(currentBalance.toString())}>Max Amount</button>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 flex gap-3 items-start">
              <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 leading-relaxed">
                Please verify the destination address carefully. Transactions on the network are irreversible. BCMoney cannot recover funds sent to the wrong address.
              </p>
            </div>

            <Button type="submit" className="w-full bg-primary h-12 gap-2 text-lg" disabled={isBalanceLoading}>
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
