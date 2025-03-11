"use client";
import { Button } from "@/components/ui/button";

export default function TodoList({ todos, deleteTodo, toggleComplete }) {
  if (!todos || todos.length === 0) {
    return <p className="text-center text-gray-500">No todos yet!</p>;
  }

  return (
    <div className="space-y-2">
      {todos.map(({ id, name, complete }) => (
        <div
          key={id}
          className="flex justify-between items-center bg-white p-3 rounded-lg shadow-md"
        >
          <div className="flex items-center space-x-3">
            {/* ✅ Checkbox ติ๊กเพื่อเปลี่ยนสถานะ */}
            <input
              type="checkbox"
              checked={Boolean(complete)}
              onChange={() => toggleComplete(id, !complete)}
              className="w-5 h-5 accent-blue-500 cursor-pointer"
            />
            {/* 📌 ขีดฆ่าเมื่อทำเสร็จ */}
            <span className={`text-lg transition-all duration-300 ${complete ? "line-through text-gray-500" : "text-black"}`}>
              {name}
            </span>
          </div>
          <Button variant="destructive" onClick={() => deleteTodo(id)}>
            🗑️
          </Button>
        </div>
      ))}
    </div>
  );
}
