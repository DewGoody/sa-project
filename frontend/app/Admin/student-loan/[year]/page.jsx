'use client'
import React, { Children, useEffect, useState } from 'react';
import {
    SearchOutlined,
    FilterOutlined,
    OrderedListOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Input, Table, Space, Select } from 'antd';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import * as XLSX from 'xlsx'; // เพิ่ม XLSX สำหรับ export
import { saveAs } from 'file-saver'; // เพิ่ม FileSaver สำหรับบันทึกไฟล์
import Menubar from '../../component/menu';


const { Header, Sider, Content } = Layout;

const AppointmentManagement = () => {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [dataSource, setDataSource] = useState([]);
    const [stuData, setStuData] = useState([]);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [selectedKey, setSelectedKey] = useState('3');
    const [fetchYear, setfetchYear] = useState([]);
    const [loading, setLoading] = useState(false);
    const [shouldReload, setShouldReload] = useState(false);
    const router = useRouter();
    const { year } = useParams();
    console.log("year", year);
    console.log("fetchYear :", fetchYear);

    useEffect(() => {
        if (shouldReload) {
            window.location.reload();
        }
    }, [shouldReload]);


    const fetchStuData = async () => {
        try {
            const res = await axios.post('/api/request/getStudentLoanAdmin', { year: 0 });
            console.log("stuData", res.data.data);
            setDataSource(...dataSource, 
                    res.data.data.map((item) => ({
                        stu_id: item.Student.id,
                        fnameTH: item.Student.fnameTH,
                        lnameTH: item.Student.lnameTH,
                        status: item.status,
                    }))
            );
            console.log("dataSource :", dataSource);
        } catch (error) {
            console.error('Error fetching student data:', error);
        }
    }


    const fetchUniqueYear = async () => {
        try {
            const res = await axios.post('/api/request/getUniqueYearStudentLoan');
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
        console.log("fetchUniqueYear :", fetchYear);
    }, [])


    const handleYearChange = async (year) => {
        console.log("year", year);
        router.push(`/Admin/student-loan/${year}`);
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
            title: 'สถานะ',
            dataIndex: 'status',
            render: (text) => {
                if (text === "รอเจ้าหน้าที่ดำเนินการ") {
                    return <span>{"เข้ารับบริการแล้ว"}</span>;
                } 
                // else if (text === "อนุมัติ") {
                //     return <span style={{ color: 'green' }}>{text}</span>;
                // } 
                else {
                    return text;
                }
            },
        },

    
        {
            title: 'รหัสนิสิต',
            dataIndex: 'stu_id',
           
            ...getColumnSearchProps('stu_id'),
        },
        {
            title: 'ชื่อ',
            dataIndex: 'fnameTH',
           
            ...getColumnSearchProps('fnameTH'),
        },
        {
            title: 'นามสกุล',
            dataIndex: 'lnameTH',
           
            ...getColumnSearchProps('lnameTH'),
        },

    ];

    return (
        <Layout style={{ height: "100vh" }}>
            <Sider trigger={null} width={320} style={{ background: "rgb(255,157,210)" }}>
             <Menubar/>
            </Sider>
            <Layout style={{ background: "rgb(255,157,210)" }}>
                <Content
                    style={{
                        padding: 24,
                        minHeight: 280,
                        background: "white",

                    }}
                >
                    <div className='flex mb-5 justify-between'>
                        <div className='font-extrabold text-3xl'>
                            กองทุนกู้ยืมเพื่อการศึกษา (กยศ.)
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
                    

                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        loading={loading}
                        style={{ borderRadius: borderRadiusLG }}
                        scroll={{ x: 'max-content' }}
                        // rowSelection={rowSelection}
                        bordered

                    />

                </Content>
            </Layout>
        </Layout>
    );
};

export default AppointmentManagement;
