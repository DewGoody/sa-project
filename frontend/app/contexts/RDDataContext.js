'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const FormDataContext = createContext();
export const useFormData = () => useContext(FormDataContext);

export const FormDataProvider = ({ children }) => {
  const [datafromapiprofile, setdatafromapiprofile] = useState({});
  const [datafromapimilitary, setdatafromapimilitary] = useState({});
  const [formData, setFormData] = useState({});
  const router = useRouter();
  const [form, setForm] = useState(null); // Store form value in context
  const updateDataid = ({ int_form }) => {
    if (isNaN(int_form) || Object.is(int_form, form)) {
      // router.push("/home")
      return
    };
  
    setForm(int_form);
  
    if (int_form !== null && int_form !== undefined) {
      fetchdataapi(int_form);
    }
  };
  
  
  useEffect(() => {
    // console.log(form);

  }, [form])

  const fetchdataapi = async (form) => {
    try {
      const response = await axios.get(`/api/militaryapi/student?id=${form}`);
      setdatafromapiprofile(response.data);
      const responsemilitary = await axios.get(`/api/military?id=${form}`)
      // console.log(responsemilitary.data)
      await setdatafromapimilitary(responsemilitary.data)
    } catch (err) {
      console.log(err);
    }
  };
  
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    console.log("Context RD", datafromapimilitary.rD_info?.citizenRD);
  }, [datafromapimilitary])
  useEffect(() => {

    if (datafromapiprofile.bd) {
      const formattedBirthDate = formatDate(datafromapiprofile.bd);
  
      setFormData((prevData) => ({
        ...prevData,
        id: datafromapiprofile.id,
        Nametitle: datafromapiprofile.title,
        Name: datafromapiprofile.fnameTH,
        Surname: datafromapiprofile.lnameTH,
        citizenId: datafromapiprofile.thai_id,
        birthDate: formattedBirthDate,
        religion: datafromapiprofile.religion, //
        ethnicity: datafromapiprofile.race, //
        nationality: datafromapiprofile.nationality, //
        phone_num: datafromapiprofile.phone_num,
        year: datafromapiprofile.year,
        degree: datafromapiprofile.degree,
        age: calculateAge(formattedBirthDate),

        fathertitle: datafromapimilitary.father_mother_info?.father.title,
        fatherName: datafromapimilitary.father_mother_info?.father.fname,
        fatherSurname: datafromapimilitary.father_mother_info?.father.lname,
        mothertitle: datafromapimilitary.father_mother_info?.mother.title,
        motherName: datafromapimilitary.father_mother_info?.mother.fname,
        motherSurname: datafromapimilitary.father_mother_info?.mother.lname,
        fatherphone: datafromapimilitary.father_mother_info?.father.phone_num,
        motherphone: datafromapimilitary.father_mother_info?.mother.phone_num,

        citizenRD: datafromapimilitary.rD_info?.citizenRD,
        YearGradeRD: datafromapimilitary.rD_info?.YearGradeRD, //เอา
        register_type: datafromapimilitary.rD_info?.register_type, //เอา
        // การเป็นทหารกองหนุน
        Branches: datafromapimilitary.rD_info?.Branches,
        corps: datafromapimilitary.rD_info?.corps,

        Parenttitle: datafromapimilitary.guardian_info?.guardian_title,
        ParentName: datafromapimilitary.guardian_info?.guardian_fname,
        ParentSurname: datafromapimilitary.guardian_info?.guardian_lname,
        Parentrelated: datafromapimilitary.guardian_info?.guardian_relation,
        ParentPhone: datafromapimilitary.guardian_info?.phone_num,
        Parentconsent1: datafromapimilitary.guardian_info?.consent1,
        Parentconsent2: datafromapimilitary.guardian_info?.consent2,
        Parentconsent21: datafromapimilitary.guardian_info?.consent21,
        //คำรับรอง
        registermyself: datafromapimilitary.rD_info?.registermyself , 
        notmilitary: datafromapimilitary.rD_info?.notmilitary, 
        readymilitary: datafromapimilitary.rD_info?.readymilitary,

        man_right:datafromapimilitary.rD_info?.man_right,
        women_right:datafromapimilitary.rD_info?.women_right,
        ready_right:datafromapimilitary.rD_info?.ready_right,

      }));
      console.log("Context RD", datafromapimilitary);
      
    }
  }, [datafromapiprofile, datafromapimilitary]);

  const updateFormData = (newData) => {
    setFormData((prevData) => ({
      ...prevData,
      ...newData
    }));
  };

  return (
    <FormDataContext.Provider value={{ formData, updateFormData, updateDataid }}>
      {children}
    </FormDataContext.Provider>
  );
};