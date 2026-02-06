
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Info, Shield, Zap, Lock, ArrowLeftRight } from "lucide-react"

export default function InfoPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2 text-center md:text-left">
        <h1 className="text-3xl font-bold text-primary flex items-center justify-center md:justify-start gap-2">
          <Info className="h-8 w-8" /> About BCMoney
        </h1>
        <p className="text-muted-foreground">Understanding the power of BCMoney's private financial layer</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm border-none bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <ArrowLeftRight className="h-5 w-5 text-secondary" /> On-Ramp & Off-Ramp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              BCMoney serves as a seamless gateway between the blockchain and your daily finances. 
              Easily deposit token value into the system (On-Ramp) or withdraw your assets back to external 
              blockchain wallets (Off-Ramp) whenever you choose.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Zap className="h-5 w-5 text-secondary" /> Zero-Fee P2P
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Move value at the speed of thought. BCMoney allows you to freely transmit and trade 
              token values in a peer-to-peer manner with other users on the platform. Unlike on-chain 
              transactions, our internal movements incur **zero fees**.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Lock className="h-5 w-5 text-secondary" /> Enhanced Privacy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Public blockchains are transparent, meaning your every move is visible to the world. 
              BCMoney provides a private layer for your transactions that is not provided on-chain, 
              ensuring your financial habits remain your business alone.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-card border-l-4 border-l-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Shield className="h-5 w-5 text-secondary" /> Secure & Non-Custodial
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your security is our priority. By utilizing advanced cryptographic identifiers linked 
              to your unique handle, BCMoney ensures that your value is always protected and 
              identifiable only to the intended participants.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none bg-secondary/5 p-6">
        <p className="text-center text-sm italic text-muted-foreground">
          "BCMoney simplifies the movement of money with no fees, living both on-chain and off-chain 
          to provide the best of both worlds."
        </p>
      </Card>
    </div>
  )
}
