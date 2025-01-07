import { NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'
import * as XLSX from "xlsx";

const prisma = new PrismaClient();

export async function POST(req,res){
    try{
        const ponpanData = await prisma.request.findMany({
            where: {
                type: "การผ่อนผันเข้ารับราชการทหาร",
                deleted_at: null
            },
            include: {
              Ponpan: true,
              Student: true,
            },
        });
        console.log(ponpanData[0].Ponpan);
        
        const formattedData = ponpanData.map((item) => ({
            yearBirth: item.Student.bd.getFullYear(),
            studentId: item.Student.id,
            thaiId: item.Student.thai_id,
            degree: item.Ponpan[0].degree,
            yearLevel: item.Ponpan[0].year,
            fName: item.Student.fnameTH,
            lName: item.Student.lnameTH,
            phoneNum: item.Ponpan[0].phone_num,
            fatherName: item.Ponpan[0].father_name,
            motherName: item.Ponpan[0].mother_name,
            sdnineId: item.Ponpan[0].sdnine_id,
            houseNum: item.Ponpan[0].house_num,
            houseMoo: item.Ponpan[0].house_moo,
            subDistrict: item.Ponpan[0].sub_district,
            district: item.Ponpan[0].district,
            province: item.Ponpan[0].province,
            houseNumSd: item.Ponpan[0].house_num_sd,
            houseMooSd: item.Ponpan[0].house_moo_sd,
            subDistrictSd: item.Ponpan[0].subdistrict_sd,
            districtSd: item.Ponpan[0].district_sd,
            provinceSd: item.Ponpan[0].province_sd,
            email: item.Ponpan[0].email,
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