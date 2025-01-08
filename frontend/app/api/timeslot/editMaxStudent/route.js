import { updateTimeslotMaxStu } from '../../../service/timeslotService'
import { NextResponse } from "next/server"
import { convertBigIntToString} from '../../../../utills/convertBigInt'

export async function POST(req, res) {
    try {
        let data = await req.json()
        const updatedTimeslot = await updateTimeslotMaxStu(data.id, data.maxStu)
        return NextResponse.json({ data: convertBigIntToString(updatedTimeslot) });
    }
    catch (error) {
        if (!error.code) {
            return res.status(500).json({ message: "Server error" })
        }
        return res.status(error.code).json({ message: error.error?.message })
    }
}