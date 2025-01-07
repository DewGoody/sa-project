'use client'
import React, { Children, useEffect, useState } from 'react';
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

const AppointmentManagement = () => {
    const [dataSource, setDataSource] = useState('');
    const [stuData, setStuData] = useState([]);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [selectedKey, setSelectedKey] = useState('3');
    const [fetchYear, setfetchYear] = useState([]);
    const [statusRequest, setStatusRequest] = useState([]);
    const router = useRouter();
    const { year } = useParams();
    console.log("year", year);
    console.log("fetchYear :", fetchYear);
    const fetchStuData = async () => {
        try {
            const res = await axios.post('/api/request/getPonpanAdmin', { year: parseInt(year) });
            console.log("stuData", res.data.data);
            setStuData(res.data.data);
            setDataSource(...dataSource, res.data.data.map((item, index) => {
                const buddhistYear = new Date(item.Student.bd).getFullYear() + 543;
                return {
                    key: index,
                    stu_id: item.stu_id,
                    bd: buddhistYear,
                    thai_id: item.Student.thai_id,
                    degree: item.Ponpan[0].degree,
                    year: item.Ponpan[0].year,
                    fnameTH: item.Student.fnameTH,
                    lnameTH: item.Student.lnameTH,
                    phone_num: item.Ponpan[0].phone_num,
                    father_name: item.Ponpan[0].father_name,
                    mother_name: item.Ponpan[0].mother_name,
                    sdnine_id: item.Ponpan[0].sdnine_id,
                    house_num: item.Ponpan[0].house_num,
                    house_moo: item.Ponpan[0].house_moo,
                    sub_district: item.Ponpan[0].sub_district,
                    district: item.Ponpan[0].district,
                    province: item.Ponpan[0].province,
                    house_num_sd: item.Ponpan[0].house_num_sd,
                    house_moo_sd: item.Ponpan[0].house_moo_sd,
                    subdistrict_sd: item.Ponpan[0].subdistrict_sd,
                    district_sd: item.Ponpan[0].district_sd,
                    province_sd: item.Ponpan[0].province_sd,
                    email: item.Ponpan[0].email,
                };
            }));
            console.log("dataSource :", dataSource);
        } catch (error) {
            console.error('Error fetching student data:', error);
        }
    }

    

    const fetchUniqueYear = async () => {
        try {
            const res = await axios.post('/api/request/getUniqueYearPonpan');
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



const columns = [
    {
        title: 'สถานะ',
        dataIndex: 'status',
        render: (status) => (
            <Select
                defaultValue={status}
                style={{ width: "180px" }}
                options={[
                    { value: 'รอเข้ารับบริการ', label: 'รอเข้ารับบริการ', style: { color: 'black' } },
                    { value: 'Approved', label: 'ดำเนินการเสร็จสิ้น', style: { color: 'green' } },
                    { value: 'Rejected', label: 'คิวถูกยกเลิก', style: { color: 'red' } },
                ]}
            />
        )
    },
    {
        title: 'พ.ศ. เกิด',
        dataIndex: 'bd',
        align: 'center',
    },
    {
        title: 'รหัสนิสิต',
        dataIndex: 'stu_id',
        align: 'center',
    },
    {
        title: 'เลขประจำตัวประชาชน',
        dataIndex: 'thai_id',
        align: 'center',
    },
    {
        title: 'ศึกษาในระดับปริญญา',
        dataIndex: 'degree',
        align: 'center',
    },
    {
        title: 'ชั้นปีที่',
        dataIndex: 'year',
        align: 'center',
    },
    {
        title: 'ชื่อ',
        dataIndex: 'fnameTH',
        align: 'center',
    },
    {
        title: 'นามสกุล',
        dataIndex: 'lnameTH',
        align: 'center',
    },
    {
        title: 'เบอร์โทรศัพท์',
        dataIndex: 'phone_num',
        align: 'center',
    },
    {
        title: 'ชื่อบิดา',
        dataIndex: 'father_name',
        align: 'center',
    },
    {
        title: 'ชื่อมารดา',
        dataIndex: 'mother_name',
        align: 'center',
    },
    {
        title: 'ใบสำคัญ สด. 9',
        dataIndex: 'sdnine_id',
        align: 'center',
    },
    {
        title: 'ที่อยู่ตามทะเบียนบ้าน',
        align: 'center',
        children: [
            {
                title: 'บ้านเลขที่',
                dataIndex: 'house_num',
                align: 'center',
            },
            {
                title: 'หมู่',
                dataIndex: 'house_moo',
                align: 'center',
            },
            {
                title: 'แขวง/ตำบล',
                dataIndex: 'sub_district',
                align: 'center',
            },
            {
                title: 'อำเภอ',
                dataIndex: 'district',
                align: 'center',
            },
            {
                title: 'จังหวัด',
                dataIndex: 'province',
                align: 'center',
            },
        ]
    },
    {
        title: 'ที่อยู่ตาม สด.9',
        align: 'center',
        children: [
            {
                title: 'บ้านเลขที่',
                dataIndex: 'house_num_sd',
                align: 'center',
            },
            {
                title: 'หมู่',
                dataIndex: 'house_moo_sd',
                align: 'center',
            },
            {
                title: 'แขวง/ตำบล',
                dataIndex: 'subdistrict_sd',
                align: 'center',
            },
            {
                title: 'อำเภอ',
                dataIndex: 'district_sd',
                align: 'center',
            },
            {
                title: 'จังหวัด',
                dataIndex: 'province_sd',
                align: 'center',
            },
        ]
    },
    {
        title: "อีเมลล์",
        dataIndex: "email",
        align: 'center',
    }
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
                            การขอผ่อนผันการเข้ารับราชการทหาร
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

export default AppointmentManagement;
