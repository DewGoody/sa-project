import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createStudentLoanData(data) {
    const createRequest = await prisma.request.create({
        data: {
            type: "กองทุนเงินให้กู้ยืมเพื่อการศึกษา (กยศ.)",
            status: "รอจองคิว",
            stu_id: data.stu_id,
        }
    })    
    // const createStudentLoan = await prisma.ponpan.create({
    //     data: {
    //         req_id: createRequest.id,
    //     }

        
    // })
    return createRequest
}