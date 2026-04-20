import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './libs/token.lib'

export function proxy(request: NextRequest) {
    const token = request.cookies.get("auth_token")?.value
    if (!token) {
        if (!request.nextUrl.pathname.startsWith("/auth") && request.nextUrl.pathname !== "/") {
            return NextResponse.redirect(new URL("/auth", request.url));
        }
    } else {
        const userId = verifyToken(token)?.userId
        if (!userId) {
            return NextResponse.redirect(new URL("/auth", request.url));
        }
        if (request.nextUrl.pathname.startsWith("/auth") || request.nextUrl.pathname === "/") {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/auth/:path*', '/dashboard/:path*'],
}