'use server'
import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()
export async function GET(studentId) {
    const queue = await prisma.rD_info.findMany({
        where: { stu_id: studentId, deleted_at: null },
        select: { date: true, money: true },
    });
    return NextResponse.json({ data: queue });
}