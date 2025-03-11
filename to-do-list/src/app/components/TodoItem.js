
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export default function TodoItem({ todos, toggleComplete, deleteTodo }) {
  return (
    <div className="space-y-2">
      {Array.isArray(todos) && todos.map(({ id, text, completed }) => (
        <div key={id} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-md">
          <div className="flex items-center space-x-2">
            <Checkbox id={`todo-${id}`} checked={completed} onCheckedChange={() => toggleComplete(id)} />
            <label
              htmlFor={`todo-${id}`}
              className={`cursor-pointer ${completed ? "line-through text-gray-400" : ""}`}
            >
              {text}
            </label>
          </div>
          <Button variant="destructive" size="sm" onClick={() => deleteTodo(id)}>
            🗑️
          </Button>
        </div>
      ))}
    </div>
  );
}
