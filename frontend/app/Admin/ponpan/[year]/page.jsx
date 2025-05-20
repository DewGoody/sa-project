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
    const [statusRequest, setStatusRequest] = useState([]);
    const [loading, setLoading] = useState(false);
    const [shouldReload, setShouldReload] = useState(false);
    const [filteredInfo, setFilteredInfo] = useState({});
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRowReqid, setSelectedRowReqid] = useState([]);
    const [selectedRowReqidapi, setSelectedRowReqidapi] = useState([]);
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

    const onSelectChange = (newSelectedRowKeys, selectedRows) => {
            console.log('selectedRowKeys changed:', newSelectedRowKeys);
            setSelectedRowKeys(newSelectedRowKeys);
            setSelectedRowReqid(selectedRows.map(row => row)); // อัปเดตรายการที่เลือก
            setSelectedRowReqidapi(selectedRows.map(row => row.reqId)); // อัปเดตรายการที่เลือก
        };

        const handleEditForm = async (id) => {
            console.log("editFormReqId : ", id);
            const response = await axios.post('/api/request/getById', { id: id }); // Example API
            console.log("editFormResponse :", response.data.data.path);
            router.push(`/student/0/ponpan/${response.data.data.form}`);
        }

        const handleChangeStatusAll = async (ids,status) => {
            try {
                setLoading(true);
                setShouldReload(true);
                const res = await axios.post('/api/request/changeStatusAll', { ids, status });
                setLoading(false);
                setShouldReload(false);
                console.log("res", res);
    
            } catch (error) {
                console.log(error);
    
            }
        }
    
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,

        selections: [
            {
                key: 'all-data',
                text: 'เลือกทั้งหมด',
                onSelect: () => {
                    setSelectedRowKeys(dataSource.map((item) => item.key));
                    setSelectedRowReqid(dataSource.map((item) => item));
                    setSelectedRowReqidapi(dataSource.map((item) => item.reqId));
                },
            },
            // Table.SELECTION_INVERT,
            {
                key: 'none',
                text: 'ไม่เลือกทั้งหมด',
                onSelect: () => {
                    setSelectedRowKeys([]);
                    setSelectedRowReqid([]);
                    setSelectedRowReqidapi([]);
                },
            },
        ],
    };

    useEffect(() => {
        fetchStuData()
    }, [])

    useEffect(() => {
        fetchUniqueYear()
    }, [])

    const formattedData = dataSource?.map((row) => ({
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

    const exportToExcel = (number) => {
            // กำหนดชื่อ Columns ที่ต้องการ
            const columnHeaders = [
                { header: "ปี", key: "year" },
                { header: "รหัสนิสิต", key: "stu_id" },
                { header: "เลขประจำตัวประชาชน", key: "thai_id" },
                { header: "ศึกษาในระดับปริญญา", key: "degree" },
                { header: "ชั้นปีที่", key: "year" },
                { header: "ชื่อ", key: "fnameTH" },
                { header: "นามสกุล", key: "lnameTH" },
                { header: "เบอร์โทรศัพท์", key: "phone_num" },
                { header: "อีเมล", key: "email" },
                { header: "ชื่อบิดา", key: "father_name" },
                { header: "ชื่อมารดา", key: "mother_name" },
                { header: "ใบสำคัญ สด. 9", key: "sdnine_id" },
                { header: "ที่อยู่ตาม สด.9 บ้านเลขที่", key: "house_num_sd" },
                { header: "ที่อยู่ตาม สด.9 หมู่", key: "house_moo_sd" },
                { header: "ที่อยู่ตาม สด.9 แขวง/ตำบล", key: "subdistrict_sd" },
                { header: "ที่อยู่ตาม สด.9 อำเภอ", key: "district_sd" },
                { header: "ที่อยู่ตาม สด.9 จังหวัด", key: "province_sd" },
                { header: "ที่อยู่ตามทะเบียนบ้าน บ้านเลขที่", key: "house_num" },
                { header: "ที่อยู่ตามทะเบียนบ้าน หมู่", key: "house_moo" },
                { header: "ที่อยู่ตามทะเบียนบ้าน แขวง/ตำบล", key: "sub_district" },
                { header: "ที่อยู่ตามทะเบียนบ้าน อำเภอ", key: "district" },
                { header: "ที่อยู่ตามทะเบียนบ้าน จังหวัด", key: "province" },
               
            ];
    
            // เพิ่มชื่อ Columns เข้าไปเป็น Row แรก
            let dataWithHeaders = []
            if (number == 0) {
                dataWithHeaders = [
                    columnHeaders.map(col => col.header), // แถวแรกเป็นหัวตาราง
                    ...dataSource.map((item, index) =>
                        columnHeaders.map(col => col.key === "index" ? index + 1 : item[col.key] || '') // Auto Running Number
                    )
                ];
            }
            else {
                dataWithHeaders = [
                    columnHeaders.map(col => col.header), // แถวแรกเป็นหัวตาราง
                    ...selectedRowReqid.map((item, index) =>
                        columnHeaders.map(col => col.key === "index" ? index + 1 : item[col.key] || '') // Auto Running Number
                    )
                ];
            }

    
            // สร้าง Worksheet ด้วยข้อมูลที่มี Header
            const worksheet = XLSX.utils.aoa_to_sheet(dataWithHeaders);
            worksheet['!cols'] = columnHeaders.map(col => {
                return { wch: col.header.length + 8 }; // ปรับขนาดตามความยาว header + padding
            });
    
            // สร้าง Workbook และเพิ่ม Worksheet
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    
            // เขียนไฟล์ Excel และดาวน์โหลด
            const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
            const data = new Blob([excelBuffer], { type: "application/octet-stream" });
            saveAs(data, "exported_data.xlsx");
        };

        const dropdown = () => {
            const handleSelect = async (value) => {
                try {
                setLoading(true);
                await handleChangeStatusAll(selectedRowReqidapi, value);
                const updatedDataSource = dataSource.map((item) => {
                    if (selectedRowReqidapi.includes(item.reqId)) {
                    return { ...item, status: value };
                    }
                    return item;
                });
                setDataSource(updatedDataSource);
                setSelectedRowKeys([]);
                setSelectedRowReqid([]);
                setSelectedRowReqidapi([]);
                setLoading(false);
                } catch (error) {
                console.error("Error:", error);
                setLoading(false);
                }
            };
        
                return (
                    <Select
                        className="w-60 mt-1 mb-6 ml-3 "
                        // showSearch
                        placeholder="เลือกสถานะ"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={[
                            { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ' },
                            { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารให้ผู้ว่าราชการจังหวัดแล้ว' },
                            { value: 'ติดต่อรับเอกสาร', label: 'มารับเอกสารรับรองผ่อนผันที่ตึกจุล' },
                            { value: 'รับเอกสารเรียบร้อย', label: 'รับเอกสารเรียบร้อย' },
                        ]}
                        onSelect={handleSelect} // ใช้ฟังก์ชัน handleSelect
                    />
                );
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
        try {
            setLoading(true);
            let res;
            if (record.status === "รอเจ้าหน้าที่ดำเนินการ") {
                res = await axios.post('/api/request/changeStatusToProcess', { id: parseInt(record.reqId) });
            } else if (record.status === "ส่งเอกสารแล้ว") {
                res = await axios.post('/api/request/changeStatusToSended', { id: parseInt(record.reqId) });
            } else if (record.status === "ติดต่อรับเอกสาร") {
                res = await axios.post('/api/request/changeStatusToRecieveDoc', { id: parseInt(record.reqId) });
            } else if (record.status === "รับเอกสารเรียบร้อย") {
                res = await axios.post('/api/request/changeStatusToFinishRecieve', { id: parseInt(record.reqId) });
            }

            if (res && res.status === 200) {
                // Update the dataSource with the new status
                const updatedDataSource = dataSource.map((item) => {
                    if (item.reqId === record.reqId) {
                        return { ...item, status: record.status };
                    }
                    return item;
                });
                setDataSource(updatedDataSource);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error updating status:', error);
            setLoading(false);
        }
    };

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
                    width: 100,
                    title: 'แก้ไข',
                    dataIndex: 'status',
                    render: (status, record) => {
                        if (status !== "ประวัติการแก้ไข" && status !== "โอนเงินเรียบร้อย" && status !== "ไม่อนุมัติ") {
                            return (
                                <Space size="middle">
                                    <Button onClick={() => handleEditForm(record.reqId)}>แก้ไข</Button>
                                </Space>)
                        }
                    },
                },
        {
            title: 'สถานะ',
            dataIndex: 'status',
            render: (status, record) => {
                console.log("status", record);
                let options = [];
                if (status === 'รอเข้ารับบริการ') {
                    options = [
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', style: { color: 'gray' }, disabled: true },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารให้ผู้ว่าราชการจังหวัดแล้ว', style: { color: 'gray' }, disabled: true },
                        { value: 'ติดต่อรับเอกสาร', label: 'มารับเอกสารรับรองผ่อนผันที่ตึกจุล', style: { color: 'gray' }, disabled: true },
                        { value: 'รับเอกสารเรียบร้อย', label: 'รับเอกสารเรียบร้อย', style: { color: 'gray' }, disabled: true },
                    ];
                } else if (status === 'รอเจ้าหน้าที่ดำเนินการ') {
                    options = [
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', style: { color: 'gray' }, disabled: true },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารให้ผู้ว่าราชการจังหวัดแล้ว', style: { color: 'black' } },
                        { value: 'ติดต่อรับเอกสาร', label: 'มารับเอกสารรับรองผ่อนผันที่ตึกจุล', style: { color: 'gray' }, disabled: true },
                        { value: 'รับเอกสารเรียบร้อย', label: 'รับเอกสารเรียบร้อย', style: { color: 'gray' }, disabled: true },
                    ];
                } else if (status === 'ส่งเอกสารแล้ว') {
                    options = [
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', style: { color: 'gray' }, disabled: true },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารให้ผู้ว่าราชการจังหวัดแล้ว', style: { color: 'gray' }, disabled: true },
                        { value: 'ติดต่อรับเอกสาร', label: 'มารับเอกสารรับรองผ่อนผันที่ตึกจุล', style: { color: 'black' } },
                        { value: 'รับเอกสารเรียบร้อย', label: 'รับเอกสารเรียบร้อย', style: { color: 'gray' }, disabled: true },
                    ];
                }
                else if (status === 'ติดต่อรับเอกสาร') {
                    options = [
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', style: { color: 'gray' }, disabled: true },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารให้ผู้ว่าราชการจังหวัดแล้ว', style: { color: 'gray' }, disabled: true },
                        { value: 'ติดต่อรับเอกสาร', label: 'มารับเอกสารรับรองผ่อนผันที่ตึกจุล', style: { color: 'gray' }, disabled: true },
                        { value: 'รับเอกสารเรียบร้อย', label: 'รับเอกสารเรียบร้อย', style: { color: 'black' } },
                    ];
                } else if (status === 'รับเอกสารเรียบร้อย') {
                    options = [
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', style: { color: 'gray' }, disabled: true },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารให้ผู้ว่าราชการจังหวัดแล้ว', style: { color: 'gray' }, disabled: true },
                        { value: 'ติดต่อรับเอกสาร', label: 'มารับเอกสารรับรองผ่อนผันที่ตึกจุล', style: { color: 'gray' }, disabled: true },
                        { value: 'รับเอกสารเรียบร้อย', label: 'รับเอกสารเรียบร้อย', style: { color: 'gray' }, disabled: true },
                    ];
                }

                return (
                    <Select
                        defaultValue={record.status}
                        style={{ width: "240px" }}
                        options={options}
                        onChange={(value) => handleChangeStatus({ ...record, status: value })}
                    />
                );
            },
            filters: [
                { text: "รอเข้ารับบริการ", value: "รอเข้ารับบริการ" },
                { text: "รอเจ้าหน้าที่ดำเนินการ", value: "รอเจ้าหน้าที่ดำเนินการ" },
                { text: "ส่งเอกสารให้ผู้ว่าราชการจังหวัดแล้ว", value: "ส่งเอกสารแล้ว" },
                { text: "มารับเอกสารรับรองผ่อนผันในรับรองที่ตึกจุล", value: "ติดต่อรับเอกสาร" },
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
            title: "อีเมล",
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
            title: 'ใบสำคัญ สด. 9 ที่',
            dataIndex: 'sdnine_id',
            align: 'center',
            ...getColumnSearchProps('sdnine_id'),
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
                    title: 'หมู่ที่',
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
            title: 'ที่อยู่ตามทะเบียนบ้าน',
            align: 'center',
            children: [
                {
                    title: 'บ้านเลขที่',
                    dataIndex: 'house_num',
                    align: 'center',
                },
                {
                    title: 'หมู่ที่',
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
                        // borderTopLeftRadius: '20px',  // โค้งเฉพาะมุมบนซ้าย
                        // borderBottomLeftRadius: '20px', // โค้งเฉพาะมุมล่างซ้าย

                    }}
                >
                    <div className='flex mb-5 justify-between'>
                        <div className='font-extrabold text-3xl'>
                            การขอผ่อนผันการเข้ารับราชการทหาร
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
                        <div className='ml-3'>
                        {selectedRowReqid.length > 0 ? (
                            <>
                                <div className='flex'>
                                <Button className="mt-1 mb-6 px-4" type="primary" onClick={() => exportToExcel("1")} style={{ marginBottom: '16px' }}>
                                    Export Excel ที่เลือกไว้
                                </Button>
                                {dropdown()}
                                </div>
                            </>
                        ) : (
                            <>
                                <Button className="mt-1 mb-6 px-4" type="primary" onClick={() => exportToExcel("0")} style={{ marginBottom: '16px' }}>
                                Export Excel ทั้งหมด
                                </Button>
                            </>
                        )}
                    </div>

                    </div>
                    

                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        loading={loading}
                        style={{ borderRadius: borderRadiusLG }}
                        scroll={{ x: 'max-content' }}
                        rowSelection={rowSelection}
                        bordered

                    />

                </Content>
            </Layout>
        </Layout>
    );
};

export default AppointmentManagement;
