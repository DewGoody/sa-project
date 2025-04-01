"use client";

import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import { usePathname, useRouter } from "next/navigation";

const Menubar = () => {
    const router = useRouter();
    const pathname = usePathname(); // ✅ ใช้ `usePathname()` เพื่อให้แน่ใจว่า Next.js รู้จัก path ปัจจุบัน
    const [selectedKey, setSelectedKey] = useState(pathname || "/Admin/home/0");

    useEffect(() => {
        setSelectedKey(pathname);
    }, [pathname]); // ✅ ทำให้ selectedKey อัปเดตอัตโนมัติเมื่อเปลี่ยนเส้นทาง

    const menuItems = [
        { key: "/Admin/home/0", label: "จัดการการนัดหมาย" },
        { key: "/Admin/prakan/0", label: "ประกันอุบัติเหตุ" },
        { key: "/Admin/ponpan/0", label: "การขอผ่อนผันการเข้ารับราชการทหาร" },
        { key: "/Admin/rd/0", label: "การรับสมัครและรายงานตัวนักศึกษาวิชาทหาร" },
        { key: "/Admin/goldencard/page/0", label: "บัตรทอง" },
        { key: "/Admin/prakan-inter/0", label: "Health Insurance For Foreigner Student" },
        { key: "/Admin/editMaxStudent", label: "จัดการจำนวนผู้เข้ารับบริการ" },
        { key: "/Admin/user", label: "จัดการผู้ใช้งาน" },
        { key: "/Admin/editServiceDate", label: "เปิด-ปิดวันให้บริการ" },
    ];

    return (
        <div>
            {/* ✅ เพิ่มส่วนหัวเมนู */}
            <div className="demo-logo-vertical" />
            <div className="text-center mt-10 ml-3 mr-3">
                <p className="font-mono font-bold text-xl text-white">
                    ฝ่ายทุนการศึกษาและบริการนิสิต
                </p>
                <p className="font-mono font-bold text-xl text-white">
                    สำนักบริหารกิจการนิสิต
                </p>
                <p className="font-mono font-bold text-xl text-white">
                    จุฬาลงกรณ์มหาวิทยาลัย
                </p>
            </div>
            <div className="text-center mt-4 ml-3 mr-3">
                <p className="font-mono font-semibold text-white">
                    Department of Scholarships & Student
                </p>
                <p className="font-mono font-semibold text-white">
                    Services, Office of the Student Affairs,
                </p>
                <p className="font-mono font-semibold text-white">
                    Chulalongkorn University
                </p>
            </div>
            <div className="flex justify-center mt-5">
                <hr className="w-11/12" style={{ borderTop: "5px solid white" }} />
            </div>

            {/* ✅ เมนูหลัก */}
            <Menu
                selectedKeys={[selectedKey]}
                style={{
                    background: "rgb(255,157,210)",
                    marginTop: "20px",
                    height: "100%",
                    borderRight: 0,
                }}
                mode="inline"
                onClick={(e) => {
                    setSelectedKey(e.key);
                    router.push(e.key);
                }}
                items={menuItems.map((item) => ({
                    key: item.key,
                    label: (
                        <span style={{ color: selectedKey === item.key ? "black" : "white" }}>
                            {item.label}
                        </span>
                    ),
                }))}
            />
        </div>
    );
};

export default Menubar;
