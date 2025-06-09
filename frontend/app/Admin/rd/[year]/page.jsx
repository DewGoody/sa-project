'use client'
import React, { useState, useEffect, use } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx'; // เพิ่ม XLSX สำหรับ export
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';// เพิ่ม FileSaver สำหรับบันทึกไฟล์
import { parseISO, format } from "date-fns";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
    DownloadOutlined,
    SearchOutlined,
    FilterOutlined,
    OrderedListOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Modal, DatePicker, Input, Table, Space, Select } from 'antd';
const { Header, Sider, Content } = Layout;
import { useParams, useRouter } from 'next/navigation';
import Menubar from '../../component/menu';
const App = () => {
    const router = useRouter()
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [Data, setData] = useState([])
    const [loading, setLoading] = useState(false);
    const [shouldReload, setShouldReload] = useState(false)
    const [filteredInfo, setFilteredInfo] = useState({});
    const [fetchYear, setfetchYear] = useState([]);
    const { year } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        date: null,
        firstPayment: '',
        secondPayment: ''
    });

    const getdatemoney = async () => {
        try {
            const response = await axios.get(`/api/militaryapi/datemoney`);
            const data = response.data.data; // ดึงข้อมูลจาก API response

            handleChange("date", data.date);
            handleChange("firstPayment", data.firstPayment);
            handleChange("secondPayment", data.secondPayment);
        } catch (error) {
            console.error("Error fetching date and money:", error);
        }
    };

    useEffect(() => {
        getdatemoney();
    }, []);
    const showModal = () => setIsModalOpen(true);
    const handleCancel = () => setIsModalOpen(false);
    const handleOk = async () => {
        try {
            const response = await axios.post('/api/militaryapi/datemoney', {
                date: formData.date,
                firstPayment: formData.firstPayment,
                secondPayment: formData.secondPayment
            }, {
                headers: { "Content-Type": "application/json" } // กำหนด header
            });

            console.log("Server Response:", response.data);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error submitting data:", error);
        }
    };


    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const formatDateToDMYWithTime = (dateString) => {
        // console.log(dateString);

        if (!dateString) return 'N/A'; // Handle null or undefined dates

        const date = new Date(dateString); // Parse the input date string

        const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits for day
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = String(date.getFullYear()).slice(); // Get the last 2 digits of the year

        const hours = String(date.getHours()).padStart(2, '0'); // Ensure 2 digits for hours
        const minutes = String(date.getMinutes()).padStart(2, '0'); // Ensure 2 digits for minutes

        return `${day}/${month}/${year}`; // Return in dd/mm/yy-hour:min format
    };

    const handleSearch = (value, dataIndex) => {
        setSearchText(value);
        setSearchedColumn(dataIndex);
    };
    const handleEditForm = async (id, year) => {
        // const response = await axios.post('/api/request/getById', { id: id }); // Example API
        console.log("asffdsfasfdsfsdafsdafs", id, year);

        if (year == 1) {
            router.push(`/student/0/rordor/${id}/1/checkData`);

        }
        else {

            router.push(`/student/0/rordor/${id}/1/checkData2`);

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

    useEffect(() => {
        if (shouldReload) {
            setTimeout(() => window.location.reload(), 1000);
        }
    }, [shouldReload]);

    const fetchUniqueYear = async () => {
        try {
            const res = await axios.post('/api/Admin/getyearrordor');
            setfetchYear(res.data.data);
        }
        catch (error) {
            console.error('Error fetching unique year:', error);
        }
    }
    const handleYearChange = async (year) => {
        console.log("year", year);
        router.push(`/Admin/rd/${year}`);
    }

    const fetchData = async () => {
        try {
            const response = await axios.post(`/api/Admin/getrordor`, { year: parseInt(year) })
            response.data.map((item) => {
                console.log("กหดหกดกหดกหดกหดหก", item);

            });

            setData(...Data, response.data.map((item, index) => ({
                key: index, // Unique key for each row
                fullname: `${item.Student?.fnameTH || ''} ${item.Student?.lnameTH || ''}`,
                student_ID: item.Student?.id,
                citizen_ID: item.Student?.thai_id || '-',
                birthdate: formatDateToDMYWithTime(item.Student?.bd) || '-',
                status: item.status,
                reqId: item.id,
                rd_ID: item.RD_info?.[0]?.citizenRD || '-',
                yearRD: item.RD_info?.[0]?.RD_type || '-',
            })))
            console.log(Data.reqId);
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchUniqueYear()
        fetchData()

    }, [])
    useEffect(() => {
        console.log("reqId", Data);

    }, [Data])
    const [collapsed, setCollapsed] = useState(false);



    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [selectedKey, setSelectedKey] = useState('4');
    const handleChangeStatus = async (record) => {
        if (record.status === "รอเจ้าหน้าที่ดำเนินการ") {
            try {
                setLoading(true);
                const res = await axios.post('/api/request/changeStatusToProcess', { id: parseInt(record.reqId) });
                setLoading(false);
                console.log("res", res);

                // Update the specific record in the Data state
                setData(prevData =>
                    prevData.map(item =>
                        item.reqId === record.reqId ? { ...item, status: "รอเจ้าหน้าที่ดำเนินการ" } : item
                    )
                );
            } catch (error) {
                console.error('Error fetching status:', error);
            }
        } else if (record.status === "เสร็จสิ้น") {
            try {
                setLoading(true);
                const res = await axios.post('/api/request/changeStatusToSucc', { id: parseInt(record.reqId) });
                setLoading(false);
                console.log("res", res);

                // Update the specific record in the Data state
                setData(prevData =>
                    prevData.map(item =>
                        item.reqId === record.reqId ? { ...item, status: "เสร็จสิ้น" } : item
                    )
                );
            } catch (error) {
                console.error('Error fetching status:', error);
            }
        }
    };
    const filepdf = async (reqId, year) => {
        try {
            if (year == 1) {
                console.log(reqId);

                const response = await axios.get(`/api/export/RD1?id=${reqId}`, { responseType: 'blob' });

                return response.data;
            } else {
                console.log(reqId);

                const response = await axios.get(`/api/export/RD2?id=${reqId}`, { responseType: 'blob' });

                return response.data;
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handleDownload = async (student_ID, reqId, year) => {
        const pdfBlob = await filepdf(reqId, year);
        if (pdfBlob) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(pdfBlob);
            link.download = `RD${year} ${student_ID}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        }
    };
    const columns = [
        {
            title: 'แก้ไข',
            dataIndex: 'status',
            render: (status, record) => {
                if (status !== "ประวัติการแก้ไข" && status !== "เสร็จสิ้น" && status !== "คำขอถูกยกเลิก") {
                    return (
                        <Space size="middle">
                            <Button onClick={() => handleEditForm(record.reqId, record.yearRD)}>แก้ไข</Button>
                        </Space>)
                }
            },
        },
        {
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
                        onClick={() => handleDownload(record.student_ID, record.reqId, record.yearRD)}
                    />
                </div>
            ),
        },
        {
            title: 'สถานะ',
            dataIndex: 'status',
            render: (status, record) => {
                console.log("status", status)
                let options = [];
                if (status == "รอเข้ารับบริการ") {
                    options = [
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', },
                        { value: 'เสร็จสิ้น', label: 'เสร็จสิ้น', },
                    ]
                } else if (status == "รอเจ้าหน้าที่ดำเนินการ") {
                    options = [
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', disabled: true },
                        { value: 'เสร็จสิ้น', label: 'เสร็จสิ้น', },
                    ]
                } else if (status == "เสร็จสิ้น") {
                    options = [
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', disabled: true },
                        { value: 'เสร็จสิ้น', label: 'เสร็จสิ้น', disabled: true },
                    ]
                }
                return (
                    <Select
                        defaultValue={status}
                        style={{ width: "180px" }}
                        options={options}
                        onChange={(value) => handleChangeStatus({ ...record, status: value })}
                    />
                )
            },
            filters: [
                { text: "รอเข้ารับบริการ", value: "รอเข้ารับบริการ" },
                { text: "รอเจ้าหน้าที่ดำเนินการ", value: "รอเจ้าหน้าที่ดำเนินการ" },
                { text: "เสร็จสิ้น", value: "เสร็จสิ้น" },
            ],
            filteredValue: filteredInfo?.status,
            onFilter: (value, record) => record?.status.includes(value),
            // ellipsis: true,
            filterIcon: (filtered) => (
                <div>
                    <FilterOutlined style={{ color: "white", fontSize: "18px" }} />
                </div>
            ),
        },
        {
            title: 'ชื่อ-นามสกุล',
            dataIndex: 'fullname',
            width: 250,
            ...getColumnSearchProps('fullname'),
        }, {
            title: 'ชั้นปี นศท',
            dataIndex: 'yearRD',
            ...getColumnSearchProps('yearRD'),
        },
        {
            title: 'รหัสนิสิต',
            dataIndex: 'student_ID',
            ...getColumnSearchProps('student_ID'),
        },
        {
            title: 'รหัสนักศึกษาวิชาทหาร',
            dataIndex: 'rd_ID',
            width: 200,
            ...getColumnSearchProps('rd_ID'),
        },
        {
            title: 'เลขบัตรประชาชน',
            dataIndex: 'citizen_ID',
            width: 200,
            ...getColumnSearchProps('citizen_ID'),
        },
        {
            title: 'วันเดือนปีเกิด',
            dataIndex: 'birthdate',
        },
    ];


    const exportToExcel = () => {
        // กำหนดชื่อ Columns ที่ต้องการ
        const columnHeaders = [
            // { header: "ลำดับ", key: "key" },
            { header: "ชื่อ-นามสกุล", key: "fullname" },
            { header: "รหัสนักศึกษา", key: "student_ID" },
            { header: "เลขบัตรประชาชน", key: "citizen_ID" },
            { header: "วันเกิด", key: "birthdate" },
            { header: "สถานะ", key: "status" },
            { header: "เลขประจำตัว นศท", key: "rd_ID" },
            { header: "ชั้นปี นศท", key: "yearRD" }
        ];

        // เพิ่มชื่อ Columns เข้าไปเป็น Row แรก
        const dataWithHeaders = [
            columnHeaders.map(col => col.header), // แถวแรกเป็นหัวตาราง
            ...Data.map((item) => columnHeaders.map(col => item[col.key] || '')) // ข้อมูลตามลำดับ
        ];

        // สร้าง Worksheet ด้วยข้อมูลที่มี Header
        const worksheet = XLSX.utils.aoa_to_sheet(dataWithHeaders);

        // สร้าง Workbook และเพิ่ม Worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

        // เขียนไฟล์ Excel และดาวน์โหลด
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "exported_data.xlsx");
    };
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRowReqid, setSelectedRowReqid] = useState([]);
    const [selectedRowReqidapi, setSelectedRowReqidapi] = useState([]);

    const onSelectChange = (newSelectedRowKeys, selectedRows) => {
        console.log('selectedRowKeys changed:', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
        setSelectedRowReqid(selectedRows.map(row => row)); // อัปเดตรายการที่เลือก
        setSelectedRowReqidapi(selectedRows.map(row => row.reqId)); // อัปเดตรายการที่เลือก
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,

        selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
        ],
    };

    // ตรวจสอบค่าที่อัปเดตล่าสุด
    useEffect(() => {
        console.log("Updated selected reqids:", selectedRowReqidapi);
    }, [selectedRowReqid]);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleChangeStatusAll = async (ids, status) => {
        try {
            setLoading(true);
            await axios.post('/api/request/changeStatusAll', { ids, status });

            setData((prevDataSource) => {
                const updatedData = prevDataSource.map((item) =>
                    ids.includes(item.reqId) ? { ...item, status } : item
                );
                return [...updatedData]; // เปลี่ยน reference
            });

            setRefreshKey(prev => prev + 1); // บังคับให้ Table re-render
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const dropdown = () => {
        const handleSelect = async (value) => {
            try {
                console.log("selectRow", selectedRowReqidapi);
                console.log("value", value);

                handleChangeStatusAll(selectedRowReqidapi, value)
            } catch (error) {
                console.error("Error:", error);
            }
        };

        return (
            <Select
                className="w-full mt-1 mb-6 "
                // showSearch
                placeholder="เลือกสถานะ"
                filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={[
                    { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ' },
                    { value: 'เสร็จสิ้น', label: 'เสร็จสิ้น' },
                ]}
                onSelect={handleSelect} // ใช้ฟังก์ชัน handleSelect
            />
        );
    };

    return (
        <Layout style={{ height: "100vh" }}>
            <Sider trigger={null} width={320} style={{ background: "rgb(255,157,210)" }}>
                <Menubar />
            </Sider>
            <Layout style={{ background: "rgb(255,157,210)" }}>
                <Content
                    style={{
                        padding: 24,
                        minHeight: 280,
                        background: "white",
                        // borderTopLeftRadius: '20px',  // โค้งเฉพาะมุมบนซ้าย
                        // borderTopLeftRadius: '20px',  // โค้งเฉพาะมุมบนซ้าย
                        // borderBottomLeftRadius: '20px', // โค้งเฉพาะมุมล่างซ้าย

                    }}
                >
                    <div className='flex mb-5 justify-between'>
                        <div className='font-extrabold text-3xl'>
                            นักศึกษาวิชาทหาร
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

                        <div className='mt-1 mb-6 px-4'>
                            <Button type="primary" onClick={showModal} style={{ marginBottom: '16px' }}>
                                เพิ่มวันเวลารายงานตัว
                            </Button>
                        </div>
                        <Modal
                            title="เพิ่มวันเวลารายงานตัว"
                            open={isModalOpen}
                            onOk={handleOk}
                            onCancel={handleCancel}
                        >
                            <h1>วันที่</h1>
                            <DatePicker
                                format="DD/MM/YYYY"
                                value={formData.date ? dayjs(formData.date, "YYYY-MM-DD") : null}
                                onChange={(date) => {
                                    handleChange("date", format(date, "yyyy-MM-dd"));
                                }}
                                allowClear={false}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />

                            {/* <DatePicker
                                style={{ width: '100%', marginBottom: 10 }}
                                value={formData.date ? dayjs(formData.date) : null}
                                onChange={(date, dateString) => handleChange('date', dateString)}
                                placeholder="เลือกวันที่"
                                format="DD/MM/YYYY"
                            /> */}
                            <h1>ค่าสมัคร นศท</h1>
                            <Input
                                value={formData.firstPayment}
                                placeholder="ค่าสมัคร นศท"
                                style={{ marginBottom: 10 }}
                                onChange={e => handleChange('firstPayment', e.target.value)}
                            />
                            <h1>ค่ารายงานตัว นศท</h1>
                            <Input
                                value={formData.secondPayment}

                                placeholder="ค่ารายงานตัว นศท"
                                onChange={e => handleChange('secondPayment', e.target.value)}
                            />
                        </Modal>
                        <div >
                            {selectedRowReqidapi.length > 0 && dropdown()}
                        </div>
                    </div>
                    <Table
                        rowSelection={rowSelection} columns={columns} dataSource={Data} loading={loading} key={refreshKey}
                        bordered
                        scroll={{ x: 'max-content' }}
                    />
                </Content>
            </Layout>
        </Layout>
    );
};
export default App;