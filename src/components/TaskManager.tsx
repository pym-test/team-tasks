"use client";

import { useEffect, useRef, useState } from "react";
import type { Tables } from "@/lib/database.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type Task = Tables<"tasks">;

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  async function fetchTasks() {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      if (Array.isArray(data)) setTasks(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    const title = inputRef.current?.value.trim();
    if (!title) return;
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (res.ok) {
      const task = await res.json();
      setTasks((prev) => [task, ...prev]);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function toggleStatus(task: Task) {
    const next = task.status === "todo" ? "done" : "todo";
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (res.ok) {
      const updated = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    }
  }

  async function deleteTask(id: string) {
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">팀 일감</h1>
        <p className="text-sm text-muted-foreground mt-1">내가 만들거나 내게 배정된 일감만 표시됩니다.</p>
        <p className="text-sm mt-1">ktds pym</p>
      </div>

      <form onSubmit={addTask} className="flex gap-2">
        <Input ref={inputRef} placeholder="일감 제목" className="flex-1" />
        <Button type="submit">추가</Button>
      </form>

      {loading ? (
        <p className="text-sm text-muted-foreground">불러오는 중…</p>
      ) : tasks.length === 0 ? (
        <p className="text-sm text-muted-foreground">일감이 없습니다.</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-3 rounded-lg border px-4 py-3"
            >
              <button
                onClick={() => toggleStatus(task)}
                className="shrink-0"
                aria-label="상태 전환"
              >
                <Badge
                  variant={task.status === "done" ? "default" : "secondary"}
                  className="cursor-pointer select-none"
                >
                  {task.status === "done" ? "완료" : "할 일"}
                </Badge>
              </button>
              <span
                className={`flex-1 text-sm ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}
              >
                {task.title}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteTask(task.id)}
                aria-label="삭제"
                className="shrink-0 text-destructive hover:text-destructive"
              >
                삭제
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
