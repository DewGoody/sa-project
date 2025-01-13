'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
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
    const router = useRouter()
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

                // Create a URL for the Blob and trigger download
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                // console.log('Generated link:', link);
                // console.log('Generated URL:', url);
                // console.log('Generated Blob:', blob);
                // window.open(url, '_blank');
                link.href = url;
                link.download = `student_${form}_file.pdf`;
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
    const formatDateToDMY = (dateString) => {
        if (!dateString) return 'N/A'; // Handle null or undefined dates

        const date = new Date(dateString); // Parse the input date string
        console.log("fdsfdsfdsf", date);

        const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits for day
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear(); // Get the full year

        return `${day}/${month}/${year}`; // Return in dd/mm/yyyy format
    };
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

    const [Data, setData] = useState([])
    const fetchData = async () => {

        try {
            const response = await axios.get(`/api/Admin/getgoldenbyreq_id`)
            setData(...Data, response.data.map((item, index) => ({
                key: index, // Unique key for each row
                fullname: `${item.Student?.lnameTH || ''} ${item.Student?.fnameTH || ''}`,
                student_ID: item.stu_id?.toString(),
                citizen_ID: item.Student?.thai_id || 'N/A',
                birthdate: formatDateToDMY(item.Student?.bd) || 'N/A',
                reqId: item.id,
                status: item.status,
                updateat: formatDateToDMYWithTime(item.created_at),
            })))
            // console.log(Data.status)

        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        console.log("Data", Data)
        // console.log("Status",Data.Objectkeys(0).status)
    }, [Data])
    useEffect(() => {
        fetchData();
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
        console.log("editFormResponse :", response.data.data);
        router.push(`/${response.data.data.path}/${response.data.data.form}`);
    }
    const handleChangeStatus = async (record) => {
        console.log("status11", record.status)
        if (record.status === "รอเจ้าหน้าที่ดำเนินการ") {
            try {
                const res = await axios.post('/api/request/changeStatusProcess', { id: parseInt(record.reqId) });
                console.log("res", res);
            } catch (error) {
                console.error('Error fetching status:', error);
            }
        } else if (record.status === "ขอข้อมูลเพิ่มเติม") {
            try {
                const res = await axios.post('/api/request/changeStatusToWantInfo', { id: parseInt(record.reqId) });
                console.log("res", res);
            } catch (error) {
                console.error('Error fetching status:', error);
            }
        }
        else if (record.status === "ส่งเอกสารแล้ว") {
            try {
                const res = await axios.post('/api/request/changeStatusToSended', { id: parseInt(record.reqId) });
                console.log("res", res);
                console.log("dfsfdsfdsfdsfdsfdsf")
            } catch (error) {
                console.error('Error fetching status:', error);
            }
        } else if (record.status === "ย้ายสิทธิสำเร็จ") {
            try {
                const res = await axios.post('/api/request/changeToTranApprove', { id: parseInt(record.reqId) });
                console.log("res", res);
            } catch (error) {
                console.error('Error fetching status:', error);
            }
        } else if (record.status === "ย้ายสิทธิไม่สำเร็จ") {
            try {
                const res = await axios.post('/api/request/changeToTranNotApprove', { id: parseInt(record.reqId) });
                console.log("res", res);
            } catch (error) {
                console.error('Error fetching status:', error);
            }
        }
    }
    const columns = [
        {
            title: 'แก้ไขข้อมูล',
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
            title: 'ดาวน์โหลด PDF',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => fetchPdfFile(record.reqId)}>PDF</Button>
                </Space>
            ),
        },
        {
            title: 'สถานะ',
            dataIndex: 'status',
            render: (status, record) => {
                let options = [];
                if (status == "ยังไม่ได้ Upload เอกสาร") {
                    options = [
                        { value: 'ยังไม่ได้ Upload เอกสาร', label: 'ยังไม่ได้ Upload เอกสาร', },
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', disabled: true },
                        { value: 'ขอข้อมูลเพิ่มเติม', label: 'ขอข้อมูลเพิ่มเติม', disabled: true },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารแล้ว', disabled: true },
                        { value: 'ย้ายสิทธิสำเร็จ', label: 'ย้ายสิทธิสำเร็จ', disabled: true },
                        { value: 'ย้ายสิทธิไม่สำเร็จ', label: 'ย้ายสิทธิไม่สำเร็จ', disabled: true },
                    ]
                }
                else if (status == "รอเจ้าหน้าที่ดำเนินการ") {
                    options = [
                        { value: 'ยังไม่ได้ Upload เอกสาร', label: 'ยังไม่ได้ Upload เอกสาร', disabled: true },
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', },
                        { value: 'ขอข้อมูลเพิ่มเติม', label: 'ขอข้อมูลเพิ่มเติม' },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารแล้ว' },
                        { value: 'ย้ายสิทธิสำเร็จ', label: 'ย้ายสิทธิสำเร็จ', disabled: true },
                        { value: 'ย้ายสิทธิไม่สำเร็จ', label: 'ย้ายสิทธิไม่สำเร็จ', disabled: true },
                    ]
                }
                else if (status == "ขอข้อมูลเพิ่มเติม") {
                    options = [
                        { value: 'ยังไม่ได้ Upload เอกสาร', label: 'ยังไม่ได้ Upload เอกสาร', disabled: true },
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', disabled: true },
                        { value: 'ขอข้อมูลเพิ่มเติม', label: 'ขอข้อมูลเพิ่มเติม', },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารแล้ว', },
                        { value: 'ย้ายสิทธิสำเร็จ', label: 'ย้ายสิทธิสำเร็จ', disabled: true },
                        { value: 'ย้ายสิทธิไม่สำเร็จ', label: 'ย้ายสิทธิไม่สำเร็จ', disabled: true },
                    ]
                } else if (status == "ส่งเอกสารแล้ว") {
                    options = [
                        { value: 'ยังไม่ได้ Upload เอกสาร', label: 'ยังไม่ได้ Upload เอกสาร', disabled: true },
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', disabled: true },
                        { value: 'ขอข้อมูลเพิ่มเติม', label: 'ขอข้อมูลเพิ่มเติม', disabled: true },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารแล้ว', },
                        { value: 'ย้ายสิทธิสำเร็จ', label: 'ย้ายสิทธิสำเร็จ', },
                        { value: 'ย้ายสิทธิไม่สำเร็จ', label: 'ย้ายสิทธิไม่สำเร็จ', },
                    ]
                }
                else if (status == "ย้ายสิทธิสำเร็จ") {
                    options = [
                        { value: 'ยังไม่ได้ Upload เอกสาร', label: 'ยังไม่ได้ Upload เอกสาร', disabled: true },
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', disabled: true },
                        { value: 'ขอข้อมูลเพิ่มเติม', label: 'ขอข้อมูลเพิ่มเติม', disabled: true },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารแล้ว', disabled: true },
                        { value: 'ย้ายสิทธิสำเร็จ', label: 'ย้ายสิทธิสำเร็จ', },
                        { value: 'ย้ายสิทธิไม่สำเร็จ', label: 'ย้ายสิทธิไม่สำเร็จ', disabled: true },
                    ]
                } else if (status == "ย้ายสิทธิไม่สำเร็จ") {
                    options = [
                        { value: 'ยังไม่ได้ Upload เอกสาร', label: 'ยังไม่ได้ Upload เอกสาร', disabled: true },
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', disabled: true },
                        { value: 'ขอข้อมูลเพิ่มเติม', label: 'ขอข้อมูลเพิ่มเติม', },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารแล้ว', disabled: true },
                        { value: 'ย้ายสิทธิสำเร็จ', label: 'ย้ายสิทธิสำเร็จ', },
                        { value: 'ย้ายสิทธิไม่สำเร็จ', label: 'ย้ายสิทธิไม่สำเร็จ', },
                    ]
                }
                return (
                    <Select
                        defaultValue={status}
                        style={{ width: "180px" }}
                        options={options}
                        onChange={(value) => handleChangeStatus({ ...record, status: value })}
                    />)
            }
        }, {
            title: 'วันที่อัพโหลดเอกสาร',
            dataIndex: 'updateat',
        },
        {
            title: 'ชื่อ-นามสกุล',
            dataIndex: 'fullname',
        },

        {
            title: 'รหัสนิสิต',
            dataIndex: 'student_ID',
        },
        {
            title: 'เลขบัตรประชาชน',
            dataIndex: 'citizen_ID',
        },
        {
            title: 'วันเดือนปีเกิด',
            dataIndex: 'birthdate',
        },
    ];


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
                        borderBottomLeftRadius: '20px', // โค้งเฉพาะมุมล่างซ้าย
                    }}
                >
                    <div className='flex mb-5 justify-between'>
                        <div className='font-extrabold text-3xl'>
                            บัตรทอง
                        </div>
                        <div className='mr-10'>

                            <Input style={{ paddingRight: "100px" }} placeholder="ค้นหานิสิต" />
                        </div>
                    </div>
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