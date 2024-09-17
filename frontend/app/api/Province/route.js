const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

export async function GET(){
    const getprovince = await prisma.province.findMany()
    return Response.json(getprovince)
}