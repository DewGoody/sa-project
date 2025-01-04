import { NextResponse } from "next/server"
import { convertBigIntToString} from '../../../../utills/convertBigInt'
import {updatePonpan} from '../../../service/ponpanService'

export async function POST(req,res){
    try{
        let data = await req.json()
        const ponpanData = await updatePonpan(data)
        console.log(ponpanData);
        
        return NextResponse.json({ data: convertBigIntToString(ponpanData) });
        }
        catch(error){      
            console.log(error);
              
            if(!error.code){
                return NextResponse.json({ error: "Server error" }, { status: 500 });
            }
            return NextResponse.json({ error: error.error?.message }, { status: error.code });
        }
}