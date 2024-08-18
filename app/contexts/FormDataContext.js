'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const FormDataContext = createContext();
export const useFormData = () => useContext(FormDataContext);

export const FormDataProvider = ({ children }) => {
  const [datafromapi, setdatafromapi] = useState({});
  const [formData, setFormData] = useState({
    Nametitle: '',
    Name: '',
    Surname: '',
    citizenId: '',
    birthDate: '',
    religion: '',
    ethnicity: '',
    nationality: '',
    fatherName: '',
    motherName: '',
    occupation: '',
    domicileNumber: '',
    road: '',
    province: '',
    amphure: '',
    district: '',
    zipCode: '',
    militaryDomicileNumber: '',
    militaryProvince: '',
    militaryDistrict: '',
    militaryAmphure: '',
    grade9GPAX: '',
    school: '',
    schoolProvince: '',
    ParentName: '',
    Parentage: '',
    Parentjob: '',
    ParentworkAddress: '',
    Parentrelated: ''
  });

  const fetchdataapi = async () => {
    try {
      const response = await axios.get("/api/profile");
      setdatafromapi(response.data);
      // console.log(response.data.title); // Log the response data directly
    } catch (err) {
      console.log(err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    fetchdataapi();
  }, []);

  useEffect(() => {
    if (datafromapi.bd) {
      const formattedBirthDate = formatDate(datafromapi.bd);
      setFormData((prevData) => ({
        ...prevData,
        Nametitle: datafromapi.title,
        Name: datafromapi.fnameTH,
        Surname: datafromapi.lnameTH,
        citizenId: datafromapi.thai_id,
        birthDate: formattedBirthDate,
        religion: datafromapi.religion,
        ethnicity: datafromapi.race,
        nationality: datafromapi.nationality,

        fatherName: '',
        fatherSurname: '',
        motherName: '',
        motherSurname: '',

        occupation: '',
        domicileNumber: '',
        road: '',
        province: '',
        amphure: '',
        district: '',
        zipCode: '',
        militaryDomicileNumber: '',
        militaryProvince: '',
        militaryDistrict: '',
        militaryAmphure: '',
        grade9GPAX: '',
        school: '',
        schoolProvince: '',

        
        Parenttitle: '',
        ParentName: '',
        ParentSurname: '',

        Parentage: '',
        Parentjob: '',
        ParentworkAddress: '',
        Parentrelated: ''
      }));
    }
  }, [datafromapi]);

  const updateFormData = (newData) => {
    setFormData((prevData) => ({
      ...prevData,
      ...newData
    }));
  };

  return (
    <FormDataContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormDataContext.Provider>
  );
};