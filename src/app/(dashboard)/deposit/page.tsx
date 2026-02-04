
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, QrCode, ShieldCheck, Wallet } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DepositPage() {
  const { toast } = useToast()
  const ethAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"

  const copyAddress = () => {
    navigator.clipboard.writeText(ethAddress)
    toast({
      title: "Address copied",
      description: "ETH address has been copied to clipboard.",
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-primary">Deposit Funds</h1>
        <p className="text-muted-foreground">Send Ethereum (ETH) to your BCMoney wallet</p>
      </div>

      <Card className="shadow-lg border-none">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
            <Wallet className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Your ETH Deposit Address</CardTitle>
          <CardDescription>Only send ETH to this address. Other assets will be lost.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center p-6 bg-muted/30 rounded-xl border-2 border-dashed border-border">
            <div className="bg-white p-4 rounded-lg shadow-inner mb-4">
               <QrCode className="h-48 w-48 text-primary" />
            </div>
            <div className="w-full space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">Wallet Address</p>
              <div className="flex gap-2">
                <Input readOnly value={ethAddress} className="font-mono text-xs text-center h-12" />
                <Button variant="outline" size="icon" className="h-12 w-12 shrink-0" onClick={copyAddress}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-secondary/10 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-secondary">Secured by BCMoney</p>
                <p className="text-xs text-muted-foreground">Funds are automatically credited after 12 confirmations.</p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-blue-50 flex items-start gap-3 border border-blue-100">
               <div className="h-5 w-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">i</div>
              <div>
                <p className="text-sm font-bold text-blue-700">Unique Identifier</p>
                <p className="text-xs text-blue-600">This address is permanently linked to your unique name: <b>@john_doe</b></p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
