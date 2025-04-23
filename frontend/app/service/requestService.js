import { PrismaClient } from '@prisma/client';
import { prakan } from '../../document_build/prakan'
import { prakanFormBuilder } from '../../document_build/prakanFormBuilder'

const prisma = new PrismaClient();

export async function getRequestById(id) {
    if (id) {
        const request = await prisma.request.findUnique({
            where: { id: id, deleted_at: null },
            include: {
                accident_info: true,
                Ponpan: true,
                Student: true,
                UHC_request: true,
                RD_info: true,
                prakan_inter_info: true,
                vendor_info: true
            }
        })
        if (request) {
            let result
            if (request.type == "การเบิกจ่ายประกันอุบัติเหตุ") {
                result = {
                    ...request,
                    form: request.accident_info[0].id,
                    path: "prakan"
                }
                return result
            }
            else if (request.type == "การผ่อนผันเข้ารับราชการทหาร") {
                result = {
                    ...request,
                    form: request.Ponpan[0].id,
                    path: "ponpan"
                }
                return result
            }
            else if (request.type == "โครงการหลักประกันสุขภาพถ้วนหน้า") {
                console.log("sdfdsfsdfsdf")
                result = {
                    ...request,
                    form: request.UHC_request[0].id,
                    path: "golden_card"
                }
                return result
            } else if (request.type == "การสมัครนศท.รายใหม่และรายงานตัวนักศึกษาวิชาทหาร") {
                result = {
                    ...request,
                    form: request.RD_info[0].id,
                    path: "rordor"
                }
                return result
            }
            else if (request.type == "Health insurance") {
                result = {
                    ...request,
                    form: request.prakan_inter_info[0].id,
                    path: "prakan-inter"
                }
                return result
            }
            else if (request.type == "แบบคำขอรับเงินผ่านธนาคารสำหรับผู้ขาย") {
                result = {
                    ...request,
                    form: request.vendor_info[0].id,
                    path: "vendor"
                }
                return result
            }
            else if (request.type == "กองทุนเงินให้กู้ยืมเพื่อการศึกษา (กยศ.)"){
                result = {
                    ...request,
                    path: "student-loan"
                }
                return result
            }
               
            // return request
        }
        else {
            return "Not found"
        }
    }
}

export async function getShowRequestNotQueue(data) {
    const requests = await prisma.request.findMany({
      where: {
        // NOT: { Queue: { some: {} } },
        status: {
          in: [
            "รอจองคิว",
            "ยังไม่ได้ Upload เอกสาร",
            "รอเจ้าหน้าที่ดำเนินการ",
            "ขอข้อมูลเพิ่มเติม",
            "ส่งข้อมูลให้ รพ. แล้ว",
            "ย้ายสิทธิ์ไม่สำเร็จ",
            "ย้ายสิทธิ์สำเร็จ",
          ],
          notIn: ["ประวัติการแก้ไข"],
        },
        stu_id: data,
        deleted_at: null,
      },
      include: {
        accident_info: true,
        Ponpan: true,
        UHC_request: true,
        prakan_inter_info: true,
      },
    });
  

    const now = new Date();
    const filteredRequests = [];
  
    for (const req of requests) {
      if (req.status === "ย้ายสิทธิ์ไม่สำเร็จ" && req.created_at) {
        const createdAt = new Date(req.created_at);
        const diffDays = Math.ceil((now - createdAt) / (1000 * 3600 * 24));
  
        if (diffDays > 30) {
          await prisma.request.update({
            where: { id: req.id },
            data: { deleted_at: new Date() ,
                status: "คำขอถูกยกเลิก"
            }, 
          });
          continue;
        }
      }
  
      filteredRequests.push(req);
    }
  
    return filteredRequests.length ? filteredRequests : "Not found";
  }
  


export async function getShowRequestNotQueueGoldenCard(data) {
    const requests = await prisma.request.findMany({
        where: {
            type: "โครงการหลักประกันสุขภาพถ้วนหน้า",
            status: {
                notIn: ["ประวัติการแก้ไข"]
            },
            stu_id: data,
            deleted_at: null
        },
        include: {
            UHC_request: true
        }
    })
    if (requests) {
        return requests
    }
    else {
        return "Not found"
    }
}
export async function getShowRequestRD(data) {
    const requests = await prisma.request.findMany({
        where: {
            type: "การสมัครนศท.รายใหม่และรายงานตัวนักศึกษาวิชาทหาร",
            stu_id: data,
            deleted_at: null
        },
        include: {
            RD_info: true
        }
    })
    if (requests) {
        return requests
    }
    else {
        return "Not found"
    }
}



