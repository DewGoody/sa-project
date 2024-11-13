import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function updateTimeslotMaxStu(timeslotId, maxStu) {
    const updatedTimeslot = await prisma.timeslot.update({
        where: { id: timeslotId },
        data: { max_stu: maxStu }, 
    });
    return updatedTimeslot
}

export async function getTimeslotById(timeslotId) {
    const timeslot = await prisma.timeslot.findUnique({
        where: { id: timeslotId}
    })
    if(timeslot){
        return timeslot
    }
    else{
        throw {code: 404,error: new Error("Timeslot not found")}
    }
}

export async function addStuToPeriod(periodIndex, timeslotId) {
    const timeslot = await prisma.timeslot.findUnique({
        where: {id: timeslotId}
    })
    const period = timeslot.period
    let newStuInPeriod = period
    newStuInPeriod[periodIndex] += 1
    const updatedTimeslot = await prisma.timeslot.update({
        where: {id: timeslotId},
        data: {period: newStuInPeriod}
    })
    if(newStuInPeriod == timeslot.max_stu){
        let isFull = timeslot.is_full
        isFull[periodIndex] = true
        await prisma.timeslot.update({
            where: {id: timeslotId},
            data: {is_full: isFull}
        })
    }
    return updatedTimeslot
}

export async function getTimeslotByDate(date) {
    const timeslot = await prisma.timeslot.findUnique({
        where: { date: date}
    })
    if(timeslot){
        return timeslot
    }
    else{
        throw {code: 404,error: new Error("Timeslot not found")}
    }
}