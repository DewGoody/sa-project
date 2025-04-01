"use client";

import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import { useRouter } from "next/navigation";

const Menubar = () => {
    const router = useRouter();
    const [selectedKey, setSelectedKey] = useState("/Admin/home/0");

    useEffect(() => {
        setSelectedKey(window.location.pathname);
    }, []);

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
        
        <Menu
            selectedKeys={[selectedKey]}
            style={{
                background: "rgb(255,157,210)", // ✅ คงสีเดิม
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
    );
};

export default Menubar;
