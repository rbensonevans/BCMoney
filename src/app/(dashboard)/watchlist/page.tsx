
"use client"

import { useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  Star, 
  TrendingUp, 
  TrendingDown, 
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
          <path d="M17.922 17.383v-.002c-.017.001-.034.001-.051.002-1.004.041-2.738.041-3.744 0-.017-.001-.034-.001-.051-.002v.002c-2.454-.114-4.29-.49-4.29-.933 0-.444 1.836-.82 4.29-.933v.002c.017-.001.034-.001.051-.002 1.006-.041 2.74-.041 3.744 0 .017.001.034.001.051.002v-.002c2.454.113 4.29.49 4.29.933 0 .444-1.836.82-4.29.933zm0-2.316V12.18h3.911V9.13H10.165v3.05h3.912v2.887c-2.883.157-5.016.666-5.016 1.282 0 .616 2.133 1.125 5.016 1.282v4.237h3.845v-4.237c2.883-.157 5.016-.666 5.016-1.282 0-.616-2.133-1.125-5.016-1.282z" fill="#FFF"/>
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
          <path d="M25.86 20.76L23.23 23.41H4.37L7 20.76H25.86ZM25.86 11.23L23.23 13.88H4.37L7 11.23H25.86ZM8.77 4.1H27.63L25 6.75H6.14L8.77 4.1Z" fill="url(#sol_grad_watchlist)"/>
          <defs>
            <linearGradient id="sol_grad_watchlist" x1="27.63" y1="4.1" x2="4.37" y2="23.41" gradientUnits="userSpaceOnUse">
              <stop stopColor="#14F195"/>
              <stop offset="0.5" stopColor="#42E4B4"/>
              <stop offset="1" stopColor="#9945FF"/>
            </linearGradient>
          </defs>
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

export default function WatchlistPage() {
  const { toast } = useToast()
  const { user } = useUser()
  const { firestore } = useFirebase()

  const profileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: profileData, isLoading } = useDoc(profileRef);
  const watchlist = profileData?.watchlist || ['1', '2'];

  const watchlistTokens = useMemo(() => {
    return TOP_30_TOKENS.filter(t => watchlist.includes(t.id))
  }, [watchlist])

  const toggleWatchlist = (tokenId: string, tokenName: string) => {
    if (!profileRef || !user) return;

    const newWatchlist = watchlist.filter((id: string) => id !== tokenId);
    setDocumentNonBlocking(profileRef, { 
      watchlist: newWatchlist,
      id: user.uid 
    }, { merge: true });

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
                  <TableHead className="text-right w-[80px]">Action</TableHead>
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
                          <TokenIcon token={token} size={40} />
                          <div>
                            <p className="text-sm font-bold">{token.name}</p>
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
                          size="icon" 
                          className="h-8 w-8 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50"
                          onClick={() => toggleWatchlist(token.id, token.name)}
                          title="Remove from watchlist"
                        >
                          <Star className="h-4 w-4 fill-current" />
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
