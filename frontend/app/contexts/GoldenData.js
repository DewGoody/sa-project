'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
const Golden = createContext();
export const useGoldenContext = () => useContext(Golden);
export const GoldenDataProvider = ({ children }) => {
  const [form, setForm] = useState(null); // Store form value in context
  const [Data, setData] = useState({});
  const [datafromapi, setdatafromapi] = useState({});
  const updateDataid = ({ int_req_id }) => {
    if (int_req_id === form) return; // Prevent redundant updates
    setForm(int_req_id); // Update form
    if (int_req_id !== null && int_req_id !== undefined) {
      fetchdataapi(int_req_id); // Trigger API only when valid form is provided
    }
  };
  const fetchdataapi = async (form) => {
    if (form === null || form === undefined) return; // Avoid calls if form is invalid
    try {
      const response = await axios.get(`/api/UHC?id=${form}`); //form คือเลข formid
      setdatafromapi(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return ''; // Handle null or undefined dates
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };
  useEffect(() => {
    if (Object.keys(datafromapi).length > 0) {
      const formattedBirthDate = formatDate(datafromapi.Student.bd);
      setData((prevData) => ({
        ...prevData,
        id: datafromapi.Student.id,
        Nametitle: datafromapi.Student.title,
        Name: datafromapi.Student.fnameTH,
        Surname: datafromapi.Student.lnameTH,
        citizenId: datafromapi.Student.thai_id,
        birthDate: formattedBirthDate,
        Idcardissuedate: formatDate(datafromapi.Student.thai_id_card_issured),
        Idcardexpiraiton: formatDate(datafromapi.Student.thai_id_card_expired),
        Job: "นิสิต",
        Phonenumber: datafromapi.Student.phone_num,
        Contactphone: datafromapi.Student.contactable_tel,
        email: datafromapi.Student.personal_email,
        year: datafromapi.Student.year,
        facultyNameTH: datafromapi.Student.facultyNameTH,

        domicileNumber: datafromapi.DOPA_address.house_num,
        house_moo: datafromapi.DOPA_address.house_moo,
        soi: datafromapi.DOPA_address.soi,
        road: datafromapi.DOPA_address.street,
        province: datafromapi.DOPA_address.province,
        amphure: datafromapi.DOPA_address.district,
        district: datafromapi.DOPA_address.subdistrict,
        zipCode: datafromapi.DOPA_address.postal_code,
        Telnumber: datafromapi.Student.tel_num,

        benefitStatus: datafromapi.UHC_reg_info.status_before_reg,
        hospitalName: datafromapi.UHC_reg_info.status_before_reg === "existing"
          ? datafromapi.UHC_reg_info.status_info
          : "",

        otherStatus: datafromapi.UHC_reg_info.status_before_reg === "other"
          ? datafromapi.UHC_reg_info.status_info
          : "",
        hospitalService: datafromapi.UHC_reg_info.frequence_uses,
        usedHospitalBefore: datafromapi.UHC_reg_info.is_been,
        hasChronicDisease: datafromapi.UHC_reg_info.is_congenital_disease,

      }));
    }
  }, [datafromapi]);

  const updateData = (newData) => {
    setData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  return (
    <Golden.Provider value={{ Data, updateData, updateDataid }}>
      {children}
    </Golden.Provider>
  );
};
