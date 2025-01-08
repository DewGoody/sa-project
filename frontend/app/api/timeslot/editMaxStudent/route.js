import { updateTimeslotMaxStu } from '../../../service/timeslotService'
import { NextResponse } from "next/server"
import { convertBigIntToString} from '../../../../utills/convertBigInt'

export async function POST(req, res) {
    try {
        let data = await req.json()
        const updatedTimeslot = await updateTimeslotMaxStu(data.date, data.maxStu)
        return NextResponse.json({ data: convertBigIntToString(updatedTimeslot) });
    }
    catch (error) {
        console.log(error);
        
        if (!error.code) {
            return NextResponse.json({ error: "Server error" }, { status: 500 });
        }
        return NextResponse.json({ error: error.error?.message }, { status: error.code });
    }
}