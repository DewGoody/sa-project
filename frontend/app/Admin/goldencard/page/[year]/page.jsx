'use client'
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx'; // เพิ่ม XLSX สำหรับ export
import { saveAs } from 'file-saver'; // เพิ่ม FileSaver สำหรับบันทึกไฟล์
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import {
    SearchOutlined,
    DownloadOutlined,
    FilterOutlined,
    OrderedListOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Input, Table, Divider, Radio, Space, Modal, Select } from 'antd';



const { Header, Sider, Content } = Layout;
const App = () => {
    const router = useRouter()
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reqMoreInfo, setReqMoreInfo] = useState('');
    const [moreInfoValue, setMoreInfoValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [shouldReload, setShouldReload] = useState(false);
    const [filteredInfo, setFilteredInfo] = useState({});
    const [fetchYear, setfetchYear] = useState([]);

    const { year } = useParams();
    console.log("year", year);
    console.log("fetchYear :", fetchYear);


    useEffect(() => {
        if (shouldReload) {
            setTimeout(() => window.location.reload(), 1000);
        }
    }, [shouldReload]);

    const fetchUniqueYear = async () => {
        try {
            const res = await axios.post('/api/Admin/getyeargoldencard');
            setfetchYear(res.data.data);
        }
        catch (error) {
            console.error('Error fetching unique year:', error);
        }
    }
    const handleYearChange = async (year) => {
        console.log("year", year);
        router.push(`/Admin/goldencard/page/${year}`);
    }


    async function fetchPdfFile(form) {
        try {
            const response = await fetch(`/api/POSTPDF/getpdfadmin?id=${form}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const data = await response.json();
            if (data.binary_file_data) {
                const byteCharacters = atob(data.binary_file_data);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `student_${form}_file.zip`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                alert('No file data found.');
            }
        } catch (error) {
            console.error('Error fetching file:', error);
        }
    }
    async function fetchZipFile(form, stu_id) {
        try {
            const response = await fetch(`/api/POSTPDF/getpdfadmin?id=${form}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${stu_id}_บัตรทอง.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error fetching ZIP file:', error);
        }
    }

    const showModal = (record) => {
        setReqMoreInfo(record);

        console.log("recordModalJa :", record);

        setIsModalOpen(true);
    };

    const handleOk = () => {
        const response = axios.post('/api/request/createMoreInfo', { id: parseInt(reqMoreInfo), more_info: moreInfoValue });

        setIsModalOpen(false);
    };

   
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const formatDateToDMY = (dateString) => {
        if (!dateString) return 'N/A'; // Handle null or undefined dates

        const date = new Date(dateString); // Parse the input date string
        console.log("fdsfdsfdsf", date);

        const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits for day
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear(); // Get the full year

        return `${day}/${month}/${year + 543}`; // Return in dd/mm/yyyy format
    };
    const formatDateToDMYWithTime = (dateString) => {
        if (!dateString) return 'N/A'; // Handle null or undefined dates

        const date = new Date(dateString); // Parse the input date string

        const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits for day
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = String(date.getFullYear()).slice(); // Get the last 2 digits of the year

        const hours = String(date.getHours()).padStart(2, '0'); // Ensure 2 digits for hours
        const minutes = String(date.getMinutes()).padStart(2, '0'); // Ensure 2 digits for minutes

        return `${day}/${month}/${year} เวลา:${hours}:${minutes}`; // Return in dd/mm/yy-hour:min format
    };

    const [Data, setData] = useState([])
    let currentDate = new Date();
    const getyear = (id) => {
        const studentYear = parseInt(String(id).substring(0, 2));
        const studentClass = (currentDate.getFullYear() + 543) - (studentYear + 2500);
        return studentClass
    }
    const fetchData = async () => {

        try {
            const response = await axios.post(`/api/Admin/getgoldenbyreq_id`, { year: parseInt(year) })
            setData(...Data, response.data.map((item, index) => ({
                key: index, // Unique key for each row
                fullname: `${item.Student?.fnameTH || ''} ${item.Student?.lnameTH || ''}`, //check
                student_ID: item.stu_id?.toString(), //check
                citizen_ID: item.Student?.thai_id || 'N/A', //check
                birthdate: formatDateToDMY(item.Student?.bd) || 'N/A', //check
                reqId: item.id,
                more_info: item.more_info,
                status: item.status,
                updateat: formatDateToDMYWithTime(item.created_at),
                province: item.UHC_request?.[0]?.province,
                district: item.UHC_request?.[0]?.district,
                hospital: item.UHC_request?.[0]?.hospital || "N/A",
                facultyNameTH: item.Student?.facultyNameTH || "N/A",
                phone: item.Student?.phone_num || "N/A",
                email: item.Student?.personal_email || "N/A",
                year: getyear(item.stu_id?.toString()),
            })))
            console.log(Data)

        } catch (error) {
            console.log(error)
        }
    }


    console.log("reqMoreInfo", reqMoreInfo);
    useEffect(() => {
        console.log("Data", Data)
        // console.log("Status",Data.Objectkeys(0).status)
    }, [Data])
    useEffect(() => {
        fetchUniqueYear(),
            fetchData();
            console.log("Data111", Data)
            console.log("reqMoreInfo", reqMoreInfo);

    }, [])
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [selectedKey, setSelectedKey] = useState('5');
    const [values, setValues] = useState({})
    const handleEditForm = async (id) => {
        console.log("editFormReqId : ", id);
        const response = await axios.post('/api/request/getById', { id: id }); // Example API
        console.log("editFormResponse :", response.data.data.path);
        router.push(`/Admin/goldencard/${response.data.data.form}`);
    }
    const handleChangeStatus = async (record) => {
        console.log("status11", parseInt(record.status))
        if (record.status === "รอเจ้าหน้าที่ดำเนินการ") {
            try {
                setLoading(true);
                setShouldReload(true);
                const res = await axios.post('/api/request/changeStatusProcess', { id: parseInt(record.reqId) });
                setLoading(false);
                setShouldReload(false);
                console.log("res", res);
            } catch (error) {
                console.error('Error fetching status:', error);
            }
        } else if (record.status === "ขอข้อมูลเพิ่มเติม") {
            try {
                setLoading(true);
                setShouldReload(true);
                const res = await axios.post('/api/request/changeStatusToWantInfo', { id: parseInt(record.reqId) });
                setLoading(false);
                setShouldReload(false);
                console.log("res", res);
            } catch (error) {
                console.error('Error fetching status:', error);
            }
        }
        else if (record.status === "ส่งข้อมูลให้ รพ. แล้ว") {
            try {
                setLoading(true);
                setShouldReload(true);
                const res = await axios.post('/api/request/changeStatusToHospital', { id: parseInt(record.reqId) });
                setLoading(false);
                setShouldReload(false);
                console.log("res", res);
            } catch (error) {
                console.error('Error fetching status:', error);
            }
        } else if (record.status === "ย้ายสิทธิ์สำเร็จ") {
            try {
                setLoading(true);
                setShouldReload(true);
                const res = await axios.post('/api/request/changeToTranApprove', { id: parseInt(record.reqId) });
                setLoading(false);
                setShouldReload(false);
                console.log("res", res);
            } catch (error) {
                console.error('Error fetching status:', error);
            }
        } else if (record.status === "ย้ายสิทธิ์ไม่สำเร็จ") {
            try {
                setLoading(true);
                setShouldReload(true);
                const res = await axios.post('/api/request/ç', { id: parseInt(record.reqId) });
                setLoading(false);
                setShouldReload(false);
                console.log("res", res);
            } catch (error) {
                console.error('Error fetching status:', error);
            }
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
            align: 'center',
            width: 100,
            title: 'แก้ไข',
            dataIndex: 'status',
            render: (status, record) => {
                if (status !== "ประวัติการแก้ไข") {
                    return (
                        <Space size="middle">
                            <Button onClick={() => handleEditForm(record.reqId)}>แก้ไข</Button>
                        </Space>)
                }
            },
        },
        {
            align: 'center', // เพิ่ม align ขวา
            width: 150,
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
                        onClick={() => fetchZipFile(record.reqId, record.student_ID)}
                    />
                </div>
            ),
        },
        {
            title: 'สถานะ',
            align: 'center',
            dataIndex: 'status',
            width: 200,
            render: (status, record) => {
                let options = [];
                if (status == "ยังไม่ได้ Upload เอกสาร") {
                    options = [
                        { value: 'ยังไม่ได้ Upload เอกสาร', label: 'ยังไม่ได้ Upload เอกสาร', },
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', disabled: true },
                        { value: 'ขอข้อมูลเพิ่มเติม', label: 'ขอข้อมูลเพิ่มเติม', disabled: true },
                        { value: 'ส่งข้อมูลให้ รพ. แล้ว', label: 'ส่งข้อมูลให้ รพ. แล้ว', disabled: true },
                        { value: 'ย้ายสิทธิ์สำเร็จ', label: 'ย้ายสิทธิ์สำเร็จ', disabled: true },
                        { value: 'ย้ายสิทธิ์ไม่สำเร็จ', label: 'ย้ายสิทธิ์ไม่สำเร็จ', disabled: true },
                    ]
                }
                else if (status == "รอเจ้าหน้าที่ดำเนินการ") {
                    options = [
                        { value: 'ยังไม่ได้ Upload เอกสาร', label: 'ยังไม่ได้ Upload เอกสาร', disabled: true },
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', },
                        { value: 'ขอข้อมูลเพิ่มเติม', label: 'ขอข้อมูลเพิ่มเติม' },
                        { value: 'ส่งข้อมูลให้ รพ. แล้ว', label: 'ส่งข้อมูลให้ รพ. แล้ว' },
                        { value: 'ย้ายสิทธิ์สำเร็จ', label: 'ย้ายสิทธิ์สำเร็จ', disabled: true },
                        { value: 'ย้ายสิทธิ์ไม่สำเร็จ', label: 'ย้ายสิทธิ์ไม่สำเร็จ', disabled: true },
                    ]
                }
                else if (status == "ขอข้อมูลเพิ่มเติม") {
                    options = [
                        { value: 'ยังไม่ได้ Upload เอกสาร', label: 'ยังไม่ได้ Upload เอกสาร', disabled: true },
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', disabled: true },
                        { value: 'ขอข้อมูลเพิ่มเติม', label: 'ขอข้อมูลเพิ่มเติม', },
                        { value: 'ส่งข้อมูลให้ รพ. แล้ว', label: 'ส่งข้อมูลให้ รพ. แล้ว', },
                        { value: 'ย้ายสิทธิ์สำเร็จ', label: 'ย้ายสิทธิ์สำเร็จ', disabled: true },
                        { value: 'ย้ายสิทธิ์ไม่สำเร็จ', label: 'ย้ายสิทธิ์ไม่สำเร็จ', disabled: true },
                    ]
                } else if (status == "ส่งข้อมูลให้ รพ. แล้ว") {
                    options = [
                        { value: 'ยังไม่ได้ Upload เอกสาร', label: 'ยังไม่ได้ Upload เอกสาร', disabled: true },
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', disabled: true },
                        { value: 'ขอข้อมูลเพิ่มเติม', label: 'ขอข้อมูลเพิ่มเติม', disabled: true },
                        { value: 'ส่งข้อมูลให้ รพ. แล้ว', label: 'ส่งข้อมูลให้ รพ. แล้ว', },
                        { value: 'ย้ายสิทธิ์สำเร็จ', label: 'ย้ายสิทธิ์สำเร็จ', },
                        { value: 'ย้ายสิทธิ์ไม่สำเร็จ', label: 'ย้ายสิทธิ์ไม่สำเร็จ', },
                    ]
                }
                else if (status == "ย้ายสิทธิ์สำเร็จ") {
                    options = [
                        { value: 'ยังไม่ได้ Upload เอกสาร', label: 'ยังไม่ได้ Upload เอกสาร', disabled: true },
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', disabled: true },
                        { value: 'ขอข้อมูลเพิ่มเติม', label: 'ขอข้อมูลเพิ่มเติม', disabled: true },
                        { value: 'ส่งข้อมูลให้ รพ. แล้ว', label: 'ส่งข้อมูลให้ รพ. แล้ว', disabled: true },
                        { value: 'ย้ายสิทธิ์สำเร็จ', label: 'ย้ายสิทธิ์สำเร็จ', },
                        { value: 'ย้ายสิทธิ์ไม่สำเร็จ', label: 'ย้ายสิทธิ์ไม่สำเร็จ', disabled: true },
                    ]
                } else if (status == "ย้ายสิทธิ์ไม่สำเร็จ") {
                    options = [
                        { value: 'ยังไม่ได้ Upload เอกสาร', label: 'ยังไม่ได้ Upload เอกสาร', disabled: true },
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', disabled: true },
                        { value: 'ขอข้อมูลเพิ่มเติม', label: 'ขอข้อมูลเพิ่มเติม', },
                        { value: 'ส่งข้อมูลให้ รพ. แล้ว', label: 'ส่งข้อมูลให้ รพ. แล้ว', disabled: true },
                        { value: 'ย้ายสิทธิ์สำเร็จ', label: 'ย้ายสิทธิ์สำเร็จ', },
                        { value: 'ย้ายสิทธิ์ไม่สำเร็จ', label: 'ย้ายสิทธิ์ไม่สำเร็จ', },
                    ]
                }
                return (
                    <>
                        <div className='flex'>
                            <Select
                                defaultValue={status}
                                style={{ width: "180px" }}
                                options={options}
                                onChange={(value) => handleChangeStatus({ ...record, status: value })}
                            />
                            {record.status === "ขอข้อมูลเพิ่มเติม" ?
                                <Button type="primary" style={{ marginLeft: "10px" }} onClick={() => showModal(record.reqId)}>เขียนรายละเอียด</Button>
                                : null}
                        </div>
                    </>
                )
            },
            filters: [
                { text: "ยังไม่ได้ Upload เอกสาร", value: "ยังไม่ได้ Upload เอกสาร" },
                { text: "รอเจ้าหน้าที่ดำเนินการ", value: "รอเจ้าหน้าที่ดำเนินการ" },
                { text: "ขอข้อมูลเพิ่มเติม", value: "ขอข้อมูลเพิ่มเติม" },
                { text: "ส่งข้อมูลให้ รพ. แล้ว", value: "ส่งข้อมูลให้ รพ. แล้ว" },
                { text: "ย้ายสิทธิ์สำเร็จ", value: "ย้ายสิทธิ์สำเร็จ" },
                { text: "ย้ายสิทธิ์ไม่สำเร็จ", value: "ย้ายสิทธิ์ไม่สำเร็จ" },
            ],
            filteredValue: filteredInfo?.status,
            onFilter: (value, record) => record?.status.includes(value),
            // ellipsis: true,
            filterIcon: (filtered) => (
                <div>
                    <FilterOutlined style={{ color: "white", fontSize: "18px" }} />
                </div>
            ),
        }, {
            title: 'วันที่อัปโหลดเอกสาร',
            dataIndex: 'updateat',
            width: 200,
            align: 'center',
            sorter: (a, b) => new Date(a.updateat) - new Date(b.updateat),
            sortIcon: (sorted) => (
                <div>
                    <OrderedListOutlined style={{ color: "white", fontSize: "18px" }} />
                </div>
            ),
        },
        {
            title: 'ชั้นปี',
            dataIndex: 'year',
            width: 140,
            align: 'center',
            ...getColumnSearchProps('year'),
        },
        {
            title: 'รหัสนิสิต',
            dataIndex: 'student_ID',
            width: 180,
            align: 'center',
            ...getColumnSearchProps('student_ID'),
        },
        {
            title: 'ชื่อ-นามสกุล',
            dataIndex: 'fullname',
            width: 180,
            align: 'center',
            ...getColumnSearchProps('fullname'),
        },
        {
            title: 'คณะ',
            dataIndex: 'facultyNameTH',
            width: 180,
            align: 'center',
            ...getColumnSearchProps('facultyNameTH'),
        },


        {
            title: 'เลขบัตรประชาชน',
            dataIndex: 'citizen_ID',
            width: 180,
            align: 'center',
            ...getColumnSearchProps('citizen_ID'),
        },
        {
            title: 'วันเดือนปีเกิด',
            dataIndex: 'birthdate',
            width: 180,
            align: 'center',
        },
        {
            title: 'อำเภอ/เขต',
            dataIndex: 'district',
            width: 150,
            align: 'center',
            ...getColumnSearchProps('district'),
        },
        {
            title: 'จังหวัด',
            dataIndex: 'province',
            width: 150,
            align: 'center',
            ...getColumnSearchProps('province'),
        },
        {
            title: 'เบอร์มือถือ',
            dataIndex: 'phone',
            width: 150,
            align: 'center',
            ...getColumnSearchProps('phone'),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: 180,
            align: 'center',
            ...getColumnSearchProps('email'),
        },
        {
            title: 'ชื่อสถานพยาบาลก่อนลงทะเบียน',
            dataIndex: 'hospital',
            width: 180,
            align: 'center',
            ...getColumnSearchProps('hospital'),
        },
    ];

    const exportToExcel = (number) => {
        // กำหนดชื่อ Columns ที่ต้องการ
        const columnHeaders = [
            { header: "ปี", key: "year" },
            { header: "ลำดับ", key: "index" }, // ใช้ index เป็น Running Number
            { header: "รหัสนิสิต", key: "student_ID" },
            { header: "ชื่อ-นามสกุล", key: "fullname" },
            { header: "คณะ", key: "facultyNameTH" },
            { header: "เลขบัตรประชาชน", key: "citizen_ID" },
            { header: "วันเกิด", key: "birthdate" },
            { header: "อำเภอ/เขต", key: "district" },
            { header: "จังหวัด", key: "province" },
            { header: "เบอร์มือถือ", key: "phone" },
            { header: "Email", key: "email" },
            { header: "ชื่อสถานพยาบาลก่อนลงทะเบียน", key: "hospital" }
        ];

        // เพิ่มชื่อ Columns เข้าไปเป็น Row แรก
        let dataWithHeaders = []
        if (number == 0) {
            dataWithHeaders = [
                columnHeaders.map(col => col.header), // แถวแรกเป็นหัวตาราง
                ...Data.map((item, index) =>
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

        // สร้าง Workbook และเพิ่ม Worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

        // เขียนไฟล์ Excel และดาวน์โหลด
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "exported_data.xlsx");
    };
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRowReqid, setSelectedRowReqid] = useState([]);
    const [selectedRowReqidapi, setSelectedRowReqidapi] = useState([]);

    const onSelectChange = (newSelectedRowKeys, selectedRows) => {
        console.log('selectedRowKeys changed:', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
        setSelectedRowReqid(selectedRows.map(row => row)); // อัปเดตรายการที่เลือก
        setSelectedRowReqidapi(selectedRows.map(row => row.reqId)); // อัปเดตรายการที่เลือก
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,

        selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
        ],
    };

    // ตรวจสอบค่าที่อัปเดตล่าสุด
    useEffect(() => {
        console.log("Updated selected reqids:", selectedRowReqid);
    }, [selectedRowReqid]);
    const handleChangeStatusAll = async (ids, status) => {
        try {
            setLoading(true);
            setShouldReload(true);
            const res = await axios.post('/api/request/changeStatusAll', { ids, status });
            setLoading(false);
            setShouldReload(false);
            console.log("res", res);

        } catch (error) {
            console.log(error);

        }
    }

    const dropdown = () => {
        const handleSelect = async (value) => {
            try {
                handleChangeStatusAll(selectedRowReqidapi, value)
            } catch (error) {
                console.error("Error:", error);
            }
        };

        return (
            <Select
                className="w-1/5 mt-1 mb-6 ml-3"
                // showSearch
                placeholder="เลือกสถานะ"
                filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={[
                    { value: 'ส่งข้อมูลให้ รพ. แล้ว', label: 'ส่งข้อมูลให้ รพ. แล้ว' },
                    { value: 'ย้ายสิทธิ์สำเร็จ', label: 'ย้ายสิทธิ์สำเร็จ' },
                    { value: 'ย้ายสิทธิ์ไม่สำเร็จ', label: 'ย้ายสิทธิ์ไม่สำเร็จ' },
                ]}
                onSelect={handleSelect} // ใช้ฟังก์ชัน handleSelect
            />
        );
    };

    return (
        <Layout style={{ height: "100vh" }}>
            <Sider trigger={null} width={320} style={{ background: "rgb(255,157,210)" }}>
                <>
                    <div className="demo-logo-vertical" />
                    <div className='mt-5 ml-3'>
                        <p className='font-mono font-bold text-xl text-white'>
                            ฝ่ายทุนการศึกษาและบริการนิสิตสำนักบริหารกิจการนิสิตจุฬาลงกรณ์มหาวิทยาลัย
                        </p>
                    </div>
                    <div className='ml-3 mt-3'>
                        <p className='font-mono font-semibold text-white'>
                            Department of Scholarships & Student
                        </p>
                        <p className='font-mono font-semibold text-white'>
                            Services, Office of the Student Affairs,
                        </p>
                        <p className='font-mono font-semibold text-white'>
                            Chulalongkorn University
                        </p>
                    </div>
                    <div className="flex justify-center mt-5">
                        <hr
                            className="w-11/12"
                            style={{ borderTop: "5px solid white" }}
                        />
                    </div>



                </>

                <Menu
                    style={{ background: "rgb(255,157,210)", marginTop: "20px", height: '100%', borderRight: 0 }}
                    defaultSelectedKeys={[selectedKey]}
                    mode="inline"
                    onClick={(e) => setSelectedKey(e.key)}
                    items={[
                        {
                            key: '1',
                            label: <span style={{ color: selectedKey === '1' ? 'black' : 'white' }}>จัดการการนัดหมาย</span>,
                            onClick: () => window.location.href = '/Admin/home/0'
                        },
                        {
                            key: '2',
                            label: <span style={{ color: selectedKey === '2' ? 'black' : 'white' }}>ประกันอุบัติเหตุ</span>,
                            onClick: () => window.location.href = '/Admin/prakan/0'
                        },
                        {
                            key: '3',
                            label: <span style={{ color: selectedKey === '3' ? 'black' : 'white' }}>การขอผ่อนผันการเข้ารับราชการทหาร</span>,
                            onClick: () => window.location.href = '/Admin/ponpan/0'
                        },
                        {
                            key: '4',
                            label: <span style={{ color: selectedKey === '4' ? 'black' : 'white' }}>การรับสมัครและรายงานตัวนักศึกษาวิชาทหาร</span>,
                            onClick: () => window.location.href = '/Admin/rd/0'
                        },
                        {
                            key: '5',
                            label: <span style={{ color: selectedKey === '5' ? 'black' : 'white' }}>บัตรทอง</span>,
                            onClick: () => window.location.href = '/Admin/goldencard/page/0'
                        },
                        {
                            key: '6',
                            label: <span style={{ color: selectedKey === '6' ? 'black' : 'white' }}>Health Insurance For Foreigner Student</span>,
                            onClick: () => window.location.href = '/Admin/prakan-inter/0'
                        },
                        {
                            key: '7',
                            label: <span style={{ color: selectedKey === '7' ? 'black' : 'white' }}>จัดการจำนวนผู้เข้ารับบริการ</span>,
                            onClick: () => window.location.href = '/Admin/editMaxStudent'
                        },
                        {
                            key: '8',
                            label: <span style={{ color: selectedKey === '8' ? 'black' : 'white' }}>จัดการผู้ใช้งาน</span>,
                            onClick: () => window.location.href = '/Admin/user'
                        },
                        {
                            key: '9',
                            label: <span style={{ color: selectedKey === '9' ? 'black' : 'white' }}>เปิด-ปิดวันให้บริการ</span>,
                            onClick: () => window.location.href = '/Admin/editServiceDate'
                        }
                    ]}
                />
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
                            บัตรทอง
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


                    </div>
                    <Table
                        rowSelection={rowSelection} columns={columns} dataSource={Data}
                        bordered
                    />
                    <Modal
                        title="กรุณาเขียนรายละเอียด"
                        open={isModalOpen}
                        onOk={handleOk}
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
                            value={Data.find((item) => item.reqId === reqMoreInfo)?.more_info || null}
                            onChange={(e) => setMoreInfoValue(e.target.value)}
                        />
                    </Modal>

                </Content>
            </Layout>
        </Layout>
    );
};
export default App;