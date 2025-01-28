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
import * as XLSX from 'xlsx';


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
    const [statusRequest, setStatusRequest] = useState([]);
    const [loading, setLoading] = useState(false);
    const [shouldReload, setShouldReload] = useState(false);
    const [filteredInfo, setFilteredInfo] = useState({});
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
            const res = await axios.post('/api/request/getPonpanAdmin', { year: parseInt(year) });
            console.log("stuData", res.data.data);
            setStuData(res.data.data);
            setDataSource(...dataSource, res.data.data.map((item, index) => {
                const buddhistYear = new Date(item.Student.bd).getFullYear() + 543;
                return {
                    key: index,
                    id: item.Ponpan[0].id,
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
                    status: item.status,
                    reqId: item.id

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

    const formattedData = dataSource.map((row) => ({
        'พ.ศ. เกิด': row.bd,
        'รหัสนิสิต': row.stu_id,
        'เลขประจำตัวประชาชน': row.thai_id,
        'ศึกษาในระดับปริญญา': row.degree,
        'ชั้นปีที่': row.year,
        'ชื่อ': row.fnameTH,
        'นามสกุล': row.lnameTH,
        'เบอร์โทรศัพท์': row.phone_num,
        'อีเมลล์': row.email,
        'ชื่อบิดา': row.father_name,
        'ชื่อมารดา': row.mother_name,
        'ที่อยู่ตามทะเบียนบ้าน บ้านเลขที่': row.house_num,
        'ที่อยู่ตามทะเบียนบ้าน หมู่': row.house_moo,
        'ที่อยู่ตามทะเบียนบ้าน แขวง/ตำบล': row.sub_district,
        'ที่อยู่ตามทะเบียนบ้าน อำเภอ': row.district,
        'ที่อยู่ตามทะเบียนบ้าน จังหวัด': row.province,
        'ใบสำคัญ สด. 9': row.sdnine_id,
        'ที่อยู่ตาม สด.9 บ้านเลขที่': row.house_num_sd,
        'ที่อยู่ตาม สด.9 หมู่': row.house_moo_sd,
        'ที่อยู่ตาม สด.9 แขวง/ตำบล': row.subdistrict_sd,
        'ที่อยู่ตาม สด.9 อำเภอ': row.district_sd,
        'ที่อยู่ตาม สด.9 จังหวัด': row.province_sd,
    }));

    const handleExport = async () => {
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        // Create a new workbook
        const workbook = XLSX.utils.book_new();
        // Append the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Table Data');
        // Write the workbook to a file
        XLSX.writeFile(workbook, 'table_data.xlsx');
    };


    console.log("statusRequest", statusRequest);


    console.log("dataSource", dataSource);

    const handleYearChange = async (year) => {
        console.log("year", year);
        router.push(`/Admin/prakan/${year}`);
    }

    const handleChangeStatus = async (record) => {
        setStatusRequest(record.status);
        console.log("record", record);
        if (record.status === "รอเจ้าหน้าที่ดำเนินการ") {
            try {
                setLoading(true);
                setShouldReload(true);
                const res = await axios.post('/api/request/changeStatusToProcess', { id: parseInt(record.reqId) });
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
        }
        else if (record.status === "ติดต่อรับเอกสาร") {
            try {
                setLoading(true);
                setShouldReload(true);
                const res = await axios.post('/api/request/changeStatusToRecieveDoc', { id: parseInt(record.reqId) });
                setLoading(false);
                setShouldReload(false);
                console.log("res", res);
            } catch (error) {
                console.error('Error fetching status:', error);
            }
        }
        else if (record.status === "รับเอกสารเรียบร้อย") {
            try {
                setLoading(true);
                setShouldReload(true);
                const res = await axios.post('/api/request/changeStatusToFinishRecieve', { id: parseInt(record.reqId) });
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
            title: 'สถานะ',
            dataIndex: 'status',
            render: (status, record) => {
                console.log("status", record);
                let options = [];
                if (status === 'รอเข้ารับบริการ') {
                    options = [
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', style: { color: 'black' }, },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารแล้ว', style: { color: 'gray' }, disabled: true },
                        { value: 'ติดต่อรับเอกสาร', label: 'ติดต่อรับเอกสาร', style: { color: 'gray' }, disabled: true },
                        { value: 'รับเอกสารเรียบร้อย', label: 'รับเอกสารเรียบร้อย', style: { color: 'gray' }, disabled: true },
                    ];
                } else if (status === 'รอเจ้าหน้าที่ดำเนินการ') {
                    options = [
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', style: { color: 'gray' }, disabled: true },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารแล้ว', style: { color: 'black' } },
                        { value: 'ติดต่อรับเอกสาร', label: 'ติดต่อรับเอกสาร', style: { color: 'gray' }, disabled: true },
                        { value: 'รับเอกสารเรียบร้อย', label: 'รับเอกสารเรียบร้อย', style: { color: 'gray' }, disabled: true },
                    ];
                } else if (status === 'ส่งเอกสารแล้ว') {
                    options = [
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', style: { color: 'gray' }, disabled: true },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารแล้ว', style: { color: 'gray' }, disabled: true },
                        { value: 'ติดต่อรับเอกสาร', label: 'ติดต่อรับเอกสาร', style: { color: 'black' } },
                        { value: 'รับเอกสารเรียบร้อย', label: 'รับเอกสารเรียบร้อย', style: { color: 'gray' }, disabled: true },
                    ];
                }
                else if (status === 'ติดต่อรับเอกสาร') {
                    options = [
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', style: { color: 'gray' }, disabled: true },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารแล้ว', style: { color: 'gray' }, disabled: true },
                        { value: 'ติดต่อรับเอกสาร', label: 'ติดต่อรับเอกสาร', style: { color: 'gray' }, disabled: true },
                        { value: 'รับเอกสารเรียบร้อย', label: 'รับเอกสารเรียบร้อย', style: { color: 'black' } },
                    ];
                } else if (status === 'รับเอกสารเรียบร้อย') {
                    options = [
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', style: { color: 'gray' }, disabled: true },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารแล้ว', style: { color: 'gray' }, disabled: true },
                        { value: 'ติดต่อรับเอกสาร', label: 'ติดต่อรับเอกสาร', style: { color: 'gray' }, disabled: true },
                        { value: 'รับเอกสารเรียบร้อย', label: 'รับเอกสารเรียบร้อย', style: { color: 'gray' }, disabled: true },
                    ];
                }

                return (
                    <Select
                        defaultValue={record.status}
                        style={{ width: "180px" }}
                        options={options}
                        onChange={(value) => handleChangeStatus({ ...record, status: value })}
                    />
                );
            },
            filters: [
                { text: "รอเข้ารับบริการ", value: "รอเข้ารับบริการ" },
                { text: "รอเจ้าหน้าที่ดำเนินการ", value: "รอเจ้าหน้าที่ดำเนินการ" },
                { text: "ส่งเอกสารแล้ว", value: "ส่งเอกสารแล้ว" },
                { text: "ติดต่อรับเอกสาร", value: "ติดต่อรับเอกสาร" },
                { text: "รับเอกสารเรียบร้อย", value: "รับเอกสารเรียบร้อย" },
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
            title: 'พ.ศ. เกิด',
            dataIndex: 'bd',
            align: 'center',
        },
        {
            title: 'รหัสนิสิต',
            dataIndex: 'stu_id',
            align: 'center',
            ...getColumnSearchProps('stu_id'),
        },
        {
            title: 'เลขประจำตัวประชาชน',
            dataIndex: 'thai_id',
            align: 'center',
            ...getColumnSearchProps('thai_id'),
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
            ...getColumnSearchProps('year'),
        },
        {
            title: 'ชื่อ',
            dataIndex: 'fnameTH',
            align: 'center',
            ...getColumnSearchProps('fnameTH'),
        },
        {
            title: 'นามสกุล',
            dataIndex: 'lnameTH',
            align: 'center',
            ...getColumnSearchProps('lnameTH'),
        },
        {
            title: 'เบอร์โทรศัพท์',
            dataIndex: 'phone_num',
            align: 'center',
            ...getColumnSearchProps('phone_num'),
        },
        {
            title: "อีเมลล์",
            dataIndex: "email",
            align: 'center',
        },
        {
            title: 'ชื่อบิดา',
            dataIndex: 'father_name',
            align: 'center',
            ...getColumnSearchProps('father_name'),
        },
        {
            title: 'ชื่อมารดา',
            dataIndex: 'mother_name',
            align: 'center',
            ...getColumnSearchProps('mother_name'),
        },
        {
            title: 'ใบสำคัญ สด. 9',
            dataIndex: 'sdnine_id',
            align: 'center',
            ...getColumnSearchProps('sdnine_id'),
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
                            การขอผ่อนผันการเข้ารับราชการทหาร
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
                    <div>
                        <button
                            className="bg-blue-500 p-2 rounded-md text-white mb-3"
                            onClick={handleExport}
                        >
                            Export Excel
                        </button>
                    </div>

                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        loading={loading}
                        style={{ borderRadius: borderRadiusLG }}
                        scroll={{ x: 'max-content' }}

                    />

                </Content>
            </Layout>
        </Layout>
    );
};

export default AppointmentManagement;
