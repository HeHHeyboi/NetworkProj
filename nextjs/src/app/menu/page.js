// app/Menu/page.js
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      setError(null);
  
      try {
        const response = await fetch("http://localhost:8080/menu");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        setMenuItems(data);
        const initialQuantities = {};
        data.forEach((item) => {
          initialQuantities[item.menu_id] = 0;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setError(error.message);
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, []);

  useEffect(() => {
    console.log(`Data: ${menuItems}`)
  }, [menuItems])
  const handleIncrement = (item) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [item.menu_id]: (prevQuantities[item.menu_id] || 0) + 1,
    }));
  };

  const handleDecrement = (item) => {
    setQuantities((prevQuantities) => {
      const newQuantity = Math.max(0, (prevQuantities[item.menu_id] || 0) - 1);
      return {
        ...prevQuantities,
        [item.menu_id]: newQuantity,
      };
    });
  };

  const createOrderData = () => {
    return menuItems
      .filter((item) => quantities[item.menu_id] > 0)
      .map((item) => ({
        ...item,
        quantity: quantities[item.menu_id],
      }));
  };

  const filteredMenuItems = menuItems.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = item.name.toLowerCase().includes(searchLower);
    const typeMatch = item.menu_type.toLowerCase().includes(searchLower);
    const filterMatch = filterType === "all" || item.menu_type === filterType;

    return filterMatch && (nameMatch || typeMatch);
  });

  const menuTypes = ["all", ...new Set(menuItems.map((item) => item.menu_type))];

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        เมนูอาหาร ของหวาน และ เครื่องดื่ม
      </h1>

      {/* Search Bar and Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <Input
          type="text"
          placeholder="ค้นหาเมนู..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-2 md:mb-0 md:mr-2 w-full md:w-auto"
        />

        <div className="flex items-center w-full md:w-auto">
          <span className="mr-2">ประเภท:</span>
          <Select onValueChange={setFilterType} value={filterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="ทั้งหมด" />
            </SelectTrigger>
            <SelectContent>
              {menuTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type === "all" ? "ทั้งหมด" : type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {filteredMenuItems.length === 0 && (
        <div className="text-center p-4">
          <p>ไม่พบรายการเมนูที่ตรงกับคำค้นหาหรือตัวกรองของคุณ</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Cart Summary */}
        <div className="md:col-span-1">
          {Object.values(quantities).some((q) => q > 0) ? (
            <div className="p-4 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">รายการที่เลือก</h2>
              <div className="overflow-y-auto max-h-96">
                {/* Use max-h-96 or similar for scrollable cart */}
                {menuItems
                  .filter((item) => quantities[item.menu_id] > 0)
                  .map((item) => (
                    <div
                      key={item.menu_id}
                      className="flex justify-between items-center border-b py-2"
                    >
                      <div className="flex-1">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          {item.menu_type} {item.type && `(${item.type})`}
                        </p>
                      </div>
                      <p className="text-gray-600 mx-4">
                        x{quantities[item.menu_id]}
                      </p>
                      <p className="font-bold">
                        {(item.price * quantities[item.menu_id]).toFixed(2)}
                      </p>
                    </div>
                  ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-lg font-bold">
                  ราคารวม:{" "}
                  {menuItems
                    .reduce(
                      (sum, item) =>
                        sum + item.price * (quantities[item.menu_id] || 0),
                      0
                    )
                    .toFixed(2)}{" "}
                  บาท
                </p>
                <Link
                  href={`/MenuOrder?order=${encodeURIComponent(
                    JSON.stringify(createOrderData())
                  )}`}
                >
                  <Button variant="default" className="w-full mt-4">
                    ยืนยันรายการ
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-white rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">ยังไม่มีรายการที่เลือก</h2>
              <p className="text-gray-600">
                เลือกรายการอาหารจากเมนูทางด้านขวา
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Menu Items */}
        <div className="md:col-span-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredMenuItems.map((item) => (
              <div
                key={item.menu_id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300"
              >
                {item.img_url && (
                  <div className="relative h-48 w-full mb-4">
                    <Image
                      src={
                        `http://localhost:8080/${item.img_url}`
                      }
                      alt={item.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-lg"
                    />
                  </div>
                )}

                <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                <p className="text-gray-600 mb-2">
                  {item.menu_type} {item.type ? `(${item.type})` : ""}
                </p>
                <p className="text-lg font-bold mb-4">
                  {item.price.toFixed(2)} ฿
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDecrement(item)}
                      disabled={quantities[item.menu_id] === 0}
                    >
                      -
                    </Button>
                    <span className="mx-2 text-lg">
                      {quantities[item.menu_id] || 0}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleIncrement(item)}
                    >
                      +
                    </Button>
                  </div>
                  {quantities[item.menu_id] === 0 && (
                    <Button
                      variant="default"
                      onClick={() => handleIncrement(item)}
                    >
                      เพิ่ม
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
