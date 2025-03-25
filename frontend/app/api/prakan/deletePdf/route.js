import { NextResponse } from "next/server"
import { convertBigIntToString} from '../../../../utills/convertBigInt'
import {createPdfPrakan} from '../../../service/prakanService'
const fs = require('fs');
const path = require('path');

export async function POST(req,res){
    try{        
        let data = await req.json()
        const filePath = path.join(process.cwd(), '../frontend/public/documents/accident/'+data.Student.id+'_accident_insurance.pdf');
        console.log("pathhhhh", filePath);
        
        if (fs.existsSync(filePath)) {
            console.log("dellllllllll");
            
            fs.unlinkSync(filePath);
            return NextResponse.json({ data: convertBigIntToString(data), message: 'File deleted' });
        } 
        else {
            return NextResponse.json({ data: convertBigIntToString(data), message: 'File not found' });
        }        
        }
        catch(error){      
            console.log(error);
              
            if(!error.code){
                return NextResponse.json({ error: "Server error" }, { status: 500 });
            }
            return NextResponse.json({ error: error.error?.message }, { status: error.code });
        }
}