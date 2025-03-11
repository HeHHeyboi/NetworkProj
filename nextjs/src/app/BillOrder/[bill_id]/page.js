// app/BillOrder/[billId]/page.js
"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function BillOrderPage() {
  const params = useParams();
  const billId = params.bill_id;

  const [bill, setBill] = useState(null);
  const [billItems, setBillItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBillData = async () => {
      if (!billId) {
        setError("No bill ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/bill/${billId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch bill data: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        const user_data = await fetch(`http://localhost:8080/user/${data.user_id}`);
        
        // Set bill data
        setBill({
          bill_id: data.bill_id,
          total: data.total,
          pay_date: new Date(data.pay_date).toLocaleDateString(),
          user_id: data.user_id,
          giveaway_id: data.giveaway_id
        });
        
        // Transform orders to billItems format
        if (data.orders && Array.isArray(data.orders)) {
          const transformedItems = data.orders.map((order, index) => ({
            id: index + 1,
            menu: {
              name: order.name || `Item ${order.menu_id}`,
              menu_type: order.menu_type || "",
              type: order.type || null
            },
            price: order.unit_price || order.total_price / order.amount,
            quantity: order.amount
          }));
          
          setBillItems(transformedItems);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching bill data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBillData();
  }, [billId]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6 flex justify-center items-center h-64">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4">Loading bill details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6 text-red-500">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <div className="mt-4">
            <Link href="/menu">
              <Button variant="outline">Return to Menu</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-2">Bill Not Found</h2>
          <p>The requested bill could not be found.</p>
          <div className="mt-4">
            <Link href="/menu">
              <Button variant="outline">Return to Menu</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Bill Details (ID: {bill.bill_id})</h1>

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
            {billItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.menu.name}</TableCell>
                <TableCell>
                  {item.menu.menu_type} {item.menu.type ? `(${item.menu.type})` : ""}
                </TableCell>
                <TableCell>{item.price.toFixed(2)}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{(item.price * item.quantity).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Separator className="my-4" />
        <div className="mt-4">
          <p className="text-lg font-bold">Total Price: {bill.total.toFixed(2)}</p>
        </div>

        <div className="mt-4">
          <p>
            <strong>Payment Date:</strong> {bill.pay_date}
          </p>
        </div>

        <div className="mt-4 flex justify-end space-x-4">
          <Link href="/menu">
            <Button variant="outline">Add New Order</Button>
          </Link>
          <Button 
            variant="default" 
            onClick={() => window.print()}
          >
            Print
          </Button>
        </div>
      </div>
    </div>
  );
}
