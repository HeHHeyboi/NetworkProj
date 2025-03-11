"use client";

import { Suspense } from "react";
import BillOrderPageContent from "./BillOrderPageContent";

export default function BillOrderPage() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <BillOrderPageContent />
        </Suspense>
    );
}
