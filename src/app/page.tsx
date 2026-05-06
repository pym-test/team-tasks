"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TaskManager } from "@/components/TaskManager";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, []);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div>
      <div className="flex items-center justify-end gap-3 px-6 py-3 border-b">
        {email && <span className="text-sm text-muted-foreground">{email}</span>}
        <Button variant="outline" size="sm" onClick={signOut}>
          로그아웃
        </Button>
      </div>
      <TaskManager />
    </div>
  );
}