export async function cancleRequest(id) {
    if (id) {
        const request = await getRequestById(id)
        const changeStatusRequest = await prisma.request.update({
            where: { id: request.id },
            data: { status: "คำขอถูกยกเลิก", deleted_at: new Date() }
        })
        return changeStatusRequest
    }
}

export async function getRequestByIdFast(data) {
    if (data.id) {
        const request = await prisma.request.findUnique({
            where: { id: Number(data.id), deleted_at: null },
        })
        if (request) {
            return request
        }
        else {
            return "Not found"
        }
    }
}

export async function getRequestPrakanInAdmin(year) {
    const startOfYear = new Date(year, 0, 1); // January 1st of the specified year
    const endOfYear = new Date(year + 1, 0, 1);
    let requests = null
    if (year !== 0) {
        requests = await prisma.request.findMany({
            where: {
                status: {
                    notIn: ["คำขอถูกยกเลิก"]
                },
                type: "การเบิกจ่ายประกันอุบัติเหตุ",
                deleted_at: null,
                created_at: {
                    gte: startOfYear, // Greater than or equal to start of year
                    lt: endOfYear, // Less than start of the next year
                },
            },
            orderBy: {
                created_at: 'desc', // or 'asc' for ascending order
            },
            include: {
                Student: {
                    select: {
                        id: true,
                        fnameTH: true,
                        lnameTH: true
                    },
                },
                accident_info: true
            }
        })
    }
    else {
        requests = await prisma.request.findMany({
            where: {
                status: {
                    notIn: ["คำขอถูกยกเลิก"]
                },
                type: "การเบิกจ่ายประกันอุบัติเหตุ",
                deleted_at: null
            },
            orderBy: {
                created_at: 'desc', // or 'asc' for ascending order
            },
            include: {
                Student: {
                    select: {
                        id: true,
                        fnameTH: true,
                        lnameTH: true
                    },
                },
                accident_info: true
            }
        })
    }
    if (requests) {
        return requests
    }
    else {
        return "Not found"
    }
}

export async function changeStatusToWaitBook(id) {
    if (id) {
        const request = await getRequestByIdFast({ id: id })
        const changeStatusRequest = await prisma.request.update({
            where: { id: request.id },
            data: { status: "รอจองคิว" }
        })
        return changeStatusRequest
    }
    else {
        throw { code: 400, error: new Error("Bad Request") }
    }
}

export async function changeStatusToProcess(id) {
    if (id) {
        const request = await getRequestByIdFast({ id: id })
        console.log('request', request);

        if (request.status !== "รอเข้ารับบริการ") {
            throw { code: 400, error: new Error("Bad Request") }
        }
        const changeStatusRequest = await prisma.request.update({
            where: { id: request.id },
            data: { status: "รอเจ้าหน้าที่ดำเนินการ" }
        })
        return changeStatusRequest
    }
    else {
        throw { code: 400, error: new Error("Bad Request") }
    }
}

export async function changeStatusToSended(id) {
    if (id) {
        const request = await getRequestByIdFast({ id: id })
        if (request.status !== "รอเจ้าหน้าที่ดำเนินการ" && request.status !== "ขอข้อมูลเพิ่มเติม") {
            throw { code: 400, error: new Error("Bad Request") }
        }
        const changeStatusRequest = await prisma.request.update({
            where: { id: request.id },
            data: { status: "ส่งเอกสารแล้ว" }
        })
        return changeStatusRequest
    }
    else {
        throw { code: 400, error: new Error("Bad Request") }
    }
}
export async function changeStatusToHospital(id) {
    if (id) {
        const request = await getRequestByIdFast({ id: id })
        if (request.status !== "รอเจ้าหน้าที่ดำเนินการ" && request.status !== "ขอข้อมูลเพิ่มเติม") {
            throw { code: 400, error: new Error("Bad Request") }
        }
        const changeStatusRequest = await prisma.request.update({
            where: { id: request.id },
            data: { status: "ส่งข้อมูลให้ รพ. แล้ว" }
        })
        return changeStatusRequest
    }
    else {
        throw { code: 400, error: new Error("Bad Request") }
    }
}
export async function changeStatusToSucc(id) {
    if (id) {
        const request = await getRequestByIdFast({ id: id })
        if (request.status !== "รอเจ้าหน้าที่ดำเนินการ" && request.status !== "ขอข้อมูลเพิ่มเติม") {
            throw { code: 400, error: new Error("Bad Request") }
        }
        const changeStatusRequest = await prisma.request.update({
            where: { id: request.id },
            data: { status: "เสร็จสิ้น" }
        })
        return changeStatusRequest
    }
    else {
        throw { code: 400, error: new Error("Bad Request") }
    }
}
export async function changeStatusToWantInfo(id) {
    if (id) {
        const request = await getRequestByIdFast({ id: id })
        if (request.status !== "ส่งเอกสารแล้ว" && request.status !== "รอเจ้าหน้าที่ดำเนินการ" && request.status !== "ย้ายสิทธิ์ไม่สำเร็จ") {
            throw { code: 400, error: new Error("Bad Request") }
        }
        const changeStatusRequest = await prisma.request.update({
            where: { id: request.id },
            data: { status: "ขอข้อมูลเพิ่มเติม" }
        })
        return changeStatusRequest
    }
    else {
        throw { code: 400, error: new Error("Bad Request") }
    }
}


