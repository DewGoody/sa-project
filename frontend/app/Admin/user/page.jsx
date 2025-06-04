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
import Menubar from '../component/menu';


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
            title: 'ชื่อ',
            dataIndex: 'first_name',
            ...getColumnSearchProps('first_name'),
        },
        {
          title: 'นามสกุล',
          dataIndex: 'last_name',
          ...getColumnSearchProps('last_name'),
      },
        {
          title: 'ชื่อผู้ใช้งาน (Username)',
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
        <Form.Item name="first_name" label="ชื่อ" rules={[{ required: true, message: "Please enter your username" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="last_name" label="นามสกุล" rules={[{ required: true, message: "Please enter your username" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="username" label="ชื่อผู้ใช้งาน (Username)" rules={[{ required: true, message: "Please enter your username" }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="รหัสผ่าน (Password)"
          rules={[
          { required: true, message: "โปรดใส่รหัสผ่าน" },
          { min: 6, message: "รหัสผ่านต้องมากกว่า 6 ตัว" }
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="ยืนยันรหัสผ่าน (Confirm Password)"
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
      title="ลบผู้ใช้งาน"
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