'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function GalleryPage() {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const router = useRouter();
  
  // Reference for the file input
  const fileInputRef = useRef(null);

  // เพิ่ม useEffect เพื่อดึง user data จาก cookie
  useEffect(() => {
    const getUserFromCookie = () => {
      try {
        const userDataCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('id='));
        
      } catch(error){
        console.log(error)
      }
    };

    getUserFromCookie();
  }, []);

  // จัดการการเพิ่มรูปภาพ
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    
    // สร้าง preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };

  // Cleanup previews
  useEffect(() => {
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // ตรวจสอบวันที่
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end < start) {
      setMessage('วันที่สิ้นสุดต้องมาหลังวันที่เริ่มต้น');
      return;
    }

    // สร้าง FormData สำหรับส่งข้อมูลทั้งหมด
    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('start_date', startDate);
    formData.append('end_date', endDate);
    formData.append('description', description.trim());

    // เพิ่มรูปภาพทั้งหมดเข้าไปใน FormData
    selectedFiles.forEach((file, index) => {
      formData.append('images', file); // ใช้ชื่อ 'files' สำหรับรูปภาพทั้งหมด
    });

    try {
      const response = await fetch('http://localhost:8080/gallery', {
        method: 'POST',
        credentials: 'include',
        body: formData, // ส่ง FormData ที่มีทั้งข้อมูลและรูปภาพ
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'ไม่สามารถจองแกลลอรี่ได้');
      }

      const data = await response.json();
      console.log('Success:', data);

      setMessage('จองแกลลอรี่สำเร็จ!');
      // เคลียร์ฟอร์ม
      setName('');
      setStartDate('');
      setEndDate('');
      setDescription('');
      setSelectedFiles([]);
      setPreviews([]);

      // Redirect หลังจากจองสำเร็จ
      router.push('/GalleryShow?month=' + new Date(startDate).toISOString().slice(0, 7));

    } catch (error) {
      console.error('Error:', error);
      setMessage(error.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
    }
  };

  // เพิ่มฟังก์ชันตรวจสอบวันที่
  const handleDateChange = (setter) => (e) => {
    const value = e.target.value;
    setter(value);
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) {
        setMessage('วันที่สิ้นสุดต้องมาหลังวันที่เริ่มต้น');
      } else {
        setMessage('');
      }
    }
  };

  const removeImage = (indexToRemove) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
    setPreviews((prevPreviews) => prevPreviews.filter((_, index) => index !== indexToRemove));
  };

  // เปิด file input เมื่อคลิกปุ่ม
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">จองแกลลอรี่</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            ชื่อแกลลอรี่:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            วันที่เริ่ม:
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={handleDateChange(setStartDate)}
            min={new Date().toISOString().split('T')[0]}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            วันที่สิ้นสุด:
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={handleDateChange(setEndDate)}
            min={startDate || new Date().toISOString().split('T')[0]}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            คำอธิบาย:
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 h-32"
          />
        </div>

        {/* ส่วนปุ่มอัพโหลดรูปภาพ */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleButtonClick}
            className=" py-2 px-4 bg-blue-500 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            +เพิ่มรูปภาพ
          </button>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          {/* แสดง preview รูปที่เลือก */}
          {previews.length > 0 && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              {previews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {message && (
          <div className="text-sm text-red-500">{message}</div>
        )}

        <div className="mt-4">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-500 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
