'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx'; // เพิ่ม XLSX สำหรับ export
import { saveAs } from 'file-saver'; 
import dayjs from 'dayjs';// เพิ่ม FileSaver สำหรับบันทึกไฟล์
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
    DownloadOutlined,
    SearchOutlined,
    FilterOutlined,
    OrderedListOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Modal, DatePicker, Input, Table, Space, Select } from 'antd';
const { Header, Sider, Content } = Layout;
import { useParams, useRouter } from 'next/navigation';
const App = () => {
    const router = useRouter()
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [Data, setData] = useState([])
    const [loading, setLoading] = useState(false);
    const [shouldReload, setShouldReload] = useState(false)
    const [filteredInfo, setFilteredInfo] = useState({});
    const [fetchYear, setfetchYear] = useState([]);
    const { year } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        date: null,
        firstPayment: '',
        secondPayment: ''
    });

    const getdatemoney = async () => {
        try {
            const response = await axios.get(`/api/militaryapi/datemoney`);
            const data = response.data.data; // ดึงข้อมูลจาก API response

            handleChange("date", data.date);
            handleChange("firstPayment", data.firstPayment);
            handleChange("secondPayment", data.secondPayment);
        } catch (error) {
            console.error("Error fetching date and money:", error);
        }
    };

    useEffect(() => {
        getdatemoney();
    }, []);
    const showModal = () => setIsModalOpen(true);
    const handleCancel = () => setIsModalOpen(false);
    const handleOk = async () => {
        try {
            const response = await axios.post('/api/militaryapi/datemoney', {
                date: formData.date,
                firstPayment: formData.firstPayment,
                secondPayment: formData.secondPayment
            }, {
                headers: { "Content-Type": "application/json" } // กำหนด header
            });

            console.log("Server Response:", response.data);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error submitting data:", error);
        }
    };


    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const formatDateToDMYWithTime = (dateString) => {
        // console.log(dateString);

        if (!dateString) return 'N/A'; // Handle null or undefined dates

        const date = new Date(dateString); // Parse the input date string

        const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits for day
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = String(date.getFullYear()).slice(); // Get the last 2 digits of the year

        const hours = String(date.getHours()).padStart(2, '0'); // Ensure 2 digits for hours
        const minutes = String(date.getMinutes()).padStart(2, '0'); // Ensure 2 digits for minutes

        return `${day}/${month}/${year}`; // Return in dd/mm/yy-hour:min format
    };

    const handleSearch = (value, dataIndex) => {
        setSearchText(value);
        setSearchedColumn(dataIndex);
    };
    const handleEditForm = async (id, year) => {
        const response = await axios.post('/api/request/getById', { id: id }); // Example API

        if (year == 1) {
            router.push(`/student/0/rordor/${response.data.data.form}/1/checkData`);

        }
        else {

            router.push(`/student/0/rordor/${response.data.data.form}/1/checkData2`);

        }


    }

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

    useEffect(() => {
        if (shouldReload) {
            window.location.reload();
        }
    }, [shouldReload]);

    const fetchUniqueYear = async () => {
        try {
            const res = await axios.post('/api/Admin/getyearrordor');
            setfetchYear(res.data.data);
        }
        catch (error) {
            console.error('Error fetching unique year:', error);
        }
    }
    const handleYearChange = async (year) => {
        console.log("year", year);
        router.push(`/Admin/rd/${year}`);
    }

    const fetchData = async () => {
        try {
            const response = await axios.post(`/api/Admin/getrordor`, { year: parseInt(year) })
            response.data.map((item) => {
                console.log("กหดหกดกหดกหดกหดหก", item.entry?.json.student);

            });

            setData(...Data, response.data.map((item, index) => ({
                key: index, // Unique key for each row
                fullname: `${item.entry?.json.student?.fnameTH || ''} ${item.entry?.json.student?.lnameTH || ''}`,
                student_ID: item.entry?.stu_id,
                citizen_ID: item.entry?.json.student.thai_id || 'N/A',
                birthdate: formatDateToDMYWithTime(item.entry?.json.student?.bd) || 'N/A',
                status: item.entry?.status,
                reqId: item.entry?.id,
                rd_ID: item.entry?.json.Military_info.military_id || '-',
                yearRD: item.entry?.yearRD
            })))
            console.log(Data.fullname)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchUniqueYear()
        fetchData()
        // console.log(Data.fullname)
    }, [])
    const [collapsed, setCollapsed] = useState(false);



    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [selectedKey, setSelectedKey] = useState('4');
    const handleChangeStatus = async (record) => {

        if (record.status === "รอเจ้าหน้าที่ดำเนินการ") {
            try {
                setLoading(true);
                setShouldReload(true);
                const res = await axios.post('/api/request/changeStatusToProcess', { id: parseInt(record.reqId) });
                setLoading(false);
                setShouldReload(false);
                console.log("res", res);
            } catch (error) {
                console.error('Error fetching status:', error);
            }
        }
        else if (record.status === "เสร็จสิ้น") {
            try {
                setLoading(true);
                setShouldReload(true);
                const res = await axios.post('/api/request/changeStatusToSucc', { id: parseInt(record.reqId) });
                setLoading(false);
                setShouldReload(false);
                console.log("res", res);
            } catch (error) {
                console.error('Error fetching status:', error);
            }
        }
    }
    const filepdf = async (reqId, year) => {
        try {
            if (year == 1) {
                console.log(reqId);

                const response = await axios.get(`/api/export/AdminRD1?id=${reqId}`, { responseType: 'blob' });
                return response.data;
            } else {
                console.log(reqId);

                const response = await axios.get(`/api/export/AdminRD2?id=${reqId}`, { responseType: 'blob' });
                return response.data;
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handleDownload = async (student_ID, reqId, year) => {
        const pdfBlob = await filepdf(reqId, year);
        if (pdfBlob) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(pdfBlob);
            link.download = `RD${year} ${student_ID}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        }
    };
    const columns = [
        {
            align: 'center',
            title: 'แก้ไข',
            dataIndex: 'status',
            render: (status, record) => {
                if (status !== "ประวัติการแก้ไข") {
                    return (
                        <Space size="middle">
                            <Button onClick={() => handleEditForm(record.reqId, record.yearRD)}>แก้ไข</Button>
                        </Space>)
                }
            },
        },
        {
            align: 'center', // เพิ่ม align ขวา
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
                        onClick={() => handleDownload(record.student_ID, record.reqId, record.yearRD)}
                    />
                </div>
            ),
        },
        {
            title: 'สถานะ',
            dataIndex: 'status',
            width: "200px",
            render: (status, record) => {
                console.log("status", status)
                let options = [];
                if (status == "รอเข้ารับบริการ") {
                    options = [
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', },
                        { value: 'เสร็จสิ้น', label: 'เสร็จสิ้น', },
                    ]
                } else if (status == "รอเจ้าหน้าที่ดำเนินการ") {
                    options = [
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', disabled: true },
                        { value: 'เสร็จสิ้น', label: 'เสร็จสิ้น', },
                    ]
                } else if (status == "เสร็จสิ้น") {
                    options = [
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', disabled: true },
                        { value: 'เสร็จสิ้น', label: 'เสร็จสิ้น', disabled: true },
                    ]
                }
                return (
                    <Select
                        defaultValue={status}
                        style={{ width: "180px" }}
                        options={options}
                        onChange={(value) => handleChangeStatus({ ...record, status: value })}
                    />
                )
            },
            filters: [
                { text: "รอเข้ารับบริการ", value: "รอเข้ารับบริการ" },
                { text: "รอเจ้าหน้าที่ดำเนินการ", value: "รอเจ้าหน้าที่ดำเนินการ" },
                { text: "เสร็จสิ้น", value: "เสร็จสิ้น" },
            ],
            filteredValue: filteredInfo?.status,
            onFilter: (value, record) => record?.status.includes(value),
            // ellipsis: true,
            filterIcon: (filtered) => (
                <div>
                    <FilterOutlined style={{ color: "white", fontSize: "18px" }} />
                </div>
            ),
        },
        {
            title: 'ชื่อ-นามสกุล',
            dataIndex: 'fullname',
            ...getColumnSearchProps('fullname'),
        }, {
            title: 'ชั้นปี นศท',
            dataIndex: 'yearRD',
            ...getColumnSearchProps('yearRD'),
        },
        {
            title: 'รหัสนิสิต',
            dataIndex: 'student_ID',
            ...getColumnSearchProps('student_ID'),
        },
        {
            title: 'รหัสนักศึกษาวิชาทหาร',
            dataIndex: 'rd_ID',
            ...getColumnSearchProps('rd_ID'),
        },
        {
            title: 'เลขบัตรประชาชน',
            dataIndex: 'citizen_ID',
            ...getColumnSearchProps('citizen_ID'),
        },
        {
            title: 'วันเดือนปีเกิด',
            dataIndex: 'birthdate',
        },

        // {
        //     title: '',
        //     align: 'right', // เพิ่ม align ขวา
        //     render: (_, record) => (
        //         <Space size="middle">
        //             {/* <a>Delete</a> */}
        //         </Space>
        //     ),
        // },
    ];


    const exportToExcel = () => {
        // กำหนดชื่อ Columns ที่ต้องการ
        const columnHeaders = [
            // { header: "ลำดับ", key: "key" },
            { header: "ชื่อ-นามสกุล", key: "fullname" },
            { header: "รหัสนักศึกษา", key: "student_ID" },
            { header: "เลขบัตรประชาชน", key: "citizen_ID" },
            { header: "วันเกิด", key: "birthdate" },
            { header: "สถานะ", key: "status" },
            { header: "เลขประจำตัว นศท", key: "rd_ID" },
            { header: "ชั้นปี นศท", key: "yearRD" }
        ];

        // เพิ่มชื่อ Columns เข้าไปเป็น Row แรก
        const dataWithHeaders = [
            columnHeaders.map(col => col.header), // แถวแรกเป็นหัวตาราง
            ...Data.map((item) => columnHeaders.map(col => item[col.key] || '')) // ข้อมูลตามลำดับ
        ];

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

    return (
        <Layout style={{ height: "100vh" }}>
            <Sider trigger={null} width={320} style={{ background: "rgb(255,157,210)" }}>
                <>
                    <div className="demo-logo-vertical" />
                    <div className='text-center mt-10 ml-3 mr-3'>
                        <p className='font-mono font-bold text-xl text-white'>
                            ฝ่ายทุนการศึกษาและบริการนิสิต
                        </p>
                        <p className='font-mono font-bold text-xl text-white'>
                            สำนักบริหารกิจการนิสิต
                        </p>
                        <p className='font-mono font-bold text-xl text-white'>
                            จุฬาลงกรณ์มหาวิทยาลัย
                        </p>
                    </div>
                    <div className='text-center mt-4 ml-3 mr-3'>
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
                    style={{ background: "rgb(255,157,210)", height: '100%', marginTop: "20px" }}
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
                        // borderTopLeftRadius: '20px',  // โค้งเฉพาะมุมบนซ้าย
                        // borderBottomLeftRadius: '20px', // โค้งเฉพาะมุมล่างซ้าย

                    }}
                >
                    <div className='flex mb-5 justify-between'>
                        <div className='font-extrabold text-3xl'>
                            นักศึกษาวิชาทหาร
                        </div>
                    </div>
                    <div className='flex mt-12'>
                        <div className='mt-2 ml-3 font-normal text-base'>
                            เลือกปีการศึกษา
                        </div>
                        <div className='mt-1 mb-6'>
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

                    </div>
                    <Button type="primary" onClick={showModal} style={{ marginBottom: '16px' }}>
                        เพิ่มวันเวลารายงานตัว
                    </Button>
                    <Modal
                        title="เพิ่มวันเวลารายงานตัว"
                        open={isModalOpen}
                        onOk={handleOk}
                        onCancel={handleCancel}
                    >
                        <h1>วันที่</h1>
                        <DatePicker
                            style={{ width: '100%', marginBottom: 10 }}
                            value={formData.date ? dayjs(formData.date) : null}
                            onChange={(date, dateString) => handleChange('date', dateString)}
                            placeholder="เลือกวันที่"
                        />
                        <h1>ค่าสมัคร นศท</h1>
                        <Input
                            value={formData.firstPayment}
                            placeholder="ค่าสมัคร นศท"
                            style={{ marginBottom: 10 }}
                            onChange={e => handleChange('firstPayment', e.target.value)}
                        />
                        <h1>ค่ารายงานตัว นศท</h1>
                        <Input
                            value={formData.secondPayment}

                            placeholder="ค่ารายงานตัว นศท"
                            onChange={e => handleChange('secondPayment', e.target.value)}
                        />
                    </Modal>
                    <Table
                        dataSource={Data}
                        columns={columns}
                        loading={loading}
                        rowClassName={(record, index) =>
                            index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
                        }
                        bordered
                    />
                </Content>
            </Layout>
        </Layout>
    );
};
export default App;