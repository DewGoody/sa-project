import { NextResponse } from "next/server"
import { convertBigIntToString} from '../../../../utills/convertBigInt'
import {getServicePeriod} from '../../../service/servicePeriodService'

export async function POST(req,res){
    try{
        const period = await getServicePeriod()
        console.log(period);
        
        return NextResponse.json({ data: convertBigIntToString(period) });
        }
        catch(error){      
            console.log(error);
              
            if(!error.code){
                return NextResponse.json({ error: "Server error" }, { status: 500 });
            }
            return NextResponse.json({ error: error.error?.message }, { status: error.code });
        }
}