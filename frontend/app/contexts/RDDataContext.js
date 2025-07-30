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
      console.log("Fetching data for form ID:", form);

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
    console.log("Context RD", datafromapiprofile.title);
  }, [datafromapimilitary])
  useEffect(() => {

    if (datafromapiprofile.bd) {
      const formattedBirthDate = formatDate(datafromapiprofile.bd);

      setFormData((prevData) => ({
        ...prevData,
        id: datafromapiprofile.id ?? nul,
        Nametitle: datafromapiprofile.title ?? null,
        Name: datafromapiprofile.fnameTH ?? null,
        Surname: datafromapiprofile.lnameTH ?? null,
        citizenId: datafromapiprofile.thai_id ?? null,
        birthDate: formattedBirthDate ?? null,
        religion: datafromapiprofile.religion ?? null, //
        ethnicity: datafromapiprofile.race ?? null, //
        nationality: datafromapiprofile.nationality ?? null, //
        phone_num: datafromapiprofile.phone_num ?? null,
        year: datafromapiprofile.year ?? null,
        degree: datafromapiprofile.degree ?? null,
        age: calculateAge(formattedBirthDate) ?? null,

        fathertitle: datafromapimilitary.father_mother_info?.father.title ?? null,
        fatherName: datafromapimilitary.father_mother_info?.father.fname ?? null,
        fatherSurname: datafromapimilitary.father_mother_info?.father.lname ?? null,
        mothertitle: datafromapimilitary.father_mother_info?.mother.title ?? null,
        motherName: datafromapimilitary.father_mother_info?.mother.fname ?? null,
        motherSurname: datafromapimilitary.father_mother_info?.mother.lname ?? null,
        fatherphone: datafromapimilitary.father_mother_info?.father.phone_num ?? null,
        motherphone: datafromapimilitary.father_mother_info?.mother.phone_num ?? null,

        citizenRD: datafromapimilitary.rD_info?.citizenRD ?? null,
        YearGradeRD: datafromapimilitary.rD_info?.YearGradeRD ?? null, //เอา
        register_type: datafromapimilitary.rD_info?.register_type ?? null, //เอา
        // การเป็นทหารกองหนุน
        Branches: datafromapimilitary.rD_info?.Branches ?? null,
        corps: datafromapimilitary.rD_info?.corps ?? null,

        Parenttitle: datafromapimilitary.guardian_info?.guardian_title ?? null,
        ParentName: datafromapimilitary.guardian_info?.guardian_fname ?? null,
        ParentSurname: datafromapimilitary.guardian_info?.guardian_lname ?? null,
        Parentrelated: datafromapimilitary.guardian_info?.guardian_relation ?? null,
        ParentPhone: datafromapimilitary.guardian_info?.phone_num ?? null,
        Parentconsent1: datafromapimilitary.guardian_info?.consent1 ?? false,
        Parentconsent2: datafromapimilitary.guardian_info?.consent2 ?? false,
        Parentconsent21: datafromapimilitary.guardian_info?.consent21 ?? false,
        //คำรับรอง
        registermyself: datafromapimilitary.rD_info?.registermyself ?? true,
        notmilitary: datafromapimilitary.rD_info?.notmilitary ?? true,
        readymilitary: datafromapimilitary.rD_info?.readymilitary ?? true,

        man_right:  datafromapiprofile.title === "นาย" ? true : false,
        women_right:  datafromapiprofile.title === "นางสาว" ? true : false,
        ready_right: datafromapimilitary.rD_info?.ready_right ?? true,

      }));
      // console.log("Context RD", datafromapimilitary);

    }
  }, [datafromapiprofile, datafromapimilitary]);
  useEffect(() => {
    console.log("women", formData.women_right);
  }, [])

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