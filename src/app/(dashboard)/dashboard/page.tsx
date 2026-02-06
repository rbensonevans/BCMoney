
"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Search, 
  Plus, 
  Star, 
  TrendingUp, 
  TrendingDown,
  Coins,
  ArrowRight,
  CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates"

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()
  const { user } = useUser()
  const { firestore } = useFirebase()

  const profileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: profileData } = useDoc(profileRef);
  const watchlist = profileData?.watchlist || ['1', '2']; 
  const ownedTokens = profileData?.ownedTokens || [];

  const filteredTokens = useMemo(() => {
    return TOP_30_TOKENS.filter(token => 
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const toggleWatchlist = (tokenId: string, tokenName: string) => {
    if (!profileRef || !user) return;

    const isAlreadyAdded = watchlist.includes(tokenId)
    const newWatchlist = isAlreadyAdded 
      ? watchlist.filter((id: string) => id !== tokenId)
      : [...watchlist, tokenId];

    setDocumentNonBlocking(profileRef, { 
      watchlist: newWatchlist,
      id: user.uid,
      email: user.email || ""
    }, { merge: true });

    toast({
      title: isAlreadyAdded ? "Removed from Watchlist" : "Added to Watchlist",
      description: isAlreadyAdded ? `${tokenName} has been removed.` : `${tokenName} is now being tracked.`
    })
  }

  const addToMyTokens = (tokenId: string, tokenName: string) => {
    if (!profileRef || !user || ownedTokens.includes(tokenId)) return;

    const newOwnedTokens = [...ownedTokens, tokenId];

    setDocumentNonBlocking(profileRef, { 
      ownedTokens: newOwnedTokens,
      id: user.uid,
      email: user.email || ""
    }, { merge: true });

    toast({
      title: "Token Added",
      description: `${tokenName} has been added to your MyTokens list.`
    })
  }

  const watchlistTokens = useMemo(() => {
    return TOP_30_TOKENS.filter(t => watchlist.includes(t.id)).slice(0, 4)
  }, [watchlist])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <Coins className="h-8 w-8" /> Crypto Market
          </h1>
          <p className="text-muted-foreground">Track top assets and manage your favorites</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search tokens (e.g. BTC, Solana)..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {!searchQuery && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              Your Favorites
            </h2>
            <Button variant="link" asChild className="p-0 h-auto text-secondary font-bold">
              <Link href="/watchlist" className="flex items-center gap-1">
                View All Watchlist <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          {watchlistTokens.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {watchlistTokens.map(token => (
                <Card key={token.id} className="shadow-sm border-l-4 border-l-secondary overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary font-bold">
                          {token.symbol[0]}
                        </div>
                        <div>
                          <p className="font-bold">{token.name}</p>
                          <p className="text-xs text-muted-foreground">{token.symbol}</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-yellow-500"
                        onClick={() => toggleWatchlist(token.id, token.name)}
                      >
                        <Star className="h-4 w-4 fill-current" />
                      </Button>
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="text-2xl font-bold">${token.price.toLocaleString()}</div>
                      <div className={cn(
                        "flex items-center text-xs font-bold px-2 py-1 rounded-full",
                        token.change >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      )}>
                        {token.change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                        {Math.abs(token.change)}%
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">Your watchlist is currently empty. Star some tokens below to track them.</p>
          )}
        </div>
      )}

      <Card className="shadow-sm border-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Top 30 Market Overview</CardTitle>
              <CardDescription>
                {searchQuery ? `Found ${filteredTokens.length} tokens` : "Current rankings by market capitalization"}
              </CardDescription>
            </div>
            {!searchQuery && (
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Plus className="h-4 w-4 mr-2" /> Custom Token
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[100px]">
                    <div className="text-[10px] leading-tight uppercase font-bold text-center">
                      Add to<br/>MyTokens
                    </div>
                  </TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">24h Change</TableHead>
                  <TableHead className="text-right hidden md:table-cell">Market Cap</TableHead>
                  <TableHead className="text-right w-[80px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTokens.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No results found for "{searchQuery}"
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTokens.map((token) => {
                    const isOwned = ownedTokens.includes(token.id);
                    return (
                      <TableRow key={token.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="text-center">
                          <button
                            disabled={isOwned}
                            onClick={() => addToMyTokens(token.id, token.name)}
                            className={cn(
                              "h-6 w-6 rounded-full transition-all flex items-center justify-center mx-auto",
                              isOwned 
                                ? "bg-red-500 cursor-not-allowed opacity-80" 
                                : "bg-green-500 hover:scale-110 active:scale-95 shadow-sm"
                            )}
                          >
                            {isOwned && <CheckCircle2 className="h-4 w-4 text-white" />}
                          </button>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center text-primary text-[10px] font-bold">
                              {token.symbol}
                            </div>
                            <div>
                              <p className="text-sm font-bold">{token.name}</p>
                              <p className="text-[10px] text-muted-foreground uppercase">{token.symbol}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono font-medium">
                          ${token.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={cn(
                            "text-xs font-bold inline-flex items-center",
                            token.change >= 0 ? "text-green-600" : "text-red-600"
                          )}>
                            {token.change >= 0 ? "+" : ""}{token.change}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right hidden md:table-cell text-muted-foreground text-xs">
                          {token.marketCap}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className={cn(
                              "h-8 w-8 transition-colors",
                              watchlist.includes(token.id) ? "text-yellow-500 hover:text-yellow-600" : "text-muted-foreground hover:text-primary"
                            )}
                            onClick={() => toggleWatchlist(token.id, token.name)}
                          >
                            <Star className={cn("h-4 w-4", watchlist.includes(token.id) && "fill-current")} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
