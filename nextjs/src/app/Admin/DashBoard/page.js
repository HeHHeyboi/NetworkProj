"use client";

import { Line, Bar } from "react-chartjs-2";
import { Card } from "./components/Card";
import { CardContent } from "./components/CardContent";
import { Bell, Phone, Gift, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";
import { useRouter } from 'next/navigation';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [giveaways, setGiveaways] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // แก้ไขฟังก์ชัน getCookie
  const getCookie = (name) => {
    try {
      if (typeof document === 'undefined') return null;
      
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        const cookieValue = parts.pop().split(';').shift();
        // ถอดรหัส URI component ก่อนที่จะ parse เป็น JSON
        return decodeURIComponent(cookieValue);
      }
      return null;
    } catch (error) {
      console.error('Error parsing cookie:', error);
      return null;
    }
  };

  // แยกฟังก์ชัน fetchOrders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/bill', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const bills = await response.json();
      const formattedOrders = [];
      if(Array.isArray(bills)) {
        console.log('Bills:', bills);
      } else{
        return;
      }
      for (let bill of bills) {
        const userResponse = await fetch(`http://localhost:8080/user/${bill.user_id}`, {
          credentials: 'include'
        });
        
        if (!userResponse.ok) {
          throw new Error(`Failed to fetch user data for ID: ${bill.user_id}`);
        }

        const userData = await userResponse.json();
        console.log(userData)
        const orderDetails = {
          billId: bill.bill_id,
          userId: bill.user_id,
          userName: `${userData.first_name} ${userData.last_name}`,
          total: bill.total,
          paidStatus: bill.paid_status,
          payDate: bill.pay_date,
          orderItems: []
        };

        for (let order of bill.orders) {
          orderDetails.orderItems.push({
            menuId: order.menu_id,
            menuName: order.menu_name,
            amount: order.amount,
            totalPrice: order.total_price
          });
        }

        formattedOrders.push(orderDetails);
      }

      console.log('Formatted Orders:', formattedOrders);
      setOrders(formattedOrders);

      let totalRev = 0;
      for (let bill of bills) {
        totalRev += bill.total;
      }
      setTotalRevenue(totalRev);

      setTotalOrders(bills.length);

    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // แก้ไขฟังก์ชัน handleOrderStatusUpdate
  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      const billId = orderId.replace('#', '');
      if (!['accepted', 'rejected'].includes(newStatus)) {
        throw new Error('Invalid order status');
      }
      var response= null;
      if ('accepted' === newStatus) {
        console.log('Order accepted:', billId);
        response = await fetch(`http://localhost:8080/bill/${billId}/update`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
      } else {
        console.log('Order rejected:', billId);
        response = await fetch(`http://localhost:8080/bill/${billId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        await fetchOrders();
        return
      }
      
      // const response = await fetch(`http://localhost:8080/bill/${billId}/update`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   credentials: 'include',
      // });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message;
        } catch (e) {
          errorMessage = errorText;
        }
        throw new Error(errorMessage || 'Failed to update order status');
      }

      // รีเฟรชข้อมูลหลังจากอัพเดทสถานะ
      await fetchOrders();

    } catch (error) {
      console.error('Error updating order status:', error);
      setError(error.message);
    }
  };

  // Fetch logged in user data from cookie
  useEffect(() => {
    try {
      const userDataCookie = getCookie('userData');
      
      if (userDataCookie) {
        try {
          // แยกการ parse JSON ออกมาและเพิ่ม error handling
          const userData = JSON.parse(userDataCookie);
          setLoggedInUser(userData.name || 'Guest');
        } catch (parseError) {
          console.error("Error parsing user data JSON:", parseError);
          setLoggedInUser('Guest');
        }
      } else {
        setLoggedInUser('Guest');
        console.log('No user data found in cookie');
      }
    } catch (err) {
      console.error("Error getting user data from cookie:", err);
      setLoggedInUser('Guest');
    }
  }, []);

  // Fetch orders data
  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch GiveAway data
  useEffect(() => {
    const fetchGiveAways = async () => {
      try {
        const response = await fetch('http://localhost:8080/giveAway');
        if (!response.ok) {
          throw new Error('Failed to fetch giveaways');
        }
        const data = await response.json();
        setGiveaways(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchGiveAways();
  }, []);

  const [monthlyRevenue, setMonthlyRevenue] = useState(Array(12).fill(0));
  const [monthlyOrders, setMonthlyOrders] = useState(Array(6).fill(0));

  useEffect(() => {
    if (orders.length > 0) {
      // สร้างข้อมูลรายได้รายเดือน
      const revenueByMonth = Array(12).fill(0);
      const ordersByMonth = Array(6).fill(0);
      
      orders.forEach(order => {
        const orderDate = new Date(order.payDate);
        const month = orderDate.getMonth();
        
        // เพิ่มรายได้เข้าไปในเดือนที่เกี่ยวข้อง
        revenueByMonth[month] += order.total;
        
        // เพิ่มจำนวนออเดอร์สำหรับ 6 เดือนล่าสุด
        if (month < 6) {
          ordersByMonth[month] += 1;
        }
      });
      
      setMonthlyRevenue(revenueByMonth);
      setMonthlyOrders(ordersByMonth);
    }
  }, [orders]);

  const revenueData = {
    labels: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."],
    datasets: [
      {
        label: "รายได้รวม (บาท)",
        data: monthlyRevenue,
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true
      },
    ],
  };

  const ordersData = {
    labels: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย."],
    datasets: [
      {
        label: "จำนวนออเดอร์",
        data: monthlyOrders,
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderRadius: 5,
        borderWidth: 1,
      },
    ],
  };

  // เพิ่มตัวเลือกสำหรับกราฟให้แสดงผลได้ดีขึ้น
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };


  // Calculate total remaining giveaways
  const totalRemaining = Array.isArray(giveaways) ? giveaways.reduce((sum, giveaway) => sum + giveaway.remain, 0) : 0;
  const totalAmount = Array.isArray(giveaways) ? giveaways.reduce((sum, giveaway) => sum + giveaway.amount, 0) : 0;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen text-black">
      {/* Header with logged in user */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <Bell className="w-6 h-6 text-gray-700 cursor-pointer" />
          <Phone className="w-6 h-6 text-gray-700 cursor-pointer" />
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-2">
              {loggedInUser ? loggedInUser.charAt(0).toUpperCase() : 'G'}
            </div>
            <span className="font-medium">{loggedInUser || 'Guest'}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold">Total Revenue</h3>
            <p className="text-2xl font-bold">
              {loading ? (
                "..."
              ) : (
                `฿${totalRevenue.toLocaleString('th-TH', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}`
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold">Total Orders</h3>
            <p className="text-2xl font-bold">
              {loading ? "..." : totalOrders}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Total GiveAways</h3>
              <p className="text-2xl font-bold">
                {loading ? "..." : (giveaways?.length || 0)}
              </p>
            </div>
            <Gift className="w-10 h-10 text-blue-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">GiveAway Remaining</h3>
              <p className="text-2xl font-bold">
                {loading ? "..." : `${totalRemaining} / ${totalAmount}`}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-500 font-bold">
                {loading ? "..." : (totalAmount > 0 ? Math.round((totalRemaining / totalAmount) * 100) : 0)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">รายได้รวม</h3>
            <div style={{ height: "300px" }}>
              <Line data={revenueData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
      
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">จำนวนออเดอร์</h3>
            <div style={{ height: "300px" }}>
              <Bar data={ordersData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* GiveAway Table */}
      <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">GiveAway List</h3>
          <Button 
            onClick={() => router.push("/GiveAway")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            + เพิ่มรายการ GiveAway
          </Button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading GiveAway data...</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  {["ID", "Name", "Total Amount", "Remaining", "Description", "Date",].map((header) => (
                    <th key={header} className="p-3 text-left font-medium text-gray-700">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.isArray(giveaways) && giveaways.length > 0 ? (
                  giveaways.map((giveaway) => (
                    <tr key={giveaway.id} className="border-b hover:bg-gray-100">
                      <td className="p-3">{giveaway.id}</td>
                      <td className="p-3">{giveaway.name}</td>
                      <td className="p-3">{giveaway.amount}</td>
                      <td className="p-3">{giveaway.remain}</td>
                      <td className="p-3">{giveaway.desc}</td>
                      <td className="p-3">{new Date(giveaway.date).toLocaleDateString()}</td>
                  
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-6 text-center text-gray-500">
                      ไม่มีข้อมูล GiveAway
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2">New Orders</h3>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Bill ID</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Total</th>
                  <th className="p-2">Payment Status</th>
                  <th className="p-2">Pay Date</th>
                  <th className="p-2">Orders</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.billId} className="border-b">
                    <td className="p-2">{order.billId}</td>
                    <td className="p-2">{order.userName}</td>
                    <td className="p-2">{order.total} บาท</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        order.paidStatus ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.paidStatus ? 'ชำระแล้ว' : 'รอชำระ'}
                      </span>
                    </td>
                    <td className="p-2">{new Date(order.payDate).toLocaleDateString('th-TH')}</td>
                    <td className="p-2">
                      <div className="text-sm">
                        {order.orderItems.map((item, idx) => (
                          <div key={idx}>
                            เมนู {item.menuName}: {item.amount} ชิ้น = {item.totalPrice} บาท
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-2">
                      {!order.paidStatus && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleOrderStatusUpdate(order.billId, 'rejected')}
                            className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                          >
                            ปฏิเสธ
                          </button>
                          <button 
                            className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                            onClick={() => handleOrderStatusUpdate(order.billId, 'accepted')}
                          >
                            ยอมรับ
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}