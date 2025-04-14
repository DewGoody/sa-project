import { NextResponse } from "next/server"
import { convertBigIntToString} from '../../../../utills/convertBigInt'
import {createStudentLoanData} from '../../../service/studentLoanService'

export async function POST(req,res){
    try{
        let data = await req.json()
        const studentLoan = await createStudentLoanData(data)
        console.log(studentLoan);
        
        return NextResponse.json({ data: convertBigIntToString(studentLoan) });
        }
        catch(error){      
            console.log(error);
              
            if(!error.code){
                return NextResponse.json({ error: "Server error" }, { status: 500 });
            }
            return NextResponse.json({ error: error.error?.message }, { status: error.code });
        }
}