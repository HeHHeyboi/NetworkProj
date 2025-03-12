"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import TodoForm from "@/app/components/TodoForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// const API_URL = "http://localhost:8080/todo";
const API_URL = "http://10.53.49.156/api/todo";
// const WS_URL = "http://10.53.52.30/api/ws";

export default function AddToDoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const addTodo = async (text) => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: text }),
      });
  
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  
      // ใช้ WebSocket แจ้งเตือนให้หน้าแรกอัปเดต
      const socket = new WebSocket("ws://localhost:8080/ws");
      socket.onopen = () => {
        console.log("🔔 Sending WebSocket update...");
        socket.send("update");
      };
  
      router.push("/");
    } catch (error) {
      console.error("🚨 Error adding todo:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-lg shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">📝 Add To-Do</CardTitle>
        </CardHeader>
        <CardContent>
          <TodoForm addTodo={addTodo} loading={loading} />
          <div className="mt-4 text-center">
         <Button variant="outline" onClick={() => router.push("/")}>⬅️ กลับไปหน้าหลัก</Button>
       </div>
        </CardContent>
      </Card>
    </div>
  );
}
