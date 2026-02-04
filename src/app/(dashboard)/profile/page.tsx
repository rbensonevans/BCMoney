
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Save, User, MapPin, Phone, Mail, Fingerprint } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    firstName: "John",
    middleName: "Quincy",
    lastName: "Doe",
    uniqueName: "@john_doe",
    address: "123 Finance Way, Cryptoville, CA 90210",
    phone: "+1 (555) 000-1122",
    email: "john.doe@example.com",
    ethAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
  })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Profile Updated",
      description: "Your changes have been saved successfully.",
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-primary">Your Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and unique account identity</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 shadow-sm h-fit">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-muted shadow-lg">
                  <AvatarImage src="https://picsum.photos/seed/user123/200/200" />
                  <AvatarFallback className="text-4xl bg-primary text-primary-foreground font-bold">JD</AvatarFallback>
                </Avatar>
                <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full h-10 w-10 shadow-md">
                  <Camera className="h-5 w-5" />
                </Button>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary">{formData.firstName} {formData.lastName}</h3>
                <p className="text-secondary font-semibold">{formData.uniqueName}</p>
                <p className="text-xs text-muted-foreground mt-1">Member since Oct 2023</p>
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
                <Input id="uniqueName" value={formData.uniqueName} onChange={(e) => setFormData({...formData, uniqueName: e.target.value})} className="font-semibold text-secondary" />
                <p className="text-[10px] text-muted-foreground">This name is permanently linked to your Ethereum address.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" /> Email Address
                </Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
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

              <Button type="submit" className="w-full bg-primary gap-2">
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
