import { NextResponse } from "next/server"
import { convertBigIntToString} from '../../../../utills/convertBigInt'
import {getAllUser} from '../../../service/userService'

export async function POST(req,res){
    try{
        let data = await req.json()
        const users = await getAllUser(data)
        console.log(users);
        
        return NextResponse.json({ data: convertBigIntToString(users) });
        }
        catch(error){      
            console.log(error);
              
            if(!error.code){
                return NextResponse.json({ error: "Server error" }, { status: 500 });
            }
            return NextResponse.json({ error: error.error?.message }, { status: error.code });
        }
}