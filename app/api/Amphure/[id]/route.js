const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const id = Number(params.id);
  const getAmphure = await prisma.District.findMany({
    where: {
      province_id: id,
    },
  });

  // Convert BigInt fields to strings before serializing
  const formattedAmphure = getAmphure.map((amphure) => ({
    ...amphure,
    id: amphure.id.toString(),
    province_id: amphure.province_id ? amphure.province_id.toString() : null,
  }));

  return new Response(JSON.stringify(formattedAmphure), {
    headers: { 'Content-Type': 'application/json' },
  });
}