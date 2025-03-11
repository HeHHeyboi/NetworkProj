"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import TodoList from "@/app/components/TodoList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const API_URL = "http://localhost:8080/todo";
const WS_URL = "ws://localhost:8080/ws";

export default function HomePage() {
  const [todos, setTodos] = useState([]);

  // โหลด To-Do เมื่อหน้าแรกโหลด
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setTodos(data);
      } catch (error) {
        console.error("🚨 Error fetching todos:", error);
      }
    };

    fetchTodos();
  }, []);

  // ตั้งค่า WebSocket
  useEffect(() => {
    let socket;

    const connectWebSocket = () => {
      console.log("🔌 Connecting WebSocket...");
      socket = new WebSocket(WS_URL);

      socket.onopen = () => console.log("✅ WebSocket connected");

      socket.onmessage = (event) => {
        try {
          const newTodos = JSON.parse(event.data);
          console.log("🔄 WebSocket update:", newTodos);
          setTodos(newTodos || []);
        } catch (err) {
          console.error("❌ Error parsing WebSocket data:", err);
        }
      };

      //socket.onerror = (err) => console.error("🚨 WebSocket error:", err);

      socket.onclose = () => {
        console.warn("⚠️ WebSocket closed. Reconnecting in 3s...");
        setTimeout(connectWebSocket, 3000);
      };
    };

    connectWebSocket();

    return () => {
      if (socket) socket.close();
    };
  }, []);

  const deleteTodo = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("🚨 Error deleting todo:", error);
    }
  };

  const toggleComplete = async (id,name, complete) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, id,name,complete } : todo
        )
      );
    } catch (error) {
      console.error("🚨 Error updating todo status:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-lg shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">📌 To-Do List</CardTitle>
        </CardHeader>
        <CardContent>
          <Link href="/add-todo">
            <Button className="w-full mb-4">➕ Add To-Do</Button>
          </Link>
          <ScrollArea className="h-64 overflow-y-auto">
            <TodoList todos={todos} deleteTodo={deleteTodo} toggleComplete={toggleComplete} />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
