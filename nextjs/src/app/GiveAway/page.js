'use client';

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";

const GiveAwayPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        desc: "",
        amount: "",
        images: []
    });

    const [error, setError] = useState(null);
    const router = useRouter();
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleImageSelect = (e) => {
        if (e.target.files.length > 0) {
            // Convert FileList to Array and add to existing images
            const newImages = Array.from(e.target.files);
            setFormData({
                ...formData,
                images: [...formData.images, ...newImages]
            });
            // Reset file input so same file can be selected again
            e.target.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.desc || !formData.amount || formData.images.length === 0) {
            setError("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("desc", formData.desc);
        formDataToSend.append("amount", parseInt(formData.amount));
        
        // Append each image to the FormData
        formData.images.forEach((image) => {
            formDataToSend.append("images", image);
        });

        try {
            const response = await fetch("http://localhost:8080/giveAway", {
                method: "POST",
                credentials: "include",
                body: formDataToSend,
            });

            if (response.ok) {
                router.push("/Admin/DashBoard");
            } else {
                const errorData = await response.json();
                setError("ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
            }
        } catch (error) {
            setError("เกิดข้อผิดพลาดในการส่งข้อมูล");
        }
    };

    // Function to remove an image
    const removeImage = (indexToRemove) => {
        setFormData({
            ...formData,
            images: formData.images.filter((_, index) => index !== indexToRemove)
        });
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4">เพิ่ม Giveaway</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">ชื่อรายการ:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">รายละเอียด:</label>
                    <textarea
                        name="desc"
                        value={formData.desc}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">จำนวน:</label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">อัพโหลดรูปภาพ:</label>
                    
                    {/* ปุ่มเพิ่มรูปภาพ */}
                    <div className="mt-2">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                            id="image-upload"
                            ref={fileInputRef}
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current.click()}
                            className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            + เพิ่มรูปภาพ
                        </button>
                    </div>
                    
                    {/* แสดงรูปภาพที่เลือก */}
                    {formData.images.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-2">
                            {formData.images.map((image, index) => (
                                <div key={index} className="relative border rounded p-1">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={`รูปภาพ ${index + 1}`}
                                        className="w-full h-24 object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-0 right-0 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center"
                                        title="ลบรูปภาพ"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-green-500 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default GiveAwayPage;
