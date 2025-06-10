'use client'
import React, { use, useEffect, useState } from 'react';
import {
    SearchOutlined,
    DownloadOutlined,
    FilterOutlined,
    OrderedListOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Input, Table, Space, Select, Modal } from 'antd';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import Menubar from '../../component/menu';
import * as XLSX from 'xlsx'; // เพิ่ม XLSX สำหรับ export
import { saveAs } from 'file-saver'; // เพิ่ม FileSaver สำหรับบันทึกไฟล์


const { Header, Sider, Content } = Layout;


const App = () => {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [dataSource, setDataSource] = useState([]);
    const [stuData, setStuData] = useState([]);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [selectedKey, setSelectedKey] = useState('6');
    const [fetchYear, setfetchYear] = useState([]);
    const [statusRequest, setStatusRequest] = useState('');
    const [loading, setLoading] = useState(false);
    const [shouldReload, setShouldReload] = useState(false);
    const [filteredInfo, setFilteredInfo] = useState({});
    // for modal and modal value
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reqMoreInfo, setReqMoreInfo] = useState('');
    const [moreInfoValue, setMoreInfoValue] = useState('');
    const [selectedRowReqid, setSelectedRowReqid] = useState([]);
    const [selectedRowReqidapi, setSelectedRowReqidapi] = useState([]);
    const router = useRouter();
    const { year } = useParams();
    console.log("year", year);
    console.log("fetchYear :", fetchYear);
    console.log("selectedKey", selectedKey);



    const handleEditForm = async (id) => {
        console.log("editFormReqId : ", id);
        const response = await axios.post('/api/request/getById', { id: id }); // Example API
        console.log("editFormResponse :", response.data.data.path);
        router.push(`/student/0/prakan-inter/${response.data.data.form}`);
    }
    const showModal = (record) => {
        setReqMoreInfo(record);
        console.log("recordModalJa :", typeof record);
        setIsModalOpen(true);
    };

    const handleOk = () => {
        const response = axios.post('/api/request/createMoreInfo', { id: parseInt(reqMoreInfo), more_info: moreInfoValue });

        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const exportToExcel = (number) => {
        // กำหนดชื่อ Columns ที่ต้องการ
        const columnHeaders = [
            { header: "ลำดับ", key: "index" },
            { header: "ชื่อ-นามสกุล", key: "name" },
            { header: "รหัสนิสิต", key: "student_ID" },
            { header: "เบอร์โทรนิสิต", key: "tel" },
            { header: "ประเภทการเบิกเงิน", key: "claimType" },
            { header: "สาเหตุการเบิกเงิน (กรณีเลือกอื่นๆ)", key: "claimOtherReason" },
            { header: "จำนวนเงิน", key: "amount" },
            { header: "บัญชีของธนาคาร", key: "bankCompany" },
            { header: "สาขา", key: "bankBranch" },
            { header: "ชื่อบัญชี", key: "bankAccountName" },
            { header: "ประเภทบัญชี", key: "bankAccountType" },
            { header: "เลขที่บัญชี", key: "bankAccountNumber" },
            { header: "บ้านเลขที่", key: "houseID" },
            { header: "หมู่", key: "moo" },
            { header: "อาคาร/หมู่บ้าน", key: "buildingVillage" },
            { header: "ซอย", key: "soi" },
            { header: "ถนน", key: "road" },
            { header: "แขวง/ตำบล", key: "subDistrict" },
            { header: "เขต/อำเภอ", key: "district" },
            { header: "จังหวัด", key: "province" },
            { header: "รหัสไปรษณีย์", key: "postalCode" },
            { header: "โทรศัพท์", key: "tel" },
            { header: "เลขบัตรประชาชน", key: "citizenId" },
            { header: "วันที่ออกบัตร", key: "citizenIssueDate" },
            { header: "วันหมดอายุบัตร", key: "citizenExpireDate" },
            { header: "สถานะ", key: "status" },

        ];

        // เพิ่มชื่อ Columns เข้าไปเป็น Row แรก
        let dataWithHeaders = []
        if (number == 0) {
            dataWithHeaders = [
                columnHeaders.map(col => col.header), // แถวแรกเป็นหัวตาราง
                ...dataSource.map((item, index) =>
                    columnHeaders.map(col => col.key === "index" ? index + 1 : item[col.key] || '') // Auto Running Number
                )
            ];
        }
        else {
            dataWithHeaders = [
                columnHeaders.map(col => col.header), // แถวแรกเป็นหัวตาราง
                ...selectedRowReqid.map((item, index) =>
                    columnHeaders.map(col => col.key === "index" ? index + 1 : item[col.key] || '') // Auto Running Number
                )
            ];
        }


        // สร้าง Worksheet ด้วยข้อมูลที่มี Header
        const worksheet = XLSX.utils.aoa_to_sheet(dataWithHeaders);
        worksheet['!cols'] = columnHeaders.map(col => {
            return { wch: col.header.length + 8 }; // ปรับขนาดตามความยาว header + padding
        });

        // สร้าง Workbook และเพิ่ม Worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

        // เขียนไฟล์ Excel และดาวน์โหลด
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "exported_data.xlsx");
    };

    const fetchStuData = async () => {
        try {
            const res = await axios.post('/api/request/getVendorAdmin', { year: parseInt(year) });
            console.log("stuData", res.data.data);
            setStuData(res.data.data);
            if (!Array.isArray(res.data.data)) {
                console.warn("Expected array but got:", res.data.data);
            }

            const formatted = res.data.data.map((data, index) => {
                const formatDate = (dateString) => {
                    const date = new Date(dateString);
                    if (isNaN(date)) return "-";
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    return `${day}/${month}/${year}`;
                };

                const vendor = data.vendor_info?.[0] || {};

                return {
                    key: index,
                    id: data.id || "-",
                    reqId: data.reqId,
                    name: (vendor.titleTH) + (data.Student?.fnameTH || "") + " " + (data.Student?.lnameTH || "-"),
                    student_ID: data.Student?.id || "-",
                    nameTH: vendor.nameTH || "-",
                    faculty: vendor.faculty || "-",
                    houseID: vendor.houseID || "-",
                    moo: vendor.moo || "-",
                    buildingVillage: vendor.buildingVillage || "-",
                    soi: vendor.soi || "-",
                    road: vendor.road || "-",
                    subDistrict: vendor.subDistrict || "-",
                    district: vendor.district || "-",
                    province: vendor.province || "-",
                    postalCode: vendor.postalCode || "-",
                    tel: vendor.tel || "-",
                    citizenId: vendor.citizenId || "-",
                    citizenIssueDate: vendor.citizenIssueDate ? formatDate(vendor.citizenIssueDate) : "-",
                    citizenExpireDate: vendor.citizenExpireDate ? formatDate(vendor.citizenExpireDate) : "-",
                    claimType: vendor.claimType || "-",
                    claimOtherReason: vendor.claimOtherReason || "-",
                    amount: vendor.amount || "-",
                    bankCompany: vendor.bankCompany || "-",
                    bankBranch: vendor.bankBranch || "-",
                    bankAccountType: vendor.bankAccountType || "-",
                    bankAccountName: vendor.bankAccountName || "-",
                    bankAccountNumber: vendor.bankAccountNumber || "-",
                    stu_id: vendor.stu_id || "-",
                    status: data.status || "-",
                    vendorId: vendor.id
                };
            });

            setDataSource(formatted);
        } catch (error) {
            console.error('Error fetching student data:', error);
        }
    }

    const fetchUniqueYear = async () => {
        try {
            const res = await axios.post('/api/request/getUniqueYearPrakan');
            setfetchYear(res.data.data);
        }
        catch (error) {
            console.error('Error fetching unique year:', error);
        }
    }

    useEffect(() => {
        fetchStuData()
    }, [])

    useEffect(() => {
        fetchUniqueYear()
    }, [])

    useEffect(() => {
        console.log("Data Source", dataSource)
    }, [dataSource])


    console.log("statusRequest", statusRequest);


    console.log("dataSource", dataSource);

    const handleYearChange = async (year) => {
        console.log("year", year);
        router.push(`/Admin/prakan/${year}`);
    }

    const handleDownload = async (record) => {
        try {
            const res = await axios.post(
                '/api/request/downloadVendor',
                { id: parseInt(record.vendorId), stu_id: record.stu_id || "-" },
                { responseType: 'blob' }
            );
            console.log("resDownload", res);
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${record.stu_id || "-"}_vendor.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            console.log("download", res);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };


    const handleChangeStatus = async (record) => {
        setStatusRequest(record.status);
        console.log("record", record);

        try {
            setLoading(true);

            const res = await axios.post('/api/request/changeStatusVendor', {
                id: parseInt(record.id),
                newStatus: record.status
            });

            console.log("Status change response:", res);

            // Update the dataSource state instead of reloading
            setDataSource(prevDataSource =>
                prevDataSource.map(item =>
                    item.reqId === record.reqId
                        ? { ...item, status: record.status }
                        : item
                )
            );

            setLoading(false);

        } catch (error) {
            console.error('Error fetching status:', error);
            setLoading(false);
        }
    }
    const handleSearch = (value, dataIndex) => {
        setSearchText(value);
        setSearchedColumn(dataIndex);
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, confirm }) => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder={`Search ${dataIndex}`}
                    value={searchText}
                    onChange={(e) => {
                        const value = e.target.value;
                        setSelectedKeys(value ? [value] : []);
                        handleSearch(value, dataIndex);
                        confirm({ closeDropdown: false }); // Keep the dropdown open
                    }}
                    style={{ marginBottom: 8, display: "block" }}
                />
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: "white", fontSize: "18px" }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ?.toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        render: (text) =>
            searchedColumn === dataIndex ? (
                <span style={{ backgroundColor: "#ffc069", padding: "0 4px" }}>
                    {text}
                </span>
            ) : (
                text
            ),
    });


    const columns = [

        {
            align: 'right', // เพิ่ม align ขวา
            title: 'ดาวน์โหลด',
            render: (_, record) => (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%', // Optional: ensures full height centering within the parent
                    }}
                >
                    <DownloadOutlined
                        style={{
                            fontSize: '21px', // Increase the size (e.g., 24px)
                            cursor: 'pointer', // Optional: changes the cursor to a pointer
                        }}
                        onClick={() => handleDownload(record)}
                    />
                </div>
            ),
        },
        {
            title: 'สถานะ',
            dataIndex: 'status',
            width: 200,

            render: (status, record) => {
                let options = [];
                if (status === 'รอเข้ารับบริการ') {
                    options = [
                        { value: 'รอนิสิตส่งเอกสาร', label: 'รอนิสิตส่งเอกสาร', style: { color: 'black' }, },
                        { value: 'รับเอกสารแล้ว', label: 'รับเอกสารแล้ว', style: { color: 'gray' }, disabled: true },
                        { value: 'เจ้าหน้าที่จัดทำข้อมูล', label: 'เจ้าหน้าที่จัดทำข้อมูล', style: { color: 'gray' }, disabled: true },
                        { value: 'ไม่อนุมัติ', label: 'ไม่อนุมัติ', style: { color: 'gray' }, disabled: true },
                        { value: 'ส่งเอกสารให้การเงินแล้ว', label: 'ส่งเอกสารให้การเงินแล้ว', style: { color: 'gray' }, disabled: true },
                    ];
                } else if (status === 'รอนิสิตส่งเอกสาร') {
                    options = [
                        { value: 'รอนิสิตส่งเอกสาร', label: 'รอนิสิตส่งเอกสาร', style: { color: 'gray' }, disabled: true },
                        { value: 'รับเอกสารแล้ว', label: 'รับเอกสารแล้ว', style: { color: 'black' } },
                        { value: 'เจ้าหน้าที่จัดทำข้อมูล', label: 'เจ้าหน้าที่จัดทำข้อมูล', style: { color: 'gray' }, disabled: true },
                        { value: 'ไม่อนุมัติ', label: 'ไม่อนุมัติ', style: { color: 'gray' }, disabled: true },
                        { value: 'ส่งเอกสารให้การเงินแล้ว', label: 'ส่งเอกสารให้การเงินแล้ว', style: { color: 'gray' }, disabled: true },
                    ];
                } else if (status === 'รับเอกสารแล้ว') {
                    options = [
                        { value: 'รอนิสิตส่งเอกสาร', label: 'รอนิสิตส่งเอกสาร', style: { color: 'gray' }, disabled: true },
                        { value: 'รับเอกสารแล้ว', label: 'รับเอกสารแล้ว', style: { color: 'gray' }, disabled: true },
                        { value: 'เจ้าหน้าที่จัดทำข้อมูล', label: 'เจ้าหน้าที่จัดทำข้อมูล', style: { color: 'black' } },
                        { value: 'ไม่อนุมัติ', label: 'ไม่อนุมัติ', style: { color: 'gray' }, disabled: true },
                        { value: 'ส่งเอกสารให้การเงินแล้ว', label: 'ส่งเอกสารให้การเงินแล้ว', style: { color: 'gray' }, disabled: true },
                    ];
                }
                else if (status === 'เจ้าหน้าที่จัดทำข้อมูล') {
                    options = [
                        { value: 'รอนิสิตส่งเอกสาร', label: 'รอนิสิตส่งเอกสาร', style: { color: 'gray' }, disabled: true },
                        { value: 'รับเอกสารแล้ว', label: 'รับเอกสารแล้ว', style: { color: 'gray' }, disabled: true },
                        { value: 'เจ้าหน้าที่จัดทำข้อมูล', label: 'เจ้าหน้าที่จัดทำข้อมูล', style: { color: 'black' }, disabled: true },
                        { value: 'ไม่อนุมัติ', label: 'ไม่อนุมัติ', style: { color: 'black' } },
                        { value: 'ส่งเอกสารให้การเงินแล้ว', label: 'ส่งเอกสารให้การเงินแล้ว', style: { color: 'black' } },
                    ];
                } else if (status === 'ไม่อนุมัติ') {
                    options = [
                        { value: 'รอนิสิตส่งเอกสาร', label: 'รอนิสิตส่งเอกสาร', style: { color: 'gray' }, disabled: true },
                        { value: 'รับเอกสารแล้ว', label: 'รับเอกสารแล้ว', style: { color: 'gray' }, disabled: true },
                        { value: 'เจ้าหน้าที่จัดทำข้อมูล', label: 'เจ้าหน้าที่จัดทำข้อมูล', style: { color: 'gray' }, disabled: true },
                        { value: 'ไม่อนุมัติ', label: 'ไม่อนุมัติ', style: { color: 'gray' }, disabled: true },
                        { value: 'ส่งเอกสารให้การเงินแล้ว', label: 'ส่งเอกสารให้การเงินแล้ว', style: { color: 'gray' }, disabled: true },
                    ];
                }
                else if (status === 'ส่งเอกสารให้การเงินแล้ว') {
                    options = [
                        { value: 'รอนิสิตส่งเอกสาร', label: 'รอนิสิตส่งเอกสาร', style: { color: 'gray' }, disabled: true },
                        { value: 'รับเอกสารแล้ว', label: 'รับเอกสารแล้ว', style: { color: 'gray' }, disabled: true },
                        { value: 'เจ้าหน้าที่จัดทำข้อมูล', label: 'เจ้าหน้าที่จัดทำข้อมูล', style: { color: 'gray' }, disabled: true },
                        { value: 'ไม่อนุมัติ', label: 'ไม่อนุมัติ', style: { color: 'gray' }, disabled: true },
                        { value: 'ส่งเอกสารให้การเงินแล้ว', label: 'ส่งเอกสารให้การเงินแล้ว', style: { color: 'gray' }, disabled: true },
                    ];
                }
                return (
                    <>
                        <Select
                            defaultValue={record.status}
                            style={{ width: "180px" }}
                            options={options}
                            onChange={(value) => handleChangeStatus({ ...record, status: value })}
                        />

                        {record.status === "ขอข้อมูลเพิ่มเติม" ?
                            <Button type="primary" style={{ marginLeft: "10px" }} onClick={() => showModal(record.reqId)}>เขียนรายละเอียด</Button>
                            : null}

                    </>


                );
            },
            filters: [
                { text: "รอเข้ารับบริการ", value: "รอเข้ารับบริการ" },
                { text: "รอนิสิตส่งเอกสาร", value: "รอนิสิตส่งเอกสาร" },
                { text: "รับเอกสารแล้ว", value: "รับเอกสารแล้ว" },
                { text: "เจ้าหน้าที่จัดทำข้อมูล", value: "เจ้าหน้าที่จัดทำข้อมูล" },
                { text: "ไม่อนุมัติ", value: "ไม่อนุมัติ" },
                { text: "ส่งเอกสารให้การเงินแล้ว", value: "ส่งเอกสารให้การเงินแล้ว" },
            ],
            filteredValue: filteredInfo?.status,
            onFilter: (value, record) => record?.status.includes(value),
            ellipsis: true,
            filterIcon: (filtered) => (
                <div>
                    <FilterOutlined style={{ color: "white", fontSize: "18px" }} />
                </div>
            ),
        },
        {
            title: 'ชื่อ-นามสกุล',
            dataIndex: 'name',
            width: 200,
            ...getColumnSearchProps('name'),
        },
        {
            title: 'รหัสนิสิต',
            dataIndex: 'student_ID',
            ...getColumnSearchProps('student_ID'),
            width: 125,
        },
        {
            title: 'เบอร์โทรนิสิต',
            dataIndex: 'tel',
            width: 150,
        },
        {
            title: 'ประเภทการเบิกเงิน',
            dataIndex: 'claimType',
            width: 200,

            filters: [
                { text: "ค่าจ้างนิสิตทำงานพิเศษ", value: "ค่าจ้างนิสิตทำงานพิเศษ" },
                { text: "ค่าเล่าเรียน", value: "ค่าเล่าเรียน" },
                { text: "ค่าธรรมเนียมการศึกษา", value: "ค่าธรรมเนียมการศึกษา" },
                { text: "เงินสมทบค่ารักษาพยาบาล", value: "เงินสมทบค่ารักษาพยาบาล" },
                { text: "เงินช่วยเหลือนิสิตรักษาต่อเนื่อง/ทุพพลภาพ", value: "เงินช่วยเหลือนิสิตรักษาต่อเนื่อง/ทุพพลภาพ" },
                { text: "อื่นๆ (ระบุ)", value: "อื่นๆ (ระบุ)" },
            ],
            filteredValue: filteredInfo?.claimType,
            onFilter: (value, record) => record?.claimType.includes(value),
            ellipsis: true,
            filterIcon: (filtered) => (
                <div>
                    <FilterOutlined style={{ color: "white", fontSize: "18px" }} />
                </div>
            ),

        },
        {
            title: 'สาเหตุการเบิกเงิน (กรณีเลือกอื่นๆ)',
            dataIndex: 'claimOtherReason',
            width: 250,

        },
        {
            title: 'จำนวนเงิน',
            dataIndex: 'amount',
            render: (text) => {
                const number = parseFloat(text.replace(/[^\d.-]/g, ''));
                return number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' บาท';
            },
            width: 135,
        },
        {
            title: 'บัญชีของธนาคาร',
            dataIndex: 'bankCompany',
            width: 150,

        },
        {
            title: 'สาขา',
            dataIndex: 'bankBranch',
            width: 150,

        },
        {
            title: 'ชื่อบัญชี',
            dataIndex: 'bankAccountName',
            width: 200,

        },
        {
            title: 'ประเภทบัญชี',
            dataIndex: 'bankAccountType',
            width: 150,

        },
        {
            title: 'เลขที่บัญชี',
            dataIndex: 'bankAccountNumber',
            width: 150,

        },
        {
            title: 'บ้านเลขที่',
            dataIndex: 'houseID',
            width: 120,

        },
        {
            title: 'หมู่',
            dataIndex: 'moo',
            width: 80,

        },
        {
            title: 'อาคาร/หมู่บ้าน',
            dataIndex: 'buildingVillage',
            width: 150,

        },
        {
            title: 'ซอย',
            dataIndex: 'soi',
            width: 120,

        },
        {
            title: 'ถนน',
            dataIndex: 'road',
            width: 120,

        },
        {
            title: 'แขวง/ตำบล',
            dataIndex: 'subDistrict',
            width: 150,

        },
        {
            title: 'เขต/อำเภอ',
            dataIndex: 'district',
            width: 150,

        },
        {
            title: 'จังหวัด',
            dataIndex: 'province',
            width: 120,

        },
        {
            title: 'รหัสไปรษณีย์',
            dataIndex: 'postalCode',
            width: 130,

        },
        {
            title: 'โทรศัพท์',
            dataIndex: 'tel',
            width: 120,

        },
        {
            title: 'เลขบัตรประชาชน',
            dataIndex: 'citizenId',
            width: 160,

        },


        {
            title: 'วันที่ออกบัตร',
            dataIndex: 'citizenIssueDate',
            width: 150,
            sorter: (a, b) => {
                const dateA = new Date(a.accidentDate.split('/').reverse().join('-'));
                const dateB = new Date(b.accidentDate.split('/').reverse().join('-'));
                return dateA - dateB;
            },
            sortIcon: (sorted) => (
                <div>
                    <OrderedListOutlined style={{ color: "white", fontSize: "18px" }} />
                </div>
            ),
        },
        {
            title: 'วันหมดอายุบัตร',
            dataIndex: 'citizenExpireDate',
            width: 150,
            sorter: (a, b) => {
                const dateA = new Date(a.accidentDate.split('/').reverse().join('-'));
                const dateB = new Date(b.accidentDate.split('/').reverse().join('-'));
                return dateA - dateB;
            },
            sortIcon: (sorted) => (
                <div>
                    <OrderedListOutlined style={{ color: "white", fontSize: "18px" }} />
                </div>
            ),
        },




    ];



    return (
        <Layout style={{ height: "100vh" }}>
            <Sider trigger={null} width={320} style={{ background: "rgb(255,157,210)" }}>
                <Menubar />
            </Sider>
            <Layout style={{ background: "rgb(255,157,210)" }}>
                <Content
                    style={{
                        padding: 24,
                        minHeight: 280,
                        background: "white",
                        // borderTopLeftRadius: '20px',  // โค้งเฉพาะมุมบนซ้าย
                        // borderBottomLeftRadius: '20px', // โค้งเฉพาะมุมล่างซ้าย
                    }}
                >
                    <div className='flex mb-5 justify-between'>
                        <div className='font-extrabold text-3xl'>
                            แบบคำขอรับเงินผ่านธนาคาร (Vendor)
                        </div>
                    </div>
                    <div className='flex mt-12'>
                        <div className='mt-2 ml-3 font-normal text-base'>
                            เลือกปีการศึกษา
                        </div>
                        <div className='mt-1 mb-6 px-4'>
                            <Select
                                defaultValue={year}
                                value={year === '0' ? 'ทั้งหมด' : year}
                                style={{ width: 120, marginLeft: 10 }}
                                onChange={handleYearChange}
                            >
                                <Select.Option value={0}>ทั้งหมด</Select.Option>
                                {fetchYear.map((year) => (
                                    <Select.Option key={year} value={year}>{year}</Select.Option>
                                ))}
                            </Select>
                        </div>
                        {/*}
                        {selectedRowReqid.length > 0 ? (
                            <>
                                <Button className="mt-1 mb-6 px-4" type="primary" onClick={() => exportToExcel("1")} style={{ marginBottom: '16px' }}>
                                    Export Excel ที่เลือกไว้
                                </Button>
                                {dropdown()}
                            </>
                        ) : (
                            <>
                                <Button className="mt-1 mb-6 px-4" type="primary" onClick={() => exportToExcel("0")} style={{ marginBottom: '16px' }}>
                                    Export Excel ทั้งหมด
                                </Button>
                            </>
                        )}
                        */}


                    </div>

                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        style={{ borderRadius: borderRadiusLG }}
                        scroll={{ x: 'max-content' }}
                        bordered

                    />
                    <Modal
                        title="เขียนรายละเอียดขอข้อมูลเพิ่มเติม"
                        open={isModalOpen}
                        onOk={handleOk}
                        loading={loading}
                        onCancel={handleCancel}
                        footer={[
                            <Button key="back" onClick={handleCancel}>
                                ปิด
                            </Button>,
                            <Button key="submit" type="primary" onClick={handleOk}>
                                ยืนยัน
                            </Button>,

                        ]}
                    >
                        <textarea
                            style={{ width: "100%", height: "200px", border: "gray solid", borderRadius: "15px", padding: "15px", fontSize: "18px" }}

                            onChange={(e) => setMoreInfoValue(e.target.value)}
                        >
                        </textarea>
                    </Modal>
                </Content>
            </Layout>
        </Layout>
    );
};
export default App;