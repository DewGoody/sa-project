// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_TIMEOUT = process.env.JWT_TIMEOUT || '1h';
const JWT_REFRESH = Number(process.env.JWT_REFRESH) || 15 * 60;

// หน้า/เส้นทางที่ไม่ต้องล็อกอิน
const PUBLIC_PATHS = [
  '/login',
  '/callback',
  '/callback-admin',
  '/',               // ให้หน้าแรกเป็น public ถ้าต้องการ
];

function isPublic(pathname: string) {
  // อนุญาตไฟล์สแตติกเสมอ
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp)$/)
  ) return true;

  return PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p));
}

export default async function middleware(req: NextRequest) {
  const { pathname } = new URL(req.url);

  // ข้าม middleware สำหรับ public paths
  if (isPublic(pathname)) return NextResponse.next();

  const token = req.cookies.get('token')?.value;

  // ✅ ถ้าไม่มีคุกกี้ (ถูกลบ/ไม่เคยล็อกอิน) → เด้งไป login ทันที
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    const now = Math.floor(Date.now() / 1000);
    const exp = payload.exp ?? 0;
    const timeLeft = exp - now;

    // ถ้าหมดอายุ → ส่งไป login
    if (timeLeft <= 0) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // ตัวอย่างตรวจสิทธิ์เพิ่ม (ถ้าต้องการ)
    const userId = payload.id;
    const role = payload.role;

    if (pathname.startsWith('/student')) {
      const segs = pathname.split('/');
      const pathId = segs[2];
      if (role !== 'admin' && pathId !== String(userId)) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }

    if (pathname.startsWith('/Admin') && role !== 'admin') {
      return NextResponse.redirect(new URL(`/student/${userId}/home`, req.url));
    }

    // ต่ออายุโทเค็นถ้าใกล้หมด
    if (timeLeft < JWT_REFRESH) {
      const newToken = await new SignJWT({ id: userId, role })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(JWT_TIMEOUT)
        .sign(new TextEncoder().encode(JWT_SECRET));

      const res = NextResponse.next();
      res.cookies.set('token', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });
      return res;
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// ให้ middleware ไม่ไปรันบนไฟล์สแตติก/รูป/หน้า login/api
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

