'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Phone, Download } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { callService, type CallDetails } from "@/services/call.service";
import { toast } from "sonner";

function CallDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i}>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-6 w-32" />
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-6">
        <Skeleton className="h-10 w-[300px] mb-6" />
        <Skeleton className="h-[200px] w-full" />
      </Card>
    </div>
  );
}

export default function CallDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [callDetails, setCallDetails] = useState<CallDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  
  useEffect(() => {
    async function loadCallDetails() {
      try {
        const details = await callService.getCallById(id as string);
        if (!details) {
          toast.error("Call not found");
          router.push("/dashboard/call-history");
          return;
        }
        setCallDetails(details);
      } catch (error: unknown) {
        console.error('Failed to load call details:', error);
        toast.error("Failed to load call details");
      } finally {
        setIsLoading(false);
      }
    }
    
    loadCallDetails();
  }, [id, router]);

  const handleAddNote = async () => {
    if (!newNote.trim() || !callDetails) return;

    try {
      const success = await callService.addNote(callDetails.id, newNote.trim());
      if (success) {
        // Refresh call details to get updated notes
        const updatedDetails = await callService.getCallById(callDetails.id);
        if (updatedDetails) {
          setCallDetails(updatedDetails);
          setNewNote("");
          toast.success("Note added successfully");
        }
      }
    } catch (error: unknown) {
      console.error('Failed to add note:', error);
      toast.error("Failed to add note");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Phone className="text-primary h-8 w-8" />
            <h1 className="text-3xl font-bold">Call Details</h1>
          </div>
          <Link href="/dashboard/call-history">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Call History
            </Button>
          </Link>
        </div>
        <CallDetailsSkeleton />
      </div>
    );
  }

  if (!callDetails) return null;

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Phone className="text-primary h-8 w-8" />
          <h1 className="text-3xl font-bold">Call Details</h1>
        </div>
        <Link href="/dashboard/call-history">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Call History
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {/* Call Summary Card */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Call Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-muted-foreground">Date & Time</p>
              <p className="font-medium">{callDetails.dateTime}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Line</p>
              <p className="font-medium">{callDetails.line}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Phone Number</p>
              <p className="font-medium">{callDetails.phoneNumber}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Operator</p>
              <p className="font-medium">{callDetails.operator}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Duration</p>
              <p className="font-medium">{callDetails.duration}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Tags</p>
              <div className="flex gap-2 mt-1">
                {callDetails.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Call Content Tabs */}
        <Card className="p-6">
          <Tabs defaultValue="notes" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="transcription">Transcription</TabsTrigger>
              <TabsTrigger value="recording">Recording</TabsTrigger>
            </TabsList>

            <TabsContent value="notes">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Previous Notes</h3>
                  <div className="space-y-2">
                    {callDetails.notes.map((note, index) => (
                      <div key={index} className="bg-muted p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground">{note}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Add Note</h3>
                  <Textarea
                    placeholder="Add your notes here..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="min-h-[150px] mb-2"
                  />
                  <Button onClick={handleAddNote}>Save Note</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="transcription">
              <div className="space-y-4">
                <h3 className="text-lg font-medium mb-2">Call Transcription</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap font-mono text-sm">
                    {callDetails.transcription}
                  </pre>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="recording">
              <div className="space-y-4">
                <h3 className="text-lg font-medium mb-2">Call Recording</h3>
                <audio controls className="w-full">
                  <source src={callDetails.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
                <Button variant="outline" className="mt-2">
                  <Download className="mr-2 h-4 w-4" />
                  Download Recording
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
} 