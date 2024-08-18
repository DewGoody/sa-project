'use server'

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'
import { serialize } from 'cookie';
import { SignJWT } from "jose";


const prisma = new PrismaClient()

function convertToDate(dateString) {
    // Ensure the dateString is a string and has the correct length
    if (typeof dateString === 'string' && dateString.length === 8) {
        const year = parseInt(dateString.substring(0, 4), 10);
        const month = parseInt(dateString.substring(4, 6), 10) - 1; // Months are 0-based in JavaScript
        const day = parseInt(dateString.substring(6, 8), 10);
        console.log(year, month, day);
        return new Date(year, month, day);
    }
    return null;
}

// GET api
async function handler(token) {
    if (!token) {
        throw new Error("Token is required");
    }

    try {
        const response = await fetch(`https://cunexdev.azurewebsites.net/service.svc/ext/type3/profile?token=${token}`, {
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
        return data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req,res) {
    console.log(`Callback route: ${req.url}`);
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    const lang = url.searchParams.get('lang');

    if (!token) {
        return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    try {
        // Fetch user profile using the token
        const info = await handler(token);

        if (!info) {
            return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 400 });
        }
        const bd = await convertToDate(info.birthdate);
        const date = Date.now();

        // Construct student object
        const Student = {
            title: info.prefix || '',
            lnameTH: info.lastNameTH || '',
            fnameTH: info.firstNameTH || '',
            fnameEN: info.firstNameEN || '',
            lnameEN: info.lastNameEN || '',
            thai_id: info.thai_id || '',
            nationality: info.nationality || '',
            fac_name: info.facultyNameTH || '',
            fac_id: info.facultyId || '',
            dept: info.departmentNameTH || '',
            religion: '', // Default value; modify as needed
            bd: convertToDate(info.birthdate) || bd, // Default value; modify as needed
            year: info.studentId.substring(info.studentId.length - 2) || '',
            id: info.studentId || ''
        };


        // PUT student object to the database
        await fetch('http://localhost:3000/api/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Student)
        });
    

        const key = new TextEncoder().encode(process.env.JWT_SECRET);
        const accessToken = await new SignJWT({id: Student.id}).setProtectedHeader({alg: 'HS256'}).setIssuedAt().setIssuer('http://localhost:3000').setExpirationTime(process.env.JWT_TIMEOUT).sign(key);
         // Set token as a cookie in the response header
        const response = NextResponse.redirect('http://localhost:3000/home');

         response.headers.set('Set-Cookie', serialize('token', accessToken, { 
             httpOnly: true, 
             secure: process.env.NODE_ENV === 'production',
             maxAge: 60 * 1, // 15 minutes
             path: '/', 
         }));
 
         return response;



        






    } catch (error) {
        console.error("Error processing callback:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
