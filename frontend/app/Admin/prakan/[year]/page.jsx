'use client'
import React, { useEffect, useState } from 'react';
import {
    SearchOutlined,
    DownloadOutlined,
    FilterOutlined,
    OrderedListOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Input, Table, Modal, Select, Space } from 'antd';
import axios from 'axios';
import * as XLSX from 'xlsx'; // เพิ่ม XLSX สำหรับ export
import { saveAs } from 'file-saver'; // เพิ่ม FileSaver สำหรับบันทึกไฟล์
import { useRouter, useParams } from 'next/navigation';
import Menubar from '../../component/menu';


const { Header, Sider, Content } = Layout;


const App = () => {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [dataSource, setDataSource] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stuData, setStuData] = useState([]);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [selectedKey, setSelectedKey] = useState('2');
    const [fetchYear, setfetchYear] = useState([]);
    const [statusRequest, setStatusRequest] = useState('');
    const [reqMoreInfo, setReqMoreInfo] = useState('');
    const [moreInfoValue, setMoreInfoValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [shouldReload, setShouldReload] = useState(false);
    const [filteredInfo, setFilteredInfo] = useState({});
    const [selectedRowReqid, setSelectedRowReqid] = useState([]);
    const [selectedRowReqidapi, setSelectedRowReqidapi] = useState([]);
    const router = useRouter();
    const { year } = useParams();
    console.log("year", year);
    console.log("fetchYear :", fetchYear);
    console.log("moreInfoValue :", moreInfoValue);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    useEffect(() => {
        if (shouldReload) {
            window.location.reload();
        }
    }, [shouldReload]);


    const showModal = (record) => {
        setReqMoreInfo(record);
        console.log("recordModalJa :", record);
        setIsModalOpen(true);
    };

    const handleOk = () => {
        const response = axios.post('/api/request/createMoreInfo', { id: parseInt(reqMoreInfo), more_info: moreInfoValue });

        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
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



    const fetchStuData = async () => {
        try {
            const res = await axios.post('/api/request/getPrakanAdmin', { year: parseInt(year) });
            console.log("stuData", res.data.data);
            setStuData(res.data.data);
            setDataSource(...dataSource, res.data.data.map((item, index) => {
                const accDate = new Date(item.accident_info[0].acc_date);
                const formattedDate = `${accDate.getDate().toString().padStart(2, '0')}/${(accDate.getMonth() + 1).toString().padStart(2, '0')}/${accDate.getFullYear()}`;
                return {
                    key: index,
                    name: item.Student.fnameTH + ' ' + item.Student.lnameTH,
                    student_ID: item.Student.id,
                    des_injury: item.accident_info[0].des_injury,
                    acc_desc: item.accident_info[0].acc_desc,
                    accident_place: item.accident_info[0].accident_place,
                    acc_date: formattedDate,
                    treatment_place: item.accident_info[0].treatment_place,
                    treatment_place2: item.accident_info[0].treatment_place2,
                    hospital_type: item.accident_info[0].hospital_type,
                    hospital_type2: item.accident_info[0].hospital_type2,
                    medical_fee: item.accident_info[0].medical_fee + ' บาท',
                    status: item.status,
                    id: item.accident_info[0].id,
                    reqId: item.id,
                    more_info: item.more_info,
                    time_acc: item.accident_info[0].time_acc,

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

    const handleDownload = async (dataDownload) => {
        const response = await axios.post('/api/prakan/createPdf', { form: dataDownload.id }, {
          responseType: 'blob'
        });
        
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
      
        const link = document.createElement('a');
        link.href = url;
        link.download = dataDownload.student_ID + '_accident_insurance.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

    const handleEditForm = async (id) => {
        console.log("editFormReqId : ", id);
        const response = await axios.post('/api/request/getById', { id: id }); // Example API
        console.log("editFormResponse :", response.data.data.path);
        router.push(`/student/0/prakan/${response.data.data.form}`);
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
            } else if (record.status === "ขอข้อมูลเพิ่มเติม") {
                res = await axios.post('/api/request/changeStatusToWantInfo', { id: parseInt(record.reqId) });
            } else if (record.status === "ไม่อนุมัติ") {
                res = await axios.post('/api/request/changeStatusToNotApprove', { id: parseInt(record.reqId) });
            } else if (record.status === "โอนเงินเรียบร้อย") {
                res = await axios.post('/api/request/changeStatusToFinish', { id: parseInt(record.reqId) });
            }
            console.log("res", res);

            // Update the dataSource without refreshing the page
            setDataSource((prevDataSource) =>
                prevDataSource.map((item) =>
                    item.reqId === record.reqId ? { ...item, status: record.status } : item
                )
            );
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setLoading(false);
        }
    };

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

    const exportToExcel = (number) => {
                // กำหนดชื่อ Columns ที่ต้องการ
                const columnHeaders = [
                    { header: "ลำดับ", key: "index" },
                    { header: "ชื่อ-นามสกุล", key: "name" },
                    { header: "รหัสนิสิต", key: "student_ID" },
                    { header: "วันที่เกิดอุบัติเหตุ", key: "acc_date" },
                    { header: "เวลาเกิดอุบัติเหตุ", key: "time_acc" },
                    { header: "อาการบาดเจ็บ", key: "des_injury" },
                    { header: "การเกิดอุบัติเหตุ", key: "acc_desc" },
                    { header: "สถานที่เกิดอุบัติเหตุ", key: "accident_place" },
                    { header: "สถานที่รักษา 1", key: "treatment_place" },
                    { header: "ประเภทสถานพยาบาล 1", key: "hospital_type" },
                    { header: "สถานที่รักษา 2", key: "treatment_place2" },
                    { header: "ประเภทสถานพยาบาล 2", key: "hospital_type2" },
                    { header: "ค่ารักษาพบาบาล", key: "medical_fee" },
                    { header: "สถานะ", key: "status" },
                    { header: "หมายเหตุ", key: "more_info" },
                   
                   
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
                            columnHeaders.map(col => {
                                if (col.key === "index") {
                                  return index + 1;
                                } 
                                 else if (col.key === "time_acc") {
                                    const timePart = item[col.key]?.split("T")[1]; // ได้ "16:58:00.000Z"
                                    const hhmm = timePart ? timePart.substring(0, 5) : ''; // ดึง "16:58"
                                    return hhmm;
                                } 
                                else if (col.key === "hospital_type") {
                                    const typeMap = {
                                      0: "โรงพยาบาลรัฐ",
                                      1: "โรงพยาบาลเอกชน",
                                      2: "คลินิก",
                                    };
                                    return typeMap[item[col.key]] || '';
                                  }
                                  else if (col.key === "hospital_type2") {
                                    const typeMap = {
                                      0: "โรงพยาบาลรัฐ",
                                      1: "โรงพยาบาลเอกชน",
                                      2: "คลินิก",
                                    };
                                    return typeMap[item[col.key]] || '';
                                  }
                                else {
                                  return item[col.key] || '';
                                }
                              })
                              
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
                saveAs(data, "accident_insurance.xlsx");
            };

    
    useEffect(() => {
        const matched = dataSource.find((item) => item.reqId === reqMoreInfo);
        if (matched) {
            setMoreInfoValue(matched.more_info || "");
        }
    }, [reqMoreInfo, dataSource]);
    

    const columns = [
        {
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
            title: 'ดาวน์โหลด',
            width: 100,
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
                        onClick={() => handleDownload(record)}
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
                if (status === 'รอเข้ารับบริการ') {
                    options = [
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', style: { color: 'gray' }, disabled: true },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารไปบริษัทประกันแล้ว', style: { color: 'gray' }, disabled: true },
                        { value: 'ขอข้อมูลเพิ่มเติม', label: 'ขอข้อมูลเพิ่มเติม', style: { color: 'gray' }, disabled: true },
                        { value: 'ไม่อนุมัติ', label: 'ไม่อนุมัติ', style: { color: 'gray' }, disabled: true },
                        { value: 'โอนเงินเรียบร้อย', label: 'โอนเงินเรียบร้อย', style: { color: 'gray' }, disabled: true },
                    ];
                } else if (status === 'รอเจ้าหน้าที่ดำเนินการ') {
                    options = [
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', style: { color: 'gray' }, disabled: true },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารไปบริษัทประกันแล้ว', style: { color: 'black' } },
                        { value: 'ขอข้อมูลเพิ่มเติม', label: 'ขอข้อมูลเพิ่มเติม', style: { color: 'gray' }, disabled: true },
                        { value: 'ไม่อนุมัติ', label: 'ไม่อนุมัติ', style: { color: 'gray' }, disabled: true },
                        { value: 'โอนเงินเรียบร้อย', label: 'โอนเงินเรียบร้อย', style: { color: 'gray' }, disabled: true },
                    ];
                } else if (status === 'ส่งเอกสารแล้ว') {
                    options = [
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', style: { color: 'gray' }, disabled: true },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารไปบริษัทประกันแล้ว', style: { color: 'gray' }, disabled: true },
                        { value: 'ขอข้อมูลเพิ่มเติม', label: 'ขอข้อมูลเพิ่มเติม', style: { color: 'black' } },
                        { value: 'ไม่อนุมัติ', label: 'ไม่อนุมัติ', style: { color: 'black' } },
                        { value: 'โอนเงินเรียบร้อย', label: 'โอนเงินเรียบร้อย', style: { color: 'black' } },
                    ];
                }
                else if (status === 'ขอข้อมูลเพิ่มเติม') {
                    options = [
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', style: { color: 'gray' }, disabled: true },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารไปบริษัทประกันแล้ว', style: { color: 'black' } },
                        { value: 'ขอข้อมูลเพิ่มเติม', label: 'ขอข้อมูลเพิ่มเติม', style: { color: 'black' }, disabled: true },
                        { value: 'ไม่อนุมัติ', label: 'ไม่อนุมัติ', style: { color: 'black' } },
                        { value: 'โอนเงินเรียบร้อย', label: 'โอนเงินเรียบร้อย', style: { color: 'black' } },
                    ];
                } else if (status === 'ไม่อนุมัติ') {
                    options = [
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', style: { color: 'gray' }, disabled: true },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารไปบริษัทประกันแล้ว', style: { color: 'gray' }, disabled: true },
                        { value: 'ขอข้อมูลเพิ่มเติม', label: 'ขอข้อมูลเพิ่มเติม', style: { color: 'gray' }, disabled: true },
                        { value: 'ไม่อนุมัติ', label: 'ไม่อนุมัติ', style: { color: 'gray' }, disabled: true },
                        { value: 'โอนเงินเรียบร้อย', label: 'โอนเงินเรียบร้อย', style: { color: 'gray' }, disabled: true },
                    ];
                }
                else if (status === 'โอนเงินเรียบร้อย') {
                    options = [
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', style: { color: 'gray' }, disabled: true },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารไปบริษัทประกันแล้ว', style: { color: 'gray' }, disabled: true },
                        { value: 'ขอข้อมูลเพิ่มเติม', label: 'ขอข้อมูลเพิ่มเติม', style: { color: 'gray' }, disabled: true },
                        { value: 'ไม่อนุมัติ', label: 'ไม่อนุมัติ', style: { color: 'gray' }, disabled: true },
                        { value: 'โอนเงินเรียบร้อย', label: 'โอนเงินเรียบร้อย', style: { color: 'gray' }, disabled: true },
                    ];
                }
                return (
                    <>
                        <div className='flex'>
                            <Select
                                defaultValue={record.status}
                                style={{ width: 180 }}
                                options={options}
                                onChange={(value) => handleChangeStatus({ ...record, status: value })}
                            />
                            {record.status === "ขอข้อมูลเพิ่มเติม" || record.status === "โอนเงินเรียบร้อย" || record.status === "ไม่อนุมัติ" ?
                                <Button type="primary" style={{ marginLeft: 10, whiteSpace: 'nowrap' }} onClick={() => showModal(record.reqId)}>เขียนรายละเอียด</Button>
                                : null}
                        </div>
                    </>

                );
            },
            filters: [
                { text: "รอเข้ารับบริการ", value: "รอเข้ารับบริการ" },
                { text: "รอเจ้าหน้าที่ดำเนินการ", value: "รอเจ้าหน้าที่ดำเนินการ" },
                { text: "ส่งเอกสารไปบริษัทประกันแล้ว", value: "ส่งเอกสารแล้ว" },
                { text: "ขอข้อมูลเพิ่มเติม", value: "ขอข้อมูลเพิ่มเติม" },
                { text: "ไม่อนุมัติ", value: "ไม่อนุมัติ" },
                { text: "โอนเงินเรียบร้อย", value: "โอนเงินเรียบร้อย" },
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
            dataIndex: 'name',
            width: 250,
            ...getColumnSearchProps('name'),
        },
        {
            title: 'รหัสนิสิต',
            dataIndex: 'student_ID',
            
            ...getColumnSearchProps('student_ID'),
        },
        {
            title: 'วันที่เกิดอุบัติเหตุ',
            dataIndex: 'acc_date',
            width: 160,
            
        },
        {
            title: 'เวลาเกิดอุบัติเหตุ',
            dataIndex: 'time_acc',
            width: 160,
            
            render: (text) => {
                const time = new Date(text);
                const formattedTime = time.toISOString().split('T')[1].slice(0, 5);
                return formattedTime + ' น.';
            }
        },
        {
            title: 'อาการบาดเจ็บ',
            dataIndex: 'des_injury',
            width: 320,
        },
        {
            title: 'การเกิดอุบัติเหตุ',
            dataIndex: 'acc_desc',
            width: 320,
        },
        {
            title: 'สถานที่เกิดอุบัติเหตุ',
            dataIndex: 'accident_place',
            width: 320,
        },

        {
            title: 'สถานที่รักษา 1',
            dataIndex: 'treatment_place',
            width: 320,
        },
        {
            title: 'ประเภทสถานพยาบาล 1',
            dataIndex: 'hospital_type',
            render: (text) => {
                if (text === 0) {
                    return 'โรงพยาบาลรัฐ';
                } else if (text === 1) {
                    return 'โรงพยาบาลเอกชน';
                } else if (text === 2) {
                    return 'คลินิก';
                } else {
                    return text;
                }
            }
        },
        {
            title: 'สถานที่รักษา 2',
            dataIndex: 'treatment_place2',
            width: 320,
            render: (text) => {
                if(text===null || text===""){
                    return "-"
                }else{
                    return text
                }
            }
        },
        {
            title: 'ประเภทสถานพยาบาล 2',
            dataIndex: 'hospital_type2',
            render: (text) => {
                if (text === 0) {
                    return 'โรงพยาบาลรัฐ';
                } else if (text === 1) {
                    return 'โรงพยาบาลเอกชน';
                } else if (text === 2) {
                    return 'คลินิก';
                } else {
                    return "-";
                }
            }
        },
        {
            title: 'ค่ารักษาพบาบาล',
            dataIndex: 'medical_fee',
            render: (text) => {
                const number = parseFloat(text.replace(/[^\d.-]/g, ''));
                return number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' บาท';
            },
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
                            ประกันอุบัติเหตุ
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
                                        Export Excel ที่เลือก
                                    </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Button className="mt-1 mb-6 px-4" type="primary" onClick={() => exportToExcel("0")} style={{ marginBottom: '16px' }} disabled>
                                    Export Excel ที่เลือก
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
                        bordered
                        rowSelection={rowSelection}

                    />
                    
                    <Modal
                        title="กรุณาเขียนรายละเอียด"
                        open={isModalOpen}
                        onOk={handleOk}
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
                        style={{
                            width: "100%",
                            height: "200px",
                            border: "gray solid",
                            borderRadius: "15px",
                            padding: "15px",
                            fontSize: "18px"
                        }}
                        value={moreInfoValue}
                        onChange={(e) => setMoreInfoValue(e.target.value)}
                    />


                    </Modal>

                </Content>
            </Layout>
        </Layout>
    );
};
export default App;