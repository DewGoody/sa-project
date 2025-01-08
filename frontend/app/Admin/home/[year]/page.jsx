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
import { Button, Layout, Menu, theme, Input, Table, Space,Select,Modal } from 'antd';
import axios from 'axios';
import { useRouter,useParams } from 'next/navigation';


const { Header, Sider, Content } = Layout;

const AppointmentManagement = () => {
    const [dataSource, setDataSource] = useState([]);
    const [stuData, setStuData] = useState([]);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [selectedKey, setSelectedKey] = useState('1');
    const [fetchYear, setfetchYear] = useState([]);
    const [statusRequest, setStatusRequest] = useState([]);
    const router = useRouter();
    const { year } = useParams();
    const [dateMaxStu, setDateMaxStu] = useState([])
    const [selectDate, setSelectDate] = useState();
    const [maxStu, setMaxStu] = useState();
    console.log("year", year);
    console.log("fetchYear :", fetchYear);
    const timeSlots = 
  [
    '8:00-8:30', '8:30-9:00','9:00-9:30', '9:30-10:00','10:00-10:30', '10:30-11:00','11:00-11:30', '11.30-12.00',
    '13:00-13:30', '13:30-14:00','14:00-14:30', '14:30-15:00','15:00-15:30', '15:30-16:00','16:00-16:30', '16.30-17.00',
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);

const showModal = async () => {
    setIsModalOpen(true);
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

console.log("dateMaxStu", dateMaxStu);

  const handleOk = () => {
    const res = axios.post('/api/timeslot/editMaxStudent', { date: selectDate, maxStu: maxStu });
    console.log("resEditMx", res);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleMaxStuChange = async (input) => {
    setMaxStu(input);
    }

    const fetchStuData = async () => {
        try {
            const res = await axios.post('/api/queue/getInAdmin', { year: 0 });
            console.log("stuData", res.data.data);
            setStuData(res.data.data);
            setDataSource(...dataSource, res.data.data.map((item, index) => {
                const date = new Date(item.Timeslot.date);
                const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

                return {
                    key: index,
                    name: item.Student.fnameTH + ' ' + item.Student.lnameTH,
                    student_ID: item.Student.id,
                    status: item.status,
                    id: item.id,
                    reqId: item.Request.id,
                    type: item.Request.type,
                    date:formattedDate,
                    period: timeSlots[item.period] + " น.",
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


    console.log("statusRequest", statusRequest);


    console.log("dataSource", dataSource);

    const handleYearChange = async (year) => {
        console.log("year", year);
        router.push(`/Admin/prakan/${year}`);
    }

    const handleStatusChange = async (reocrd) => {
        console.log("record : ", reocrd);
        try {
            if(reocrd.status === "ไม่มาเข้ารับบริการ"){
                await axios.post('/api/queue/changeStatusToLate', { id: reocrd.id });
            }
            else if(reocrd.status === "เข้ารับบริการแล้ว"){
                await axios.post('/api/queue/changeStatusToReceiveService', { id: reocrd.id });
            }
        } catch (error) {
            console.error('Error changing status:', error);
        }
    }
    
    const handleSelectDate = async (date) => {
        const formattedDate = new Date(date)
        setSelectDate(formattedDate);
        console.log("date", formattedDate);
    }
    
    

const columns = [
    {
        title: 'สถานะ',
        dataIndex: 'status',
        render: (status, record) => (
            <Select
                defaultValue={record.status}
                style={{ width: 120 }}
                onChange={(value) => handleStatusChange({ ...record, status: value })}
            >
                <Select.Option value="จองคิวสำเร็จ" disabled={record.status === "ไม่มาเข้ารับบริการ"}>จองคิวสำเร็จ</Select.Option>
                <Select.Option value="ไม่มาเข้ารับบริการ">ไม่มาเข้ารับบริการ</Select.Option>
                <Select.Option value="เข้ารับบริการแล้ว">เข้ารับบริการแล้ว</Select.Option>
            </Select>
        ),
    },
    {
        title: 'ประเภทการเข้ารับบริการ',
        dataIndex: 'type',
    },
    {
        title: 'วันที่',
        dataIndex: 'date',
    },
    {
        title: 'เวลา',
        dataIndex: 'period',
    },
    {
        title: 'ชื่อ-นามสกุล',
        dataIndex: 'name',
    },
    {
        title: 'รหัสนิสิต',
        dataIndex: 'student_ID',
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
                            onClick: () => window.location.href = '/Admin/goldencard/0'
                        },
                        {
                            key: '6',
                            label: <span style={{ color: selectedKey === '6' ? 'black' : 'white' }}>Health Insurance For Foreigner Student</span>,
                        },
                        {
                            key: '7',
                            label: <span style={{ color: selectedKey === '7' ? 'black' : 'white' }}>กยศ</span>,
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
                            จัดการการนัดหมาย
                        </div>
                        <div className='mr-10'>
                            <Input style={{ paddingRight: "100px" }} placeholder="ค้นหานิสิต" />
                        </div>
                        
                        
                    </div>
                    <div className="flex justify-between">
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
                        <div className='mt-10 mb-6'>
                            <Button
                                type="primary"
                                onClick={showModal}
                                style={{ background: "rgb(255,157,210)", borderColor: "rgb(255,157,210)", borderRadius: borderRadiusLG }}
                            >
                                จัดการจำนวนผู้เข้ารับบริการ
                            </Button>
                        </div>
                    </div>
                    
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        style={{ borderRadius: borderRadiusLG  }}
                        scroll={{ x: 'max-content' }}
                        
                    />

                    <Modal title="เลือกจำนวนนิสิตที่รับได้ในแต่ละรอบ" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                         <div>
                            <p>เลือกวัน</p>
                            <Input 
                                type="date" 
                                min = {dateMaxStu[0]?.date}
                                onClick={ (e) => handleSelectDate(e.target.value)}
                           
                            />
                         </div>
                         <div className="mt-4">
                            <p>เลือกจำนวนนิสิต</p>
                            <Input 
                                placeholder="จำนวนนิสิต" 
                                type="number"
                                onChange={(e) => handleMaxStuChange(e.target.value)}

                            />
                         </div>
                    </Modal>
               
                </Content>
            </Layout>
        </Layout>
  );
};

export default AppointmentManagement;