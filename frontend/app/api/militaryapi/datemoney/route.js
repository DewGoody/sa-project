'use server'
import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function POST(req) {
    try {
        const body = await req.json(); // เปลี่ยนชื่อเป็น `body` แทน `data`
        console.log("Received Data:", body); // ตรวจสอบค่าที่ได้รับ

        await prisma.rD_info.updateMany({
            where: { RD_type: 1 },
            data: { date: new Date(body.date), money: body.firstPayment },
            
        });

        await prisma.rD_info.updateMany({
            where: { RD_type: 2 },
            data: { date: new Date(body.date), money: body.secondPayment },
        });

        await prisma.rD_info.updateMany({
            where: { RD_type: 3 },
            data: { date: new Date(body.date), money: body.secondPayment },
        });

        return NextResponse.json({ message: "Updated successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error updating data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
