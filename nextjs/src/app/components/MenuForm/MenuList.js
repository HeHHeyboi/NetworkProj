"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function MenuList({ menuItems, onEdit, onDelete }) {
  console.log("Rendering Menu Items:", menuItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const menuTypes = ["all", ...new Set(menuItems.map((item) => item.menu_type))];

  const filteredMenuItems = menuItems.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = item.name?.toLowerCase().includes(searchLower);
    const typeMatch = item.menu_type?.toLowerCase().includes(searchLower);
    const filterMatch = filterType === "all" || item.menu_type === filterType;
    return filterMatch && (nameMatch || typeMatch);
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">รายการเมนู</h2>

      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <Input
          type="text"
          placeholder="ค้นหาเมนู..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-2 md:mb-0 md:mr-2"
        />

        <div className="flex items-center">
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

      {filteredMenuItems.length === 0 ? (
        <p>ไม่มีรายการเมนูที่ตรงกับคำค้นหา</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รูป</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อเมนู</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ประเภท</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชนิด</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ราคา</th>
                <th className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMenuItems.map((item) => (
                <tr key={item.menu_id}>
                  <td>
                    {Array.isArray(item.img_url) && typeof item.img_url[0] === "string" ? (
                      <Image src={`http://localhost:8080/${item.img_url[0]}`} alt={item.name} width={50} height={50} />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>{item.name || "Unnamed"}</td>
                  <td>{item.menu_type || "Unknown"}</td>
                  <td>{item.type || "Unknown"}</td>
                  <td>{item.price ? `${item.price} บาท` : "N/A"}</td>
                  <td>
                    <Button onClick={() => onEdit(item)}>Edit</Button>
                    <Button onClick={() => onDelete(item.menu_id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MenuList;
