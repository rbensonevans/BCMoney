"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Send, 
  History, 
  TrendingUp, 
  CreditCard,
  User
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const transactions = [
  { id: 1, type: "Sent", recipient: "Alice (UniqueName: @alice)", amount: -150.00, date: "2023-10-25", status: "Completed" },
  { id: 2, type: "Received", sender: "Exchange", amount: 1200.50, date: "2023-10-24", status: "Completed" },
  { id: 3, type: "Sent", recipient: "Bob (UniqueName: @bob_the_builder)", amount: -45.20, date: "2023-10-23", status: "Completed" },
  { id: 4, type: "Deposit", sender: "External Wallet", amount: 500.00, date: "2023-10-20", status: "Completed" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-primary text-primary-foreground shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <CreditCard className="h-4 w-4 opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$12,450.00</div>
            <p className="text-xs opacity-70 mt-1">
              +12% from last month
            </p>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="secondary" className="flex-1 text-xs gap-1">
                <ArrowDownLeft className="h-3 w-3" /> Deposit
              </Button>
              <Button size="sm" variant="secondary" className="flex-1 text-xs gap-1">
                <Send className="h-3 w-3" /> Send
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Monthly Outflow</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,200.00</div>
            <p className="text-xs text-muted-foreground mt-1">
              Mainly to friends & family
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Unique Name</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">@john_doe</div>
            <p className="text-xs text-muted-foreground mt-1">
              Linked to your account
            </p>
            <div className="mt-2 text-[10px] font-mono bg-muted p-1 rounded">
              0x123...456abc
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <CardTitle className="text-xl flex items-center gap-2">
                <History className="h-5 w-5 text-primary" /> Recent Transactions
              </CardTitle>
              <CardDescription>Your latest financial activities</CardDescription>
            </div>
            <Button variant="outline" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors border border-transparent hover:border-border">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center",
                      tx.amount > 0 ? "bg-secondary/10 text-secondary" : "bg-destructive/10 text-destructive"
                    )}>
                      {tx.amount > 0 ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{tx.type} {tx.sender || tx.recipient}</p>
                      <p className="text-xs text-muted-foreground">{tx.date} • {tx.status}</p>
                    </div>
                  </div>
                  <div className={cn(
                    "text-sm font-bold",
                    tx.amount > 0 ? "text-secondary" : "text-foreground"
                  )}>
                    {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
