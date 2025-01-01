import { PrismaClient } from '@prisma/client';
import { getTimeslotByDate } from '../../../service/timeslotService'
import { NextResponse } from "next/server"
import { convertBigIntToString} from '../../../../utills/convertBigInt'

export async function POST(req, res) {
    try {
        let data = await req.json()
        // console.log("data", data, typeof data.date);
        const timeslot = await getTimeslotByDate(data.date)
        return NextResponse.json({ data: convertBigIntToString(timeslot) });
    }
    catch (error) {
        if (!error.code) {
            return NextResponse.json({ error: "Server error" }, { status: 500 });
        }
        return NextResponse.json({ error: error.error?.message }, { status: error.code });
    }
}