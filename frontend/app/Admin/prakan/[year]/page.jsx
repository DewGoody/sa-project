'use client'
import React, { useEffect, useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
    DeleteOutlined,
    DownloadOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Input, Table, Space,Select } from 'antd';
import axios from 'axios';
import { useRouter,useParams } from 'next/navigation';


const { Header, Sider, Content } = Layout;


const App = () => {
    const [dataSource, setDataSource] = useState([]);
    const [stuData, setStuData] = useState([]);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [selectedKey, setSelectedKey] = useState('2');
    const [fetchYear, setfetchYear] = useState([]);

    const router = useRouter();
    const { year } = useParams();
    console.log("year", year);
    console.log("fetchYear :", fetchYear);

    

    const fetchStuData = async () => {
        try {
            const res = await axios.post('/api/request/getPrakanAdmin', { year: parseInt(year) });
            console.log("stuData", res.data.data);
            setStuData(res.data.data);
            setDataSource(...dataSource, res.data.data.map((item, index) => {
                const accDate = new Date(item.accident_info[0].acc_date);
                const formattedDate = `${accDate.getDate().toString().padStart(2, '0')}/${(accDate.getMonth() + 1).toString().padStart(2, '0')}/${accDate.getFullYear()}`;
                return {
                    key: index,
                    name: item.Student.fnameTH + ' ' + item.Student.lnameTH,
                    student_ID: item.Student.id,
                    des_injury: item.accident_info[0].des_injury,
                    acc_desc: item.accident_info[0].acc_desc,
                    accident_place: item.accident_info[0].accident_place,
                    acc_date: formattedDate,
                    treatment_place: item.accident_info[0].treatment_place,
                    hospital_type: item.accident_info[0].hospital_type,
                    medical_fee: item.accident_info[0].medical_fee + ' บาท',
                    status: item.status,
                    id: item.accident_info[0].id
                };
            }));
            console.log("dataSource :", dataSource);
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

    console.log("dataSource", dataSource);

    const handleYearChange = async (year) => {
        console.log("year", year);
        router.push(`/Admin/prakan/${year}`);
    }

    const handleDownload = async (dataDownload) => {

        console.log("dataDownloadJaa", typeof dataDownload);

        try {
            const res = await axios.post('/api/request/downloadPrakan', { id: parseInt(dataDownload) }, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'prakanformfilled.pdf');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            console.log("download", res);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    }


    const columns = [
        {
            title: 'ชื่อ-นามสกุล',
            dataIndex: 'name',
        },
        {
            title: 'รหัสนิสิต',
            dataIndex: 'student_ID',
        },
        {
            title: 'อาการบาดเจ็บ',
            dataIndex: 'des_injury',
        },
        {
            title: 'การเกิดอุบัติเหตุ',
            dataIndex: 'acc_desc',
        },
        {
            title: 'สถานที่เกิดอุบัติเหตุ',
            dataIndex: 'accident_place',
        },
        {
            title: 'วันที่เกิดอุบัติเหตุ',
            dataIndex: 'acc_date',
        },
        {
            title: 'การเกิดอุบัติเหตุ',
            dataIndex: 'acc_desc',
        },
        {
            title: 'สถานที่รักษา',
            dataIndex: 'treatment_place',
        },
        {
            title: 'ประเภทสถานพยาบาล',
            dataIndex: 'hospital_type',
        },
        {
            title: 'ค่ารักษาพบาบาล',
            dataIndex: 'medical_fee',
        },
        {
            title: 'สถานะ',
            dataIndex: 'status',
            render: (status) => (
                <Select
                    defaultValue={status}
                    style={{ width: "180px" }}
                    options={[
                        { value: 'รอเข้ารับบริการ', label: 'รอเข้ารับบริการ', style: {color: 'black' } },
                        { value: 'Approved', label: 'ดำเนินการเสร็จสิ้น', style: { color: 'green' } },
                        { value: 'Rejected', label: 'คิวถูกยกเลิก', style: { color: 'red' } },
                    ]}
                />
            )
        },
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
                  onClick={() => handleDownload(record.id)}
                />
              </div>
            ),
        },
    ];

    
   
    return (
        <Layout style={{ height: "100vh" }}>
            <Sider trigger={null} width={320} style={{ background: "rgb(255,157,210)" }}>
                <div>
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
                            Departmet of Scholarship & Students
                        </p>
                        <p className='font-mono font-semibold text-white'>
                            Service, Office of the Student Affairs,
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
                </div>

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
                            ประกันอุบัติเหตุ
                        </div>
                        <div className='mr-10'>
                            <Input style={{ paddingRight: "100px" }} placeholder="ค้นหานิสิต" />
                        </div>
                        
                        
                    </div>
                    <div className='mt-10 mb-6'>
                            <Select
                                defaultValue={year}
                                style={{ width: 120, marginLeft: 10 }}
                                onChange={handleYearChange}
                            >
                                <Select.Option value={0}>ทั้งหมด</Select.Option>
                                {fetchYear.map((year) => (
                                    <Select.Option key={year} value={year}>{year}</Select.Option>
                                ))}
                            </Select>
                    </div>
                    
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        style={{ borderRadius: borderRadiusLG  }}
                        scroll={{ x: 'max-content' }}
                        
                    />
               
                </Content>
            </Layout>
        </Layout>
    );
};
export default App;