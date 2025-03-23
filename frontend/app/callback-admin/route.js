'use server';

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { SignJWT } from "jose";
import { TextEncoder } from "util";
import { cookies } from 'next/headers';
const prisma = new PrismaClient();
const role = "admin";

function convertToDate(dateString) {
    if (typeof dateString === 'string' && dateString.length === 8) {
        const year = parseInt(dateString.substring(0, 4), 10);
        const month = parseInt(dateString.substring(4, 6), 10) - 1;
        const day = parseInt(dateString.substring(6, 8), 10);
        return new Date(year, month, day);
    }
    return null;
}

export default async function GET(req) {
    try {
        const url = new URL(req.url);
        const username = url.searchParams.get("username");
        console.log("Username:", username);
        const key = new TextEncoder().encode(process.env.JWT_SECRET);
        const accessToken = await new SignJWT({ id: username, role: role })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setIssuer(`${process.env.WEB_URL}`)
            .setExpirationTime(process.env.JWT_TIMEOUT)
            .sign(key);

        // await setTOKEN(accessToken).then(() => {console.log('token set')}).catch((err) => {console.log(err)});
        
        // Set the token as a cookie using NextResponse
        const response = NextResponse.redirect(`${process.env.WEB_URL}/Admin/home/0`, 303);
        response.cookies.set('token', accessToken, {
            httpOnly: true, // Prevent JavaScript access
            // secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
            // sameSite: 'none', // Prevents sending with cross-origin requests
            path: '/', // Available to the entire site
        });
        console.log(`User logged in`, response);
        return response;
    } catch (error) {
        console.error("Error processing callback:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}