import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getMaxStuDay() {
    const maxStu = await prisma.max_student.findMany({
        where: {
            date: {
                gte: new Date(),
                lt: new Date(new Date().getFullYear() + 1, 0, 1)}
        },
        orderBy: {
            date: 'asc'
        }
    })
    return maxStu;
}

export async function editMaxStu(data) {    
    const maxStu = await prisma.max_student.update({
        where:{
            date: data.oldDate
        },
        data: {
            date: data.newDate,
            max_stu: parseInt(data.max_stu)
        }
    })
    if(!maxStu){
        return "not found"
    }    
    return maxStu;
}

export async function deleteMaxStu(data) {
    const maxStu = await prisma.max_student.delete({
        where:{
            date: data.date
        }
    })
    return maxStu;
}

export async function getDefaultMaxStu() {
    const maxStu = await prisma.default_max_student.findFirst()
    return maxStu;
}

export async function editDefaultMaxStu(data) {
    const maxStu = await prisma.default_max_student.update({
        where:{
            id: 1
        },
        data: {
            max_stu: parseInt(data.max_stu)
        }
    }) 
    return maxStu;
}