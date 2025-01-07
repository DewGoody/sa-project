import { NextResponse } from "next/server"
import { convertBigIntToString} from '../../../../utills/convertBigInt'
import { PrismaClient } from '@prisma/client'
import * as XLSX from "xlsx";

const prisma = new PrismaClient();

export async function POST(req,res){
    try{
        const ponpanData = await prisma.ponpan.findMany({
            include: {
              Request: true,
              Student: true,
            },
        });
        const formattedData = ponpanData.map((item) => ({
            yearBirth: item.Student.bd.getFullYear(),
            studentId: item.Student.id,
            thaiId: item.Student.thai_id,
            degree: item.degree,
            yearLevel: item.year,
            fName: item.Student.fnameTH,
            lName: item.Student.lnameTH,
            phoneNum: item.phone_num,
            fatherName: item.father_name,
            motherName: item.mother_name,
            sdnineId: item.sdnine_id,
            houseNum: item.house_num,
            houseMoo: item.house_moo,
            subDistrict: item.sub_district,
            district: item.district,
            province: item.province,
            houseNumSd: item.house_num_sd,
            houseMooSd: item.house_moo_sd,
            subDistrictSd: item.subdistrict_sd,
            districtSd: item.district_sd,
            provinceSd: item.province_sd,
            email: item.email,
        }));
        const headers = [
            { header: "พ.ศ. เกิด", key: "yearBirth" },
            { header: "เลขประจำตัวนิสิต", key: "studentId" },
            { header: "เลขประจำตัวประชาชน", key: "studentId" },
            { header: "ศึกษาในระดับปริญญา", key: "degree" },
            { header: "ชั้นปีที่", key: "yearLevel" },
            { header: "ชื่อ (ไม่ต้องใส่คำนำหน้า)", key: "fName" },
            { header: "นามสกุล", key: "lName" },
            { header: "เบอร์โทรศัพท์", key: "phoneNum" },
            { header: "ชื่อบิดา (ไม่ต้องใส่คำนำหน้าและนามสกุล)", key: "fatherName" },
            { header: "ชื่อมารดา (ไม่ต้องใส่คำนำหน้าและนามสกุล)", key: "motherName" },
            { header: "ใบสำคัญ สด.9 ที่", key: "sdnineId" },
            { header: "บ้านเลขที่ ตามทะเบียนบ้าน", key: "houseNum" },
            { header: "หมู่ที่ ตามทะเบียนบ้าน", key: "houseMoo" },
            { header: "แขวง/ตำบล ตามทะเบียนบ้าน", key: "subDistrict" },
            { header: "เขต/อำเภอ ตามทะเบียนบ้าน", key: "district" },
            { header: "จังหวัด ตามทะเบียนบ้าน", key: "province" },
            { header: "บ้านเลขที่ ตามสด.9", key: "houseNumSd" },
            { header: "หมู่ที่ ตามสด.9", key: "houseMooSd" },
            { header: "แขวง/ตำบล ตามสด.9", key: "subDistrictSd" },
            { header: "เขต/อำเภอ ตามสด.9", key: "districtSd" },
            { header: "จังหวัด ตามสด.9", key: "provinceSd" },
            { header: "อีเมล", key: "email" },
        ];
        const formattedDataWithHeaders = [
            headers.map((h) => h.header), // Add headers as the first row
            ...formattedData.map((row) => headers.map((h) => row[h.key] || "")), // Map data rows
        ];
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(formattedDataWithHeaders);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Ponpan");
        const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
        return new NextResponse(buffer, {
            headers: {
              "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              "Content-Disposition": 'attachment; filename="exported-file.xlsx"',
            },
          });
        }
        catch(error){      
            console.log(error);
              
            if(!error.code){
                return NextResponse.json({ error: "Server error" }, { status: 500 });
            }
            return NextResponse.json({ error: error.error?.message }, { status: error.code });
        }
}