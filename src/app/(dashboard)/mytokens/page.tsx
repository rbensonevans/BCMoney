
"use client"

import { useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
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
import { Award, ArrowDownLeft, ArrowUpRight, Send, Repeat, History, Loader2 } from "lucide-react"
import { useUser, useFirebase, useDoc, useMemoFirebase } from "@/firebase"
import { doc } from "firebase/firestore"
import { TOP_30_TOKENS } from "@/lib/market-data"

export default function MyTokensPage() {
  const { user } = useUser()
  const { firestore } = useFirebase()

  const profileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: profileData, isLoading } = useDoc(profileRef);
  
  const ownedTokensList = useMemo(() => {
    const ownedIds = profileData?.ownedTokens || [];
    return TOP_30_TOKENS.filter(t => ownedIds.includes(t.id)).map(t => ({
      ...t,
      balance: ownedIds.indexOf(t.id) % 2 === 0 ? 0.5 : 1250.0 
    }));
  }, [profileData]);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <Award className="h-8 w-8" /> MyTokens
          </h1>
          <p className="text-muted-foreground text-sm">Assets added from the market overview</p>
        </div>
      </div>

      <Card className="shadow-sm border-none">
        <CardContent className="pt-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Asset</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ownedTokensList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Award className="h-8 w-8 text-muted-foreground/30" />
                        <p className="text-muted-foreground">You haven't added any tokens to MyTokens yet.</p>
                        <Button asChild variant="secondary" size="sm" className="mt-2">
                          <Link href="/dashboard">Go to Market</Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  ownedTokensList.map((token) => (
                    <TableRow key={token.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full overflow-hidden bg-muted relative">
                            <Image 
                              src={`https://picsum.photos/seed/${token.id}/32/32`} 
                              alt={token.symbol}
                              fill
                              className="object-cover"
                              data-ai-hint="crypto token"
                            />
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
                            <Send className="h-3 w-3 mr-1" /> Send
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
