'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function GiveAwayDetailPage() {
    const params = useParams();
    const id = params?.id;
    
    const [giveaway, setGiveaway] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const router = useRouter();

    useEffect(() => {
        if (!id) {
            setError(new Error('ไม่พบไอดีของรายการ'));
            setLoading(false);
            return;
        }
        
        fetch(`http://localhost:8080/giveAway?id=${id}`, { method: 'GET' })
            .then(response => {
                if (!response.ok) throw new Error(response.status === 404 
                    ? 'ไม่พบรายการ Giveaway ที่ต้องการ' 
                    : 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
                return response.json();
            })
            .then(data => {
                const giveawayData = Array.isArray(data) ? data[0] : data;
                setGiveaway(giveawayData);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
                setError(error);
                setLoading(false);
            });
    }, [id]);

    const navigateImage = (direction) => {
        if (giveaway?.img_url?.length > 0) {
            setCurrentImageIndex(prev => 
                (prev + direction + giveaway.img_url.length) % giveaway.img_url.length
            );
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-pulse text-gray-400">กำลังโหลด...</div>
            </div>
        );
    }

    if (error || !giveaway) {
        return (
            <div className="flex flex-col justify-center items-center h-screen p-4">
                <p className="text-gray-600 mb-6">{error?.message || 'ไม่พบข้อมูลรายการ'}</p>
                <button 
                    onClick={() => router.back()} 
                    className="px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition"
                >
                    กลับ
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6">
            <button 
                onClick={() => router.back()} 
                className="group mb-4 flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mr-2 transition-transform group-hover:-translate-x-1">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                กลับ
            </button>

            <div>
                <h1 className="text-2xl font-medium text-gray-900 mb-4">{giveaway.name}</h1>
                
                {giveaway.img_url && giveaway.img_url.length > 0 && (
                    <div className="mb-6">
                        <div className="relative mx-auto" style={{ width: '500px', height: '300px' }}>
                            <img 
                                src={`http://localhost:8080/${giveaway.img_url[currentImageIndex]}`}
                                alt={`${giveaway.name} - รูปที่ ${currentImageIndex + 1}`}
                                className="object-contain w-full h-full bg-gray-50 rounded-lg"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/500x300?text=Image+Not+Found';
                                }}
                            />
                            
                            {giveaway.img_url.length > 1 && (
                                <>
                                    <button 
                                        onClick={() => navigateImage(-1)}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition shadow"
                                        aria-label="Previous image"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button 
                                        onClick={() => navigateImage(1)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition shadow"
                                        aria-label="Next image"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </>
                            )}
                        </div>
                        
                        {giveaway.img_url.length > 1 && (
                            <div className="flex justify-center mt-2 mb-2">
                                <div className="flex space-x-1.5">
                                    {giveaway.img_url.map((_, index) => (
                                        <button 
                                            key={index}
                                            className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-gray-800' : 'bg-gray-300'}`}
                                            onClick={() => setCurrentImageIndex(index)}
                                            aria-label={`Go to image ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="space-y-4 shadow-md p-5 bg-white rounded-lg">
                    <div>
                        <h2 className="text-gray-500 text-x mb-1">รายละเอียด</h2>
                        <p className="text-gray-700 whitespace-pre-line leading-relaxed">{giveaway.desc}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                            <h3 className="text-gray-500 text-b mb-0.5">จำนวนทั้งหมด</h3>
                            <p className="text-2xl font-light">{giveaway.amount}</p>
                        </div>
                        
                        <div>
                            <h3 className="text-green-500 text-b mb-0.5 ">คงเหลือ</h3>
                            <p className="text-2xl font-light ">{giveaway.remain}</p>
                        </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100">
                        <h3 className="text-gray-500 text-sm mb-0.5">วันที่เพิ่ม</h3>
                        <p className="text-gray-600">{new Date(giveaway.date).toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}