export async function changeStatusToAll(ids, status) {
    if (Array.isArray(ids) && ids.length > 0) {
        const changeStatusRequest = await prisma.request.updateMany({
            where: { id: { in: ids } },  // ✅ ใช้ in เพื่ออัปเดตหลาย id
            data: { status: status }
        });
        return changeStatusRequest;
    } else {
        throw { code: 400, error: new Error("Bad Request: No valid IDs provided") };
    }
}


export async function changeStatusToNotApprove(id) {
    if (id) {
        const request = await getRequestByIdFast({ id: id })
        if (request.status !== "ส่งเอกสารแล้ว" && request.status !== "ขอข้อมูลเพิ่มเติม") {
            throw { code: 400, error: new Error("Bad Request") }
        }
        const changeStatusRequest = await prisma.request.update({
            where: { id: request.id },
            data: { status: "ไม่อนุมัติ" }
        })
        return changeStatusRequest
    }
    else {
        throw { code: 400, error: new Error("Bad Request") }
    }
}

export async function changeStatusRecieveDoc(id) {
    if (id) {
        const request = await getRequestByIdFast({ id: id })
        if (request.status !== "ส่งเอกสารแล้ว") {
            throw { code: 400, error: new Error("Bad Request") }
        }
        const changeStatusRequest = await prisma.request.update({
            where: { id: request.id },
            data: { status: "ติดต่อรับเอกสาร" }
        })
        return changeStatusRequest
    }
    else {
        throw { code: 400, error: new Error("Bad Request") }
    }
}

export async function changeStatusFinishRecieve(id) {
    if (id) {
        const request = await getRequestByIdFast({ id: id })
        if (request.status !== "ติดต่อรับเอกสาร") {
            throw { code: 400, error: new Error("Bad Request") }
        }
        const changeStatusRequest = await prisma.request.update({
            where: { id: request.id },
            data: { status: "รับเอกสารเรียบร้อย" }
        })
        return changeStatusRequest
    }
    else {
        throw { code: 400, error: new Error("Bad Request") }
    }
}

export async function changeStatusToFinish(id) {
    if (id) {
        const request = await getRequestByIdFast({ id: id })
        if (request.status !== "ส่งเอกสารแล้ว" && request.status !== "ขอข้อมูลเพิ่มเติม") {
            throw { code: 400, error: new Error("Bad Request") }
        }
        const changeStatusRequest = await prisma.request.update({
            where: { id: request.id },
            data: { status: "โอนเงินเรียบร้อย" }
        })
        return changeStatusRequest
    }
    else {
        throw { code: 400, error: new Error("Bad Request") }
    }
}
export async function changeToTranApprove(id) {
    if (id) {
        const request = await getRequestByIdFast({ id: id })
        if (request.status !== "ส่งข้อมูลให้ รพ. แล้ว" && request.status !== "ขอข้อมูลเพิ่มเติม" && request.status !== "ย้ายสิทธิ์ไม่สำเร็จ") {
            throw { code: 400, error: new Error("Bad Request") }
        }
        const changeStatusRequest = await prisma.request.update({
            where: { id: request.id },
            data: { status: "ย้ายสิทธิ์สำเร็จ" }
        })
        return changeStatusRequest
    }
    else {
        throw { code: 400, error: new Error("Bad Request") }
    }
}
export async function changeToTranNotApprove(id) {
    if (id) {
        const request = await getRequestByIdFast({ id: id })
        if (request.status !== "ส่งข้อมูลให้ รพ. แล้ว" && request.status !== "ขอข้อมูลเพิ่มเติม") {
            throw { code: 400, error: new Error("Bad Request") }
        }
        const changeStatusRequest = await prisma.request.update({
            where: { id: request.id },
            data: { status: "ย้ายสิทธิ์ไม่สำเร็จ" }
        })
        return changeStatusRequest
    }
    else {
        throw { code: 400, error: new Error("Bad Request") }
    }
}

