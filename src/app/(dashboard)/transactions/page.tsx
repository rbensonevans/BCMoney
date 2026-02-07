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
import { History, ArrowDownLeft, ArrowUpRight, Repeat, Send, ArrowLeft, Loader2, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUser, useFirebase, useCollection, useDoc, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy, where, getDocs, deleteDoc, doc } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"

export default function TransactionsPage() {
  const { user } = useUser()
  const { firestore } = useFirebase()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || 'BTC'
  const { toast } = useToast()
  const [isClearing, setIsClearing] = useState(false)

  // Check if profile exists before retrieving transactions
  const profileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'user_profiles', user.uid);
  }, [firestore, user]);

  const { data: profileData, isLoading: isProfileLoading } = useDoc(profileRef);

  // Using the user's UID as the account ID for this MVP
  const transactionsRef = useMemoFirebase(() => {
    if (!firestore || !user || !profileData) return null;
    return collection(firestore, 'accounts', user.uid, 'transactions');
  }, [firestore, user, profileData]);

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
    if (!transactionsRef) return;
    
    setIsClearing(true);
    try {
      const q = query(transactionsRef, where('tokenSymbol', '==', token));
      const snapshot = await getDocs(q);
      
      const deletePromises = snapshot.docs.map(d => deleteDoc(d.ref));
      await Promise.all(deletePromises);
      
      toast({
        title: "History Cleared",
        description: `All ${token} transactions have been removed.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Clear Failed",
        description: error.message,
      });
    } finally {
      setIsClearing(false);
    }
  };

  const isLoading = isProfileLoading || isTxnLoading;

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
                          {new Date(tx.transactionDate).toLocaleString()}
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
