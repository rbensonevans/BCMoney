
"use client"

import { useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  Star, 
  TrendingUp, 
  TrendingDown, 
  LayoutDashboard,
  ArrowLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { TOP_30_TOKENS } from "@/lib/market-data"
import { useUser, useFirebase, useDoc, useMemoFirebase } from "@/firebase"
import { doc } from "firebase/firestore"
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates"

export default function WatchlistPage() {
  const { toast } = useToast()
  const { user } = useUser()
  const { firestore } = useFirebase()

  // Firestore Watchlist Persistence - Pointing to the root user document
  const profileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: profileData, isLoading } = useDoc(profileRef);
  // Default to BTC and ETH if watchlist is not yet set in profile
  const watchlist = profileData?.watchlist || ['1', '2'];

  const watchlistTokens = useMemo(() => {
    return TOP_30_TOKENS.filter(t => watchlist.includes(t.id))
  }, [watchlist])

  const toggleWatchlist = (tokenId: string, tokenName: string) => {
    if (!profileRef) return;

    const newWatchlist = watchlist.filter((id: string) => id !== tokenId);
    updateDocumentNonBlocking(profileRef, { watchlist: newWatchlist });

    toast({
      title: "Removed from Watchlist",
      description: `${tokenName} has been removed from your tracking list.`
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground italic">Loading your watchlist...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Button variant="ghost" asChild className="p-0 h-auto mb-2 text-muted-foreground hover:text-primary">
            <Link href="/dashboard" className="flex items-center gap-1 text-xs">
              <ArrowLeft className="h-3 w-3" /> Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <Star className="h-8 w-8 text-yellow-500 fill-current" /> My Watchlist
          </h1>
          <p className="text-muted-foreground">Detailed view of your tracked assets</p>
        </div>
      </div>

      <Card className="shadow-sm border-none">
        <CardHeader>
          <CardTitle>Tracked Assets</CardTitle>
          <CardDescription>
            You are currently tracking {watchlistTokens.length} tokens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Asset</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">24h Change</TableHead>
                  <TableHead className="text-right hidden md:table-cell">Market Cap</TableHead>
                  <TableHead className="text-right w-[100px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {watchlistTokens.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-48 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Star className="h-8 w-8 text-muted-foreground/30" />
                        <p className="text-muted-foreground">Your watchlist is empty</p>
                        <Button asChild variant="secondary" size="sm" className="mt-2">
                          <Link href="/dashboard">Explore Market</Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  watchlistTokens.map((token) => (
                    <TableRow key={token.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {token.symbol[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold">{token.name}</p>
                            <p className="text-xs text-muted-foreground uppercase">{token.symbol}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono font-medium">
                        ${token.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className={cn(
                          "inline-flex items-center text-xs font-bold",
                          token.change >= 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {token.change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                          {Math.abs(token.change)}%
                        </div>
                      </TableCell>
                      <TableCell className="text-right hidden md:table-cell text-muted-foreground text-xs">
                        {token.marketCap}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => toggleWatchlist(token.id, token.name)}
                        >
                          Unstar
                        </Button>
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
