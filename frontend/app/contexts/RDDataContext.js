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
      // console.log("dsfdsfdsfdsfdsfsdf", int_form);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const getOldfromBighddate = (dateString) => {
    const birthDate = new Date(dateString);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    // Adjust age if the birthdate hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  };

  const getCurrentYear = () => {
    return new Date().getFullYear();
  };
  useEffect(() => {
    // console.log("พ่อแม่", datafromapimilitary.addresses?.Military_address.house_num)
  }, [datafromapimilitary])
  useEffect(() => {

    if (datafromapiprofile.bd) {
      const formattedBirthDate = formatDate(datafromapiprofile.bd);
      const OldRD = getOldfromBighddate(formattedBirthDate)
      setFormData((prevData) => ({
        ...prevData,
        id: datafromapiprofile.id,
        Nametitle: datafromapiprofile.title,
        Name: datafromapiprofile.fnameTH,
        Surname: datafromapiprofile.lnameTH,
        citizenId: datafromapiprofile.thai_id,
        birthDate: formattedBirthDate,
        religion: datafromapiprofile.religion,
        ethnicity: datafromapiprofile.race,
        nationality: datafromapiprofile.nationality,
        email: datafromapiprofile.personal_email,
        phone_num: datafromapiprofile.phone_num,
        tel_num: datafromapiprofile.tel_num,

        fatherName: datafromapimilitary.father_mother_info?.father.fname,
        fatherSurname: datafromapimilitary.father_mother_info?.father.lname,
        motherName: datafromapimilitary.father_mother_info?.mother.fname,
        motherSurname: datafromapimilitary.father_mother_info?.mother.lname,
        occupationfather: datafromapimilitary.father_mother_info?.father.occupation,
        occupationmother: datafromapimilitary.father_mother_info?.mother.occupation,

        domicileNumber: datafromapimilitary.addresses?.DOPA_address.house_num,
        road: datafromapimilitary.addresses?.DOPA_address.street,
        moo: datafromapimilitary.addresses?.DOPA_address.house_moo,
        soi: datafromapimilitary.addresses?.DOPA_address.soi,
        province: datafromapimilitary.addresses?.DOPA_address.province,
        amphure: datafromapimilitary.addresses?.DOPA_address.subdistrict,
        district: datafromapimilitary.addresses?.DOPA_address.district,
        zipCode: datafromapimilitary.addresses?.DOPA_address.postal_code,

        domicileNumber_contactable: datafromapimilitary.addresses?.Contactable_address.house_num,
        moo_contactable: datafromapimilitary.addresses?.Contactable_address.house_moo,
        soi_contactable: datafromapimilitary.addresses?.Contactable_address.soi,
        province_contactable: datafromapimilitary.addresses?.Contactable_address.province,
        amphure_contactable: datafromapimilitary.addresses?.Contactable_address.subdistrict,
        district_contactable: datafromapimilitary.addresses?.Contactable_address.district,
        zipCode_contactable: datafromapimilitary.addresses?.Contactable_address.postal_code,

        militaryDomicileNumber: datafromapimilitary.addresses?.Military_address.house_num, //RD1&2 

        militaryMoo: datafromapimilitary.addresses?.Military_address.house_moo, //RD2
        militarySoi: datafromapimilitary.addresses?.Military_address.soi, //RD2

        militaryProvince: datafromapimilitary.addresses?.Military_address.province, //RD1&2
        militaryDistrict: datafromapimilitary.addresses?.Military_address.district, //RD1&2
        militaryAmphure: datafromapimilitary.addresses?.Military_address.subdistrict, //RD1&2

        grade9GPAX: datafromapimilitary.Military_info?.grade9_gpax,
        school: datafromapimilitary.Military_info?.grade9_school,
        schoolProvince: datafromapimilitary.Military_info?.grade9_province,
        // military 2

        citizenRD: datafromapimilitary.Military_info?.military_id,
        BeforeMilitartYear: datafromapimilitary.Military_info?.prev_military_class,
        YearBefore: datafromapimilitary.Military_info?.prev_year,
        Whereform: datafromapimilitary.Military_info?.prev_school,
        militaryProvince2: datafromapimilitary.Military_info?.prev_province,
        YearGradeRD: datafromapimilitary.Military_info?.military_class,
        Yearregister: getCurrentYear(),
        SelectedRD: "",
        register_type: datafromapimilitary.Military_info?.register_type,

        OldRD: OldRD,

        //U.data
        Collage_Year: datafromapimilitary.student?.year,
        Major: datafromapimilitary.student?.facultyNameTH,
        Fristdata_in_U: formatDate(datafromapimilitary.Military_info?.date_of_study),

        Parenttitle: datafromapimilitary.guardian_info?.guardian_title,
        ParentName: datafromapimilitary.guardian_info?.guardian_fname,
        ParentSurname: datafromapimilitary.guardian_info?.guardian_lname,

        Parentage: datafromapimilitary.guardian_info?.guardian_age,
        Parentjob: datafromapimilitary.guardian_info?.guardian_occupation,
        ParentworkAddress: datafromapimilitary.guardian_info?.guardian_address,
        Parentrelated: datafromapimilitary.guardian_info?.guardian_relation,
        guardian_nationality:datafromapimilitary.guardian_info?.guardian_nationality,

        // rd2
        fatherNationality: datafromapimilitary.father_mother_info?.father.nationality,
        fatherjob: datafromapimilitary.father_mother_info?.father.occupation,
        fatherwherejob: datafromapimilitary.father_mother_info?.father.working_place,
        fatherjobTST: datafromapimilitary.father_mother_info?.father.tel_num,
        fatherphone: datafromapimilitary.father_mother_info?.father.phone_num,
        fatherhome: datafromapimilitary.addresses?.Father_address.house_num,
        fathermoo: datafromapimilitary.addresses?.Father_address.house_moo,
        fathersubdistrict: datafromapimilitary.addresses?.Father_address.subdistrict,
        fatherdistrict: datafromapimilitary.addresses?.Father_address.district,
        fatherprovince: datafromapimilitary.addresses?.Father_address.province,
        fatherzipcode: datafromapimilitary.addresses?.Father_address.postal_code,
        fatherhomeTST: datafromapimilitary.father_mother_info?.father.home_tel,

        motherNationality: datafromapimilitary.father_mother_info?.mother.nationality,
        motherjob: datafromapimilitary.father_mother_info?.mother.occupation,
        motherwherejob: datafromapimilitary.father_mother_info?.mother.working_place,
        motherjobTST: datafromapimilitary.father_mother_info?.mother.tel_num,
        motherphone: datafromapimilitary.father_mother_info?.mother.phone_num,
        motherhome: datafromapimilitary.addresses?.Mother_address.house_num,
        mothermoo: datafromapimilitary.addresses?.Mother_address.house_moo,
        mothersubdistrict: datafromapimilitary.addresses?.Mother_address.subdistrict,
        motherdistrict: datafromapimilitary.addresses?.Mother_address.district,
        motherprovince: datafromapimilitary.addresses?.Mother_address.province,
        motherzipcode: datafromapimilitary.addresses?.Mother_address.postal_code,
        motherhomeTST: datafromapimilitary.father_mother_info?.mother.home_tel,

        //RD2 การศึกษา บลาๆ
        RD2_Grade1: datafromapimilitary.Military_info?.academic_grade1,
        RD2_Grade2: datafromapimilitary.Military_info?.academic_grade2,
        RD2_Grade3: datafromapimilitary.Military_info?.academic_grade3,
        RD2_Grade4: datafromapimilitary.Military_info?.academic_grade4,
        RD2_Level1: datafromapimilitary.Military_info?.academic_class1,
        RD2_Level2: datafromapimilitary.Military_info?.academic_class2,
        RD2_Level3: datafromapimilitary.Military_info?.academic_class3,
        RD2_Level4: datafromapimilitary.Military_info?.academic_class4,
        RD2_Major1: datafromapimilitary.Military_info?.academic_major1,
        RD2_Major2: datafromapimilitary.Military_info?.academic_major2,
        RD2_Major3: datafromapimilitary.Military_info?.academic_major3,
        RD2_Major4: datafromapimilitary.Military_info?.academic_major4,
        RD2_Academy1: datafromapimilitary.Military_info?.academic_school1,
        RD2_Academy2: datafromapimilitary.Military_info?.academic_school2,
        RD2_Academy3: datafromapimilitary.Military_info?.academic_school3,
        RD2_Academy4: datafromapimilitary.Military_info?.academic_school4,

        //RD2 การฝึกพวกหัวเกรียน ประวัติการเรียนรด
        RD2_LevelRD1: datafromapimilitary.Military_info?.military_grade1,
        RD2_LevelRD12: datafromapimilitary.Military_info?.military_year1,
        RD2_LevelRD2: datafromapimilitary.Military_info?.military_grade2,
        RD2_LevelRD22: datafromapimilitary.Military_info?.military_year2,
        RD2_LevelRD3: datafromapimilitary.Military_info?.military_grade3,
        RD2_LevelRD32: datafromapimilitary.Military_info?.military_year3,
        RD2_LevelRD4: datafromapimilitary.Military_info?.military_grade4,
        RD2_LevelRD42: datafromapimilitary.Military_info?.military_year4,
        RD2_AcademyRD1: datafromapimilitary.Military_info?.military_school1,
        RD2_AcademyRD2: datafromapimilitary.Military_info?.military_school2,
        RD2_AcademyRD3: datafromapimilitary.Military_info?.military_school3,
        RD2_AcademyRD4: datafromapimilitary.Military_info?.military_school4,
        RD2_ProvinceRD1: datafromapimilitary.Military_info?.military_province1,
        RD2_ProvinceRD2: datafromapimilitary.Military_info?.military_province2,
        RD2_ProvinceRD3: datafromapimilitary.Military_info?.military_province3,
        RD2_ProvinceRD4: datafromapimilitary.Military_info?.military_province4,

        //RD2 ภูมิลำเนาทหาร ใช่อันเดิม

        // การเป็นทหารกองหนุน
        Branches: datafromapimilitary.Military_info?.reg_army,
        corps: datafromapimilitary.Military_info?.reg_corp,
        military_rank1: datafromapimilitary.Military_info?.promo_title1,
        military_rank2: datafromapimilitary.Military_info?.promo_title2,
        corps_rank1: datafromapimilitary.Military_info?.promo_corp1,
        corps_rank2: datafromapimilitary.Military_info?.promo_corp2,
        command_rank1: datafromapimilitary.Military_info?.promo_order1,
        command_rank2: datafromapimilitary.Military_info?.promo_order2,
        date_rank1: formatDate(datafromapimilitary.Military_info?.promo_date1),
        date_rank2: formatDate(datafromapimilitary.Military_info?.promo_date2),

        follower1_name: datafromapimilitary.Military_info?.follower_name1,
        follower1_school: datafromapimilitary.Military_info?.follower_school1,
        follower1_telnum: datafromapimilitary.Military_info?.follower_telnum1,
        follower1_phonenum: datafromapimilitary.Military_info?.follower_phonenum1,
        follower1_housenum: datafromapimilitary.addresses?.Follower_address1.house_num,
        follower1_housemoo: datafromapimilitary.addresses?.Follower_address1.house_moo,
        follower1_soi: datafromapimilitary.addresses?.Follower_address1.soi,
        follower1_subdistrict: datafromapimilitary.addresses?.Follower_address1.subdistrict,
        follower1_district: datafromapimilitary.addresses?.Follower_address1.district,
        follower1_province: datafromapimilitary.addresses?.Follower_address1.province,
        follower1_postal_code: datafromapimilitary.addresses?.Follower_address1.postal_code,

        follower2_name: datafromapimilitary.Military_info?.follower_name2,
        follower2_school: datafromapimilitary.Military_info?.follower_school2,
        follower2_telnum: datafromapimilitary.Military_info?.follower_telnum2,
        follower2_phonenum: datafromapimilitary.Military_info?.follower_phonenum2,
        follower2_housenum: datafromapimilitary.addresses?.Follower_address2.house_num,
        follower2_housemoo: datafromapimilitary.addresses?.Follower_address2.house_moo,
        follower2_soi: datafromapimilitary.addresses?.Follower_address2.soi,
        follower2_subdistrict: datafromapimilitary.addresses?.Follower_address2.subdistrict,
        follower2_district: datafromapimilitary.addresses?.Follower_address2.district,
        follower2_province: datafromapimilitary.addresses?.Follower_address2.province,
        follower2_postal_code: datafromapimilitary.addresses?.Follower_address2.postal_code,
      }));
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