import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getShowRequestById(id) {
    if(id){
        const request = await prisma.request.findUnique({
            where: {id: id}
        })
        if(request){            
            return request
        }
        else{
            return "Not found"
        }
    }
}