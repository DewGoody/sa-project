"use client";

import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import { usePathname, useRouter } from "next/navigation";

const Menubar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [selectedKey, setSelectedKey] = useState(pathname || "/Admin/home/0");

    useEffect(() => {
        setSelectedKey(pathname);
    }, [pathname]);

    const logout = () => {
        router.push("/login");
    };

    const menuItems = [
        { key: "/Admin/home/0", label: "จัดการการนัดหมาย" },
        { key: "/Admin/prakan/0", label: "ประกันอุบัติเหตุ" },
        { key: "/Admin/rd/0", label: "การรับสมัครและรายงานตัวนักศึกษาวิชาทหาร" },
        { key: "/Admin/ponpan/0", label: "การขอผ่อนผันการเข้ารับราชการทหาร" },
        { key: "/Admin/goldencard/page/0", label: "บัตรทอง" },
        { key: "/Admin/prakan-inter/0", label: "Health Insurance For Foreigner Student" },
        { key: "/Admin/student-loan/0", label: "กองทุนเงินให้กู้ยืมเพื่อการศึกษา (กยศ.)" },
        { key: "/Admin/vendor/0", label: "แบบคำขอรับเงินผ่านธนาคาร (Vendor)" },
        { key: "/Admin/dashboard/0", label: "สรุปการนัดหมาย" },
        { key: "/Admin/editMaxStudent", label: "จัดการจำนวนผู้เข้ารับบริการ" },
        { key: "/Admin/editServiceDate", label: "เปิด-ปิดวันเวลาให้บริการ" },
        { key: "/Admin/Service_inactive", label: "เปิด-ปิดการให้บริการ" },
        { key: "/Admin/user", label: "จัดการผู้ใช้งาน" },
        
        
    ];

    return (
        <div className="h-screen flex flex-col">
            {/* ✅ หัวเมนู */}
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
                Division of Scholarships & Student
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
            <div className="flex-1 overflow-y-auto">
                <Menu
                    selectedKeys={[selectedKey]}
                    style={{
                        background: "rgb(255,157,210)",
                        marginTop: "20px",
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

            {/* ✅ ปุ่ม Logout ที่อยู่ล่างสุด */}
            <div className="p-4">
                <button
                    className="w-full py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition"
                    onClick={logout}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Menubar;
