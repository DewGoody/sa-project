import { NextResponse } from "next/server";
import { downloadVendorAdmin } from "../../../service/requestService";

export async function POST(req) {
  try {
    const data = await req.json();
    console.log("Received data:", data);

    // This returns a PDF Buffer, not a file path
    const pdfBuffer = await downloadVendorAdmin(data.id);

    if (!pdfBuffer) {
      return NextResponse.json({ error: "PDF not found" }, { status: 404 });
    }

    // Return the PDF buffer directly as a response
    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${data.stu_id || 'student'}_Health_claim.pdf"`
      }
    });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}