
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { mockUsers, ticketStatuses } from "@/lib/placeholder-data";
import type { Ticket, TicketStatus, User } from "@/lib/types";
import { SnippetTool } from "./snippet-tool";
import { format } from "date-fns";
import { Paperclip, Send, CalendarPlus, UserCircle, MessageSquareText } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, CheckIcon as LucideCheckIcon } from "lucide-react"; // Renamed to avoid conflict
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClientOnly } from "@/components/client-only";


const commentFormSchema = z.object({
  comment: z.string().min(1, "Comment cannot be empty."),
  isInternalNote: z.boolean().optional(),
});
type CommentFormValues = z.infer<typeof commentFormSchema>;

const RHF_UNASSIGNED_VALUE = ""; // Value used by react-hook-form for "unassigned"
const SELECT_ITEM_UNASSIGNED_VALUE = "__SELECT_ITEM_UNASSIGNED__"; // Unique, non-empty string for the SelectItem

const updateTicketFormSchema = z.object({
  status: z.enum(ticketStatuses as [TicketStatus, ...TicketStatus[]]),
  assignedTo: z.string().optional(), // User ID
});
type UpdateTicketFormValues = z.infer<typeof updateTicketFormSchema>;

interface TicketDetailsProps {
  ticket: Ticket;
}

// Helper to rehydrate dates from localStorage string format
const rehydrateTicketDates = (ticketData: Ticket): Ticket => {
  return {
    ...ticketData,
    createdAt: new Date(ticketData.createdAt),
    updatedAt: new Date(ticketData.updatedAt),
    comments: ticketData.comments.map(comment => ({
      ...comment,
      createdAt: new Date(comment.createdAt),
    })),
  };
};


