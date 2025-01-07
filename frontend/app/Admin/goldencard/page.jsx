'use client'
import React, { useState,useEffect } from 'react';
import axios from 'axios';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Input, Table, Space,Select } from 'antd';
const { Header, Sider, Content } = Layout;
const App = () => {

    async function fetchPdfFile(studentId) {
        try {
            const response = await fetch(`/api/POSTPDF?id=${studentId}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
    
            const data = await response.json();
    
            if (data.binary_file_data) {
                // Decode Base64 to binary
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
                link.href = url;
                link.download = `student_${studentId}_file.pdf`;
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
        
    const [Data ,setData] = useState([])
    const fetchData = async () =>{
        try{
            const response =await axios.get(`/api/Admin/getgoldenbyreq_id`)
            setData(response.data)
        }catch(error){
            console.log(error)
        }
    }
    useEffect(()=> {
        fetchData();
    },[])
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [selectedKey, setSelectedKey] = useState('5');
    const [values, setValues] = useState({})
    const handleChanged = (e) => {
        const { value } = e.target;
        /**
         * Updates the state with the provided value.
         *
         * @param {any} value - The new value to set in the state.
         */
        setValues({ ...values, [e.target.name]: value });
    }
    const columns = [
        {
            title: 'ดาวน์โหลด PDF',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => fetchPdfFile(record.student_ID)}>PDF</Button>
                </Space>
            ),
        },
        {
            title: 'สถานะ',
            dataIndex: 'status',
            render: (status) => (
                <Select
                    defaultValue={status}
                    style={{ width: "180px" }}
                    options={[
                        { value: 'ยังไม่ได้ Upload เอกสาร', label: 'ยังไม่ได้ Upload เอกสาร', },
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ',  },
                        { value: 'ขอข้อมูลเพิ่มเติม', label: 'ขอข้อมูลเพิ่มเติม',  },
                        { value: 'ส่งเอกสารเรียบร้อย', label: 'ส่งเอกสารเรียบร้อย',  },
                        { value: 'ย้ายสิทธิสำเร็จ', label: 'ย้ายสิทธิสำเร็จ',  },
                        { value: 'ย้ายสิทธิไม่สำเร็จ', label: 'ย้ายสิทธิไม่สำเร็จ',  },
                    ]}
                />
            )
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
    const dataSource = Data.map((item, index) => ({
        key: index, // Unique key for each row
        fullname: `${item.Student?.lnameTH || ''} ${item.Student?.fnameTH || ''}`,
        student_ID: item.student_id?.toString(),
        citizen_ID: item.Student?.thai_id || 'N/A',
        birthdate: item.Student?.bd || 'N/A',
    }));
    console.log(dataSource)
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
                        dataSource={dataSource}
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