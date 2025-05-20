import { PrismaClient } from '@prisma/client';
import {downloadPrakanAdmin} from '../../../service/requestService'
import { NextResponse } from "next/server"
import { convertBigIntToString} from '../../../../utills/convertBigInt'
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function POST(req,res){
    try{
    let data = await req.json()
    console.log(data);
    
    const filePath = await downloadPrakanAdmin(data.id)        
    
    // const fileBuffer = fs.readFileSync(filePath);

    // Set the response headers for file download
    // return new Response(fileBuffer, {
    //     status: 200,
    //     headers: {
    //       'Content-Type': 'application/pdf',
    //       'Content-Disposition': `attachment; filename="prakanformfilled.pdf"`,
    //     },
    //   });
    return NextResponse.json({ data: convertBigIntToString(filePath) });
    }
    catch(error){        
        console.log(error);
        
        if(!error.code){
            return NextResponse.json({ error: "Server error" }, { status: 500 });
        }
        return NextResponse.json({ error: error.error?.message }, { status: error.code });
    }
}