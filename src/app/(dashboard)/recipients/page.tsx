
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Heart, Users, Globe, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useUser, useFirebase, useCollection, useMemoFirebase } from "@/firebase"
import { collection, doc } from "firebase/firestore"
import { setDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates"

interface RecipientListProps {
  category: 'family' | 'friends' | 'general';
  recipients: any[] | null;
  isLoading: boolean;
  onAdd: (name: string, handle: string, category: string) => void;
  onDelete: (id: string) => void;
}

function RecipientList({ category, recipients, isLoading, onAdd, onDelete }: RecipientListProps) {
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");

  const handleAdd = () => {
    if (!name || !handle) return;
    onAdd(name, handle, category);
    setName("");
    setHandle("");
  };

  const list = recipients?.filter(r => r.listType === category) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input 
          placeholder="Full Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          className="flex-1"
        />
        <Input 
          placeholder="@handle" 
          value={handle} 
          onChange={(e) => setHandle(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleAdd} className="bg-secondary shrink-0">
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
                    {r.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold">{r.name}</p>
                  <p className="text-xs text-secondary">{r.ethereumAddress}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => onDelete(r.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function RecipientsPage() {
  const { toast } = useToast()
  const { user } = useUser()
  const { firestore } = useFirebase()

  const recipientsRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'user_profiles', user.uid, 'recipients');
  }, [firestore, user]);

  const { data: recipients, isLoading } = useCollection(recipientsRef);

  const addRecipient = (name: string, handleInput: string, category: string) => {
    if (!recipientsRef || !user) return;
    
    const handle = handleInput.startsWith("@") ? handleInput : `@${handleInput}`;
    
    // Create a new document reference to get the ID first
    const newDocRef = doc(recipientsRef);
    
    setDocumentNonBlocking(newDocRef, {
      id: newDocRef.id,
      name: name,
      ethereumAddress: handle,
      listType: category,
      userProfileId: user.uid
    }, { merge: true });

    toast({
      title: "Recipient Added",
      description: `${name} has been added to your ${category} list.`,
    });
  };

  const deleteRecipient = (id: string) => {
    if (!recipientsRef) return;
    const docRef = doc(recipientsRef, id);
    deleteDocumentNonBlocking(docRef);
    toast({
      title: "Recipient Deleted",
      variant: "destructive"
    });
  };

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
              <RecipientList 
                category="family" 
                recipients={recipients} 
                isLoading={isLoading} 
                onAdd={addRecipient} 
                onDelete={deleteRecipient} 
              />
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
              <RecipientList 
                category="friends" 
                recipients={recipients} 
                isLoading={isLoading} 
                onAdd={addRecipient} 
                onDelete={deleteRecipient} 
              />
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
              <RecipientList 
                category="general" 
                recipients={recipients} 
                isLoading={isLoading} 
                onAdd={addRecipient} 
                onDelete={deleteRecipient} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
