"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { problemTypes, urgencies } from "@/lib/placeholder-data";
import type { ProblemType, Urgency } from "@/lib/types";
import { Paperclip, Send } from "lucide-react";

const ticketFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(50),
  email: z.string().email({ message: "Please enter a valid email address." }),
  problemType: z.enum(problemTypes as [ProblemType, ...ProblemType[]], {
    required_error: "Please select a problem type.",
  }),
  urgency: z.enum(urgencies as [Urgency, ...Urgency[]], {
    required_error: "Please select an urgency level.",
  }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }).max(100),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }).max(1000),
  attachment: z.custom<FileList>((val) => val instanceof FileList, "Please upload a file").optional(),
});

type TicketFormValues = z.infer<typeof ticketFormSchema>;

const defaultValues: Partial<TicketFormValues> = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export function TicketSubmissionForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);


  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: TicketFormValues) {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Ticket submitted:", data);

    // In a real app, you would call a server action here:
    // e.g. const result = await submitTicketAction(data);
    // if (result.success) { ... } else { ... }
    
    toast({
      title: "Ticket Submitted!",
      description: "Your support ticket has been successfully submitted. We will get back to you shortly.",
    });
    form.reset();
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="e.g. john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Cannot login to application" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="problemType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Problem Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a problem type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {problemTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="urgency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Urgency Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {urgencies.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your issue in detail..."
                  className="resize-y min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="attachment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Attach File (Optional)</FormLabel>
              <FormControl>
                <Input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={(e) => field.onChange(e.target.files)} 
                />
              </FormControl>
              <FormDescription>
                Max file size: 5MB. Allowed types: JPG, PNG, PDF, DOCX.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Ticket"}
          {!isSubmitting && <Send className="ml-2 h-4 w-4" />}
        </Button>
      </form>
    </Form>
  );
}
