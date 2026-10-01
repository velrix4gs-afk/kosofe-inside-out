import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    // Protect all admin routes EXCEPT the login page
    if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
        // Look for the Supabase auth session cookie
        const cookies = request.cookies.getAll()
        const hasSession = cookies.some(
            (c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
        )

        if (!hasSession) {
            // Redirect to login BEFORE the page renders
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'],
}