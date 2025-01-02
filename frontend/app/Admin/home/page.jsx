import React from 'react';

const AppointmentManagement = () => {
  const columns = [
    {
        title: 'ชื่อ-นามสกุล',
        dataIndex: 'name',
    },
    {
        title: 'รหัสนิสิต',
        dataIndex: 'student_ID',
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
        title: 'วันที่เกิดอุบัติเหตุ',
        dataIndex: 'acc_date',
    },
    {
        title: 'การเกิดอุบัติเหตุ',
        dataIndex: 'acc_desc',
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
    {
        title: 'สถานะ',
        dataIndex: 'status',
        render: (status) => (
            <Select
                defaultValue={status}
                style={{ width: "180px" }}
                options={[
                    { value: 'รอเข้ารับบริการ', label: 'รอเข้ารับบริการ', style: {color: 'black' } },
                    { value: 'Approved', label: 'ดำเนินการเสร็จสิ้น', style: { color: 'green' } },
                    { value: 'Rejected', label: 'คิวถูกยกเลิก', style: { color: 'red' } },
                ]}
            />
        )
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
            />
          </div>
        ),
    },
];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-pink-300 p-5">
        <h1 className="text-lg font-bold text-white mb-4">ฝ่ายทุนการศึกษาและบริการนิสิต</h1>
        <ul className="space-y-4">
          <li className="bg-white p-2 rounded-lg">จัดการการนัดหมาย</li>
          <li className="p-2 rounded-lg">รายการนัดหมาย</li>
        </ul>
        <div className="mt-auto pt-10">
          <div className="flex items-center">
            <img
              src="/user-profile.png"
              alt="Profile"
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <p className="font-bold">Receptionist</p>
              <p>recep@example.com</p>
            </div>
          </div>
          <button className="w-full mt-5 bg-white p-2 rounded-lg">Log out</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5 bg-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">จัดการการนัดหมาย</h1>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Search"
              className="border p-2 rounded-lg"
            />
            <button className="bg-pink-300 p-2 rounded-lg">+ Add Appointment</button>
          </div>
        </div>

        {/* Table */}
        <table className="w-full bg-white rounded-lg overflow-hidden shadow-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">First Name</th>
              <th className="p-3 text-left">Last Name</th>
              <th className="p-3 text-left">Phone Number</th>
              <th className="p-3 text-left">Appointment Date & Time</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment, index) => (
              <tr key={index} className="border-t">
                <td className="p-3">{appointment.firstName}</td>
                <td className="p-3">{appointment.lastName}</td>
                <td className="p-3">{appointment.phone}</td>
                <td className="p-3">{appointment.date}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-white ${
                      appointment.status === 'Open'
                        ? 'bg-green-500'
                        : appointment.status === 'Booked'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                  >
                    {appointment.status}
                  </span>
                </td>
                <td className="p-3 space-x-2">
                  <button className="bg-purple-500 text-white px-3 py-1 rounded-lg">Pay Now</button>
                  <button className="bg-blue-500 text-white px-3 py-1 rounded-lg">
                    {appointment.status === 'Completed' ? 'Re-Book' : 'Book Now'}
                  </button>
                  <button className="text-red-500">🗑️</button>
                  <button className="text-gray-500">👁️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button className="text-gray-500">Previous</button>
          <div className="flex space-x-2">
            <button className="bg-purple-500 text-white px-3 py-1 rounded-lg">1</button>
            <button className="bg-gray-300 px-3 py-1 rounded-lg">2</button>
            <button className="bg-gray-300 px-3 py-1 rounded-lg">3</button>
          </div>
          <button className="text-gray-500">Next</button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentManagement;
