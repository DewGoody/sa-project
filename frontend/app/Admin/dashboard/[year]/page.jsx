'use client'
import React, { useEffect, useState } from 'react';
import {
    SearchOutlined,
    FilterOutlined,
    OrderedListOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Input, Table, Select, Modal,Card, Row, Col, Statistic, Progress } from 'antd';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
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
    const [countStudent, setCountStudent] = useState([]);
    const [tableType, setTableType] = useState(0);
    const [countAll0, setCountAll0] = useState(0);
    const [countFinish0, setCountFinish0] = useState(0);
    const [countNotFinish0, setCountNotFinish0] = useState(0);
    const [countCancel0, setCountCancel0] = useState(0);

    const [countAll1, setCountAll1] = useState(0);
    const [countFinish1, setCountFinish1] = useState(0);
    const [countNotFinish1, setCountNotFinish1] = useState(0);
    const [countCancel1, setCountCancel1] = useState(0);
    const [countAll2, setCountAll2] = useState(0);
    const [countFinish2, setCountFinish2] = useState(0);
    const [countNotFinish2, setCountNotFinish2] = useState(0);
    const [countCancel2, setCountCancel2] = useState(0);
    const [countAll3, setCountAll3] = useState(0);
    const [countFinish3, setCountFinish3] = useState(0);
    const [countNotFinish3, setCountNotFinish3] = useState(0);
    const [countCancel3, setCountCancel3] = useState(0);
    const [countAll4, setCountAll4] = useState(0);
    const [countFinish4, setCountFinish4] = useState(0);
    const [countNotFinish4, setCountNotFinish4] = useState(0);
    const [countCancel4, setCountCancel4] = useState(0);
    const [countAll5, setCountAll5] = useState(0);
    const [countFinish5, setCountFinish5] = useState(0);
    const [countNotFinish5, setCountNotFinish5] = useState(0);
    const [countCancel5, setCountCancel5] = useState(0);
    const [countAll6, setCountAll6] = useState(0);
    const [countFinish6, setCountFinish6] = useState(0);
    const [countNotFinish6, setCountNotFinish6] = useState(0);
    const [countCancel6, setCountCancel6] = useState(0);
    const [countAll7, setCountAll7] = useState(0);
    const [countFinish7, setCountFinish7] = useState(0);
    const [countNotFinish7, setCountNotFinish7] = useState(0);
    const [countCancel7, setCountCancel7] = useState(0);
    


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
    const handleExportExcel = () => {
        const exportData = dataSource.map(({ key, id, reqId, ...rest }) => rest); // ลบ key, id และ reqId ออกก่อน export
        const worksheet = XLSX.utils.json_to_sheet(exportData);

        // แก้ไข header ใน Excel
        const headers = [
            "ชื่อ-นามสกุล", 
            "รหัสนิสิต", 
            "สถานะ", 
            "ประเภทการเข้ารับบริการ", 
            "วันที่จองคิว", 
            "เวลาจองคิว"
        ];
        XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });

        // เพิ่มความกว้างของคอลัมน์
        const columnWidths = headers.map(() => ({ wch: 25 })); // กำหนดความกว้างเป็น 20 สำหรับทุกคอลัมน์
        worksheet['!cols'] = columnWidths;

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Appointments");
    
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "appointment_summary.xlsx");
    };


    const handleSearch = (value, dataIndex) => {
        setSearchText(value);
        setSearchedColumn(dataIndex);
    };


    const fetchCountStudent = async () => {
        try {
            const res = await axios.post('/api/queue/getCount', { year: year });
            console.log("countStudent", res.data.data);
            setCountStudent(res.data.data);
        }
        catch (error) {
            console.error('Error fetching count student:', error);
        }
    }

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

    const fetchStuData = async () => {
        try {
            const res = await axios.post('/api/queue/getAll', { year: 0 });
            console.log("stuData", res.data.data);
            setStuData(res.data.data);
            setCountAll0(res.data.data.length);
            setCountFinish0(res.data.data.filter(item => item.status === "เข้ารับบริการแล้ว").length);
            setCountNotFinish0(res.data.data.filter(item => item.status === "ไม่มาเข้ารับบริการ").length);
            setCountCancel0(res.data.data.filter(item => item.status === "คิวถูกยกเลิก").length);
            
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
                } 
                else {
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
        // fetchCountStudent()
    }, []);

    useEffect(() => {
        fetchUniqueYear()
    }, [])



    console.log("statusRequest", statusRequest);


    console.log("dataSource", dataSource);

    const handleYearChange = async (year) => {
        console.log("year", year);
        router.push(`/Admin/dashboard/${year}`);
    }

    const handleTypeChange = (value) => {
        setTableType(value);
        if (value === 0) {
            const newData = stuData.map((item, index) => {
                const date = new Date(item.Timeslot.date);
                const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    
                return {
                    key: index,
                    name: `${item.Student.fnameTH} ${item.Student.lnameTH}`,
                    student_ID: item.Student.id,
                    status: item.status,
                    id: item.id,
                    reqId: item.Request.id,
                    type: item.Request.type,
                    date: formattedDate,
                    period: timeSlots[item.period] + " น.",
                };
                
            });
            setDataSource(newData);
            setCountAll0(newData.length);
            setCountFinish0(newData.filter(item => item.status === "เข้ารับบริการแล้ว").length);
            setCountNotFinish0(newData.filter(item => item.status === "ไม่มาเข้ารับบริการ").length);
            setCountCancel0(newData.filter(item => item.status === "คิวถูกยกเลิก").length);
        } 
        else if (value === 1) {
            const filtered = stuData.filter(item => item.Request.type === "การเบิกจ่ายประกันอุบัติเหตุ");
            const newData = filtered.map((item, index) => {
                const date = new Date(item.Timeslot.date);
                const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    
                return {
                    key: index,
                    name: `${item.Student.fnameTH} ${item.Student.lnameTH}`,
                    student_ID: item.Student.id,
                    status: item.status,
                    id: item.id,
                    reqId: item.Request.id,
                    type: item.Request.type,
                    date: formattedDate,
                    period: timeSlots[item.period] + " น.",
                };
                
            });
            setDataSource(newData);
            setCountAll1(filtered.length);
            setCountFinish1(filtered.filter(item => item.status === "เข้ารับบริการแล้ว").length);
            setCountNotFinish1(filtered.filter(item => item.status === "ไม่มาเข้ารับบริการ").length);
            setCountCancel1(filtered.filter(item => item.status === "คิวถูกยกเลิก").length);
        } 
        else if (value === 2) {
            const filtered = stuData.filter(item => item.Request.type === "การผ่อนผันเข้ารับราชการทหาร");
            const newData = filtered.map((item, index) => {
                const date = new Date(item.Timeslot.date);
                const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    
                return {
                    key: index,
                    name: `${item.Student.fnameTH} ${item.Student.lnameTH}`,
                    student_ID: item.Student.id,
                    status: item.status,
                    id: item.id,
                    reqId: item.Request.id,
                    type: item.Request.type,
                    date: formattedDate,
                    period: timeSlots[item.period] + " น.",
                };
            });
            setDataSource(newData);
            setCountAll2(filtered.length);
            setCountFinish2(filtered.filter(item => item.status === "เข้ารับบริการแล้ว").length);
            setCountNotFinish2(filtered.filter(item => item.status === "ไม่มาเข้ารับบริการ").length);
            setCountCancel2(filtered.filter(item => item.status === "คิวถูกยกเลิก").length);

        }
        else if (value === 3) {
            const filtered = stuData.filter(item => item.Request.type === "โครงการหลักประกันสุขภาพถ้วนหน้า");
            const newData = filtered.map((item, index) => {
                const date = new Date(item.Timeslot.date);
                const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    
                return {
                    key: index,
                    name: `${item.Student.fnameTH} ${item.Student.lnameTH}`,
                    student_ID: item.Student.id,
                    status: item.status,
                    id: item.id,
                    reqId: item.Request.id,
                    type: item.Request.type,
                    date: formattedDate,
                    period: timeSlots[item.period] + " น.",
                };
            });
            setDataSource(newData);
            setCountAll3(filtered.length);
            setCountFinish3(filtered.filter(item => item.status === "เข้ารับบริการแล้ว").length);
            setCountNotFinish3(filtered.filter(item => item.status === "ไม่มาเข้ารับบริการ").length);
            setCountCancel3(filtered.filter(item => item.status === "คิวถูกยกเลิก").length);

        }
        else if (value === 4) {
            const filtered = stuData.filter(item => item.Request.type === "การสมัครนศท.รายใหม่และรายงานตัวนักศึกษาวิชาทหาร");
            const newData = filtered.map((item, index) => {
                const date = new Date(item.Timeslot.date);
                const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    
                return {
                    key: index,
                    name: `${item.Student.fnameTH} ${item.Student.lnameTH}`,
                    student_ID: item.Student.id,
                    status: item.status,
                    id: item.id,
                    reqId: item.Request.id,
                    type: item.Request.type,
                    date: formattedDate,
                    period: timeSlots[item.period] + " น.",
                };
            });
            setDataSource(newData);
            setCountAll4(filtered.length);
            setCountFinish4(filtered.filter(item => item.status === "เข้ารับบริการแล้ว").length);
            setCountNotFinish4(filtered.filter(item => item.status === "ไม่มาเข้ารับบริการ").length);
            setCountCancel4(filtered.filter(item => item.status === "คิวถูกยกเลิก").length);
        }
        else if (value === 5) {
            const filtered = stuData.filter(item => item.Request.type === "Health insurance");
            const newData = filtered.map((item, index) => {
                const date = new Date(item.Timeslot.date);
                const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    
                return {
                    key: index,
                    name: `${item.Student.fnameTH} ${item.Student.lnameTH}`,
                    student_ID: item.Student.id,
                    status: item.status,
                    id: item.id,
                    reqId: item.Request.id,
                    type: item.Request.type,
                    date: formattedDate,
                    period: timeSlots[item.period] + " น.",
                };
            });
            setDataSource(newData);
            setCountAll5(filtered.length);
            setCountFinish5(filtered.filter(item => item.status === "เข้ารับบริการแล้ว").length);
            setCountNotFinish5(filtered.filter(item => item.status === "ไม่มาเข้ารับบริการ").length);
            setCountCancel5(filtered.filter(item => item.status === "คิวถูกยกเลิก").length);
        }
        else if (value === 6) {
            const filtered = stuData.filter(item => item.Request.type === "กองทุนเงินให้กู้ยืมเพื่อการศึกษา (กยศ.)");
            const newData = filtered.map((item, index) => {
                const date = new Date(item.Timeslot.date);
                const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    
                return {
                    key: index,
                    name: `${item.Student.fnameTH} ${item.Student.lnameTH}`,
                    student_ID: item.Student.id,
                    status: item.status,
                    id: item.id,
                    reqId: item.Request.id,
                    type: item.Request.type,
                    date: formattedDate,
                    period: timeSlots[item.period] + " น.",
                };
            });
            setDataSource(newData);
            setCountAll6(filtered.length);
            setCountFinish6(filtered.filter(item => item.status === "เข้ารับบริการแล้ว").length);
            setCountNotFinish6(filtered.filter(item => item.status === "ไม่มาเข้ารับบริการ").length);
            setCountCancel6(filtered.filter(item => item.status === "คิวถูกยกเลิก").length);
        }
        else if (value === 7) {
            const filtered = stuData.filter(item => item.Request.type === "แบบคำขอรับเงินผ่านธนาคารสำหรับผู้ขาย");
            const newData = filtered.map((item, index) => {
                const date = new Date(item.Timeslot.date);
                const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    
                return {
                    key: index,
                    name: `${item.Student.fnameTH} ${item.Student.lnameTH}`,
                    student_ID: item.Student.id,
                    status: item.status,
                    id: item.id,
                    reqId: item.Request.id,
                    type: item.Request.type,
                    date: formattedDate,
                    period: timeSlots[item.period] + " น.",
                };
            });
            setDataSource(newData);
            setCountAll7(filtered.length);
            setCountFinish7(filtered.filter(item => item.status === "เข้ารับบริการแล้ว").length);
            setCountNotFinish7(filtered.filter(item => item.status === "ไม่มาเข้ารับบริการ").length);
            setCountCancel7(filtered.filter(item => item.status === "คิวถูกยกเลิก").length);
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
        },
        {
            title: 'ประเภทการเข้ารับบริการ',
            dataIndex: 'type',

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
        {
            title: 'วันที่จองคิว',
            dataIndex: 'date',
        },
        {
            title: 'เวลาจองคิว',
            dataIndex: 'period',
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
                            หน้าสรุปการนัดหมาย
                        </div>
                    </div>
                    <div className='flex'>
                    <div className='flex mt-12'>
                        <div className='mt-2 ml-3 font-normal text-base'>
                            เลือกปีการศึกษา
                        </div>
                        <div className='mt-1 mb-6 '>
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
                    <div className='flex mt-12'>
                        <div className='mt-2 ml-3 font-normal text-base'>
                            เลือกการนัดหมาย
                        </div>
                        <div className='mt-1 mb-6 '>
                            <Select
                                value={tableType}
                                style={{ width: 260, marginLeft: 10 }}
                                onChange={handleTypeChange}
                            >
                                <Select.Option value={0}>การนัดหมายทั้งหมด</Select.Option>
                                <Select.Option value={1}>การเบิกจ่ายประกันอุบัติเหตุ</Select.Option>
                                <Select.Option value={4}>การสมัครนศท.รายใหม่และรายงานตัวนักศึกษาวิชาทหาร</Select.Option>
                                <Select.Option value={2}>การผ่อนผันเข้ารับราชการทหาร</Select.Option>
                                <Select.Option value={5}>Health insurance</Select.Option>
                                <Select.Option value={6}>กองทุนเงินให้กู้ยืมเพื่อการศึกษา (กยศ.)</Select.Option>
                                <Select.Option value={7}>แบบคำขอรับเงินผ่านธนาคารสำหรับผู้ขาย</Select.Option>
                               
                            </Select>
                            
                          
                        </div>
                       
                    </div>
                    </div>
                    <div className='mt-2'>
                           <Row gutter={16} wrap={false} style={{ marginTop: '16px',overflowX: 'auto', whiteSpace: 'nowrap' }}>
                            <Col style={{ flex: '0 0 auto' }}>
                            <Card style={{ width: 200}}>
                                <Statistic 
                                title={<span style={{ fontWeight: 'semi-bold', fontSize: '22px', color: 'black' }}>นัดหมายทั้งหมด</span>}
                                value={
                                    tableType === 0
                                      ? countAll0
                                      : tableType === 1
                                      ? countAll1
                                      : tableType === 2
                                      ? countAll2
                                      : tableType === 3
                                      ? countAll3
                                      : tableType === 4
                                        ? countAll4
                                        : tableType === 5
                                        ? countAll5
                                        : tableType === 6
                                        ? countAll6
                                        : tableType === 7
                                        ? countAll7
                                      : countStudent?.studentCount ?? 0
                                  }
                                />
                            </Card>
                            </Col>
                            <Col style={{ flex: '0 0 auto' }}>
                            <Card style={{ width: 220 }}>
                                <Statistic 
                                title={<span style={{ fontWeight: 'semi-bold', fontSize: '22px', color: 'black' }}>มาเข้ารับบริการ</span>}
                                value={
                                    tableType === 0
                                    ? countFinish0
                                    : tableType === 1
                                    ? countFinish1
                                    : tableType === 2
                                    ? countFinish2
                                    : tableType === 3
                                    ? countFinish3
                                    : tableType === 4
                                    ? countFinish4
                                    : tableType === 5
                                    ? countFinish5
                                    : tableType === 6
                                    ? countFinish6
                                    : tableType === 7
                                    ? countFinish7
                                      : countStudent?.finishQueueCount ?? 0
                                  } 
                                />
                            </Card>
                            </Col>
                            <Col style={{ flex: '0 0 auto' }}>
                            <Card style={{ width: 220 }}>
                                <Statistic 
                                title={<span style={{ fontWeight: 'semi-bold', fontSize: '22px', color: 'black' }}>ไม่มาเข้ารับบริการ</span>}
                                value={
                                    tableType === 0
                                      ? countNotFinish0
                                      : tableType === 1
                                      ? countNotFinish1
                                      : tableType === 2
                                      ? countNotFinish2
                                      : tableType === 3
                                      ? countNotFinish3
                                      : tableType === 4
                                        ? countNotFinish4
                                        : tableType === 5
                                        ? countNotFinish5
                                        : tableType === 6
                                        ? countNotFinish6
                                        : tableType === 7
                                        ? countNotFinish7
                                      : countStudent?.notFinishQueueCount ?? 0
                                  } 
                                />
                            </Card>
                            </Col>
                            <Col style={{ flex: '0 0 auto' }}>
                            <Card style={{ width: 200 }}>
                                <Statistic 
                                title={<span style={{ fontWeight: 'semi-bold', fontSize: '22px', color: 'black' }}>ยกเลิกคิว</span>} 
                                value={
                                    tableType === 0
                                      ? countCancel0
                                      : tableType === 1
                                      ? countCancel1
                                      : tableType === 2
                                      ? countCancel2
                                      : tableType === 3
                                      ? countCancel3
                                      : tableType === 4
                                        ? countCancel4
                                        : tableType === 5
                                        ? countCancel5
                                        : tableType === 6
                                        ? countCancel6
                                        : tableType === 7
                                        ? countCancel7
                                      : countStudent?.cancleQueueCount ?? 0
                                  }
                                />
                            </Card>
                            </Col>
                        </Row>
                    </div>
                    <div className="flex justify-end">
                        <Button type="primary" onClick={handleExportExcel}>
                            Export Excel
                        </Button>
                    </div>

                    <Table
                        className="mt-4"
                        columns={columns}
                        dataSource={dataSource}
            
                        onChange={(pagination, filters) => {
                            setFilteredInfo(filters);
                        }}
                        scroll={{ x: 'max-content' }}
                        style={{
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                            // padding: 24,
                        }}
                    />
                    

                   
                </Content>
            </Layout>
        </Layout>
    );
};

export default AppointmentManagement;