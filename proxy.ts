import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 🚨 FUNCTION KA NAAM 'middleware' HONA ZAROORI HAI
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('accessToken')?.value;
    const userCookieString = request.cookies.get('admin_user')?.value;
    
    let email = null;
    let isAdmin = false;

    if (userCookieString) {
      try {
        const adminUser = JSON.parse(userCookieString);
        email = adminUser.email;
        // Backend 'role' bhejta hai ya 'isAdmin', dono ko check kar liya taake safe rahay
        isAdmin = adminUser.isAdmin || adminUser.role === 'admin'; 
      } catch (error) {
        console.error("Cookie parsing failed in middleware", error);
      }
    }

    // 🚨 THE FIX: Agar Token NAHI hai, YA banda Admin NAHI hai -> Wapis Login par bhejo
    if (!token || !isAdmin) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Agar sab theek ha (Token bhi hai aur Admin bhi hai) toh agay jane do
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};