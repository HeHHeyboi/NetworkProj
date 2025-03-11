'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// คอมโพเนนต์ย่อยสำหรับแสดงข้อมูลของแกลเลอรี่แต่ละรายการ
const GalleryItem = ({ gallery }) => {
    return (
        <div className="border p-4 rounded-lg shadow-sm">
            {Array.isArray(gallery.img_url) && gallery.img_url.length > 0 ? (
                <div className="mb-4 overflow-x-auto">
                    <div className="flex space-x-2">
                        {gallery.img_url.map((url, index) => {
                            console.log(`Image URL for ${gallery.name}: http://localhost:8080/${url}`);
                            return (
                                <img
                                    key={index}
                                    src={`http://localhost:8080/${url}`}
                                    alt={`${gallery.name} image ${index + 1}`}
                                    className="w-full h-32 object-cover object-center rounded-md"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            ) : (
                <p className="text-gray-500">No images available for this gallery.</p>
            )}

            <h2 className="text-xl font-semibold text-gray-800">{gallery.name}</h2>
            <p className="text-gray-600"><strong>Start Date:</strong> {gallery.start_date}</p>
            <p className="text-gray-600"><strong>End Date:</strong> {gallery.end_date}</p>
        </div>
    );
};

export default function GalleryShowPage() {
    const [galleries, setGalleries] = useState([]);
    const [error, setError] = useState(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    const getCurrentMonth = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
    };

    useEffect(() => {
        const month = searchParams.get('month') || getCurrentMonth();

        const fetchGalleries = async () => {
            try {
                const response = await fetch(`http://localhost:8080/gallery?month=${month}`, { method: 'GET' });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setGalleries(data || []);
            } catch (e) {
                setError(e.message);
                console.error("Could not fetch galleries:", e);
            }
        };

        fetchGalleries();
    }, [searchParams]);

    const handleGoBack = () => {
        router.push('/Gallery');
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-semibold text-gray-800 text-center mb-8">Gallery List</h1>
            
            {error && <p className="text-red-500 text-center">{error}</p>}
            {Array.isArray(galleries) && galleries.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {galleries.map((gallery) => (
                        <GalleryItem key={gallery.name} gallery={gallery} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">No galleries found for this month.</p>
            )}
        </div>
    );
}
