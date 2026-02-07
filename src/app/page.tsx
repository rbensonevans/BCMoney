"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Wallet, ShieldCheck, Lock, Loader2, ArrowRight, AlertCircle } from "lucide-react"
import { useAuth, useUser } from "@/firebase/provider"
import { initiateEmailSignIn, initiateEmailSignUp } from "@/firebase/non-blocking-login"
import { useToast } from "@/hooks/use-toast"

export default function LandingPage() {
  const [showAuth, setShowAuth] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const auth = useAuth()
  const { user, isUserLoading } = useUser()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (isRegistering && password.length < 6) {
      const msg = "Password must be at least 6 characters long."
      setError(msg)
      toast({
        variant: "destructive",
        title: "Weak Password",
        description: msg,
      })
      return
    }

    setIsLoading(true)

    const handleAuthError = (err: any) => {
      setIsLoading(false)
      let errorMessage = "Something went wrong. Please try again."

      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-email') {
        errorMessage = "Invalid email or password. Please check your credentials and try again."
      } else if (err.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already associated with an account."
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed attempts. Please try again later."
      } else if (err.code === 'auth/weak-password') {
        errorMessage = "The password is too weak."
      }

      setError(errorMessage)
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: errorMessage,
      })
    }
    
    if (isRegistering) {
      initiateEmailSignUp(auth, email, password, handleAuthError)
    } else {
      initiateEmailSignIn(auth, email, password, handleAuthError)
    }
  }

  if (isUserLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!showAuth && !user) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-background text-center space-y-8">
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="bg-primary p-6 rounded-3xl shadow-2xl w-fit mx-auto mb-6">
            <Wallet className="h-16 w-16 text-primary-foreground" />
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-primary">
            BCMoney
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-lg mx-auto leading-tight">
            Move Blockchain Money 
            <span className="block text-secondary font-bold">P2P &amp; Feeless</span>
            <span className="block mt-1">Just like Cash</span>
          </p>
        </div>
        
        <Button 
          size="lg" 
          onClick={() => setShowAuth(true)}
          className="h-16 px-10 text-xl font-bold bg-primary hover:bg-primary/90 shadow-xl rounded-full group transition-all"
        >
          Start <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
        </Button>

        <div className="flex items-center gap-6 text-muted-foreground opacity-60 pt-8">
          <div className="flex items-center gap-1 text-sm font-semibold">
            <ShieldCheck className="h-4 w-4" /> Secured
          </div>
          <div className="flex items-center gap-1 text-sm font-semibold">
            <Lock className="h-4 w-4" /> Private
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-background">
      <div className="mb-8 flex flex-col items-center gap-2">
        <div className="bg-primary p-4 rounded-2xl shadow-xl">
          <Wallet className="h-10 w-10 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">BCMoney</h1>
        <p className="text-muted-foreground flex items-center gap-1">
          <ShieldCheck className="h-4 w-4" /> Secure access to your funds
        </p>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-none animate-in zoom-in duration-300">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            {isRegistering ? "Create an Account" : "Login"}
          </CardTitle>
          <CardDescription className="text-center">
            {isRegistering 
              ? "Join BCMoney and start managing your assets" 
              : "Enter your credentials to access your account"}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="m@example.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              {isRegistering && (
                <p className="text-xs text-muted-foreground">
                  Minimum 6 characters required.
                </p>
              )}
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-12 text-lg font-bold" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isRegistering ? "Sign Up" : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t pt-6 bg-muted/50 rounded-b-lg">
          <div className="text-sm text-center text-muted-foreground">
            {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
            <Button 
              variant="link" 
              className="p-0 h-auto text-secondary font-bold"
              onClick={() => {
                setIsRegistering(!isRegistering)
                setIsLoading(false)
                setError(null)
              }}
            >
              {isRegistering ? "Login now" : "Register now"}
            </Button>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            End-to-end encrypted session
          </div>
        </CardFooter>
      </Card>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setShowAuth(false)}
        className="mt-6 text-muted-foreground"
      >
        Back to Home
      </Button>
    </div>
  )
}
