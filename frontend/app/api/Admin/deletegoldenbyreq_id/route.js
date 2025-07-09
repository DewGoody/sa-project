import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { convertBigIntToString } from '../../../../utills/convertBigInt';

const prisma = new PrismaClient();

export async function PUT(req) {
    try {
        const data = await req.json();
        const { req_id } = data;

        const deletedRequest = await prisma.request.update({
            where: {
                id: BigInt(req_id),
            },
            data: {
                status: "ยกเลิก",
                deleted_at: new Date(),
            },
        });

        return NextResponse.json({ data: convertBigIntToString(deletedRequest) });

    } catch (error) {
        console.error("❌ delete error", error);

        let statusCode = 500;
        let errorMessage = "Server error";

        if (error.code === "P2025") {
            statusCode = 404;
            errorMessage = "ไม่พบข้อมูลที่ต้องการลบ";
        } else if (typeof error.code === "number" && error.code >= 400 && error.code <= 599) {
            statusCode = error.code;
            errorMessage = error.message || "Unknown error";
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }

        return NextResponse.json({ error: errorMessage }, { status: statusCode });
    }
}
