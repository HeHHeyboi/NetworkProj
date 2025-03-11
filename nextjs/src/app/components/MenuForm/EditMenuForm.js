"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function EditMenuForm({ item, onMenuUpdated, onCancel }) {
  const [name, setName] = useState("");
  const [menuType, setMenuType] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const menuTypeOptions = ["เครื่องดื่ม", "ของหวาน"];
  const typeOptions = ["ร้อน", "เย็น", "ปั่น"];

  // Reset form when item prop changes
  useEffect(() => {
    if (item) {
      console.log("Item has changed:", item);
      setName(item.name || "");
      // Set menuType only if it's not already set, avoid overwriting an existing value
      setMenuType((prevMenuType) => prevMenuType || item.menu_type || menuTypeOptions[0]);
      setType(item.type || "");
      setPrice(item.price ? item.price.toString() : "");
      setImageUrl( item.img_url ? `http://localhost:8080/${item.img_url[0]}` : "");
      setImage(null); // Reset image on item change
      setError(null);
      setSuccess(false);
    }
  }, [item]); // Ensure `item` is properly passed and updated

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
  
    // Validate form inputs
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
  
    const formData = new FormData();
    formData.append("name", name);
    formData.append("menu_type", menuType);
    if (type) formData.append("type", type);
    formData.append("price", price);
  
    // Check if an image is selected, otherwise send the old image URL
    if (image) {
      formData.append("images", image);
    } else if (imageUrl) {
      // Add the old image URL to form data if no new image is selected
      formData.append("img_url", imageUrl);
    }
  
    console.log(`Update Item : ${name}, ${menuType}, ${type}, ${price},${imageUrl}`);
    
    try {
      const response = await fetch(
        `http://localhost:8080/menu/id/${item.menu_id}`,
        {
          method: "PUT",
          body: formData,
        }
      );
  
      const responseData = await response.json();
      setSuccess(true);
      onMenuUpdated(responseData);
      setImageUrl(responseData.img_url); // Update image URL with the response
      setIsSubmitting(false);
    } catch (error) {
      console.log(`Error : ${error}`);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && !file.type.startsWith("image/")) {
      setError("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
      return;
    }

    setError(null);
    setImage(file); // Update the image state
    setImageUrl(URL.createObjectURL(file)); // Generate image preview URL
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImageUrl(""); // Remove the image and preview URL
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">แก้ไขเมนู</h2>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> Menu item updated.</span>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="edit-name">ชื่อเมนู:</Label>
          <Input
            type="text"
            id="edit-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="กรอกชื่อเมนู"
            className="mt-1"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label htmlFor="edit-menuType">ประเภทเมนู:</Label>
          <Select
            onValueChange={setMenuType}
            value={menuType || item.menu_type}
            disabled={isSubmitting}
          >
            <SelectTrigger id="edit-menuType" className="w-full">
              <SelectValue />
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

        <div>
          <Label htmlFor="edit-type">ชนิด (ร้อน/เย็น/ปั่น):</Label>
          <Select onValueChange={setType} value={type || item.type} disabled={isSubmitting}>
            <SelectTrigger id="edit-type" className="w-full">
              <SelectValue />
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

        <div>
          <Label htmlFor="edit-price">ราคา:</Label>
          <Input
            type="text"
            id="edit-price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="กรอกราคา"
            className="mt-1"
            disabled={isSubmitting}
          />
        </div>

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
          {imageUrl && (
            <div className="mt-2 relative w-32 h-32">
              <Image
                key={imageUrl}
                src={imageUrl}
                alt="Menu Item"
                layout="fill"
                objectFit="cover"
                className="rounded"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1"
                onClick={handleRemoveImage}
                disabled={isSubmitting}
              >
                X
              </Button>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button type="submit" variant="default" disabled={isSubmitting}>
            {isSubmitting ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            ยกเลิก
          </Button>
        </div>
      </form>
    </div>
  );
}

export default EditMenuForm;
