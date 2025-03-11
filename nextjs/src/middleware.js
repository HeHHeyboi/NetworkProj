import { NextResponse } from "next/server";

export async function middleware(req) {
    console.log(`Middleware: Checking auth for ${req.nextUrl.pathname}`);

    // ⛔ ข้าม Middleware ถ้าเป็น static files หรือ API routes
    if (req.nextUrl.pathname.startsWith("/_next") || req.nextUrl.pathname.startsWith("/api")) {
        return NextResponse.next();
    }

    // ⛔ ห้ามเรียก /checkAuth ซ้ำๆ เพื่อลด Too Many Requests
    try {
        const checkAuth = await fetch("http://localhost:8080/checkAuth", {
            headers: { Cookie: req.headers.get("cookie") || "" },
        });

        const isAuthenticated = checkAuth.status === 201;

        if (req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register")) {
            if (isAuthenticated) {
                console.log("User is already logged in, redirecting to '/'");
                return NextResponse.redirect(new URL("/", req.nextUrl.origin));
            }
            return NextResponse.next();
        }

        if (!isAuthenticated) {
            console.log("User is not authenticated, redirecting to '/login'");
            return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Auth check failed:", error);
        return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
    }
}
