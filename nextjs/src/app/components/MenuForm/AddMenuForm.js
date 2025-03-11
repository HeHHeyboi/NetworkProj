// src/app/components/MenuForm/AddMenuForm.js
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea"; // Remove Textarea

function AddMenuForm({ onMenuAdded }) {
  const [name, setName] = useState("");
  const [menuType, setMenuType] = useState(""); // State for select
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null); // State for the image file
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [success, setSuccess] = useState(false);

  const menuTypeOptions = ["เครื่องดื่ม", "ของหวาน"]; // Options for select
  const typeOptions = ["ร้อน", "เย็น", "ปั่น"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);


    // --- Validation ---
    if (!name.trim()) {
        setError("กรุณากรอกชื่อเมนู");
        setIsSubmitting(false);
        return;
    }
     if (!menuType) {
        setError("กรุณาเลือกประเภทเมนู");
        setIsSubmitting(false);
        return;
    }
    if (!price) {
        setError("กรุณากรอกราคา");
        setIsSubmitting(false);
        return;
    }
    const priceNum = parseFloat(price);
    if (isNaN(priceNum)) {
        setError("ราคาต้องเป็นตัวเลข");
        setIsSubmitting(false);
        return;
    }
    // Add more validation as needed (e.g., type validation, image size limits)

    console.log(`Add Image:  ${image}`)
    // Use FormData for multipart/form-data
    const formData = new FormData();
    formData.append("name", name);
    formData.append("menu_type", menuType);
     if (type) {  // Only append type if it's not empty
        formData.append("type", type);
    }
    formData.append("price", price); // No need to parseFloat here
    if (image) {
      formData.append("images", image); // Append the image file
    }

    try {
      const response = await fetch("http://localhost:8080/menu", {
        method: "POST",
        // No Content-Type header!  Let the browser set it automatically with FormData
        body: formData, // Send FormData, not JSON
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }
      const responseData = await response.json() //get response
      console.log(`Response: ${response}`)
      setSuccess(true);
      setName("");
      setMenuType("");
      setType("");
      setPrice("");
      setImage(null); // Reset image after successful upload
      onMenuAdded(responseData); // Pass new data
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };


    const handleFileChange = (e) => {
        const file = e.target.files[0];
         // Basic file type validation
        if (file && !file.type.startsWith("image/")) {
            setError("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
            return;
        }
        setError(null); // Clear previous error
        if (file) {
          setImage(file);
        }
    };


    // Image Preview (using URL.createObjectURL)
    const [previewUrl, setPreviewUrl] = useState(null);
    useEffect(() => {
        if (image) {
            setPreviewUrl(URL.createObjectURL(image));
        } else {
            setPreviewUrl(null); // Clear preview when image is reset
        }

        // Clean up the URL when the component unmounts or the image changes
        return () => {
          if (previewUrl) {
                URL.revokeObjectURL(previewUrl)
            }
        };
    }, [image]);


  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">เพิ่มเมนูใหม่</h2>

      {/* Success and Error Messages */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">สำเร็จ!</strong>
          <span> เพิ่มเมนูเรียบร้อยแล้ว</span>
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">เกิดข้อผิดพลาด!</strong>
          <span> {error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <div>
          <Label htmlFor="name">ชื่อเมนู:</Label>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="กรอกชื่อเมนู"
            className="mt-1"
            disabled={isSubmitting}
          />
        </div>

        {/* Menu Type Select */}
        <div>
          <Label htmlFor="menuType">ประเภทเมนู:</Label>
          <Select onValueChange={setMenuType} value={menuType} disabled={isSubmitting}>
            <SelectTrigger id="menuType" className="w-full">
              <SelectValue placeholder="เลือกประเภทเมนู" />
            </SelectTrigger>
            <SelectContent>
              {menuTypeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Type Select */}
        <div>
          <Label htmlFor="type">ชนิด (ร้อน/เย็น/ปั่น):</Label>
          <Select onValueChange={setType} value={type} disabled={isSubmitting}>
            <SelectTrigger id="type" className="w-full">
              <SelectValue placeholder="เลือกชนิด (ถ้ามี)" />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Input */}
        <div>
          <Label htmlFor="price">ราคา:</Label>
          <Input
            type="text" // Keep type as text for easier input
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="กรอกราคา"
            className="mt-1"
            disabled={isSubmitting}
          />
        </div>

        {/* Image Upload */}
        <div>
          <Label htmlFor="image">รูปภาพ:</Label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isSubmitting}
            className="mt-1"
          />
           {/* Image Preview */}
            {previewUrl && (
                <img
                    src={previewUrl}
                    alt="Preview"
                    className="mt-2 w-32 h-32 object-cover rounded"
                />
            )}
        </div>

        {/* Submit Button */}
        <Button type="submit" variant="default" disabled={isSubmitting}>
          {isSubmitting ? "กำลังเพิ่ม..." : "เพิ่มเมนู"}
        </Button>
      </form>
    </div>
  );
}

export default AddMenuForm;