export function TicketDetails({ ticket: initialTicket }: TicketDetailsProps) {
  const { toast } = useToast();
  const commentTextareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [ticket, setTicket] = React.useState<Ticket>(rehydrateTicketDates(initialTicket));
  const [isSubmittingComment, setIsSubmittingComment] = React.useState(false);
  const [isUpdatingTicket, setIsUpdatingTicket] = React.useState(false);
  const [eventDate, setEventDate] = React.useState<Date | undefined>();


  const commentForm = useForm<CommentFormValues>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: { comment: "", isInternalNote: false },
  });

  const updateTicketForm = useForm<UpdateTicketFormValues>({
    resolver: zodResolver(updateTicketFormSchema),
    defaultValues: {
      status: ticket.status,
      assignedTo: ticket.assignedTo || RHF_UNASSIGNED_VALUE,
    },
  });
  
  React.useEffect(() => {
    // When initialTicket prop changes, rehydrate and reset the local state and forms
    const rehydratedTicket = rehydrateTicketDates(initialTicket);
    setTicket(rehydratedTicket);
    updateTicketForm.reset({
      status: rehydratedTicket.status,
      assignedTo: rehydratedTicket.assignedTo || RHF_UNASSIGNED_VALUE,
    });
  }, [initialTicket, updateTicketForm]);


  const handleInsertSnippet = (content: string) => {
    const currentComment = commentForm.getValues("comment");
    commentForm.setValue("comment", currentComment ? `${currentComment} ${content}` : content);
    commentTextareaRef.current?.focus();
  };

  // Function to update localStorage after ticket modifications
  const updateTicketInLocalStorage = (updatedTicket: Ticket) => {
    if (typeof window !== 'undefined') {
      const storedTicketsRaw = localStorage.getItem("submittedTickets");
      let storedTicketsData: Ticket[] = storedTicketsRaw ? JSON.parse(storedTicketsRaw) : [];
      
      // Convert stored string dates to Date objects for comparison if necessary, or just keep as strings for storage
      const ticketIndex = storedTicketsData.findIndex(t => t.id === updatedTicket.id);

      // Prepare ticket for storage (ensure dates are ISO strings)
      const ticketToStore = {
        ...updatedTicket,
        createdAt: new Date(updatedTicket.createdAt).toISOString(),
        updatedAt: new Date(updatedTicket.updatedAt).toISOString(),
        comments: updatedTicket.comments.map(c => ({...c, createdAt: new Date(c.createdAt).toISOString()}))
      };
      
      if (ticketIndex > -1) {
        storedTicketsData[ticketIndex] = ticketToStore;
      } else {
        // If it's a mock ticket not yet in localStorage, add it.
        // This path might not be strictly necessary if only tickets from `getAllTickets` (which includes localStorage) are shown on this page.
        // However, it's safer to handle this.
        const allCurrentTickets = JSON.parse(localStorage.getItem("allTickets") || "[]") as Ticket[];
        if(!allCurrentTickets.find(t=> t.id === updatedTicket.id)){ // A bit redundant, but ensures we only add if truly new to local storage scope
             storedTicketsData.push(ticketToStore);
        }
      }
      localStorage.setItem("submittedTickets", JSON.stringify(storedTicketsData));
    }
  };


  async function onCommentSubmit(data: CommentFormValues) {
    setIsSubmittingComment(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newComment = {
      id: `comment-${Date.now()}`,
      userId: 'it1', 
      userName: mockUsers.find(u => u.id === 'it1')?.name || "IT Staff",
      comment: data.comment,
      createdAt: new Date(),
      isInternalNote: data.isInternalNote,
    };

    setTicket(prev => {
      const updatedTicket = { 
        ...prev, 
        comments: [...prev.comments, newComment], 
        updatedAt: new Date() 
      };
      updateTicketInLocalStorage(updatedTicket);
      return updatedTicket;
    });

    toast({ title: "Comment Added", description: "Your comment has been posted." });
    commentForm.reset();
    setIsSubmittingComment(false);
  }

  async function onUpdateTicketSubmit(data: UpdateTicketFormValues) {
    setIsUpdatingTicket(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setTicket(prev => {
      const updatedTicket = { 
        ...prev, 
        ...data, 
        assignedTo: data.assignedTo === RHF_UNASSIGNED_VALUE ? undefined : data.assignedTo, // Store undefined if unassigned
        updatedAt: new Date() 
      };
      updateTicketInLocalStorage(updatedTicket);
      return updatedTicket;
    });

    toast({ title: "Ticket Updated", description: `Status set to ${data.status}, Assigned to ${mockUsers.find(u => u.id === data.assignedTo)?.name || 'Unassigned'}.` });
    setIsUpdatingTicket(false);
  }
  
  const itSupportUsers = mockUsers.filter(user => user.role === "IT_Support");

  return (
    <ClientOnly>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Ticket Info & Comments */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl flex justify-between items-center">
              <span>{ticket.subject} <span className="text-muted-foreground text-lg">(#{ticket.id})</span></span>
            </CardTitle>
            <CardDescription>
              Reported by {ticket.requesterName} ({ticket.requesterEmail}) on {format(new Date(ticket.createdAt), "PPP p")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-1">Original Message:</h4>
              <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-md">{ticket.message}</p>
            </div>
            {(ticket.attachmentName || ticket.attachmentUrl) && (
              <div>
                <h4 className="font-semibold mb-1">Attachment:</h4>
                {ticket.attachmentUrl ? (
                     <Link href={ticket.attachmentUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                        <Paperclip className="h-4 w-4" /> View Attachment
                    </Link>
                ) : (
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Paperclip className="h-4 w-4" /> {ticket.attachmentName} (File not uploaded in demo)
                    </span>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2"><MessageSquareText className="h-6 w-6 text-primary" />Comments & Updates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {ticket.comments.length > 0 ? (
              <ScrollArea className="h-64 pr-3"> {/* Ensure ScrollArea has a defined height */}
                <div className="space-y-4">
                {ticket.comments.map((comment) => (
                  <div key={comment.id} className={`p-3 rounded-md ${comment.isInternalNote ? 'bg-yellow-50 border-l-4 border-yellow-400' : 'bg-secondary/50'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={`https://picsum.photos/seed/${comment.userId}/50/50`} data-ai-hint="avatar person" />
                          <AvatarFallback>{comment.userName.substring(0,1)}</AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-sm">{comment.userName}</span>
                        {comment.isInternalNote && <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-700 border-yellow-300">Internal Note</Badge>}
                      </div>
                      <span className="text-xs text-muted-foreground">{format(new Date(comment.createdAt), "PP p")}</span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{comment.comment}</p>
                  </div>
                ))}
                </div>
              </ScrollArea>
            ) : (
              <p className="text-sm text-muted-foreground">No comments yet.</p>
            )}
            <Separator />
            <Form {...commentForm}>
              <form onSubmit={commentForm.handleSubmit(onCommentSubmit)} className="space-y-3">
                <FormField
                  control={commentForm.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Add a Comment or Update</FormLabel>
                      <FormControl>
                        <Textarea
                          ref={commentTextareaRef}
                          placeholder="Type your response or internal note..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={commentForm.control}
                  name="isInternalNote"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 pt-1">
                      <FormControl>
                        <div
                          onClick={() => field.onChange(!field.value)}
                          className={cn(
                            "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground cursor-pointer",
                            field.value && "bg-primary text-primary-foreground"
                          )}
                          data-state={field.value ? "checked" : "unchecked"}
                          tabIndex={0}
                          role="checkbox"
                          aria-checked={field.value}
                          onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') field.onChange(!field.value);}}
                        >
                          {field.value && <LucideCheckIcon className="h-4 w-4" />}
                        </div>
                      </FormControl>
                      <FormLabel className="cursor-pointer text-sm font-normal" htmlFor={field.name}>
                          Mark as internal note (visible to IT staff only)
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <div className="flex justify-between items-center">
                  <SnippetTool onInsertSnippet={handleInsertSnippet} />
                  <Button type="submit" disabled={isSubmittingComment}>
                    {isSubmittingComment ? "Posting..." : "Post Comment"}
                    {!isSubmittingComment && <Send className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar for Actions & Details */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Ticket Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...updateTicketForm}>
              <form onSubmit={updateTicketForm.handleSubmit(onUpdateTicketSubmit)} className="space-y-4">
                <FormField
                  control={updateTicketForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ticketStatuses.map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateTicketForm.control}
                  name="assignedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assign To</FormLabel>
                      <Select 
                        onValueChange={(valueFromSelect) => {
                          if (valueFromSelect === SELECT_ITEM_UNASSIGNED_VALUE) {
                            field.onChange(RHF_UNASSIGNED_VALUE);
                          } else {
                            field.onChange(valueFromSelect);
                          }
                        }} 
                        value={field.value === RHF_UNASSIGNED_VALUE ? SELECT_ITEM_UNASSIGNED_VALUE : field.value || SELECT_ITEM_UNASSIGNED_VALUE}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select IT staff" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={SELECT_ITEM_UNASSIGNED_VALUE}>Unassigned</SelectItem>
                          {itSupportUsers.map(user => (
                            <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isUpdatingTicket}>
                  {isUpdatingTicket ? "Updating..." : "Update Ticket"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="text-xl">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
                <p><strong>Problem Type:</strong> {ticket.problemType}</p>
                <p><strong>Urgency:</strong> {ticket.urgency}</p>
                <p><strong>Last Updated:</strong> {format(new Date(ticket.updatedAt), "PPP p")}</p>
            </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Calendar Event</CardTitle>
          </CardHeader>
          <CardContent>
             <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                        <CalendarPlus className="mr-2 h-4 w-4" /> Add to Calendar
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                    <DialogTitle>Add Calendar Event</DialogTitle>
                    <DialogDescription>
                        Schedule a follow-up or reminder for this ticket. (UI Only)
                    </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="event-title" className="text-right">Title</Label>
                            <Input id="event-title" defaultValue={`Follow up: ${ticket.subject}`} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="event-date" className="text-right">Date</Label>
                             <Popover>
                                <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                    "w-full justify-start text-left font-normal col-span-3",
                                    !eventDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {eventDate ? format(eventDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={eventDate}
                                    onSelect={setEventDate}
                                    initialFocus
                                />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="event-desc" className="text-right">Description</Label>
                            <Textarea id="event-desc" placeholder="Event details..." className="col-span-3 min-h-[80px]" />
                        </div>
                    </div>
                    <DialogFooter>
                    <Button type="submit" onClick={() => toast({title: "Event 'Added'", description: "Calendar event UI interaction."})}>Save Event</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
    </ClientOnly>
  );
}

