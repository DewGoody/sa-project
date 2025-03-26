'use client';
import Image from "next/image";
import { Header } from '../../../components/Header.js';

export default function StudentLoan() {
  return (
    <>
    <Header req1="กองทุนกู้ยืมเงินเพื่อการศึกษา (กยศ.)" req2="STUDENT LOAN FUND ACT"/>
    <div className="max-w-4xl mx-auto p-6 ">
      {/* Header Section */}
      
      <div className="flex items-center  pl-4 mb-4">
        <h1 className="text-3xl font-bold">กองทุนกู้ยืมเงินเพื่อการศึกษา (กยศ.)</h1>
      </div>
      
      {/* Description */}
      <p className="text-gray-700 mb-4">
        เป็นเงินทุนกู้ยืมจากกองทุนเงินให้กู้ยืมเพื่อการศึกษา (กยศ.) โดยมีคุณสมบัติและหลักเกณฑ์ตามที่กองทุนกำหนด
      </p>
      
      {/* Qualification Section */}
      <h2 className="text-2xl font-bold mb-2">กองทุนได้กำหนดคุณสมบัติของผู้กู้ยืมแบ่งเป็น 4 ลักษณะ ดังนี้</h2>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li><span className="font-semibold">ลักษณะที่ 1:</span> นักเรียนหรือนักศึกษาที่ขาดแคลนทุนทรัพย์</li>
        <li><span className="font-semibold">ลักษณะที่ 2:</span> นักเรียนหรือนักศึกษาที่ศึกษาในสาขาวิชาที่เป็นความต้องการหลัก ซึ่งมีความขัดแย้งของการผลิต กำลังคนและมีความจำเป็นต่อการพัฒนาประเทศ</li>
        <li><span className="font-semibold">ลักษณะที่ 3:</span> นักเรียนหรือนักศึกษาที่ศึกษาในสาขาวิชาขาดแคลน หรือที่กองทุนมุ่งส่งเสริมเป็นพิเศษ</li>
        <li><span className="font-semibold">ลักษณะที่ 4:</span> นักเรียนหรือนักศึกษาที่เรียนดีเพื่อสร้างความเป็นเลิศ โดยให้กู้ในระดับปริญญาโท</li>
      </ul>
      <div className="flex justify-center mt-4">
        <Image 
          src="/kys.jpg" 
          alt="คุณสมบัติของผู้กู้ยืม 4 ลักษณะ"
          width={800} 
          height={1200} 
          className="rounded-lg shadow-lg"
        />
      </div>
      <p className="text-gray-700 mb-4 mt-10">
      สามารถยื่นกู้ได้ทาง Application กยศ. Connect
      </p>
      <h2 className="text-xl font-bold mb-2">
      ดูรายละเอียดเพิ่มเติมได้ที่
      </h2>
     <a href="https://www.studentloan.or.th/" className="text-blue-500">https://www.studentloan.or.th/</a>
     <h2 className="text-xl font-bold mb-2">
     บุคลากรดูแลทุนกู้ยืมเงินเพื่อการศึกษา (กยศ.)
      </h2>
      <p className="text-gray-700 mb-4">
      โทรศัพท์ 081-4533233 (10.00-17.00 น.)
      </p>
    </div>
    </>
    
  );
}
