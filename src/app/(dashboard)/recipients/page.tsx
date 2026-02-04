
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, UserPlus, Heart, Users, Globe, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type Recipient = {
  id: string
  name: string
  handle: string
  category: 'family' | 'friends' | 'general'
}

export default function RecipientsPage() {
  const { toast } = useToast()
  const [recipients, setRecipients] = useState<Recipient[]>([
    { id: '1', name: "Jane Doe", handle: "@jane_mom", category: 'family' },
    { id: '2', name: "Dave Smith", handle: "@davey", category: 'friends' },
    { id: '3', name: "Amazon Marketplace", handle: "@amazon", category: 'general' },
  ])
  const [newName, setNewName] = useState("")
  const [newHandle, setNewHandle] = useState("")

  const addRecipient = (category: Recipient['category']) => {
    if (!newName || !newHandle) return
    const newRec: Recipient = {
      id: Date.now().toString(),
      name: newName,
      handle: newHandle.startsWith("@") ? newHandle : `@${newHandle}`,
      category
    }
    setRecipients([...recipients, newRec])
    setNewName("")
    setNewHandle("")
    toast({
      title: "Recipient Added",
      description: `${newName} has been added to your ${category} list.`,
    })
  }

  const deleteRecipient = (id: string) => {
    setRecipients(recipients.filter(r => r.id !== id))
    toast({
      title: "Recipient Deleted",
      variant: "destructive"
    })
  }

  const ListContent = ({ category }: { category: Recipient['category'] }) => {
    const list = recipients.filter(r => r.category === category)
    return (
      <div className="space-y-4 pt-4">
        <div className="flex gap-2">
          <Input 
            placeholder="Full Name" 
            value={newName} 
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1"
          />
          <Input 
            placeholder="@handle" 
            value={newHandle} 
            onChange={(e) => setNewHandle(e.target.value)}
            className="flex-1"
          />
          <Button onClick={() => addRecipient(category)} className="bg-secondary">
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>

        <div className="grid gap-2">
          {list.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground text-sm italic">No recipients in this list yet.</p>
          ) : (
            list.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 bg-card border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-muted text-primary font-bold">
                      {r.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-bold">{r.name}</p>
                    <p className="text-xs text-secondary">{r.handle}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => deleteRecipient(r.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-primary">Managed Recipients</h1>
        <p className="text-muted-foreground">Organize and manage your frequent contacts</p>
      </div>

      <Tabs defaultValue="family" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-14 bg-muted/50 p-1">
          <TabsTrigger value="family" className="data-[state=active]:bg-white data-[state=active]:text-primary flex gap-2">
            <Heart className="h-4 w-4" /> Family
          </TabsTrigger>
          <TabsTrigger value="friends" className="data-[state=active]:bg-white data-[state=active]:text-primary flex gap-2">
            <Users className="h-4 w-4" /> Friends
          </TabsTrigger>
          <TabsTrigger value="general" className="data-[state=active]:bg-white data-[state=active]:text-primary flex gap-2">
            <Globe className="h-4 w-4" /> General
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="family">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Family Contacts</CardTitle>
              <CardDescription>Trusted family members for frequent transfers</CardDescription>
            </CardHeader>
            <CardContent>
              <ListContent category="family" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="friends">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Friends List</CardTitle>
              <CardDescription>Peers and social circles</CardDescription>
            </CardHeader>
            <CardContent>
              <ListContent category="friends" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>General Recipients</CardTitle>
              <CardDescription>Utilities, merchants, and other public handles</CardDescription>
            </CardHeader>
            <CardContent>
              <ListContent category="general" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
