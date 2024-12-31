import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server"
import {sendMessageToQueue} from '../../../rabbitmq/send'
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

export async function POST(req,res){
    try{
    let data = await req.json()
    const customUid = nanoid(10);
    data.uid = customUid
    console.log("uid",data);
    await prisma.request.update({
        where: {id: data.reqId},
        data: {status: "กำลังดำเนินการจองคิว"}
    })
    await sendMessageToQueue(data);
    return NextResponse.json({ reqId: data.reqId , uid: customUid});
}
    catch(error){
        if(!error.code){
            return NextResponse.json({ error: "Server error" }, { status: 500 });
        }
        return NextResponse.json({ error: error.error?.message }, { status: error.code });
    }
}