'use server'
import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()
export async function GET() {
    try {
        const one = await prisma.rD_info.findFirst({
            where: { RD_type: 1 },
            select: { date: true, money: true }
        });

        const two = await prisma.rD_info.findFirst({
            where: { RD_type: 2 },
            select: { money: true }
        });

        const three = await prisma.rD_info.findFirst({
            where: { RD_type: 3 },
            select: { money: true }
        });

        // ตรวจสอบค่าก่อนใช้งาน
        const response = {
            date: one?.date ? new Date(one.date).toISOString().split("T")[0] : null, // แปลง Date เป็น "YYYY-MM-DD"
            firstPayment: one?.money ? one.money.toString() : "0",
            secondPayment: two?.money 
                ? two.money.toString() 
                : three?.money 
                ? three.money.toString() 
                : "0"
        };

        return NextResponse.json({ data: response });

    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
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
