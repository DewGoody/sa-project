'use client'
import React, { useEffect, useState } from 'react';
import {
    SearchOutlined,
    DownloadOutlined,
    FilterOutlined,
    OrderedListOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Input, Table, Space,Select } from 'antd';
import axios from 'axios';
import { useRouter,useParams } from 'next/navigation';


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
   

    useEffect(() => {
            if (shouldReload) {
            window.location.reload();
            }
        }, [shouldReload]);
    

    const fetchStuData = async () => {
        try {
            const res = await axios.post('/api/request/getPrakanInterAdmin', { year: parseInt(year) });
            console.log("stuData", res.data.data);
            setStuData(res.data.data);
            setDataSource(...dataSource, res.data.data.map((data, index) => {
                const formatDate = (dateString) => {
                    if (!dateString) return "-";
                    const date = new Date(dateString);
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    return `${day}/${month}/${year}`;
                };

                return {
                    key: index,
                    id: data.id,
                    reqId: data.reqId,
                    name: data.Student.fnameEN + " " + data.Student.lnameEN,
                    student_ID: data.Student.id,
                    accidentCause: data.prakan_inter_info[0].accidentCause || "-",
                    accidentDate: formatDate(data.prakan_inter_info[0].accidentDate),
                    accidentTime: data.prakan_inter_info[0].accidentTime + " น." || "-",
                    hospitalAmittedDate: formatDate(data.prakan_inter_info[0].hospitalAmittedDate),
                    hospitalDischargedDate: formatDate(data.prakan_inter_info[0].hospitalDischargedDate),
                    hospitalName: data.prakan_inter_info[0].hospitalName || "-",
                    hospitalPhoneNumber: data.prakan_inter_info[0].hospitalPhoneNumber || "-",
                    hospitalProvince: data.prakan_inter_info[0].hospitalProvince || "-",
                    phone_num: data.prakan_inter_info[0].phone_num || "-",
                    presentAddress: data.prakan_inter_info[0].presentAddress || "-",
                    type: data.prakan_inter_info[0].claimType || "-",
                    status: data.status || "-",
                    reqId: data.prakan_inter_info[0].req_id,
                    prakanId: data.prakan_inter_info[0].id
                }
            }
            ));
        } catch (error) {
            console.error('Error fetching student data:', error);
        }
    }

    useEffect(() => {
        fetchStuData()
    }, [])

    
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
          <SearchOutlined style={{ color: "white", fontSize:"18px" }} />
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
            title: 'ชื่อ-นามสกุล',
            dataIndex: 'name',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'รหัสพนักงาน',
            dataIndex: 'student_ID',
            ...getColumnSearchProps('student_ID'),
        },
        {
            title: 'อีเมล',
            dataIndex: 'email',
            ...getColumnSearchProps('email'),
        },
        {
            title: 'สิทธิ์ผู้ใช้งาน',
            dataIndex: 'role',
            ...getColumnSearchProps('role'),
        },
        {
            title: 'สถานะ',
            dataIndex: 'status',
            filters: [
                        { text: "เปิดการใช้งาน", value: "เปิดการใช้งาน" },
                        { text: "ปิดการใช้งาน", value: "ปิดการใช้งาน" },
                    ],
            filteredValue: filteredInfo?.status,
            onFilter: (value, record) => record?.status.includes(value),
            ellipsis: true,
            filterIcon: (filtered) => (
                <div>
                    <FilterOutlined style={{ color: "white", fontSize:"18px" }}/>
                </div>
            ),
        },
        {
            title: 'แก้ไข/ลบ',
            dataIndex: 'edit',

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
                            จัดการผู้ใช้งาน
                        </div>
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