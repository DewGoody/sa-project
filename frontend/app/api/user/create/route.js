import { NextResponse } from "next/server"
import { convertBigIntToString} from '../../../../utills/convertBigInt'
import {createUser} from '../../../service/userService'

export async function POST(req,res){
    try{
        let data = await req.json()
        const user = await createUser(data)
        console.log(user);
        
        return NextResponse.json({ data: convertBigIntToString(user) });
        }
        catch(error){      
            console.log(error);
              
            if(!error.code){
                return NextResponse.json({ error: "Server error" }, { status: 500 });
            }
            return NextResponse.json({ error: error.error?.message }, { status: error.code });
        }
}