import { createPdfPrakan, getPrakanDataById } from '../../../service/prakanInterService';

export async function POST(req) {
  try {
    const { form } = await req.json();
    const pdfBuffer = await createPdfPrakan(form); // return a Buffer or Uint8Array
    const data = await getPrakanDataById(form)

    const filename = `${data.Student.id}_Health_claim_form.pdf`;

    console.log("Buffer?", Buffer.isBuffer(pdfBuffer)); // Should log true
    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="Health_claim_form.pdf"`,
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}