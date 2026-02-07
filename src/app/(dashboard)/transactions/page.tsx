"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { History, ArrowDownLeft, ArrowUpRight, Repeat, Send, ArrowLeft, Loader2, Trash2, Database } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUser, useFirebase, useCollection, useDoc, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy, where, getDocs, deleteDoc, doc, writeBatch } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates"

export default function TransactionsPage() {
  const { user } = useUser()
  const { firestore } = useFirebase()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || 'BTC'
  const { toast } = useToast()
  const [isClearing, setIsClearing] = useState(false)
  const [isSeeding, setIsSeeding] = useState(false)

  // 1. Get Profile first to ensure auth context is fully ready
  const profileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'user_profiles', user.uid);
  }, [firestore, user]);

  const { data: profileData, isLoading: isProfileLoading } = useDoc(profileRef);

  // 2. Setup Transactions Reference - Only if profile exists
  const transactionsRef = useMemoFirebase(() => {
    if (!firestore || !user || !profileData) return null;
    return collection(firestore, 'accounts', user.uid, 'transactions');
  }, [firestore, user, profileData]);

  // 3. Setup Query
  const transactionsQuery = useMemoFirebase(() => {
    if (!transactionsRef) return null;
    return query(
      transactionsRef, 
      where('tokenSymbol', '==', token),
      orderBy('transactionDate', 'desc')
    );
  }, [transactionsRef, token]);

  const { data: transactions, isLoading: isTxnLoading } = useCollection(transactionsQuery);

  const handleClearHistory = async () => {
    if (!transactionsRef || !firestore || !user) return;
    
    setIsClearing(true);
    try {
      const q = query(transactionsRef, where('tokenSymbol', '==', token));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        toast({ title: "History is already empty" });
        setIsClearing(false);
        return;
      }

      const batch = writeBatch(firestore);
      snapshot.docs.forEach(d => batch.delete(d.ref));
      await batch.commit();
      
      toast({
        title: "History Cleared",
        description: `All ${token} transactions have been removed.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Clear Failed",
        description: "Could not clear history. Please try again.",
      });
    } finally {
      setIsClearing(false);
    }
  };

  const handleSeedHistory = async () => {
    if (!transactionsRef || !firestore || !user) return;
    
    setIsSeeding(true);
    try {
      const samples = [
        { amount: 1.5, type: 'deposit', date: new Date(Date.now() - 86400000 * 3).toISOString() },
        { amount: -0.25, type: 'send', date: new Date(Date.now() - 86400000 * 2).toISOString(), recipient: '@alice' },
        { amount: 0.1, type: 'trade', date: new Date(Date.now() - 86400000 * 1).toISOString() },
        { amount: -0.5, type: 'withdrawal', date: new Date().toISOString(), recipient: '0x123...abc' },
      ];

      for (const sample of samples) {
        const newDocRef = doc(transactionsRef);
        setDocumentNonBlocking(newDocRef, {
          id: newDocRef.id,
          accountId: user.uid,
          transactionDate: sample.date,
          amount: sample.amount,
          transactionType: sample.type,
          tokenSymbol: token,
          recipientAccountId: sample.recipient || null
        }, { merge: true });
      }

      toast({
        title: "Sample Data Seeded",
        description: `Generated 4 sample transactions for ${token}.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Seeding Failed",
        description: error.message,
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const isLoading = isProfileLoading || (isTxnLoading && !!profileData);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <Button variant="ghost" asChild className="p-0 h-auto mb-2 text-muted-foreground hover:text-primary">
            <Link href="/mytokens" className="flex items-center gap-1 text-xs">
              <ArrowLeft className="h-3 w-3" /> Back to MyTokens
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <History className="h-8 w-8" /> Transactions
          </h1>
          <p className="text-muted-foreground">Historical activity for your {token} wallet</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-primary border-primary/20 hover:bg-primary/10"
            onClick={handleSeedHistory}
            disabled={isSeeding || isLoading}
          >
            {isSeeding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Database className="h-4 w-4 mr-2" />}
            Seed Samples
          </Button>
          {transactions && transactions.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-destructive border-destructive/20 hover:bg-destructive/10"
              onClick={handleClearHistory}
              disabled={isClearing}
            >
              {isClearing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Clear {token} History
            </Button>
          )}
        </div>
      </div>

      <Card className="shadow-sm border-none">
        <CardHeader>
          <CardTitle>{token} History</CardTitle>
          <CardDescription>A list of your recent {token} movements</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!transactions || transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-48 text-center text-muted-foreground">
                        <div className="flex flex-col items-center gap-2">
                          <History className="h-8 w-8 opacity-20" />
                          <p>No transactions found for {token}.</p>
                          <p className="text-xs">Click "Seed Samples" to populate some test data.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "p-1.5 rounded-full",
                              tx.transactionType === 'deposit' ? "bg-green-100 text-green-700" :
                              tx.transactionType === 'withdrawal' ? "bg-red-100 text-red-700" :
                              tx.transactionType === 'send' ? "bg-blue-100 text-blue-700" :
                              "bg-amber-100 text-amber-700"
                            )}>
                              {tx.transactionType === 'deposit' && <ArrowDownLeft className="h-3 w-3" />}
                              {tx.transactionType === 'withdrawal' && <ArrowUpRight className="h-3 w-3" />}
                              {tx.transactionType === 'send' && <Send className="h-3 w-3" />}
                              {tx.transactionType === 'trade' && <Repeat className="h-3 w-3" />}
                            </div>
                            <span className="capitalize text-sm font-medium">{tx.transactionType}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {tx.transactionDate ? new Date(tx.transactionDate).toLocaleString() : 'N/A'}
                        </TableCell>
                        <TableCell className={cn(
                          "text-right font-mono font-bold",
                          tx.amount > 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString()} {token}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="px-2 py-0.5 rounded-full bg-muted text-[10px] font-bold uppercase">
                            completed
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}