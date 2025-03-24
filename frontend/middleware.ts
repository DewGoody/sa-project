import { NextResponse, NextRequest } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

const protectedRoutes = ['/home', '/profile', '/rordor', '/api', '/Admin'];
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH = Number(process.env.JWT_REFRESH) || 15 * 60; // 15 minutes refresh window
const JWT_TIMEOUT = process.env.JWT_TIMEOUT || '1h'; // 2 hours token validity

export default async function middleware(req: NextRequest) {
  const BASE_URL = process.env.BASE_URL || 'http://161.200.199.69:3000';
  const url = new URL(req.url);
  const path = url.pathname;
  const cookieStore = cookies()
  console.log('Cookies:', cookieStore);
  
  console.log(`Middleware route: ${path}`);

  // Skip middleware for the /callback route
  if (path === '/callback' || path === '/callback-admin') {
    return NextResponse.next();
  }

  const token = cookieStore.get('token')?.value;

  if (!token && protectedRoutes.includes(path)) {
    return NextResponse.redirect(`${BASE_URL}/login`);
  }

  try {
    if (!token) {
      return NextResponse.redirect(`${BASE_URL}/login`);
    }
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    const currentTime = Math.floor(Date.now()/ 1000);
    const expTime = payload.exp;
    console.log('Payload:', payload,"\n", "path:",path,"\n", "token",token,"\n", "pathStartAdmin:", path.startsWith('/Admin'));

    // Check if the token is already expired
    if (expTime !== undefined) {
      console.log('Time left:', expTime - currentTime);
      if (expTime <= currentTime) {
        console.log('Token has expired, redirecting to login');
        return NextResponse.redirect(`${BASE_URL}/login`);
      }
    } else {
      console.log('Token expiration time is undefined, redirecting to login');
      return NextResponse.redirect(`${BASE_URL}/login`);
    }

    if (path.startsWith('/student') && !path.includes(token)&& payload.role !== 'admin') {
      // If the token is not included in the path, redirect to login
      return NextResponse.redirect('${BASE_URL}/login');
    }

    if (token && path.startsWith('/Admin') && payload.role !== 'admin') {
      console.log('User is not admin, redirecting to home');
      return NextResponse.redirect(`${BASE_URL}/student/${token}/home`);
    }
    // Check if the token needs to be refreshed
    const timeRemaining = expTime - currentTime;
    console.log(timeRemaining)
    if (timeRemaining < JWT_REFRESH) {
      console.log('Token is close to expiration, refreshing');
      const newToken = await new SignJWT({ id: payload.id })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(JWT_TIMEOUT)
        .sign(new TextEncoder().encode(JWT_SECRET));

      const response = NextResponse.next();
      response.cookies.set('token', newToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      


      return response;
    }

    return NextResponse.next();
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return NextResponse.redirect(`${BASE_URL}/login`);
  }
}

export const config = {
  matcher: ['/((?!api|login|_next/static|_next/image|.*\\.png$).*)'],
};