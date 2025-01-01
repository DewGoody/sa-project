import { NextResponse } from "next/server"
import { convertBigIntToString} from '../../../../utills/convertBigInt'
import {createPrakan} from '../../../service/prakanService'

export async function POST(req,res){
    try{
        let data = await req.json()
        const prakanData = await createPrakan(data)
        console.log(prakanData);
        
        return NextResponse.json({ data: convertBigIntToString(prakanData) });
        }
        catch(error){      
            console.log(error);
              
            if(!error.code){
                return NextResponse.json({ error: "Server error" }, { status: 500 });
            }
            return NextResponse.json({ error: error.error?.message }, { status: error.code });
        }
}