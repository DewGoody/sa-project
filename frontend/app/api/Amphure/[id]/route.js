const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();


export async function GET(request, { params }) {
  const id = Number(params.id);
  const getAmphure = await prisma.District.findMany({
    where: {
      province_id: id,
    },
  });
  return new Response(JSON.stringify(getAmphure), {
    headers: { 'Content-Type': 'application/json' },
  });
}