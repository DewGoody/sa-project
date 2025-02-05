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
import { Button, Layout, Menu, theme, Input, Table, Space, Select, Modal } from 'antd';
import axios from 'axios';


const { Header, Sider, Content } = Layout;

const AppointmentManagement = () => {
    const [dataSource, setDataSource] = useState([]);
    const [stuData, setStuData] = useState([]);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [selectedKey, setSelectedKey] = useState('7');
    const [statusRequest, setStatusRequest] = useState([]);
    const [shouldReload, setShouldReload] = useState(false);
    const [dateMaxStu, setDateMaxStu] = useState([])
    const [selectDate, setSelectDate] = useState();
    const [maxStu, setMaxStu] = useState();

    const timeSlots =
        [
            '8:00-8:30', '8:30-9:00', '9:00-9:30', '9:30-10:00', '10:00-10:30', '10:30-11:00', '11:00-11:30', '11.30-12.00',
            '13:00-13:30', '13:30-14:00', '14:00-14:30', '14:30-15:00', '15:00-15:30', '15:30-16:00', '16:00-16:30', '16.30-17.00',
        ];


    useEffect(() => {
        if (shouldReload) {
            window.location.reload();
        }
    }, [shouldReload]);

    const fetchGetAllTimeSlots = async () => {
        try {
            const res = await axios.post('/api/timeslot/getAll');
            console.log("resGetAll", res.data.data);
            const sortedData = res.data.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setDateMaxStu(...dateMaxStu, sortedData.map((item) => {
                const date = new Date(item.date);
                date.setDate(date.getDate() + 1);
                return {
                    date: date.toISOString().split('T')[0],
                };
            }));
        } catch (error) {
            console.error('Error fetching timeslots:', error);
        }
    };

    useEffect(() => {
        fetchGetAllTimeSlots();
    }, []);

    console.log("dateMaxStu", dateMaxStu);

    const handleOk = async () => {
        setShouldReload(true);
        try {
            const res = await axios.post('/api/timeslot/editMaxStudent', { date: selectDate, maxStu: maxStu });
            console.log("resEditMx", res);
        } catch (error) {
            console.error('Error editing max student:', error);
        } finally {
            setShouldReload(false);
        }
    };



    const handleSelectDate = async (date) => {
        const formattedDate = new Date(date)
        setSelectDate(formattedDate);
        console.log("date", formattedDate);
    }

    const handleMaxStuChange = async (input) => {
        setMaxStu(input);
    }

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
                            Department of Scholarships & Students
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
                            จัดการจำนวนผู้เข้ารับบริการ
                        </div>


                    </div>
                    <div className='w-3/12'>
                        <p>เลือกวัน</p>
                        <Input
                            type="date"
                            min={dateMaxStu[0]?.date}
                            onClick={(e) => handleSelectDate(e.target.value)}

                        />
                    </div>
                    <div className="mt-4 w-3/12">
                        <p>เลือกจำนวนนิสิต</p>
                        <Input
                            placeholder="จำนวนนิสิต"
                            type="number"
                            onChange={(e) => handleMaxStuChange(e.target.value)}

                        />
                    </div>

                    <div className='absolute mt-6 '>
                        <Button type="primary" onClick={handleOk}>ยืนยัน</Button>
                    </div>

                </Content>
            </Layout>
        </Layout>
    );
};

export default AppointmentManagement;