export async function downloadPrakanAdmin(id) {
    if (id) {
        const thisPrakan = await prisma.accident_info.findUnique({
            where: { id: id },
            include: {
                Student: true
            }
        })
        const mergedData = {
            ...thisPrakan,
            ...thisPrakan.Student, // Spread the `Student` object into the main object
        };
        const filePath = await prakan(mergedData)
        console.log('fileeee', filePath);

        return filePath
    }
    else {
        throw { code: 400, error: new Error("Bad Request") }
    }
}


export async function getUniqueYearPrakan() {
    const requests = await prisma.request.findMany({
        where: {
            type: "การเบิกจ่ายประกันอุบัติเหตุ",
            deleted_at: null
        },
        select: {
            created_at: true,
        },
    });

    // Extract unique years
    const uniqueYears = Array.from(
        new Set(requests.map((request) => request.created_at.getFullYear()))
    );

    return uniqueYears;
}

export async function getRequestPonpanInAdmin(year) {
    const startOfYear = new Date(year, 0, 1); // January 1st of the specified year
    const endOfYear = new Date(year + 1, 0, 1);
    let requests = null
    if (year !== 0) {
        requests = await prisma.request.findMany({
            where: {
                status: {
                    notIn: ["คำขอถูกยกเลิก"]
                },
                type: "การผ่อนผันเข้ารับราชการทหาร",
                deleted_at: null,
                created_at: {
                    gte: startOfYear, // Greater than or equal to start of year
                    lt: endOfYear, // Less than start of the next year
                },
            },
            orderBy: {
                created_at: 'desc', // or 'asc' for ascending order
            },
            include: {
                Student: {
                    select: {
                        id: true,
                        fnameTH: true,
                        lnameTH: true,
                        thai_id: true,
                        bd: true
                    },
                },
                Ponpan: true
            }
        })
    }
    else {
        requests = await prisma.request.findMany({
            where: {
                status: {
                    notIn: ["คำขอถูกยกเลิก"]
                },
                type: "การผ่อนผันเข้ารับราชการทหาร",
                deleted_at: null
            },
            orderBy: {
                created_at: 'desc', // or 'asc' for ascending order
            },
            include: {
                Student: {
                    select: {
                        id: true,
                        fnameTH: true,
                        lnameTH: true,
                        thai_id: true,
                        bd: true
                    },
                },
                Ponpan: true
            }
        })
    }
    if (requests) {
        return requests
    }
    else {
        return "Not found"
    }
}

export async function getRequestStudentLoanInAdmin(year) {
    const startOfYear = new Date(year, 0, 1); // January 1st of the specified year
    const endOfYear = new Date(year + 1, 0, 1);
    let requests = null
    if (year !== 0) {
        requests = await prisma.request.findMany({
            where: {
                status: {
                    notIn: ["คำขอถูกยกเลิก", "รอจองคิว"]
                },
                type: "กองทุนเงินให้กู้ยืมเพื่อการศึกษา (กยศ.)",
                deleted_at: null,
                created_at: {
                    gte: startOfYear, // Greater than or equal to start of year
                    lt: endOfYear, // Less than start of the next year
                },
            },
            orderBy: {
                created_at: 'desc', // or 'asc' for ascending order
            },
            include: {
                Student: {
                    select: {
                        id: true,
                        fnameTH: true,
                        lnameTH: true,
                    },
                },
            }
        })
    }
    else {
        requests = await prisma.request.findMany({
            where: {
                status: {
                    notIn: ["คำขอถูกยกเลิก", "รอจองคิว"]
                },
                type: "กองทุนเงินให้กู้ยืมเพื่อการศึกษา (กยศ.)",
                deleted_at: null
            },
            orderBy: {
                created_at: 'desc', // or 'asc' for ascending order
            },
            include: {
                Student: {
                    select: {
                        id: true,
                        fnameTH: true,
                        lnameTH: true,
                    },
                },
            }
        })
    }
    if (requests) {
        return requests
    }
    else {
        return "Not found"
    }
}

