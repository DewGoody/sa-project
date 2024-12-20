import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const provinces = await prisma.province.findMany();
    return NextResponse.json(provinces);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch provinces" }, { status: 500 });
  }
}
