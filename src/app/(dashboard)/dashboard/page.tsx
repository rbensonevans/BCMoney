"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
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
  if (token.symbol === 'ETH') {
    return (
      <div className="shrink-0" style={{ width: size, height: size }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={size} height={size}>
          <circle cx="16" cy="16" r="16" fill="#627EEA"/>
          <path d="M16.498 4v8.87l7.497 3.35z" fill="#C0CBF6"/>
          <path d="M16.498 4L9 16.22l7.498-3.35z" fill="#FFF"/>
          <path d="M16.498 21.968v6.027l7.5-10.583z" fill="#C0CBF6"/>
          <path d="M16.498 27.995v-6.028l-7.5-10.556z" fill="#FFF"/>
          <path d="M16.498 20.443l7.497-4.553-7.497-3.348z" fill="#8197EE"/>
          <path d="M9 15.89l7.498 4.553v-7.901z" fill="#C0CBF6"/>
        </svg>
      </div>
    )
  }
  if (token.symbol === 'USDT') {
    return (
      <div className="shrink-0" style={{ width: size, height: size }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={size} height={size}>
          <circle cx="16" cy="16" r="16" fill="#26A17B"/>
          <path d="M17.922 17.383v-.002c-.017.001-.034.001-.051.002-1.004.041-2.738.041-3.744 0-.017-.001-.034-.001-.051-.002v.002c-2.454-.114-4.29-.49-4.29-.933 0-.444 1.836-.82 4.29-.933v.002c.017-.001.034-.001.051-.002 1.006-.041 2.74-.041 3.744 0 .017.001.034.001.051.002v-.002c2.454.113 4.29.49 4.29.933 0 .444-1.836.82-4.29.933zm0-2.316V12.18h3.911V9.13H10.165v3.05h3.912v2.887c-2.883.157-5.016.666-5.016 1.282 0 .616 2.133 1.125 5.016 1.282v4.237h3.845v-4.237c2.883-.157 5.016-.666 5.016-1.282 0-.616 2.133-1.125-5.016-1.282z" fill="#FFF"/>
        </svg>
      </div>
    )
  }
  if (token.symbol === 'USDC') {
    return (
      <div className="shrink-0" style={{ width: size, height: size }}>
        <svg viewBox="0 0 32 32" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="#2775CA"/>
          <path d="M16 24.5C20.6944 24.5 24.5 20.6944 24.5 16C24.5 11.3056 20.6944 7.5 16 7.5C11.3056 7.5 7.5 11.3056 7.5 16C7.5 20.6944 11.3056 24.5 16 24.5ZM16 22.7C12.2997 22.7 9.3 19.7003 9.3 16C9.3 12.2997 12.2997 9.3 16 9.3C19.7003 9.3 22.7 12.2997 22.7 16C22.7 19.7003 19.7003 22.7 16 22.7Z" fill="white"/>
          <path d="M17.8 17.5C17.8 19.1 16.5 20.1 14.9 20.3V21.4H13.8V20.3C12.3 20.2 11.3 19.3 11.2 18H12.6C12.7 18.6 13.3 19.1 14.4 19.2V17.3L13.1 17C11.9 16.7 11.1 16 11.1 14.8C11.1 13.4 12.2 12.5 13.7 12.3V11.2H14.8V12.3C16.2 12.4 17 13.1 17.1 14.2H15.7C15.6 13.6 15.1 13.2 14.2 13.1V14.9L15.5 15.2C16.8 15.5 17.8 16.3 17.8 17.5ZM14.9 18C15.9 17.9 16.5 17.5 16.5 16.8C16.5 16.3 16.2 15.9 15.4 15.7L14.4 15.5V17.9C14.4 17.9 14.6 18 14.9 18ZM13.1 14.4C12.3 14.5 12.3 14.9 12.3 15.2C12.3 15.6 12.6 15.9 13.3 16.1L13.8 16.2V14.3C13.8 14.3 13.4 14.3 13.1 14.4Z" fill="white"/>
        </svg>
      </div>
    )
  }
  if (token.symbol === 'BNB') {
    return (
      <div className="shrink-0" style={{ width: size, height: size }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={size} height={size}>
          <circle cx="16" cy="16" r="16" fill="#F3BA2F"/>
          <path d="M16 12.35l-2.43 2.43 2.43 2.43 2.43-2.43L16 12.35zM12.7 9.05l-2.43 2.43L12.7 13.9l2.43-2.42-2.43-2.43zM19.3 9.05l-2.43 2.43 2.43 2.42 2.43-2.43-2.43-2.43zM16 5.75l-2.43 2.43 2.43 2.43 2.43-2.43L16 5.75zM16 18.95l-2.43 2.43 2.43 2.43 2.43-2.43-2.43-2.43zM12.7 15.65l-2.43 2.43 2.43 2.43 2.43-2.43-2.43-2.43zM19.3 15.65l-2.43 2.43 2.43 2.43 2.43-2.43-2.43-2.43zM16 22.25l-2.43 2.43 2.43 2.43 2.43-2.43-2.43-2.43z" fill="#FFF"/>
        </svg>
      </div>
    )
  }
  if (token.symbol === 'SOL') {
    return (
      <div className="shrink-0" style={{ width: size, height: size }}>
        <svg viewBox="0 0 32 32" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="#000"/>
          <path d="M25.86 20.76L23.23 23.41H4.37L7 20.76H25.86ZM25.86 11.23L23.23 13.88H4.37L7 11.23H25.86ZM8.77 4.1H27.63L25 6.75H6.14L8.77 4.1Z" fill="url(#sol_grad)"/>
          <defs>
            <linearGradient id="sol_grad" x1="27.63" y1="4.1" x2="4.37" y2="23.41" gradientUnits="userSpaceOnUse">
              <stop stopColor="#14F195"/>
              <stop offset="0.5" stopColor="#42E4B4"/>
              <stop offset="1" stopColor="#9945FF"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
    )
  }
  if (token.symbol === 'XRP') {
    return (
      <div className="shrink-0" style={{ width: size, height: size }}>
        <svg viewBox="0 0 32 32" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="#23292F"/>
          <path d="M16 14.885L10.231 9.115H6.5L13.885 16.5L6.5 23.885H10.231L16 18.115L21.769 23.885H25.5L18.115 16.5L25.5 9.115H21.769L16 14.885Z" fill="white"/>
        </svg>
      </div>
    )
  }
  if (token.symbol === 'ADA') {
    return (
      <div className="shrink-0" style={{ width: size, height: size }}>
        <svg viewBox="0 0 32 32" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="#0033AD"/>
          <circle cx="16" cy="16" r="2" fill="white"/>
          <circle cx="16" cy="11" r="1.5" fill="white"/>
          <circle cx="16" cy="21" r="1.5" fill="white"/>
          <circle cx="11" cy="16" r="1.5" fill="white"/>
          <circle cx="21" cy="16" r="1.5" fill="white"/>
          <circle cx="12.5" cy="12.5" r="1.2" fill="white"/>
          <circle cx="19.5" cy="12.5" r="1.2" fill="white"/>
          <circle cx="12.5" cy="19.5" r="1.2" fill="white"/>
          <circle cx="19.5" cy="19.5" r="1.2" fill="white"/>
          <circle cx="16" cy="7" r="0.8" fill="white"/>
          <circle cx="16" cy="25" r="0.8" fill="white"/>
          <circle cx="7" cy="16" r="0.8" fill="white"/>
          <circle cx="25" cy="16" r="0.8" fill="white"/>
        </svg>
      </div>
    )
  }
  if (token.symbol === 'AVAX') {
    return (
      <div className="shrink-0" style={{ width: size, height: size }}>
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="16" fill="#E84142"/>
          <path fill="#FFF" d="m17.51 14.54-1.51-2.61-1.51 2.61h3.02zM12.63 23h2.38l-1.19-2.07L12.63 23zm4.37-2.07-1.19 2.07h2.38l-1.19-2.07zM16 10l-8 13.86h16L16 10zm4.24 11h-8.48L16 13.66 20.24 21z"/>
        </svg>
      </div>
    )
  }
  if (token.symbol === 'DOGE') {
    return (
      <div className="shrink-0" style={{ width: size, height: size }}>
        <svg viewBox="0 0 32 32" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="#BA9F33"/>
          <circle cx="16" cy="16" r="13" fill="#E1B305"/>
          <path d="M12 11V21H16.5C18.433 21 20 19.433 20 17.5V14.5C20 12.567 18.433 11 16.5 11H12ZM14.5 18.5V13.5H16.5C17.6046 13.5 18.5 14.3954 18.5 15.5V16.5C18.5 17.6046 17.6046 18.5 16.5 18.5H14.5Z" fill="white"/>
          <rect x="11" y="15.5" width="4" height="1" fill="white"/>
        </svg>
      </div>
    )
  }
  if (token.symbol === 'TRX') {
    return (
      <div className="shrink-0" style={{ width: size, height: size }}>
        <svg viewBox="0 0 32 32" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="#FF0013"/>
          <path d="M24 12L16 5L8 12L16 27L24 12ZM16 8L21 12.5L16 22L11 12.5L16 8Z" fill="white"/>
          <path d="M16 8L11 12.5L16 22V8Z" fill="white" fillOpacity="0.3"/>
        </svg>
      </div>
    )
  }
  if (token.symbol === 'DOT') {
    return (
      <div className="shrink-0" style={{ width: size, height: size }}>
        <svg viewBox="0 0 32 32" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="#E6007A"/>
          <path d="M16 8C11.5817 8 8 11.5817 8 16C8 20.4183 11.5817 24 16 24C20.4183 24 24 20.4183 24 16C24 11.5817 20.4183 8 16 8Z" fill="white"/>
          <circle cx="16" cy="16" r="2.5" fill="#E6007A"/>
        </svg>
      </div>
    )
  }
  if (token.symbol === 'LINK') {
    return (
      <div className="shrink-0" style={{ width: size, height: size }}>
        <svg viewBox="0 0 32 32" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="#2A5ADA"/>
          <path d="M16 6.5L25.5 11.5V20.5L16 25.5L6.5 20.5V11.5L16 6.5ZM16 11.5L11.5 14V18L16 20.5L20.5 18V14L16 11.5Z" fill="white" fillRule="evenodd"/>
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
                        <TokenIcon token={token} size={40} />
                        <div>
                          <p className="font-bold">{token.name}</p>
                          <p className="text-xs text-muted-foreground uppercase">{token.symbol}</p>
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
                  <TableHead className="w-[50px]">#</TableHead>
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
                    <TableCell colSpan={7} className="h-24 text-center">
                      No results found for "{searchQuery}"
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTokens.map((token, index) => {
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
                        <TableCell className="text-sm font-medium text-muted-foreground">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <TokenIcon token={token} size={32} />
                            <div>
                              <p className="text-sm font-bold">{token.name}</p>
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