export async function getUniqueYearPonpan() {
    const requests = await prisma.request.findMany({
        where: {
            type: "การผ่อนผันเข้ารับราชการทหาร",
            deleted_at: null
        },
        select: {
            created_at: true,
        },
    });

    // Extract unique years
    const uniqueYears = Array.from(
        new Set(requests.map((request) => request.created_at.getFullYear()))
    );

    return uniqueYears;
}
export async function getUniqueYearStudentLoan() {
    const requests = await prisma.request.findMany({
        where: {
            type: "กองทุนเงินให้กู้ยืมเพื่อการศึกษา (กยศ.)",
            deleted_at: null
        },
        select: {
            created_at: true,
        },
    });

    // Extract unique years
    const uniqueYears = Array.from(
        new Set(requests.map((request) => request.created_at.getFullYear()))
    );

    return uniqueYears;
}
export async function getUniqueYearGoldencard() {
    const requests = await prisma.request.findMany({
        where: {
            type: "โครงการหลักประกันสุขภาพถ้วนหน้า",
            deleted_at: null
        },
        select: {
            created_at: true,
        },
    });

    // Extract unique years
    const uniqueYears = Array.from(
        new Set(requests.map((request) => request.created_at.getFullYear()))
    );

    return uniqueYears;
}
export async function getUniqueYearRD() {
    const requests = await prisma.request.findMany({
        where: {
            type: "การสมัครนศท.รายใหม่และรายงานตัวนักศึกษาวิชาทหาร",
            deleted_at: null
        },
        select: {
            created_at: true,
        },
    });

    // Extract unique years
    const uniqueYears = Array.from(
        new Set(requests.map((request) => request.created_at.getFullYear()))
    );

    return uniqueYears;
}

export async function getRequestPrakanInterInAdmin(year) {
    const startOfYear = new Date(year, 0, 1); // January 1st of the specified year
    const endOfYear = new Date(year + 1, 0, 1);
    let requests = null
    if (year !== 0) {
        requests = await prisma.request.findMany({
            where: {
                status: {
                    notIn: ["คำขอถูกยกเลิก", "รอจองคิว"]
                },
                type: "Health insurance",
                deleted_at: null,
                created_at: {
                    gte: startOfYear, // Greater than or equal to start of year
                    lt: endOfYear, // Less than start of the next year
                },
            },
            orderBy: {
                created_at: 'desc', // or 'asc' for ascending order
            },
            include: {
                Student: {
                    select: {
                        id: true,
                        fnameEN: true,
                        lnameEN: true
                    },
                },
                prakan_inter_info: true
            }
        })
    }
    else {
        requests = await prisma.request.findMany({
            where: {
                status: {
                    notIn: ["คำขอถูกยกเลิก", "รอจองคิว"]
                },
                type: "Health insurance",
                deleted_at: null
            },
            orderBy: {
                created_at: 'desc', // or 'asc' for ascending order
            },
            include: {
                Student: {
                    select: {
                        id: true,
                        fnameEN: true,
                        lnameEN: true
                    },
                },
                prakan_inter_info: true
            }
        })
    }
    if (requests) {
        return requests
    }
    else {
        return "Not found"
    }
}

export async function downloadPrakanInterAdmin(id) {
    if (id) {
        const thisPrakan = await prisma.prakan_inter_info.findUnique({
            where: { id: id },
            include: {
                Student: true,
            }
        })
        const mergedData = {
            ...thisPrakan,
            ...thisPrakan.Student,
        };
        const filePath = await prakanFormBuilder(mergedData)
        console.log('fileeee', filePath);

        return filePath
    }
    else {
        throw { code: 400, error: new Error("Bad Request") }
    }
}

export async function createMoreInfo(data) {
    const existingRequest = await prisma.request.findFirst({
        where: {
            id: data.id, // Find the first record where more_info is null
        },
    });
    let request;
    if (existingRequest) {
        request = await prisma.request.update({
            where: {
                id: existingRequest.id,
            },
            data: {
                more_info: data.more_info,
            },
        });
        return request
    }
    else {
        throw { code: 404, error: new Error("Request not found") }
    }
}