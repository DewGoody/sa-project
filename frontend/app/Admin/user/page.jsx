'use client'
import React, { useEffect, useState } from 'react';
import {
    SearchOutlined,
    DownloadOutlined,
    FilterOutlined,
    OrderedListOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Input, Table, Space,Select, Form, message, Modal} from 'antd';
import axios from 'axios';
import { useRouter,useParams } from 'next/navigation';


const { Header, Sider, Content } = Layout;


const App = () => {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [dataSource, setDataSource] = useState([]);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [selectedKey, setSelectedKey] = useState('8');
    const [fetchYear, setfetchYear] = useState([]);
    const [statusRequest, setStatusRequest] = useState('');
    const [loading, setLoading] = useState(false);
    const [shouldReload, setShouldReload] = useState(false);
    const [filteredInfo, setFilteredInfo] = useState({});
    const [form] = Form.useForm();
    const [formEdit] = Form.useForm();

     useEffect(() => {
            if (shouldReload) {
            window.location.reload();
            }
        }, [shouldReload]);
    
    const fetchAdmin = async () => {
        try {
            const response = await axios.post("/api/user/getAll");
            console.log("responseFetch",response)
            setDataSource(...dataSource, response.data.data);
        } catch (error) {
            console.error("Error:", error);
            message.error("Failed to fetch data!");
        }
    };

    useEffect(() => {
        fetchAdmin();
    }, []);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const handleEdit = (record) => {
      setEditingUser(record);
      setIsModalVisible(true);
    };

    const handleCancel = () => {
      setIsModalVisible(false);
      setEditingUser(null);
    };

    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [deletingUser, setDeletingUser] = useState(null);

    const handleDelete = (record) => {
      setDeletingUser(record);
      setIsDeleteModalVisible(true);
    };

    const handleDeleteCancel = () => {
      setIsDeleteModalVisible(false);
      setDeletingUser(null);
    };

    const handleDeleteConfirm = async () => {
      try {
        setLoading(true);
        await axios.post("/api/user/delete", { id: deletingUser.id });
        setLoading(false);
        setIsDeleteModalVisible(false);
        setShouldReload(true);
        message.success("User deleted successfully!");
      } catch (error) {
        setLoading(false);
        message.error("Delete failed!");
        console.error("Error:", error);
      }
    };

    const handleSave = async () => {
      try {
        setLoading(true);
        const response = await axios.post("/api/user/update", editingUser);
        setLoading(false);
        setIsModalVisible(false);
        setShouldReload(true);
        message.success("User updated successfully!");
        console.log("Response:", response.data);
      } catch (error) {
        setLoading(false);
        message.error("Update failed!");
        console.error("Error:", error);
      }
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setEditingUser({ ...editingUser, [name]: value });
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

      const onFinish = async (values) => {
        try {
          setLoading(true);
          setShouldReload(true);
          const response = await axios.post("/api/user/create", values);
          setLoading(false);
          setShouldReload(false);
          
          message.success("Data submitted successfully!");
          console.log("Response:", response.data);
        } catch (error) {
          message.error("Submission failed!");
          console.error("Error:", error);
        }
      };


    const columns = [
        
        {
            title: 'ชื่อจริงเจ้าหน้าที่',
            dataIndex: 'first_name',
            ...getColumnSearchProps('first_name'),
        },
        {
          title: 'นามสกุลเจ้าหน้าที่',
          dataIndex: 'last_name',
          ...getColumnSearchProps('last_name'),
      },
        {
          title: 'ชื่อผู้ใช้งาน',
          dataIndex: 'username',
          ...getColumnSearchProps('username'),
      },
        {
            title: 'แก้ไข / ลบ',
            dataIndex: 'edit',
            render: (text, record) => (
                <Space size="middle">
                    <Button
                        // type="primary"
                        onClick={() => {
                            handleEdit(record);
                        }}
                    >
                        แก้ไข
                    </Button>
                    <Button
                        type="primary"
                        danger
                        onClick={() => {
                           handleDelete(record);
                        }}
                    >
                        ลบ
                    </Button>
                </Space>
            ),

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
                จัดการผู้ใช้งาน
              </div>
            </div>
            
            <Table
              dataSource={dataSource}
              columns={columns}
              loading={loading}
              style={{ borderRadius: borderRadiusLG  }}
              scroll={{ x: 'max-content' }}
              
            />
            <Form form={form} onFinish={onFinish} layout="vertical">
        {/* Username Field */}
        <Form.Item name="first_name" label="ชื่อจริงเจ้าหน้าที่" rules={[{ required: true, message: "Please enter your username" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="last_name" label="นามสกุลเจ้าหน้าที่" rules={[{ required: true, message: "Please enter your username" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="username" label="ชื่อผู้ใช้งาน" rules={[{ required: true, message: "Please enter your username" }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="รหัสผ่าน"
          rules={[
          { required: true, message: "โปรดใส่รหัสผ่าน" },
          { min: 6, message: "รหัสผ่านต้องมากกว่า 6 ตัว" }
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="ยืนยันรหัสผ่าน"
          dependencies={["password"]}
          rules={[
          { required: true, message: "โปรดใส่รหัสผ่าน" },
          ({ getFieldValue }) => ({
            validator(_, value) {
            if (!value || getFieldValue("password") === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error("รหัสผ่านไม่ตรงกัน"));
            },
          }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">สร้างผู้ใช้งาน</Button>
        </Form.Item>
    </Form>
    <Modal
      title="แก้ไขผู้ใช้งาน"
      visible={isModalVisible}
      onCancel={handleCancel}
      footer={[
      <Button key="cancel" onClick={handleCancel}>
        ปิดหน้าต่าง
      </Button>,
      <Button key="save" type="primary" loading={loading} onClick={handleSave}>
        แก้ไข
      </Button>,
      ]}
    >
      <Form form={formEdit} layout="vertical">
      <Form.Item label="ชื่อจริงเจ้าหน้าที่">
      <Input
        name="first_name"
        value={editingUser?.first_name}
        onChange={handleInputChange}
      />
    </Form.Item>
    <Form.Item label="นามสกุลเจ้าหน้าที่">
      <Input
        name="last_name"
        value={editingUser?.last_name}
        onChange={handleInputChange}
      />
    </Form.Item>
    <Form.Item label="ชื่อผู้ใช้งาน">
      <Input
        name="username"
        value={editingUser?.username}
        onChange={handleInputChange}
      />
    </Form.Item>
    <Form.Item>
      <Button type="primary" onClick={() => setEditingUser({ ...editingUser, editPassword: true })}>
        แก้ไขรหัสผ่าน
      </Button>
    </Form.Item>

    {editingUser?.editPassword && (
      <>
        <Form.Item
          label="รหัสผ่านใหม่"
          name="password" // Fix this
          rules={[
            { required: true, message: "โปรดใส่รหัสผ่าน" },
            { min: 6, message: "รหัสผ่านต้องมากกว่า 6 ตัว" },
          ]}
        >
          <Input.Password onChange={handleInputChange} />
        </Form.Item>

        <Form.Item
          label="ยืนยันรหัสผ่านใหม่"
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "โปรดยืนยันรหัสผ่าน" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("รหัสผ่านไม่ตรงกัน"));
              },
            }),
          ]}
        >
          <Input.Password onChange={handleInputChange} />
        </Form.Item>
        </>
      )}
      </Form>
    </Modal>

    <Modal
      title="Delete User"
      visible={isDeleteModalVisible}
      onCancel={handleDeleteCancel}
      footer={[
        <Button key="cancel" onClick={handleDeleteCancel}>
          ปิดหน้าต่าง
        </Button>,
        <Button key="delete" type="primary" danger loading={loading} onClick={handleDeleteConfirm}>
          ลบ
        </Button>,
      ]}
    >
      <p>ต้องการลบผู้ใช้นี้ออกจากระบบใช่ไหม</p>
    </Modal>
           
          </Content>
        </Layout>
      </Layout>
    );
};
export default App;