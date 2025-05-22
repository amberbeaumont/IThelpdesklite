// src/app/login/login-client.tsx
"use client";

import * as React from "react";
import Link from 'next/link';
import { useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { LogIn, KeyRound } from "lucide-react";
import { ClientOnly } from "@/components/client-only";
import { createClient } from "@/utils/supabase/client"; // Import Browser Supabase client
import { SupabaseClient } from '@supabase/supabase-js';

const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

interface LoginPageClientProps {
  supabase: SupabaseClient;
}

export default function LoginPageClient({ supabase }: LoginPageClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  // const supabase = createClient(); // NO:  Use the Supabase client passed as a prop

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsSubmitting(true);

    const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (signInError) {
      let errorMessage = "Invalid email or password. Please try again.";
      
      if (signInError.message.includes("Email not confirmed")) {
        errorMessage = "Please verify your email address before logging in.";
      } else if (signInError.message.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password. Please check your credentials and try again.";
      }
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Get user metadata to check role
    const { data: { user: userData }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      toast({
        title: "Error",
        description: "Failed to verify user role. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (!userData?.user_metadata?.role || userData.user_metadata.role !== "IT_Support") {
      toast({
        title: "Access Denied",
        description: "This portal is only accessible to IT support staff.",
        variant: "destructive",
      });
      await supabase.auth.signOut();
      setIsSubmitting(false);
      return;
    } else {
      toast({
        title: "Login Successful",
        description: "Welcome back! Redirecting to dashboard...",
      });
      router.push("/dashboard");
    }
    setIsSubmitting(false);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
             <KeyRound className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">IT Support Login</CardTitle>
          <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <ClientOnly>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="it.staff@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </ClientOnly>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <ClientOnly>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </ClientOnly>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
                {!isSubmitting && <LogIn className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex-col items-center text-sm">
            <p className="text-muted-foreground">
                Forgot your password? Contact administrator.
            </p>
            <p className="mt-4 text-muted-foreground">
                Not an IT staff member? <Link href="/" className="text-primary hover:underline">Submit a ticket here</Link>.
            </p>
        </CardFooter>
      </Card>
    </main>
  );
}
