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
import Menubar from '../../component/menu';


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
    const router = useRouter();
    const { year } = useParams();
    console.log("year", year);
    console.log("fetchYear :", fetchYear);
    console.log("selectedKey", selectedKey);

    useEffect(() => {
            if (shouldReload) {
            window.location.reload();
            }
        }, [shouldReload]);

    const handleEditForm = async (id) => {
            console.log("editFormReqId : ", id);
            const response = await axios.post('/api/request/getById', { id: id }); // Example API
            console.log("editFormResponse :", response.data.data.path);
            router.push(`/student/0/prakan-inter/${response.data.data.form}`);
        }
    

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
                    phone_num: data.prakan_inter_info[0].phone_num || "-",
                    hospitalName: data.prakan_inter_info[0].hospitalName || "-",
                    hospitalName2: data.prakan_inter_info[0].hospitalName2 || "-",
                    title: data.prakan_inter_info[0].title || "-",
                    stu_id: data.prakan_inter_info[0].stu_id || "-",
                    email: data.prakan_inter_info[0].email || "-",
                    totalMedicalFees: data.prakan_inter_info[0].totalMedicalFees ?? "-",
                    treatmentType: data.prakan_inter_info[0].treatmentType || "-",
                    IPDAmittedDate: data.prakan_inter_info[0].IPDAmittedDate ? formatDate(data.prakan_inter_info[0].IPDAmittedDate) : "-",
                    IPDDischargedDate: data.prakan_inter_info[0].IPDDischargedDate ? formatDate(data.prakan_inter_info[0].IPDDischargedDate) : "-",
                    OPDTreatmentDateCount: data.prakan_inter_info[0].OPDTreatmentDateCount ?? "-",
                    OPDTreatmentDate1: data.prakan_inter_info[0].OPDTreatmentDate1 ? formatDate(data.prakan_inter_info[0].OPDTreatmentDate1) : "-",
                    OPDTreatmentDate2: data.prakan_inter_info[0].OPDTreatmentDate2 ? formatDate(data.prakan_inter_info[0].OPDTreatmentDate2) : "-",
                    OPDTreatmentDate3: data.prakan_inter_info[0].OPDTreatmentDate3 ? formatDate(data.prakan_inter_info[0].OPDTreatmentDate3) : "-",
                    OPDTreatmentDate4: data.prakan_inter_info[0].OPDTreatmentDate4 ? formatDate(data.prakan_inter_info[0].OPDTreatmentDate4) : "-",
                    OPDTreatmentDate5: data.prakan_inter_info[0].OPDTreatmentDate5 ? formatDate(data.prakan_inter_info[0].OPDTreatmentDate5) : "-",
                    illnessDescription: data.prakan_inter_info[0].illnessDescription || "-",
                    reqId: data.prakan_inter_info[0].req_id,
                    status: data.status || "-",
                    prakanId: data.prakan_inter_info[0].id
                }
            }
            ));
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
            const res = await axios.post('/api/request/downloadPrakanInter', { id: parseInt(dataDownload) }, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'prakanformfilled.pdf');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            console.log("download", res);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    }

    const handleChangeStatus = async (record) => {
        setStatusRequest(record.status);
        console.log("record", record);
       if(record.status === "รอเจ้าหน้าที่ดำเนินการ"){
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
       else if(record.status === "ส่งเอกสารแล้ว"){
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
       
       else if(record.status === "ขอข้อมูลเพิ่มเติม"){
        try {
            setLoading(true);
            setShouldReload(true);
            const res = await axios.post('/api/request/changeStatusToWantInfo', { id: parseInt(record.reqId) });
            setLoading(false);
            setShouldReload(false);
            console.log("resPerm", res);
        } catch (error) {
            console.error('Error fetching status:', error);
        }
       }
       else if(record.status === "ไม่อนุมัติ"){
        try {
            setLoading(true);
            setShouldReload(true);
            const res = await axios.post('/api/request/changeStatusToNotApprove', { id: parseInt(record.reqId) });
            setLoading(false);
            setShouldReload(false);
            console.log("res", res);
        } catch (error) {
            console.error('Error fetching status:', error);
        }
       }
       else if(record.status === "โอนเงินเรียบร้อย"){
        try {
            setLoading(true);
            setShouldReload(true);
            const res = await axios.post('/api/request/changeStatusToFinish', { id: parseInt(record.reqId) });
            setLoading(false);
            setShouldReload(false);
            console.log("resOwn", res);
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
                  onClick={() => handleDownload(record.prakanId)}
                />
              </div>
            ),
        },
        {
            title: 'สถานะ',
            dataIndex: 'status',
            render: (status,record) => {
                let options = [];
                if (status === 'รอเข้ารับบริการ') {
                    options = [
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', style: { color: 'black' } , },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารแล้ว', style: { color: 'gray' } , disabled: true},
                        { value: 'ขอข้อมูลเพิ่มเติม', label: 'ขอข้อมูลเพิ่มเติม', style: { color: 'gray' } , disabled: true},
                        { value: 'ไม่อนุมัติ', label: 'ไม่อนุมัติ', style: { color: 'gray' } , disabled: true},
                        { value: 'โอนเงินเรียบร้อย', label: 'โอนเงินเรียบร้อย', style: { color: 'gray' } , disabled: true},
                    ];
                } else if (status === 'รอเจ้าหน้าที่ดำเนินการ') {
                    options = [
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', style: { color: 'gray' } , disabled: true },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารแล้ว', style: { color: 'black' } },
                        { value: 'ขอข้อมูลเพิ่มเติม', label: 'ขอข้อมูลเพิ่มเติม', style: { color: 'gray' } , disabled: true},
                        { value: 'ไม่อนุมัติ', label: 'ไม่อนุมัติ', style: { color: 'gray' } , disabled: true},
                        { value: 'โอนเงินเรียบร้อย', label: 'โอนเงินเรียบร้อย', style: { color: 'gray' }, disabled: true },
                    ];
                } else if (status === 'ส่งเอกสารแล้ว') {
                    options = [
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', style: { color: 'gray' } , disabled: true },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารแล้ว', style: { color: 'gray' } , disabled: true},
                        { value: 'ขอข้อมูลเพิ่มเติม', label: 'ขอข้อมูลเพิ่มเติม', style: { color: 'black' } },
                        { value: 'ไม่อนุมัติ', label: 'ไม่อนุมัติ', style: { color: 'black' } },
                        { value: 'โอนเงินเรียบร้อย', label: 'โอนเงินเรียบร้อย', style: { color: 'black' } },
                    ];
                }
                else if (status === 'ขอข้อมูลเพิ่มเติม') {
                    options = [
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', style: { color: 'gray' } , disabled: true },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารแล้ว', style: { color: 'gray' } , disabled: true},
                        { value: 'ขอข้อมูลเพิ่มเติม', label: 'ขอข้อมูลเพิ่มเติม', style: { color: 'black' }, disabled: true },
                        { value: 'ไม่อนุมัติ', label: 'ไม่อนุมัติ', style: { color: 'black' } },
                        { value: 'โอนเงินเรียบร้อย', label: 'โอนเงินเรียบร้อย', style: { color: 'black' } },
                    ];
                }else if (status === 'ไม่อนุมัติ') {
                    options = [
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', style: { color: 'gray' } , disabled: true },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารแล้ว', style: { color: 'gray' } , disabled: true},
                        { value: 'ขอข้อมูลเพิ่มเติม', label: 'ขอข้อมูลเพิ่มเติม', style: { color: 'gray' },disabled: true },
                        { value: 'ไม่อนุมัติ', label: 'ไม่อนุมัติ', style: { color: 'gray' },disabled: true },
                        { value: 'โอนเงินเรียบร้อย', label: 'โอนเงินเรียบร้อย', style: { color: 'gray' },disabled: true },
                    ];
                }
                else if (status === 'โอนเงินเรียบร้อย') {
                    options = [
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', style: { color: 'gray' } , disabled: true },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารแล้ว', style: { color: 'gray' } , disabled: true},
                        { value: 'ขอข้อมูลเพิ่มเติม', label: 'ขอข้อมูลเพิ่มเติม', style: { color: 'gray' },disabled: true },
                        { value: 'ไม่อนุมัติ', label: 'ไม่อนุมัติ', style: { color: 'gray' },disabled: true },
                        { value: 'โอนเงินเรียบร้อย', label: 'โอนเงินเรียบร้อย', style: { color: 'gray' },disabled: true },
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
                { text: "ขอข้อมูลเพิ่มเติม", value: "ขอข้อมูลเพิ่มเติม" },
                { text: "ไม่อนุมัติ", value: "ไม่อนุมัติ" },
                { text: "โอนเงินเรียบร้อย", value: "โอนเงินเรียบร้อย" },
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
            title: 'ประเภท',
            dataIndex: 'type',
            filters: [
                { text: "accident", value: "accident" },
                { text: "illness", value: "illness" },
            ],
            filteredValue: filteredInfo?.type,
            onFilter: (value, record) => record?.type.includes(value),
            ellipsis: true,
            filterIcon: (filtered) => (
                <div>
                <FilterOutlined style={{ color: "white", fontSize:"18px" }}/>
                </div>
            ),

        },
        {
            title: 'ชื่อ-นามสกุล',
            dataIndex: 'name',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'รหัสนิสิต',
            dataIndex: 'student_ID',
            ...getColumnSearchProps('student_ID'),
        },
        {
            title: 'สาเหตุการเกิดอุบัติเหตุ',
            dataIndex: 'accidentCause',
        },
        {
            title: 'วันที่เกิดอุบัติเหตุ',
            dataIndex: 'accidentDate',
            width:180,
             sorter: (a, b) => {
                    const dateA = new Date(a.accidentDate.split('/').reverse().join('-'));
                    const dateB = new Date(b.accidentDate.split('/').reverse().join('-'));
                    return dateA - dateB;
                },
            sortIcon: (sorted) => (
                <div>
                    <OrderedListOutlined style={{ color: "white", fontSize:"18px" }}/>
                </div>
            ),
        },
       
        {
            title: 'เวลาเกิดอุบัติเหตุ',
            dataIndex: 'accidentTime',
            width:180,
            sorter: (a, b) => {
                const timeA = timeSlots.indexOf(a.accidentTime.split(' ')[0]);
                const timeB = timeSlots.indexOf(b.accidentTime.split(' ')[0]);
                return timeA - timeB;
            },
            sortIcon: (sorted) => (
                <div>
                    <OrderedListOutlined style={{ color: "white", fontSize:"18px" }}/>
                </div>
            ),
        },
        
       
        {
            title: 'วันที่เข้ารักษา',
            dataIndex: 'hospitalAmittedDate',
        },
        {
            title: 'วันที่ออกโรงพยาบาล',
            dataIndex: 'hospitalDischargedDate',
        },
        {
            title: 'ชื่อโรงพยาบาล',
            dataIndex: 'hospitalName',
        },
        {
            title: 'เบอร์โรงพยาบาล',
            dataIndex: 'hospitalPhoneNumber',
        },
        {
            title: 'จังหวัดโรงพยาบาล',
            dataIndex: 'hospitalProvince',
        },
        {
            title: 'เบอร์โทรนิสิต',
            dataIndex: 'phone_num',
        },
        {
            title: 'ที่อยู่ปัจจุบัน',
            dataIndex: 'presentAddress',
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
                            ประกันนิสิตต่างชาติ
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
                        dataSource={dataSource}
                        columns={columns}
                        style={{ borderRadius: borderRadiusLG  }}
                        scroll={{ x: 'max-content' }}
                        bordered
                        
                    />
               
                </Content>
            </Layout>
        </Layout>
    );
};
export default App;