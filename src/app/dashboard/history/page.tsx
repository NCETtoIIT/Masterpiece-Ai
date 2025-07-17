import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal } from "lucide-react";

export default function HistoryPage() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Generation History</CardTitle>
        <CardDescription>
          Your generated images will be saved here once you connect your Supabase account.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center gap-4 min-h-[400px]">
        <Terminal className="w-16 h-16 text-muted-foreground" />
        <h3 className="text-xl font-bold">Connect to Supabase</h3>
        <p className="text-muted-foreground">
          To enable persistent history, you need to connect a Supabase project.
          <br />
          Follow the documentation to set up your database and API keys.
        </p>
      </CardContent>
    </Card>
  );
}
