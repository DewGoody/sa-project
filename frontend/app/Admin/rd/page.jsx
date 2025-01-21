'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx'; // เพิ่ม XLSX สำหรับ export
import { saveAs } from 'file-saver'; // เพิ่ม FileSaver สำหรับบันทึกไฟล์
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Input, Table, Space, Select } from 'antd';
const { Header, Sider, Content } = Layout;
const App = () => {
    const [Data, setData] = useState([])
    const formatDateToDMYWithTime = (dateString) => {
        if (!dateString) return 'N/A'; // Handle null or undefined dates

        const date = new Date(dateString); // Parse the input date string

        const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits for day
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = String(date.getFullYear()).slice(-2); // Get the last 2 digits of the year

        const hours = String(date.getHours()).padStart(2, '0'); // Ensure 2 digits for hours
        const minutes = String(date.getMinutes()).padStart(2, '0'); // Ensure 2 digits for minutes

        return `${day}/${month}/${year} เวลา:${hours}:${minutes}`; // Return in dd/mm/yy-hour:min format
    };

    const fetchData = async () => {
        try {
            const response = await axios.get(`/api/Admin/getrordor`)
            // response.data.map((item) => {
            //     console.log(item.entry);

            // });
            
            setData(...Data, response.data.map((item, index) => ({
                key: index, // Unique key for each row
                fullname: `${item.entry?.json.student?.lnameTH || ''} ${item.entry?.json.student?.fnameTH || ''}`,
                student_ID: item.entry?.stu_id,
                citizen_ID: item.entry?.json.student.thai_id || 'N/A',
                birthdate: formatDateToDMYWithTime(item.entry?.json.student?.bd) || 'N/A',
                status:item.entry?.status,
                reqId: item.entry?.id,
                rd_ID: item.entry?.json.Military_info.military_id || 'ปี1 ไม่มีเลขประจำตัว',
                yearRD : item.entry?.yearRD
            })))
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        console.log(Data)
        fetchData()
    }, [])
    const [collapsed, setCollapsed] = useState(false);



    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [selectedKey, setSelectedKey] = useState('4');
    const handleChangeStatus = async (record) => {
        console.log("status11",record.status)
        if(record.status === "รอเจ้าหน้าที่ดำเนินการ"){
            try {
                const res = await axios.post('/api/request/changePrakanProcess', { id: parseInt(record.reqId) });
                console.log("res", res);
            } catch (error) {
                console.error('Error fetching status:', error);
            }
           }
           else if(record.status === "ส่งเอกสารแล้ว"){
            try {
                const res = await axios.post('/api/request/changePrakanToSended', { id: parseInt(record.reqId) });
                console.log("res", res);
            } catch (error) {
                console.error('Error fetching status:', error);
            }
           } 
    } 
    const columns = [
        {
            title: 'สถานะ',
            dataIndex: 'status',
            render: (status, record) => {
                console.log("status", status )
                let options = [];
                if(status == "รอเข้ารับบริการ"){
                    options=[
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารแล้ว', },
                    ]
                }else if(status == "ส่งเอกสารแล้ว"){
                    options=[
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', disabled: true },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารแล้ว', },
                    ]
                }
                return(
                <Select
                    defaultValue={status}
                    style={{ width: "180px" }}
                    options={options}
                    onChange={(value) => handleChangeStatus({ ...record, status: value })}
                />
                )
            }
        },
        {
            title: 'ชื่อ-นามสกุล',
            dataIndex: 'fullname',
        },{
            title: 'ชั้นปี นศท',
            dataIndex: 'yearRD',
        },
        {
            title: 'รหัสนิสิต',
            dataIndex: 'student_ID',
        },
        {
            title: 'รหัสนักศึกษาวิชาทหาร',
            dataIndex: 'rd_ID',
        },
        {
            title: 'เลขบัตรประชาชน',
            dataIndex: 'citizen_ID',
        },
        {
            title: 'วันเดือนปีเกิด',
            dataIndex: 'birthdate',
        },

        {
            title: '',
            align: 'right', // เพิ่ม align ขวา
            render: (_, record) => (
                <Space size="middle">
                    {/* <a>Delete</a> */}
                </Space>
            ),
        },
    ];


    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(Data); // แปลงข้อมูลเป็น worksheet
        const workbook = XLSX.utils.book_new(); // สร้าง workbook ใหม่
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data"); // เพิ่ม worksheet เข้า workbook
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' }); // สร้างไฟล์ excel
        const data = new Blob([excelBuffer], { type: "application/octet-stream" }); // สร้าง blob
        saveAs(data, "exported_data.xlsx"); // บันทึกไฟล์
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
                        <p className='font-mono font-medium text-white'>
                            Departmet of Scholarship & Students Service, Office of the Student Affairs, Chulalongkorn University
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
                    style={{ background: "rgb(255,157,210)", marginTop: "20px" }}
                    defaultSelectedKeys={[selectedKey]}
                    mode="inline"
                    onClick={(e) => setSelectedKey(e.key)}
                    items={[
                        {
                            key: '1',
                            label: <span style={{ color: selectedKey === '1' ? 'black' : 'white' }}>จัดการการนัดหมาย</span>,
                            onClick: () => window.location.href = '/Admin/home'
                        },
                        {
                            key: '2',
                            label: <span style={{ color: selectedKey === '2' ? 'black' : 'white' }}>ประกันอุบัติเหตุ</span>,
                            onClick: () => window.location.href = '/Admin/prakan'

                        },
                        {
                            key: '3',
                            label: <span style={{ color: selectedKey === '3' ? 'black' : 'white' }}>การขอผ่อนผันการเข้ารับราชการทหาร</span>,
                        },
                        {
                            key: '4',
                            label: <span style={{ color: selectedKey === '4' ? 'black' : 'white' }}>การรับสมัครและรายงานตัวนักศึกษาวิชาทหาร</span>,
                            onClick: () => window.location.href = '/Admin/rd'
                        },
                        {
                            key: '5',
                            label: <span style={{ color: selectedKey === '5' ? 'black' : 'white' }}>บัตรทอง</span>,
                            onClick: () => window.location.href = '/Admin/goldencard'
                        },
                        {
                            key: '6',
                            label: <span style={{ color: selectedKey === '6' ? 'black' : 'white' }}>Health Insurance For Foreigner Student</span>,
                        },
                        {
                            key: '7',
                            label: <span style={{ color: selectedKey === '7' ? 'black' : 'white' }}>แบบคำขอรับเงินผ่านธนาคาร</span>,
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
                        borderTopLeftRadius: '20px',  // โค้งเฉพาะมุมบนซ้าย
                        borderTopLeftRadius: '20px',  // โค้งเฉพาะมุมบนซ้าย
                        borderBottomLeftRadius: '20px', // โค้งเฉพาะมุมล่างซ้าย

                    }}
                >
                    <div className='flex mb-5 justify-between'>
                        <div className='font-extrabold text-3xl'>
                            นักศึกษาวิชาทหาร
                        </div>
                        <div className='mr-10'>
                            <Input style={{ paddingRight: "100px" }} placeholder="ค้นหานิสิต" />
                        </div>
                    </div>
                    <Button type="primary" onClick={exportToExcel} style={{ marginBottom: '16px' }}>
                        Export to Excel
                    </Button>
                    <Table
                        dataSource={Data}
                        columns={columns}
                        rowClassName={(record, index) =>
                            index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
                        }
                    />
                </Content>
            </Layout>
        </Layout>
    );
};
export default App;