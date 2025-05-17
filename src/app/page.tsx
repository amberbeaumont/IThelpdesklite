import { TicketSubmissionForm } from "@/components/ticket-submission-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FilePlus2 } from "lucide-react";
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function HomePage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: todos } = await supabase.from('todos').select()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-background">
      <div className="w-full max-w-3xl">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
              <FilePlus2 className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">Submit a Support Ticket</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Fill out the form below and our support team will get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TicketSubmissionForm />
          </CardContent>
        </Card>
        <p className="text-center mt-6 text-sm text-muted-foreground">
          Already have an account or an IT staff member? <a href="/login" className="text-primary hover:underline">Login here</a>.
        </p>
        {todos && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Todos</h2>
            <ul>
              {todos.map((todo) => (
                <li key={todo.id}>{todo.title}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}