
"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { History, ArrowDownLeft, ArrowUpRight, Repeat, Send } from "lucide-react"
import { cn } from "@/lib/utils"

const MOCK_TXNS = [
  { id: '1', type: 'deposit', amount: 0.05, date: '2024-03-20 14:30', status: 'completed' },
  { id: '2', type: 'send', amount: -0.01, date: '2024-03-18 09:15', status: 'completed' },
  { id: '3', type: 'trade', amount: -0.02, date: '2024-03-15 11:45', status: 'completed' },
  { id: '4', type: 'withdraw', amount: -0.01, date: '2024-03-10 16:20', status: 'completed' },
  { id: '5', type: 'deposit', amount: 0.1, date: '2024-03-05 10:00', status: 'completed' },
]

export default function TransactionsPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || 'BTC'

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <History className="h-8 w-8" /> Transactions
        </h1>
        <p className="text-muted-foreground">Historical activity for your {token} wallet</p>
      </div>

      <Card className="shadow-sm border-none">
        <CardHeader>
          <CardTitle>{token} History</CardTitle>
          <CardDescription>A list of your recent {token} movements</CardDescription>
        </CardHeader>
        <CardContent>
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
                {MOCK_TXNS.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "p-1.5 rounded-full",
                          tx.type === 'deposit' ? "bg-green-100 text-green-700" :
                          tx.type === 'withdraw' ? "bg-red-100 text-red-700" :
                          tx.type === 'send' ? "bg-blue-100 text-blue-700" :
                          "bg-amber-100 text-amber-700"
                        )}>
                          {tx.type === 'deposit' && <ArrowDownLeft className="h-3 w-3" />}
                          {tx.type === 'withdraw' && <ArrowUpRight className="h-3 w-3" />}
                          {tx.type === 'send' && <Send className="h-3 w-3" />}
                          {tx.type === 'trade' && <Repeat className="h-3 w-3" />}
                        </div>
                        <span className="capitalize text-sm font-medium">{tx.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{tx.date}</TableCell>
                    <TableCell className={cn(
                      "text-right font-mono font-bold",
                      tx.amount > 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {tx.amount > 0 ? "+" : ""}{tx.amount} {token}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="px-2 py-0.5 rounded-full bg-muted text-[10px] font-bold uppercase">
                        {tx.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
