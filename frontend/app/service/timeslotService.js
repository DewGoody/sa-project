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
    if(timeslotId){
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
}

export async function addStuToPeriod(periodIndex, timeslotId) {
    if(timeslotId){
        const timeslot = await prisma.timeslot.findUnique({
            where: {id: timeslotId}
        })
        console.log(timeslot.is_full[periodIndex]);
        
        if(timeslot.is_full[periodIndex]){
            throw {code: 409,error: new Error("Timeslot full")}
        }
        const period = timeslot.period
        let newStuInPeriod = period    
        const intStu = parseInt(newStuInPeriod[periodIndex])+1
        newStuInPeriod[periodIndex] = intStu
        const updatedTimeslot = await prisma.timeslot.update({
            where: {id: timeslotId},
            data: {period: newStuInPeriod}
        })
        console.log(updatedTimeslot);    
        if(intStu == timeslot.max_stu){
            let isFull = timeslot.is_full
            isFull[periodIndex] = true
            await prisma.timeslot.update({
                where: {id: timeslotId},
                data: {is_full: isFull}
            })
        }
        return updatedTimeslot
    }
}

export async function   getTimeslotByDate(date) {    
    const targetDate = new Date(date);
    const timeslot = await prisma.timeslot.findUnique({
        where: { date: targetDate }
    })    
    if(timeslot){
        return timeslot
    }
    else{
        throw {code: 404,error: new Error("Timeslot not found")}
    }
}

export async function   getAllTimeslot() {    
    const timeslots = await prisma.timeslot.findMany({
        orderBy: {
          id: 'asc', // 'asc' for ascending order
        },
      }); 
    if(timeslots){
        return timeslots
    }
    else{
        throw {code: 404,error: new Error("Timeslot not found")}
    }
}

export async function delStuInPeriod(periodIndex, timeslotId) {
    if(timeslotId){
        const timeslot = await prisma.timeslot.findUnique({
            where: {id: timeslotId}
        })
        if(timeslot.period[periodIndex] == 0){
            throw {code: 409,error: new Error("Timeslot empty")}
        }
        const period = timeslot.period
        let newStuInPeriod = period    
        const intStu = parseInt(newStuInPeriod[periodIndex])-1
        newStuInPeriod[periodIndex] = intStu
        const updatedTimeslot = await prisma.timeslot.update({
            where: {id: timeslotId},
            data: {period: newStuInPeriod}
        })
        return updatedTimeslot
    }
}