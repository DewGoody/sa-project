'use server';

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { SignJWT } from "jose";
import { TextEncoder } from "util";
import { cookies } from 'next/headers';
import { log } from "console";
const prisma = new PrismaClient();
const role = "student";

function convertToDate(dateString) {
    if (typeof dateString === 'string' && dateString.length === 8) {
        const year = parseInt(dateString.substring(0, 4), 10);
        const month = parseInt(dateString.substring(4, 6), 10) - 1;
        const day = parseInt(dateString.substring(6, 8), 10);

        return new Date(Date.UTC(year, month, day, 7));
    }
    return null;
}


async function handler(token) {
    if (!token) {
        throw new Error("Token is required");
    }

    try {


        const response = await fetch(`https://cunexdev.azurewebsites.net/service.svc/ext/type3/profile?token=${token}`, {
        //const response = await fetch(`https://cunex.meesoft.co.th/service.svc/ext/type3/profile?token=${token}`, { //(SSO)


            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ClientId': 'cuserv',
                'ClientSecret': '25a4b9d2efb6b16cc75ed6786c92526c'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch user profile: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("User profile:", data);
        return data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw new Error("Failed to fetch user profile");
    }
}

// async function setTOKEN(token) {
//     const cookieStore = cookies()
//     cookieStore.set('token', token, {
//         httpOnly: false,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'Strict',
//         path: '/'

//     })
//     // refresh the web and set the new token but not redirect 

// }

export async function GET(req) {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    if (!token) {
        return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    try {
        let currentDate = new Date();
        const info = await handler(token);

        if (!info) {
            return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 400 });
        }
        const currentYear = new Date().getFullYear() + 543;
        const studentYearPrefix = parseInt(info.studentId.substring(0, 2), 10);
        let Convert_Student_Year = currentYear - (studentYearPrefix + 2500);
        if (currentDate.getMonth() > 8) {
            Convert_Student_Year += 1;
        }

        const Student = {
            title: info.prefix || '',
            lnameTH: info.lastNameTH || '',
            fnameTH: info.firstNameTH || '',
            fnameEN: info.firstNameEN || '',
            lnameEN: info.lastNameEN || '',
            id: info.studentId || '',
            bd: convertToDate(info.birthdate) || '',
            facultyNameTH: info.facultyNameTH || '',
            facultyNameEN: info.facultyNameEN || '',
            nationality: info.nationality || '',
            fac_id: info.facultyCode || '',
            year: String(Convert_Student_Year) || '',
            dept: '',

        };

        const key = new TextEncoder().encode(process.env.JWT_SECRET);
        const accessToken = await new SignJWT({ id: Student.id, role: role })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setIssuer(`${process.env.WEB_URL}`)
            .setExpirationTime(process.env.JWT_TIMEOUT)
            .sign(key);

        // await setTOKEN(accessToken).then(() => {console.log('token set')}).catch((err) => {console.log(err)});

        // Set the token as a cookie using NextResponse
        const response = NextResponse.redirect(`${process.env.WEB_URL}/student/${Student.id}/home`);
        response.cookies.set('token', accessToken, {
            httpOnly: true, // Prevent JavaScript access
            // secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
            // sameSite: 'none', // Prevents sending with cross-origin requests
            path: '/', // Available to the entire site
        });

        await prisma.student.upsert({
            where: { id: Student.id },
            update: Student,
            create: Student
        });

        console.log(`User ${Student.id} logged in`);
        return response;
    } catch (error) {
        console.error("Error processing callback:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}