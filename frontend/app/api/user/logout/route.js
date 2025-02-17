// pages/api/logout.js
import { NextResponse } from 'next/server';

export async function GET(req) {
  const response = NextResponse.redirect('http://localhost:3000/login');

  // ลบคุกกี้ 'token'
  response.cookies.set('token', '', {
    httpOnly: true,
    // secure: process.env.NODE_ENV === 'production', // ใช้เฉพาะใน production
    // sameSite: 'strict',
    expires: new Date(0), // ตั้งให้คุกกี้หมดอายุ
    path: '/', // ใช้กับทุก path
  });

  return response;
}
