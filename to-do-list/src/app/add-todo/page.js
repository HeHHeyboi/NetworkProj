"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import TodoForm from "@/app/components/TodoForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const API_URL = "http://localhost:8080/todo";
const WS_URL = "ws://localhost:8080/ws";
// const API_URL = "http://192.168.1.113/api/todo";
// const WS_URL = "ws://192.168.1.113/ws";

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
      const socket = new WebSocket(WS_URL);
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
