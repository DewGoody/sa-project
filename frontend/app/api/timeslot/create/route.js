import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server"
import { convertBigIntToString} from '../../../../utills/convertBigInt'

const prisma = new PrismaClient();

export async function POST(req, res) {
    try {
        let data = await req.json()
        console.log("data", data);
        const targetDate = new Date(data.date);

        // const dateArr = data.date.split("/");        
        // const day = parseInt(dateArr[0], 10)+1;
        // const month = parseInt(dateArr[1], 10) - 1;
        // const year = parseInt(dateArr[2], 10);    
        // const dateObject = new Date(year, month, day);
        // console.log("dateObject",dateObject);
        
        const createTimeslot = await prisma.timeslot.create({
            data: {
                date: targetDate,
                period: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                is_full: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
                max_stu: 5
            }
        })
        return NextResponse.json({ data: convertBigIntToString(createTimeslot) });
    }
    catch (error) {
        if (!error.code) {
            return NextResponse.json({ error: "Server error" }, { status: 500 });
        }
        return NextResponse.json({ error: error.error?.message }, { status: error.code });
    }
}