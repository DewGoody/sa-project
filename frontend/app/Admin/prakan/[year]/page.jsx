'use client'
import React, { useEffect, useState } from 'react';
import {
    SearchOutlined,
    DownloadOutlined,
    FilterOutlined,
    OrderedListOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Input, Table, Modal ,Select, Space } from 'antd';
import axios from 'axios';
import { useRouter,useParams } from 'next/navigation';


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
        console.log("recordModalJa :", typeof record);
        setIsModalOpen(true);
      };
    
      const handleOk = () => {
        const response = axios.post('/api/request/createMoreInfo', {id: parseInt(reqMoreInfo), more_info: moreInfoValue});
        
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
                    hospital_type: item.accident_info[0].hospital_type,
                    medical_fee: item.accident_info[0].medical_fee + ' บาท',
                    status: item.status,
                    id: item.accident_info[0].id,
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

        console.log("dataDownloadJaa", typeof dataDownload);

        try {
            const res = await axios.post('/api/request/downloadPrakan', { id: parseInt(dataDownload) }, {
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

    const handleEditForm = async (id) => {
        console.log("editFormReqId : ", id);
        const response = await axios.post('/api/request/getById', { id: id }); // Example API
        console.log("editFormResponse :", response.data.data.path);
        router.push(`/student/0/prakan/${response.data.data.form}`);
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


    const columns = [
        {
            align: 'center',
            width: 100,
            title: 'แก้ไข',
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
                  onClick={() => handleDownload(record.id)}
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
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารไปบริษัทประกันแล้ว', style: { color: 'gray' } , disabled: true},
                        { value: 'ขอข้อมูลเพิ่มเติม', label: 'ขอข้อมูลเพิ่มเติม', style: { color: 'gray' } , disabled: true},
                        { value: 'ไม่อนุมัติ', label: 'ไม่อนุมัติ', style: { color: 'gray' } , disabled: true},
                        { value: 'โอนเงินเรียบร้อย', label: 'โอนเงินเรียบร้อย', style: { color: 'gray' } , disabled: true},
                    ];
                } else if (status === 'รอเจ้าหน้าที่ดำเนินการ') {
                    options = [
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', style: { color: 'gray' } , disabled: true },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารไปบริษัทประกันแล้ว', style: { color: 'black' } },
                        { value: 'ขอข้อมูลเพิ่มเติม', label: 'ขอข้อมูลเพิ่มเติม', style: { color: 'gray' } , disabled: true},
                        { value: 'ไม่อนุมัติ', label: 'ไม่อนุมัติ', style: { color: 'gray' } , disabled: true},
                        { value: 'โอนเงินเรียบร้อย', label: 'โอนเงินเรียบร้อย', style: { color: 'gray' }, disabled: true },
                    ];
                } else if (status === 'ส่งเอกสารแล้ว') {
                    options = [
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', style: { color: 'gray' } , disabled: true },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารไปบริษัทประกันแล้ว', style: { color: 'gray' } , disabled: true},
                        { value: 'ขอข้อมูลเพิ่มเติม', label: 'ขอข้อมูลเพิ่มเติม', style: { color: 'black' } },
                        { value: 'ไม่อนุมัติ', label: 'ไม่อนุมัติ', style: { color: 'black' } },
                        { value: 'โอนเงินเรียบร้อย', label: 'โอนเงินเรียบร้อย', style: { color: 'black' } },
                    ];
                }
                else if (status === 'ขอข้อมูลเพิ่มเติม') {
                    options = [
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', style: { color: 'gray' } , disabled: true },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารไปบริษัทประกันแล้ว', style: { color: 'gray' } , disabled: true},
                        { value: 'ขอข้อมูลเพิ่มเติม', label: 'ขอข้อมูลเพิ่มเติม', style: { color: 'black' }, disabled: true },
                        { value: 'ไม่อนุมัติ', label: 'ไม่อนุมัติ', style: { color: 'black' } },
                        { value: 'โอนเงินเรียบร้อย', label: 'โอนเงินเรียบร้อย', style: { color: 'black' } },
                    ];
                }else if (status === 'ไม่อนุมัติ') {
                    options = [
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', style: { color: 'gray' } , disabled: true },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารไปบริษัทประกันแล้ว', style: { color: 'gray' } , disabled: true},
                        { value: 'ขอข้อมูลเพิ่มเติม', label: 'ขอข้อมูลเพิ่มเติม', style: { color: 'gray' },disabled: true },
                        { value: 'ไม่อนุมัติ', label: 'ไม่อนุมัติ', style: { color: 'gray' },disabled: true },
                        { value: 'โอนเงินเรียบร้อย', label: 'โอนเงินเรียบร้อย', style: { color: 'gray' },disabled: true },
                    ];
                }
                else if (status === 'โอนเงินเรียบร้อย') {
                    options = [
                        { value: 'รอเจ้าหน้าที่ดำเนินการ', label: 'รอเจ้าหน้าที่ดำเนินการ', style: { color: 'gray' } , disabled: true },
                        { value: 'ส่งเอกสารแล้ว', label: 'ส่งเอกสารไปบริษัทประกันแล้ว', style: { color: 'gray' } , disabled: true},
                        { value: 'ขอข้อมูลเพิ่มเติม', label: 'ขอข้อมูลเพิ่มเติม', style: { color: 'gray' },disabled: true },
                        { value: 'ไม่อนุมัติ', label: 'ไม่อนุมัติ', style: { color: 'gray' },disabled: true },
                        { value: 'โอนเงินเรียบร้อย', label: 'โอนเงินเรียบร้อย', style: { color: 'gray' },disabled: true },
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
                     {record.status === "ขอข้อมูลเพิ่มเติม" || record.status === "โอนเงินเรียบร้อย" || record.status === "ไม่อนุมัติ"? 
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
            title: 'วันที่เกิดอุบัติเหตุ',
            dataIndex: 'acc_date',
            width: 160,
            sorter: (a, b) => {
                    const dateA = new Date(a.acc_date.split('/').reverse().join('-'));
                    const dateB = new Date(b.acc_date.split('/').reverse().join('-'));
                    return dateA - dateB;
                },
            sortIcon: (sorted) => (
                <div>
                    <OrderedListOutlined style={{ color: "white", fontSize:"18px" }}/>
                </div>
            ),
        },
        {
            title: 'อาการบาดเจ็บ',
            dataIndex: 'des_injury',
        },
        {
            title: 'การเกิดอุบัติเหตุ',
            dataIndex: 'acc_desc',
        },
        {
            title: 'สถานที่เกิดอุบัติเหตุ',
            dataIndex: 'accident_place',
        },
        
        {
            title: 'สถานที่รักษา',
            dataIndex: 'treatment_place',
        },
        {
            title: 'ประเภทสถานพยาบาล',
            dataIndex: 'hospital_type',
        },
        {
            title: 'ค่ารักษาพบาบาล',
            dataIndex: 'medical_fee',
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
                            Department of Scholarships & Student
                        </p>
                        <p className='font-mono font-semibold text-white'>
                            Services, Office of the Student Affairs,
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
                    style={{ background: "rgb(255,157,210)",  height: '100%',marginTop: "20px" }}
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
                        },
                        {
                            key: '9',
                            label: <span style={{ color: selectedKey === '9' ? 'black' : 'white' }}>เปิด-ปิดวันให้บริการ</span>,
                            onClick: () => window.location.href = '/Admin/editServiceDate'
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
                        
                    </div>
                    
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        loading = {loading}
                        style={{ borderRadius: borderRadiusLG  }}
                        scroll={{ x: 'max-content' }}
                        bordered
                        
                    />
                     <Modal 
                        title="เขียนรายละเอียดขอข้อมูลเพิ่มเติม" 
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
                            style={{width: "100%", height: "200px", border:"gray solid", borderRadius:"15px", padding:"15px", fontSize:"18px"}}
                            
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