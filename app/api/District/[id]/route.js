const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const id = Number(params.id);
  const getSubdistrict = await prisma.Subdistrict.findMany({
    where: {
      amphureId: id,
    },
  });

  // Convert BigInt fields to strings before serializing
  const formattedSubdistrict = getSubdistrict.map((subdistrict) => ({
    ...subdistrict,
    zipCode: subdistrict.zipCode.toString(),
    amphureId: subdistrict.amphureId ? subdistrict.amphureId.toString() : null,
  }));

  return new Response(JSON.stringify(formattedSubdistrict), {
    headers: { 'Content-Type': 'application/json' },
  });
}