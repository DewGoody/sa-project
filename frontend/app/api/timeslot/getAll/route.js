import { getAllTimeslot } from '../../../service/timeslotService'
import { NextResponse } from "next/server"
import { convertBigIntToString} from '../../../../utills/convertBigInt'

export async function POST(req, res) {
    try {
        // console.log("data", data, typeof data.date);
        const timeslot = await getAllTimeslot()
        return NextResponse.json({ data: convertBigIntToString(timeslot) });
    }
    catch (error) {
        if (!error.code) {
            return NextResponse.json({ error: "Server error" }, { status: 500 });
        }
        return NextResponse.json({ error: error.error?.message }, { status: error.code });
    }
}