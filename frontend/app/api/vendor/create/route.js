import { NextResponse } from "next/server"
import { convertBigIntToString} from '../../../../utills/convertBigInt'
import {createVendor} from '../../../service/vendorService'

export async function POST(req,res){
    try{
        let data = await req.json()
        const vendorData = await createVendor(data)
        console.log(vendorData);
        
        return NextResponse.json({ data: convertBigIntToString(vendorData) });
        }
        catch(error){      
            console.log(error);
              
            if(!error.code){
                return NextResponse.json({ error: "Server error" }, { status: 500 });
            }
            return NextResponse.json({ error: error.error?.message }, { status: error.code });
        }
}