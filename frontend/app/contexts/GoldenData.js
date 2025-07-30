'use client';
import React, { createContext, useContext, useState, useEffect, useDebugValue } from 'react';
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
    // console.log(datafromapi, "datafromapi.Student.tel_num");

  }, [datafromapi]);
  useEffect(() => {
    if (Object.keys(datafromapi).length > 0) {
      const formattedBirthDate = formatDate(datafromapi.Student.bd);
      setData((prevData) => ({
        ...prevData,
        id: datafromapi.Student.id ?? null,
        Nametitle: datafromapi.Student.title ?? null,
        Name: datafromapi.Student.fnameTH ?? null,
        Surname: datafromapi.Student.lnameTH ?? null,
        citizenId: datafromapi.Student.thai_id ?? null,
        birthDate: formattedBirthDate ?? null,
        Idcardissuedate: formatDate(datafromapi.Student.thai_id_card_issured) ?? null,
        Idcardexpiraiton: formatDate(datafromapi.Student.thai_id_card_expired) ?? null,
        Job: "นิสิต" ?? null,
        Phonenumber: datafromapi.Student.phone_num ?? null,
        Contactphone: datafromapi.Student.contactable_tel ?? null,
        email: datafromapi.Student.personal_email ?? null,
        year: datafromapi.Student.year ?? null,
        facultyNameTH: datafromapi.Student.facultyNameTH ?? null,

        domicileNumber: datafromapi.DOPA_address.house_num ?? null,
        house_moo: datafromapi.DOPA_address.house_moo ?? null,
        soi: datafromapi.DOPA_address.soi ?? null,
        road: datafromapi.DOPA_address.street ?? null,
        province: datafromapi.DOPA_address.province ?? null,
        amphure: datafromapi.DOPA_address.district ?? null,
        district: datafromapi.DOPA_address.subdistrict ?? null,
        zipCode: datafromapi.DOPA_address.postal_code ?? null,
        Telnumber: datafromapi.Student.tel_num ?? null,

        benefitStatus: datafromapi.UHC_reg_info.status_before_reg ?? null,
        hospitalName: datafromapi.UHC_reg_info?.status_before_reg === "existing"
          ? datafromapi.UHC_reg_info?.status_info ?? null
          : null,
        otherStatus: datafromapi.UHC_reg_info?.status_before_reg === "other"
          ? datafromapi.UHC_reg_info?.status_info ?? null
          : null,
        hospitalService: datafromapi.UHC_reg_info.frequence_uses ?? null,
        usedHospitalBefore: datafromapi.UHC_reg_info.is_been ?? null,
        hasChronicDisease: datafromapi.UHC_reg_info.is_congenital_disease ?? null,

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
