

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function TodoForm({ addTodo, loading }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    addTodo(text);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter new To-Do..."
        disabled={loading}
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Adding..." : "➕"}
      </Button>
    </form>
  );
}
