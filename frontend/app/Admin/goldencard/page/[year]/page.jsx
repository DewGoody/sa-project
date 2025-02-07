'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import {
    SearchOutlined,
    DownloadOutlined,
    FilterOutlined,
    OrderedListOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Input, Table, Space, Modal, Select } from 'antd';
const { Header, Sider, Content } = Layout;
const App = () => {
    const router = useRouter()
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reqMoreInfo, setReqMoreInfo] = useState('');
    const [moreInfoValue, setMoreInfoValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [shouldReload, setShouldReload] = useState(false);
    const [filteredInfo, setFilteredInfo] = useState({});
    const [fetchYear, setfetchYear] = useState([]);
    const { year } = useParams();
    console.log("year", year);
    console.log("fetchYear :", fetchYear);


    useEffect(() => {
        if (shouldReload) {
            window.location.reload();
        }
    }, [shouldReload]);

    const fetchUniqueYear = async () => {
        try {
            const res = await axios.post('/api/Admin/getyeargoldencard');
            setfetchYear(res.data.data);
        }
        catch (error) {
            console.error('Error fetching unique year:', error);
        }
    }
    const handleYearChange = async (year) => {
        console.log("year", year);
        router.push(`/Admin/goldencard/page/${year}`);
    }


    async function fetchPdfFile(form) {
        try {
            const response = await fetch(`/api/POSTPDF/getpdfadmin?id=${form}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const data = await response.json();
            if (data.binary_file_data) {
                const byteCharacters = atob(data.binary_file_data);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `student_${form}_file.zip`;
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
    async function fetchZipFile(form) {
        try {
            const response = await fetch(`/api/POSTPDF/getpdfadmin?id=${form}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${form}_บัตรทอง.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error fetching ZIP file:', error);
        }
    }

    const showModal = (record) => {
        setReqMoreInfo(record);
        console.log("recordModalJa :", typeof record);
        setIsModalOpen(true);
    };

    const handleOk = () => {
        const response = axios.post('/api/request/createMoreInfo', { id: parseInt(reqMoreInfo), more_info: moreInfoValue });

        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const formatDateToDMY = (dateString) => {
        if (!dateString) return 'N/A'; // Handle null or undefined dates

        const date = new Date(dateString); // Parse the input date string
        console.log("fdsfdsfdsf", date);

        const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits for day
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear(); // Get the full year

        return `${day}/${month}/${year}`; // Return in dd/mm/yyyy format
    };
    const formatDateToDMYWithTime = (dateString) => {
        if (!dateString) return 'N/A'; // Handle null or undefined dates

        const date = new Date(dateString); // Parse the input date string

        const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits for day
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = String(date.getFullYear()).slice(); // Get the last 2 digits of the year

        const hours = String(date.getHours()).padStart(2, '0'); // Ensure 2 digits for hours
        const minutes = String(date.getMinutes()).padStart(2, '0'); // Ensure 2 digits for minutes

        return `${day}/${month}/${year} เวลา:${hours}:${minutes}`; // Return in dd/mm/yy-hour:min format
    };

    const [Data, setData] = useState([])
    const fetchData = async () => {

        try {
            const response = await axios.post(`/api/Admin/getgoldenbyreq_id` , { year: parseInt(year) })
            setData(...Data, response.data.map((item, index) => ({
                key: index, // Unique key for each row
                fullname: `${item.Student?.fnameTH || ''} ${item.Student?.lnameTH || ''}`,
                student_ID: item.stu_id?.toString(),
                citizen_ID: item.Student?.thai_id || 'N/A',
                birthdate: formatDateToDMY(item.Student?.bd) || 'N/A',
                reqId: item.id,
                status: item.status,
                updateat: formatDateToDMYWithTime(item.created_at),
            })))
            // console.log(Data.status)

        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        console.log("Data", Data)
        // console.log("Status",Data.Objectkeys(0).status)
    }, [Data])
    useEffect(() => {
        fetchUniqueYear(),
            fetchData();
    }, [])
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [selectedKey, setSelectedKey] = useState('5');
    const [values, setValues] = useState({})
    const handleEditForm = async (id) => {
        console.log("editFormReqId : ", id);
        const response = await axios.post('/api/request/getById', { id: id }); // Example API
        console.log("editFormResponse :", response.data.data.path);
        router.push(`/Admin/goldencard/${response.data.data.form}`);
    }
    const handleChangeStatus = async (record) => {
        console.log("status11", record.status)
        if (record.status === "รอเจ้าหน้าที่ดำเนินการ") {
            try {
                setLoading(true);
                setShouldReload(true);
                const res = await axios.post('/api/request/changeStatusProcess', { id: parseInt(record.reqId) });
                setLoading(false);
                setShouldReload(false);
                console.log("res", res);
            } catch (error) {
                console.error('Error fetching status:', error);
            }
        } else if (record.status === "ขอข้อมูลเพิ่มเติม") {
            try {
                setLoading(true);
                setShouldReload(true);
                const res = await axios.post('/api/request/changeStatusToWantInfo', { id: parseInt(record.reqId) });
                setLoading(false);
                setShouldReload(false);
                console.log("res", res);
            } catch (error) {
                console.error('Error fetching status:', error);
            }
        }
        else if (record.status === "ส่งเอกสารแล้ว") {
            try {
                setLoading(true);
                setShouldReload(true);
                const res = await axios.post('/api/request/changeStatusToSended', { id: parseInt(record.reqId) });
                setLoading(false);
                setShouldReload(false);
                console.log("res", res);
            } catch (error) {
                console.error('Error fetching status:', error);
            }
        } else if (record.status === "ย้ายสิทธิสำเร็จ") {
            try {
                setLoading(true);
                setShouldReload(true);
                const res = await axios.post('/api/request/changeToTranApprove', { id: parseInt(record.reqId) });
                setLoading(false);
                setShouldReload(false);
                console.log("res", res);
            } catch (error) {
                console.error('Error fetching status:', error);
            }
        } else if (record.status === "ย้ายสิทธิไม่สำเร็จ") {
            try {
                setLoading(true);
                setShouldReload(true);
                const res = await axios.post('/api/request/changeToTranNotApprove', { id: parseInt(record.reqId) });
                setLoading(false);
                setShouldReload(false);
                console.log("res", res);
            } catch (error) {
                console.error('Error fetching status:', error);
            }
        }
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
            align: 'center',
            title: '',
            dataIndex: 'status',
            render: (status, record) => {
                if (status !== "ประวัติการแก้ไข") {
                    return (
                        <Space size="middle">
                            <Button onClick={() => handleEditForm(record.reqId)}>แก้ไข</Button>
                        </Space>)
                }
            },
        },
        {
            align: 'center', // เพิ่ม align ขวา
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
                        onClick={() => fetchZipFile(record.reqId)}
                    />
                </div>
            ),
        },
        {
            title: 'สถานะ',
            dataIndex: 'status',
            width: 200,
            render: (status, record) => {
                let options = [];
                if (status == "ยังไม่ได้ Upload เอกสาร") {
                    options = [
                        { value: 'ยังไม่ได้ Upload เอกสาร', label: 'ยังไม่ได้ Upload เอกสาร', },
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', disabled: true },
                        { value: 'ขอข้อมูลเพิ่มเติม', label: 'ขอข้อมูลเพิ่มเติม', disabled: true },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารแล้ว', disabled: true },
                        { value: 'ย้ายสิทธิสำเร็จ', label: 'ย้ายสิทธิสำเร็จ', disabled: true },
                        { value: 'ย้ายสิทธิไม่สำเร็จ', label: 'ย้ายสิทธิไม่สำเร็จ', disabled: true },
                    ]
                }
                else if (status == "รอเจ้าหน้าที่ดำเนินการ") {
                    options = [
                        { value: 'ยังไม่ได้ Upload เอกสาร', label: 'ยังไม่ได้ Upload เอกสาร', disabled: true },
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', },
                        { value: 'ขอข้อมูลเพิ่มเติม', label: 'ขอข้อมูลเพิ่มเติม' },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารแล้ว' },
                        { value: 'ย้ายสิทธิสำเร็จ', label: 'ย้ายสิทธิสำเร็จ', disabled: true },
                        { value: 'ย้ายสิทธิไม่สำเร็จ', label: 'ย้ายสิทธิไม่สำเร็จ', disabled: true },
                    ]
                }
                else if (status == "ขอข้อมูลเพิ่มเติม") {
                    options = [
                        { value: 'ยังไม่ได้ Upload เอกสาร', label: 'ยังไม่ได้ Upload เอกสาร', disabled: true },
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', disabled: true },
                        { value: 'ขอข้อมูลเพิ่มเติม', label: 'ขอข้อมูลเพิ่มเติม', },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารแล้ว', },
                        { value: 'ย้ายสิทธิสำเร็จ', label: 'ย้ายสิทธิสำเร็จ', disabled: true },
                        { value: 'ย้ายสิทธิไม่สำเร็จ', label: 'ย้ายสิทธิไม่สำเร็จ', disabled: true },
                    ]
                } else if (status == "ส่งเอกสารแล้ว") {
                    options = [
                        { value: 'ยังไม่ได้ Upload เอกสาร', label: 'ยังไม่ได้ Upload เอกสาร', disabled: true },
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', disabled: true },
                        { value: 'ขอข้อมูลเพิ่มเติม', label: 'ขอข้อมูลเพิ่มเติม', disabled: true },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารแล้ว', },
                        { value: 'ย้ายสิทธิสำเร็จ', label: 'ย้ายสิทธิสำเร็จ', },
                        { value: 'ย้ายสิทธิไม่สำเร็จ', label: 'ย้ายสิทธิไม่สำเร็จ', },
                    ]
                }
                else if (status == "ย้ายสิทธิสำเร็จ") {
                    options = [
                        { value: 'ยังไม่ได้ Upload เอกสาร', label: 'ยังไม่ได้ Upload เอกสาร', disabled: true },
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', disabled: true },
                        { value: 'ขอข้อมูลเพิ่มเติม', label: 'ขอข้อมูลเพิ่มเติม', disabled: true },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารแล้ว', disabled: true },
                        { value: 'ย้ายสิทธิสำเร็จ', label: 'ย้ายสิทธิสำเร็จ', },
                        { value: 'ย้ายสิทธิไม่สำเร็จ', label: 'ย้ายสิทธิไม่สำเร็จ', disabled: true },
                    ]
                } else if (status == "ย้ายสิทธิไม่สำเร็จ") {
                    options = [
                        { value: 'ยังไม่ได้ Upload เอกสาร', label: 'ยังไม่ได้ Upload เอกสาร', disabled: true },
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', disabled: true },
                        { value: 'ขอข้อมูลเพิ่มเติม', label: 'ขอข้อมูลเพิ่มเติม', },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารแล้ว', disabled: true },
                        { value: 'ย้ายสิทธิสำเร็จ', label: 'ย้ายสิทธิสำเร็จ', },
                        { value: 'ย้ายสิทธิไม่สำเร็จ', label: 'ย้ายสิทธิไม่สำเร็จ', },
                    ]
                }
                return (
                    <>
                        <Select
                            defaultValue={status}
                            style={{ width: "180px" }}
                            options={options}
                            onChange={(value) => handleChangeStatus({ ...record, status: value })}
                        />
                        {record.status === "ขอข้อมูลเพิ่มเติม" ?
                            <Button type="primary" style={{ marginLeft: "10px" }} onClick={() => showModal(record.reqId)}>เขียนรายละเอียด</Button>
                            : null}
                    </>
                )
            },
            filters: [
                { text: "ยังไม่ได้ Upload เอกสาร", value: "ยังไม่ได้ Upload เอกสาร" },
                { text: "รอเจ้าหน้าที่ดำเนินการ", value: "รอเจ้าหน้าที่ดำเนินการ" },
                { text: "ขอข้อมูลเพิ่มเติม", value: "ขอข้อมูลเพิ่มเติม" },
                { text: "ส่งเอกสารแล้ว", value: "ส่งเอกสารแล้ว" },
                { text: "ย้ายสิทธิสำเร็จ", value: "ย้ายสิทธิสำเร็จ" },
                { text: "ย้ายสิทธิไม่สำเร็จ", value: "ย้ายสิทธิไม่สำเร็จ" },
            ],
            filteredValue: filteredInfo?.status,
            onFilter: (value, record) => record?.status.includes(value),
            ellipsis: true,
            filterIcon: (filtered) => (
                <div>
                    <FilterOutlined style={{ color: "white", fontSize: "18px" }} />
                </div>
            ),
        }, {
            title: 'วันที่อัปโหลดเอกสาร',
            dataIndex: 'updateat',
            sorter: (a, b) => new Date(a.updateat) - new Date(b.updateat),
            sortIcon: (sorted) => (
                <div>
                    <OrderedListOutlined style={{ color: "white", fontSize: "18px" }} />
                </div>
            ),
        },
        {
            title: 'ชื่อ-นามสกุล',
            dataIndex: 'fullname',
            ...getColumnSearchProps('fullname'),
        },

        {
            title: 'รหัสนิสิต',
            dataIndex: 'student_ID',
            ...getColumnSearchProps('student_ID'),
        },
        {
            title: 'เลขบัตรประชาชน',
            dataIndex: 'citizen_ID',
            ...getColumnSearchProps('citizen_ID'),
        },
        {
            title: 'วันเดือนปีเกิด',
            dataIndex: 'birthdate',
        },
    ];


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
                            บัตรทอง
                        </div>
                    </div>
                    <div className='flex mt-12'>
                        <div className='mt-2 ml-3 font-normal text-base'>
                            เลือกปี
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
                        dataSource={Data}
                        columns={columns}
                        rowClassName={(record, index) =>
                            index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
                        }
                    />
                    <Modal
                        title="เขียนรายละเอียดขอข้อมูลเพิ่มเติม"
                        open={isModalOpen}
                        onOk={handleOk}
                        loading={loading}
                        onCancel={handleCancel}
                        footer={[
                            <Button key="back" onClick={handleCancel}>
                                ปิด
                            </Button>,
                            <Button key="submit" type="primary" onClick={handleOk}>
                                ยืนยัน
                            </Button>,

                        ]}
                    >
                        <textarea
                            style={{ width: "100%", height: "200px", border: "gray solid", borderRadius: "15px", padding: "15px", fontSize: "18px" }}

                            onChange={(e) => setMoreInfoValue(e.target.value)}
                        >
                        </textarea>
                    </Modal>
                </Content>
            </Layout>
        </Layout>
    );
};
export default App;