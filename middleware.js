import { NextRequest, NextResponse } from 'next/server';
import { getSession } from './lib/session';
import { setCookie, removeCookie } from 'cookies-next';

const protectedRoutes = ['/home', '/profile', '/rordor', '/api'];
const publicRoutes = []; // Define your public routes if needed

export default async function middleware(req) {
    const path = req.nextUrl.pathname;
    console.log(`Request path: ${path}`);

    if (path === '/callback') {
        console.log('Bypassing middleware for /callback');
        return NextResponse.next();
    }
    try{

    const isProtectedRoute = protectedRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);

    console.log(`Is Protected Route: ${isProtectedRoute}`);

    const { session, newToken } = await getSession(req);
    const { payload, protectedHeader } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    const expTime = payload.exp;
    
    const timeRemaining = expTime - currentTime;
    const id = payload?.id;

    if (timeRemaining < JWT_REFRESH / 1000) {
        const newToken = await new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime(JWT_TIMEOUT)
            .sign(new TextEncoder().encode(JWT_SECRET));

        const response = NextResponse.next();
        response.cookies.set('token', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: JWT_TIMEOUT,
        });

        return response;

    }
} catch (error) {
    console.error(error);
    return NextResponse.redirect('');
}

}

    export const config = {
        matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
    };
