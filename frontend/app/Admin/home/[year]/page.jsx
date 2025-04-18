'use client'
import React, { useEffect, useState } from 'react';
import {
    SearchOutlined,
    FilterOutlined,
    OrderedListOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Input, Table, Select, Modal } from 'antd';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
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
    const [selectedKey, setSelectedKey] = useState('1');
    const [fetchYear, setfetchYear] = useState([]);
    const [statusRequest, setStatusRequest] = useState([]);
    const router = useRouter();
    const { year } = useParams();
    const [dateMaxStu, setDateMaxStu] = useState([])
    const [selectDate, setSelectDate] = useState();
    const [maxStu, setMaxStu] = useState();
    const [loading, setLoading] = useState(false);
    const [shouldReload, setShouldReload] = useState(false);
    const [filteredInfo, setFilteredInfo] = useState({});


    console.log("year", year);
    console.log("fetchYear :", fetchYear);
    const timeSlots =
        [
            '8:00-8:30', '8:30-9:00', '9:00-9:30', '9:30-10:00', '10:00-10:30', '10:30-11:00', '11:00-11:30', '11.30-12.00',
            '13:00-13:30', '13:30-14:00', '14:00-14:30', '14:30-15:00', '15:00-15:30', '15:30-16:00', '16:00-16:30', '16.30-17.00',
        ];

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (shouldReload) {
            window.location.reload();
        }
    }, [shouldReload]);


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

                if (item.Request.status !== "คำขอถูกยกเลิก") {
                    return {
                        key: index,
                        name: item.Student.fnameTH + ' ' + item.Student.lnameTH,
                        student_ID: item.Student.id,
                        status: item.status,
                        id: item.id,
                        reqId: item.Request.id,
                        type: item.Request.type,
                        date: formattedDate,
                        period: timeSlots[item.period] + " น.",
                    }
                } else {
                    return {
                        key: index,
                        name: item.Student.fnameTH + ' ' + item.Student.lnameTH,
                        student_ID: item.Student.id,
                        status: item.status,
                        id: item.id,
                        reqId: item.Request.id,
                        type: item.Request.type,
                        date: formattedDate,
                        period: timeSlots[item.period] + " น.",
                    }
                }
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

    const handleStatusChange = async (record) => {
        console.log("record : ", record);
        try {
            setLoading(true);
            if (record.status === "ไม่มาเข้ารับบริการ") {
                await axios.post('/api/queue/changeStatusToLate', { id: record.id });
            } else if (record.status === "เข้ารับบริการแล้ว") {
                await axios.post('/api/queue/changeStatusToReceiveService', { id: record.id });
            }
            // Update the dataSource without refreshing the page
            setDataSource((prevDataSource) =>
                prevDataSource.map((item) =>
                    item.id === record.id ? { ...item, status: record.status } : item
                )
            );
            setLoading(false);
        } catch (error) {
            console.error('Error changing status:', error);
            setLoading(false);
        }
    };

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
                    style={{ width: 170 }}
                    onChange={(value) => handleStatusChange({ ...record, status: value })}
                >
                    <Select.Option value="จองคิวสำเร็จ" disabled={record.status === "ไม่มาเข้ารับบริการ"}>จองคิวสำเร็จ</Select.Option>
                    <Select.Option value="ไม่มาเข้ารับบริการ">ไม่มาเข้ารับบริการ</Select.Option>
                    <Select.Option value="เข้ารับบริการแล้ว">เข้ารับบริการแล้ว</Select.Option>
                </Select>
            ),
            filters: [
                { text: "จองคิวสำเร็จ", value: "จองคิวสำเร็จ" },
                { text: "ไม่มาเข้ารับบริการ", value: "ไม่มาเข้ารับบริการ" },
                { text: "เข้ารับบริการแล้ว", value: "เข้ารับบริการแล้ว" },
            ],
            filteredValue: filteredInfo?.status,
            onFilter: (value, record) => record?.status.includes(value),
            ellipsis: true,
            filterIcon: (filtered) => (
                <div>
                    <FilterOutlined style={{ color: "white", fontSize: "18px" }} />
                </div>
            ),
        },
        {
            title: 'ประเภทการเข้ารับบริการ',
            dataIndex: 'type',
            filters: [
                { text: "การเบิกจ่ายประกันอุบัติเหตุ", value: "การเบิกจ่ายประกันอุบัติเหตุ" },
                { text: "การผ่อนผันเข้ารับราชการทหาร", value: "การผ่อนผันเข้ารับราชการทหาร" },
                { text: "โครงการหลักประกันสุขภาพถ้วนหน้า", value: "โครงการหลักประกันสุขภาพถ้วนหน้า" },
                { text: "การสมัครนศท.รายใหม่และรายงานตัวนักศึกษาวิชาทหาร", value: "การสมัครนศท.รายใหม่และรายงานตัวนักศึกษาวิชาทหาร" },
                { text: "Health insurance", value: "Health insurance" },

            ],
            filteredValue: filteredInfo?.type,
            onFilter: (value, record) => record?.type.includes(value),
            ellipsis: true,
            filterIcon: (filtered) => (
                <div>
                    <FilterOutlined style={{ color: "white", fontSize: "18px" }} />
                </div>
            ),

        },
        {
            title: 'วันที่',
            dataIndex: 'date',
            sorter: (a, b) => {
                const dateA = new Date(a.date.split('/').reverse().join('-'));
                const dateB = new Date(b.date.split('/').reverse().join('-'));
                return dateA - dateB;
            },
            sortIcon: (sorted) => (
                <div>
                    <OrderedListOutlined style={{ color: "white", fontSize: "18px" }} />
                </div>
            ),
        },
        {
            title: 'เวลา',
            dataIndex: 'period',
            sorter: (a, b) => {
                const timeA = timeSlots.indexOf(a.period.split(' ')[0]);
                const timeB = timeSlots.indexOf(b.period.split(' ')[0]);
                return timeA - timeB;
            },
            sortIcon: (sorted) => (
                <div>
                    <OrderedListOutlined style={{ color: "white", fontSize: "18px" }} />
                </div>
            ),
        },
        {
            title: 'ชื่อ-นามสกุล',
            dataIndex: 'name',
            ...getColumnSearchProps("name"),
        },
        {
            title: 'รหัสนิสิต',
            dataIndex: 'student_ID',
            ...getColumnSearchProps("student_ID"),
        },
    ];

    return (
        <Layout style={{ minHeight: "100vh" }}> {/* ✅ ใช้ minHeight: 100vh */}
            <Sider
                trigger={null}
                width={320}
                style={{
                    background: "rgb(255,157,210)",
                    height: "100vh", // ✅ ป้องกันไม่ให้สูงขาด
                }}
            >
                <Menubar />
            </Sider>
            <Layout style={{ background: "rgb(255,157,210)" }}>
                <Content
                    style={{
                        padding: 24,
                        minHeight: 280,
                        background: "white",
                        // borderTopLeftRadius: '20px',  // โค้งเฉพาะมุมบนซ้าย
                        // borderBottomLeftRadius: '20px', // โค้งเฉพาะมุมล่างซ้าย

                    }}
                >
                    <div className='flex mb-5 justify-between'>
                        <div className='font-extrabold text-3xl'>
                            จัดการการนัดหมาย
                        </div>
                    </div>
                    {/* <div className='flex mt-12'>
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

                    </div> */}

                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        loading={loading}
                        style={{ borderRadius: borderRadiusLG }}
                        scroll={{ x: 'max-content' }}
                        bordered

                    />

                </Content>
            </Layout>
        </Layout>
    );
};

export default AppointmentManagement;