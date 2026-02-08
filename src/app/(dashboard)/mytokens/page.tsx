
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
import { Award, ArrowDownLeft, ArrowUpRight, Send, Repeat, History, Loader2, Copy } from "lucide-react"
import { useUser, useFirebase, useDoc, useCollection, useMemoFirebase } from "@/firebase"
import { doc, collection } from "firebase/firestore"
import { TOP_30_TOKENS } from "@/lib/market-data"
import { useToast } from "@/hooks/use-toast"

// Helper component for token icons
function TokenIcon({ token, size = 32 }: { token: any, size?: number }) {
  if (token.symbol === 'BTC') {
    return (
      <div className="shrink-0" style={{ width: size, height: size }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={size} height={size}>
          <circle cx="16" cy="16" r="16" fill="#F7931A"/>
          <path d="M23.189 14.152c.286-1.914-.11-3.328-3.011-4.102l.614-2.464-1.498-.374-.598 2.4c-.394-.098-.788-.192-1.182-.284l.602-2.417-1.498-.374-.614 2.464c-.326-.074-.645-.148-.962-.224l.001-.005-2.066-.516-.399 1.6s1.108.254 1.085.27c.605.151.714.552.696.871l-.7 2.809c.042.011.096.026.156.048-.05-.013-.105-.026-.164-.04l-1.127 4.52c-.074.183-.26.458-.68.353.015.021-1.085-.271-1.085-.271l-.745 1.715 1.95.487c.362.091.717.185 1.066.275l-.619 2.483 1.498.374.614-2.464c.409.111.808.217 1.2.318l-.603 2.42 1.498.374.62-2.487c2.556.484 4.479.288 5.286-2.024.652-1.861-.031-2.934-1.371-3.635.975-.225 1.71-.868 1.905-2.193zm-3.41 4.802c-.464 1.862-3.601.855-4.617.603l.824-3.305c1.016.252 4.28.749 3.793 2.702zm.466-4.832c-.422 1.696-3.033.834-3.88.623l.748-2.999c.847.211 3.57.606 3.132 2.376z" fill="#FFF"/>
        </svg>
      </div>
    )
  }
  return (
    <div className="rounded-full overflow-hidden bg-muted relative shrink-0" style={{ width: size, height: size }}>
      <Image 
        src={`https://picsum.photos/seed/${token.id}/${size}/${size}`} 
        alt={token.symbol}
        fill
        className="object-cover"
        data-ai-hint="crypto token"
      />
    </div>
  )
}

export default function MyTokensPage() {
  const { user } = useUser()
  const { firestore } = useFirebase()
  const { toast } = useToast()

  const profileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'user_profiles', user.uid);
  }, [firestore, user]);

  const balancesRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'user_profiles', user.uid, 'balances');
  }, [firestore, user]);

  const { data: profileData, isLoading: isProfileLoading } = useDoc(profileRef);
  const { data: balancesData, isLoading: isBalancesLoading } = useCollection(balancesRef);
  
  const ownedTokensList = useMemo(() => {
    const ownedIds = profileData?.ownedTokens || [];
    const balances = balancesData || [];

    return TOP_30_TOKENS
      .filter(t => ownedIds.includes(t.id))
      .map(t => {
        const balanceDoc = balances.find(b => b.tokenId === t.id);
        return {
          ...t,
          balance: balanceDoc ? balanceDoc.balance : 0,
          ethereumAddress: balanceDoc?.ethereumAddress || ""
        };
      });
  }, [profileData, balancesData]);

  const copyAddress = (address: string, symbol: string) => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    toast({
      title: "Address Copied",
      description: `${symbol} deposit address copied to clipboard.`
    });
  }

  if (isProfileLoading || isBalancesLoading) {
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
          <p className="text-muted-foreground text-sm">Your crypto portfolio with token-specific addresses</p>
        </div>
      </div>

      <Card className="shadow-sm border-none">
        <CardContent className="pt-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Asset</TableHead>
                  <TableHead>Balance & Address</TableHead>
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
                          <TokenIcon token={token} size={32} />
                          <div>
                            <Link 
                              href="/dashboard" 
                              className="text-sm font-bold hover:underline text-primary transition-colors"
                            >
                              {token.name}
                            </Link>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono font-medium">
                          {token.balance.toLocaleString()} {token.symbol}
                          <p className="text-[10px] text-muted-foreground">
                            ≈ ${(token.balance * token.price).toLocaleString()}
                          </p>
                        </div>
                        {token.ethereumAddress && (
                          <button 
                            onClick={() => copyAddress(token.ethereumAddress, token.symbol)}
                            className="flex items-center gap-1 text-[9px] text-secondary hover:underline mt-1 bg-secondary/5 px-1.5 py-0.5 rounded border border-secondary/10"
                          >
                            <Copy className="h-2 w-2" /> {token.ethereumAddress.substring(0, 10)}...
                          </button>
                        )}
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
                            <Link href={`/transactions?token=${token.symbol}&tokenId=${token.id}`}>
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
