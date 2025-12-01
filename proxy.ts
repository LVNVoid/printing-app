import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export const proxy = async (req: NextRequest) => {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const pathname = req.nextUrl.pathname;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const role = token.role;

  const adminRoutes = [
    '/admin/dashboard',
  ];

  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    '/dashboard/:path*',
   
  ],
};
