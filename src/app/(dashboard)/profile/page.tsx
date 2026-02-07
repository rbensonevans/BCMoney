
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Save, User, MapPin, Phone, Mail, Fingerprint, Trash2, AlertTriangle, Loader2, Database } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirebase, useDoc, useMemoFirebase } from "@/firebase"
import { doc, collection, getDocs, deleteDoc } from "firebase/firestore"
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { signOut } from "firebase/auth"

export default function ProfilePage() {
  const { toast } = useToast()
  const router = useRouter()
  const { user, auth } = useUser()
  const { firestore } = useFirebase()
  const [isResetting, setIsResetting] = useState(false)

  const profileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'user_profiles', user.uid);
  }, [firestore, user]);

  const { data: profileData, isLoading: isProfileLoading } = useDoc(profileRef);

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    uniqueName: "",
    address: "",
    phone: "",
    email: "",
  })

  useEffect(() => {
    if (profileData) {
      setFormData({
        firstName: profileData.firstName || "",
        middleName: profileData.middleName || "",
        lastName: profileData.lastName || "",
        uniqueName: profileData.uniqueName || "",
        address: profileData.address || "",
        phone: profileData.phoneNumber || "",
        email: profileData.email || "",
      })
    } else if (user) {
      setFormData(prev => ({ ...prev, email: user.email || "" }))
    }
  }, [profileData, user])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!profileRef || !user) return;

    setDocumentNonBlocking(profileRef, {
      ...formData,
      id: user.uid,
      phoneNumber: formData.phone, // mapping field name
    }, { merge: true });

    toast({
      title: "Profile Updated",
      description: "Your changes have been saved successfully.",
    })
  }

  const handleSeedTestData = () => {
    if (!profileRef || !user || !firestore) return;
    
    // '1' is the ID for BTC in TOP_30_TOKENS
    const btcId = '1';
    const updatedOwnedTokens = Array.from(new Set([...(profileData?.ownedTokens || []), btcId]));
    
    // 1. Update Profile with handle and owned tokens
    setDocumentNonBlocking(profileRef, {
      uniqueName: "@rbensonevans",
      ownedTokens: updatedOwnedTokens,
      id: user.uid,
      email: user.email || ""
    }, { merge: true });

    // 2. Set BTC Balance to 10 in subcollection
    const btcBalanceRef = doc(firestore, 'user_profiles', user.uid, 'balances', btcId);
    setDocumentNonBlocking(btcBalanceRef, {
      id: btcId,
      tokenId: btcId,
      balance: 10
    }, { merge: true });

    toast({
      title: "Test Data Seeded",
      description: "Account handle set to @rbensonevans and 10 BTC added to MyTokens.",
    })
  }

  const handleResetData = async () => {
    if (!user || !firestore || !auth) return;
    
    setIsResetting(true)
    try {
      // 1. Delete all recipients
      const recipientsRef = collection(firestore, 'user_profiles', user.uid, 'recipients');
      const recipientsSnap = await getDocs(recipientsRef);
      const deletePromises = recipientsSnap.docs.map(d => deleteDoc(d.ref));
      await Promise.all(deletePromises);

      // 2. Delete all balances
      const balancesRef = collection(firestore, 'user_profiles', user.uid, 'balances');
      const balancesSnap = await getDocs(balancesRef);
      const balanceDeletePromises = balancesSnap.docs.map(d => deleteDoc(d.ref));
      await Promise.all(balanceDeletePromises);

      // 3. Delete the profile document
      if (profileRef) {
        await deleteDoc(profileRef);
      }

      toast({
        title: "Data Cleared",
        description: "Your profile, balances, and recipients have been deleted. Logging out...",
      })

      // 4. Log out and redirect
      setTimeout(async () => {
        await signOut(auth);
        router.push("/");
      }, 1500);

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Reset Failed",
        description: error.message,
      })
      setIsResetting(false)
    }
  }

  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const userInitials = formData.firstName ? (formData.firstName[0] + (formData.lastName?.[0] || "")) : "BC";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-primary">Your Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and unique account identity</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <Card className="shadow-sm h-fit">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="relative">
                  <Avatar className="h-32 w-32 border-4 border-muted shadow-lg">
                    <AvatarImage src={`https://picsum.photos/seed/${user?.uid}/200/200`} />
                    <AvatarFallback className="text-4xl bg-primary text-primary-foreground font-bold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full h-10 w-10 shadow-md">
                    <Camera className="h-5 w-5" />
                  </Button>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary">
                    {formData.firstName} {formData.lastName}
                  </h3>
                  <p className="text-secondary font-semibold">{formData.uniqueName || "@anonymous"}</p>
                </div>
                <div className="w-full pt-4 border-t space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Account Status</span>
                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-bold uppercase tracking-tighter">Verified</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-primary">
                <Database className="h-4 w-4" /> Test Utilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Set up a test account with the handle <strong>@rbensonevans</strong> and 10 BTC.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full gap-2 text-primary border-primary/20" 
                onClick={handleSeedTestData}
              >
                Seed Test Data
              </Button>
            </CardContent>
          </Card>

          <Card className="border-destructive/20 shadow-sm bg-destructive/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" /> Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Clearing your data will permanently delete your profile, balances, and recipients.
              </p>
              <Button 
                variant="destructive" 
                size="sm" 
                className="w-full gap-2" 
                onClick={handleResetData}
                disabled={isResetting}
              >
                {isResetting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                Reset All Data
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="md:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> Personal Information
            </CardTitle>
            <CardDescription>Update your public and private profile details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input id="middleName" value={formData.middleName} onChange={(e) => setFormData({...formData, middleName: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="uniqueName" className="flex items-center gap-2">
                  <Fingerprint className="h-4 w-4 text-secondary" /> Unique Name (@handle)
                </Label>
                <Input 
                  id="uniqueName" 
                  value={formData.uniqueName} 
                  placeholder="@your_handle"
                  onChange={(e) => setFormData({...formData, uniqueName: e.target.value})} 
                  className="font-semibold text-secondary" 
                />
                <p className="text-[10px] text-muted-foreground">This name is used to identify you for P2P transfers.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" /> Email Address
                </Label>
                <Input id="email" type="email" value={formData.email} disabled className="bg-muted/30" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" /> Phone Number
                </Label>
                <Input id="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" /> Address
                </Label>
                <Input id="address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
              </div>

              <Button type="submit" className="w-full bg-primary gap-2 h-12">
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
