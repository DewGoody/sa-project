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
    const router = useRouter();
    const { year } = useParams();
    console.log("year", year);
    console.log("fetchYear :", fetchYear);
    console.log("moreInfoValue :", moreInfoValue);

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

        console.log("dataDownloadJaa", dataDownload);

        try {
            const response = await axios.post('/api/prakan/createPdf', {form: dataDownload.id})
            console.log("kselmgseg",response.data.data.stu_id, response.data.data.Student.id);

            const link = document.createElement('a');
            link.href = '../../../../../documents/accident/'+response.data.data.stu_id+'_accident_insurance.pdf';
            link.download = response.data.data.stu_id+'_accident_insurance.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);            
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    }

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

    
    useEffect(() => {
        const matched = dataSource.find((item) => item.reqId === reqMoreInfo);
        if (matched) {
            setMoreInfoValue(matched.more_info || "");
        }
    }, [reqMoreInfo, dataSource]);
    

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
            align: 'right', // เพิ่ม align ขวา
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
                        onClick={() => handleDownload(record)}
                    />
                </div>
            ),
        },
        {
            title: 'สถานะ',
            dataIndex: 'status',
            align: 'center',
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
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารไปบริษัทประกันแล้ว', style: { color: 'gray' }, disabled: true },
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
                        <Select
                            defaultValue={record.status}
                            style={{ width: "180px" }}
                            options={options}
                            onChange={(value) => handleChangeStatus({ ...record, status: value })}
                        />
                        {record.status === "ขอข้อมูลเพิ่มเติม" || record.status === "โอนเงินเรียบร้อย" || record.status === "ไม่อนุมัติ" ?
                            <Button type="primary" style={{ marginLeft: "10px" }} onClick={() => showModal(record.reqId)}>เขียนรายละเอียด</Button>
                            : null}
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
            ellipsis: true,
            filterIcon: (filtered) => (
                <div>
                    <FilterOutlined style={{ color: "white", fontSize: "18px" }} />
                </div>
            ),
        },
        {
            title: 'ชื่อ-นามสกุล',
            dataIndex: 'name',
            align: 'center',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'รหัสนิสิต',
            dataIndex: 'student_ID',
            align: 'center',
            ...getColumnSearchProps('student_ID'),
        },
        {
            title: 'วันที่เกิดอุบัติเหตุ',
            dataIndex: 'acc_date',
            width: 160,
            align: 'center',
            sorter: (a, b) => {
                const dateA = new Date(a.acc_date.split('/').reverse().join('-'));
                const dateB = new Date(b.acc_date.split('/').reverse().join('-'));
                return dateA - dateB;
            },
            sortIcon: (sorted) => (
                <div>
                    <OrderedListOutlined style={{ color: "white", fontSize: "18px" }} />
                </div>
            ),
        },
        {
            title: 'เวลาเกิดอุบัติเหตุ',
            dataIndex: 'time_acc',
            width: 160,
            align: 'center',
            render: (text) => {
                const time = new Date(text);
                const formattedTime = time.toISOString().split('T')[1].slice(0, 5);
                return formattedTime + ' น.';
            }
        },
        {
            title: 'อาการบาดเจ็บ',
            dataIndex: 'des_injury',
            align: 'center',
        },
        {
            title: 'การเกิดอุบัติเหตุ',
            dataIndex: 'acc_desc',
            align: 'center',
        },
        {
            title: 'สถานที่เกิดอุบัติเหตุ',
            dataIndex: 'accident_place',
            align: 'center',
        },

        {
            title: 'สถานที่รักษา 1',
            dataIndex: 'treatment_place',
            align: 'center',
        },
        {
            title: 'ประเภทสถานพยาบาล',
            dataIndex: 'hospital_type',
            align: 'center',
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
            dataIndex: 'treatment_place',
        },
        {
            title: 'ประเภทสถานพยาบาล',
            dataIndex: 'hospital_type2',
            align: 'center',
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
            title: 'ค่ารักษาพบาบาล',
            dataIndex: 'medical_fee',
            align: 'center',
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
                        {/* <div className='mt-2 ml-3 font-normal text-base'>
                            เลือกปีการศึกษา
                        </div> */}
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
                        bordered

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