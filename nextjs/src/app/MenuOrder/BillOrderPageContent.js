"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Function to get a cookie value
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

export default function BillOrderPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const orderParam = searchParams.get("order");
    if (orderParam) {
      try {
        const decodedOrder = decodeURIComponent(orderParam);
        const parsedOrder = JSON.parse(decodedOrder);
        setOrderData(parsedOrder);
      } catch (e) {
        setError("Invalid order data received.");
        console.error("Error parsing order data:", e);
      } finally {
        setLoading(false);
      }
    } else {
      setError("No order data provided.");
      setLoading(false);
    }
  }, [searchParams]);

  const handleCreateBill = async () => {
    if (!orderData) return;

    try {
      const orders = orderData.map((item) => ({
        menu_id: item.menu_id,
        amount: item.quantity,
      }));

      const billData = { orders };

      const id = getCookie("id"); 
      console.log(`Id in cookie: ${id}`);

      const billRes = await fetch("http://localhost:8080/bill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${id}`,
        },
        body: JSON.stringify(billData),
        credentials: "include",
      });

      const billText = await billRes.text();
      console.log("Bill API Response:", billText);

      if (billRes.status !== 201) {
        throw new Error(`Error creating bill: ${billText}`);
      }

      let createdBill;
      try {
        createdBill = JSON.parse(billText);
      } catch (e) {
        throw new Error("Invalid JSON response from /bill: " + billText);
      }

      alert("Bill created successfully!");
      router.push(`/BillOrder/${createdBill.bill_id}`);

    } catch (error) {
      setError(error.message);
      console.error("Error creating bill:", error);
      alert("Error creating bill: " + error.message);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-500">Error: {error}</div>
    );
  }

  if (!orderData) {
    return <div className="container mx-auto p-4">No order data found.</div>;
  }

  const totalPrice = orderData.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Menu Order</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Menu Item</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Subtotal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderData.map((item) => (
              <TableRow key={item.menu_id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  {item.menu_type} {item.type ? `(${item.type})` : ""}
                </TableCell>
                <TableCell>{item.price.toFixed(2)}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  {(item.price * item.quantity).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4">
        <p className="text-lg font-bold">Total Price: {totalPrice.toFixed(2)}</p>
      </div>
      <div className="mt-4">
        <Button onClick={handleCreateBill} variant="default">
          Create Bill
        </Button>
      </div>
    </div>
  );
}
