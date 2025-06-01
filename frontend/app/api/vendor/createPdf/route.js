import { createPdfVendor,getDataById } from '../../../service/vendorService';

export async function POST(req) {
  try {
    const { form } = await req.json();
    const pdfBuffer = await createPdfVendor(form); // return a Buffer or Uint8Array
    const data = await getDataById(form)

    const filename = `${data.Student.id}_vendor.pdf`;

    console.log("Buffer?", Buffer.isBuffer(pdfBuffer)); // Should log true
    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="_vendor.pdf"`,
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