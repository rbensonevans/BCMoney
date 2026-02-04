
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Send, Search, Star, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function SendPage() {
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const { toast } = useToast()

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Funds Sent",
      description: `Successfully sent $${amount} to ${recipient}`,
    })
  }

  const recentRecipients = [
    { name: "Alice Smith", handle: "@alice", initials: "AS" },
    { name: "Bob Builder", handle: "@bob_the_builder", initials: "BB" },
    { name: "Charlie Day", handle: "@charlie_d", initials: "CD" },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-primary">Send Money</h1>
        <p className="text-muted-foreground">Instantly transfer funds to any BCMoney user</p>
      </div>

      <Card className="shadow-lg border-none overflow-hidden">
        <div className="bg-primary p-6 text-primary-foreground flex flex-col items-center">
          <p className="text-sm opacity-80 uppercase tracking-widest mb-1">Available to Send</p>
          <p className="text-4xl font-bold">$12,450.00</p>
        </div>
        <CardHeader>
          <CardTitle>Transfer Details</CardTitle>
          <CardDescription>Search by Unique Name (@handle) or email</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <form onSubmit={handleSend} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    id="recipient" 
                    placeholder="@username or email..." 
                    required 
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USD)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input 
                    id="amount" 
                    type="number" 
                    placeholder="0.00" 
                    required 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 h-12 gap-2 text-lg">
              <Send className="h-5 w-5" /> Send Funds Now
            </Button>
          </form>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" /> Recent Recipients
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {recentRecipients.map((user) => (
                <button 
                  key={user.handle} 
                  onClick={() => setRecipient(user.handle)}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-muted/50 border border-transparent hover:border-border transition-all"
                >
                  <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">{user.initials}</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <p className="text-xs font-bold truncate w-full">{user.name}</p>
                    <p className="text-[10px] text-muted-foreground">{user.handle}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
