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
  if (token.symbol === 'BCH') {
    return (
      <div className="shrink-0" style={{ width: size, height: size }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={size} height={size}>
          <circle cx="16" cy="16" r="16" fill="#8dc351"/>
          <path d="M23.189 14.152c.286-1.914-.11-3.328-3.011-4.102l.614-2.464-1.498-.374-.598 2.4c-.394-.098-.788-.192-1.182-.284l.602-2.417-1.498-.374-.614 2.464c-.326-.074-.645-.148-.962-.224l.001-.005-2.066-.516-.399 1.6s1.108.254 1.085.27c.605.151.714.552.696.871l-.7 2.809c.042.011.096.026.156.048-.05-.013-.105-.026-.164-.04l-1.127 4.52c-.074.183-.26.458-.68.353.015.021-1.085-.271-1.085-.271l-.745 1.715 1.95.487c.362.091.717.185 1.066.275l-.619 2.483 1.498.374.614-2.464c.409.111.808.217 1.2.318l-.603 2.42 1.498.374.62-2.487c2.556.484 4.479.288 5.286-2.024.652-1.861-.031-2.934-1.371-3.635.975-.225 1.71-.868 1.905-2.193zm-3.41 4.802c-.464 1.862-3.601.855-4.617.603l.824-3.305c1.016.252 4.28.749 3.793 2.702zm.466-4.832c-.422 1.696-3.033.834-3.88.623l.748-2.999c.847.211 3.57.606 3.132 2.376z" fill="#FFF" transform="rotate(-15 16 16)"/>
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
          <path d="M25.86 20.76L23.23 23.41H4.37L7 20.76H25.86ZM25.86 11.23L23.23 13.88H4.37L7 11.23H25.86ZM8.77 4.1H27.63L25 6.75H6.14L8.77 4.1Z" fill="url(#sol_grad_mytokens)"/>
          <defs>
            <linearGradient id="sol_grad_mytokens" x1="27.63" y1="4.1" x2="4.37" y2="23.41" gradientUnits="userSpaceOnUse">
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
          <circle cx="16" cy="16" r="16" fill="black"/>
          <ellipse cx="11" cy="16" rx="2.5" ry="5" fill="white"/>
          <ellipse cx="16" cy="16" rx="2.5" ry="5" fill="white"/>
          <ellipse cx="21" cy="16" rx="2.5" ry="5" fill="white"/>
        </svg>
      </div>
    )
  }
  if (token.symbol === 'LINK') {
    return (
      <div className="shrink-0" style={{ width: size, height: size }}>
        <svg viewBox="0 0 32 32" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="#2A5ADA"/>
          <path d="M16 8L24 12.5V20L16 24.5L8 20V12.5L16 8ZM16 11L12 13.5V18.5L16 21L20 18.5V13.5L16 11Z" fill="white"/>
        </svg>
      </div>
    )
  }
  if (token.symbol === 'MATIC') {
    return (
      <div className="shrink-0" style={{ width: size, height: size }}>
        <svg viewBox="0 0 32 32" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="#8247E5"/>
          <path d="M16 8L23 12V20L16 24L9 20V12L16 8ZM16 11.5L12.5 13.5V18.5L16 20.5L19.5 18.5V13.5L16 11.5Z" fill="white"/>
        </svg>
      </div>
    )
  }
  if (token.symbol === 'SHIB') {
    return (
      <div className="shrink-0" style={{ width: size, height: size }}>
        <svg viewBox="0 0 32 32" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="#FFA409"/>
          <circle cx="16" cy="16" r="15" stroke="#E32E1D" strokeWidth="2"/>
          <path d="M16 8C13 8 10 9.5 8.5 12L7 16C7 16 7.5 24 16 24C24.5 24 25 16 25 16L23.5 12C22 9.5 19 8 16 8Z" fill="#FFA409"/>
          <path d="M16 24C11 24 8.5 20 8.5 18C8.5 18 9 22 16 22C23 22 23.5 18 23.5 18C23.5 20 21 24 16 24Z" fill="white"/>
          <path d="M12 14C12.5523 14 13 13.5523 13 13C13 12.4477 12.5523 12 12 12C11.4477 12 11 12.4477 11 13C11 13.5523 11.4477 14 12 14Z" fill="black"/>
          <path d="M20 14C20.5523 14 21 13.5523 21 13C21 12.4477 20.5523 12 20 12C19.4477 12 19 13C19 13.5523 19.4477 14 20 14Z" fill="black"/>
          <path d="M16 19C16.5523 19 17 18.5523 17 18C17 17.4477 16.5523 17 16 17C15.4477 17 15 17.4477 15 18C15 18.5523 15.4477 19 16 19Z" fill="black"/>
          <path d="M14 20C14 20 15 21 16 21C17 21 18 20 18 20" stroke="black" strokeWidth="0.5" strokeLinecap="round"/>
        </svg>
      </div>
    )
  }
  if (token.symbol === 'LTC') {
    return (
      <div className="shrink-0" style={{ width: size, height: size }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={size} height={size}>
          <circle cx="16" cy="16" r="16" fill="#345D9D"/>
          <path d="M21 21h-6.2l1.1-4.1H18L19.1 13h-2.1l1.1-4.1H13.9L10 23.3h11V21z" fill="white" />
        </svg>
      </div>
    )
  }
  if (token.symbol === 'NEAR') {
    return (
      <div className="shrink-0" style={{ width: size, height: size }}>
        <svg viewBox="0 0 32 32" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="#00FFA3"/>
          <path d="M21.5 10H17.5L10.5 20.5V10H7V22H11L18 11.5V22H21.5V10Z" fill="black"/>
        </svg>
      </div>
    )
  }
  if (token.symbol === 'UNI') {
    return (
      <div className="rounded-full overflow-hidden shrink-0" style={{ width: size, height: size }}>
        <Image 
          src="https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png" 
          alt="UNI" 
          width={size} 
          height={size} 
          className="object-cover"
        />
      </div>
    )
  }
  if (token.symbol === 'DAI') {
    return (
      <div className="rounded-full overflow-hidden shrink-0" style={{ width: size, height: size }}>
        <Image 
          src="https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png" 
          alt="DAI" 
          width={size} 
          height={size} 
          className="object-cover"
        />
      </div>
    )
  }
  if (token.symbol === 'KAS') {
    return (
      <div className="rounded-full overflow-hidden shrink-0" style={{ width: size, height: size }}>
        <Image 
          src="https://s2.coinmarketcap.com/static/img/coins/64x64/20396.png" 
          alt="KAS" 
          width={size} 
          height={size} 
          className="object-cover"
        />
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
                          <TokenIcon token={token} size={32} />
                          <div>
                            <p className="text-sm font-bold">{token.name}</p>
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
