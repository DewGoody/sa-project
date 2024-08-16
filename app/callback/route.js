'use server'

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'
import { check } from "prisma";

const prisma = new PrismaClient()

function convertToDate(dateString) {
    // Ensure the dateString is a string and has the correct length
    if (typeof dateString === 'string' && dateString.length === 8) {
        const year = parseInt(dateString.substring(0, 4), 10);
        const month = parseInt(dateString.substring(4, 6), 10) - 1; // Months are 0-based in JavaScript
        const day = parseInt(dateString.substring(6, 8), 10);
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
        console.error("Error processing callback:", error);
        throw new Error("Internal Server Error");
    }
}

export async function GET(req) {
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

        console.log('Fetched Info:', info);

        const bd = convertToDate(info.birthDate);
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
            bd: convertToDate(info.birthDate) || new Date(date), // Default value; modify as needed
            year: info.studentId.substring(info.studentId.length - 2) || '',
            id: info.studentId || ''
        };

        console.log('Constructed Student Object:', Student);

        // Upsert student into the database
        await prisma.Student.upsert({
            where: { id: Student.id },
            update: Student,
            create: Student
        });

        return NextResponse.json({ message: "Student data processed successfully" });

    } catch (error) {
        console.error("Error processing callback:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
