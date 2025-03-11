"use client";

import { Suspense } from "react";
import GalleryShowPageContent from "./GalleryShowPageContent";

export default function GalleryShowPage() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <GalleryShowPageContent />
        </Suspense>
    );
}
