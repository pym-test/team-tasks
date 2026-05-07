"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Comment = {
  id: string;
  task_id: string;
  body: string;
  created_by: string;
  created_at: string;
};

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBody, setEditBody] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const taskInputRef = useRef<HTMLInputElement>(null);

  async function load() {
    const res = await fetch("/api/comments");
    if (res.ok) setComments(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function addComment(e: React.FormEvent) {
    e.preventDefault();
    const body = inputRef.current?.value.trim();
    const task_id = taskInputRef.current?.value.trim();
    if (!body || !task_id) return;

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task_id, body }),
    });
    if (res.ok) {
      inputRef.current!.value = "";
      taskInputRef.current!.value = "";
      load();
    }
  }

  async function saveEdit(id: string) {
    await fetch(`/api/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: editBody }),
    });
    setEditingId(null);
    load();
  }

  async function deleteComment(id: string) {
    await fetch(`/api/comments/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">댓글</h1>

      <form onSubmit={addComment} className="space-y-2">
        <Input ref={taskInputRef} placeholder="Task ID" />
        <div className="flex gap-2">
          <Input ref={inputRef} placeholder="댓글 내용" className="flex-1" />
          <Button type="submit">추가</Button>
        </div>
      </form>

      <ul className="space-y-2">
        {comments.map((c) => (
          <li key={c.id} className="border rounded p-3 space-y-1">
            <p className="text-xs text-muted-foreground">task: {c.task_id}</p>
            {editingId === c.id ? (
              <div className="flex gap-2">
                <Input
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  className="flex-1"
                />
                <Button size="sm" onClick={() => saveEdit(c.id)}>저장</Button>
                <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>취소</Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p>{c.body}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setEditingId(c.id); setEditBody(c.body); }}>수정</Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteComment(c.id)}>삭제</Button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
