import { useState, useEffect, useRef } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import Head from "next/head";

import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import SuccessModal from "@/components/modals/SuccessModal";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const SurveyRequest = ({surveycode}) => {
  const { t } = useTranslation("common");
  const [richTextValue, setRichTextValue] = useState("");
  const [ surveyCode, setSurveyCode] = useState(surveycode);
  const [showModal, setShowModal] = useState(false);
  const [successCode,setSuccessCode] = useState();

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [statusMessage, setStatusMessage] = useState({
    success: "",
    error: "",
  });
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const formatDate = (isoDate) => {
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
  };

  const toolbarOptions = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],
    [{ align: [] }],
    ["link", "image", "video"],
    ["clean"],
  ];
  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "list",
    "bullet",
    "indent",
    "direction",
    "align",
    "link",
    "image",
    "video",
  ];

  const modules = {
    toolbar: toolbarOptions,
  };

  const options = [
    { label: "social", value: "Social" },
    { label: "economic", value: "Economic" },
    { label: "educational", value: "Educational" },
    { label: "healthy", value: "Healthy" },
    { label: "socio_economic", value: "Socio-economic" },
    { label: "other", value: "Other" },
  ];
  const RequesterOptions = [
    { label: "governmental_institute", value: "Governmental Institute" },
    { label: "private_institute", value: "Private Institute" },
    {
      label: "institute_government_private",
      value: "Institute (Government /Private)",
    },
    { label: "individual", value: "individual" },
  ];
  const notificationPre = [
    { id: "notification_email", value: "Email", label: "email" },
    { id: "notification_sms", value: "SMS", label: "sms" },
    { id: "notification_both", value: "Both", label: "both" },
  ];

  const [methods, setMethods] = useState({
    faceToFace: false,
    selfInterpolation: false,
    phoneCalls: false,
    other: false,
  });

  const chunkOptions = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const optionChunks = chunkOptions(options, 3);

  // const [officialLetterFile, setOfficialLetterFile] = useState(null);
  // const [studyObjectiveFile, setStudyObjectiveFile] = useState(null);

  const allowedFormats = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "image/jpeg",
    "image/png",
    "image/gif",
    // add more image types if needed
  ];

  // const fetchCode = async()=>{
  //   try {
  //     const response = await fetch(`${baseUrl}V1/surveycode`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       }
  //     });
  //     if(response){
  //       const data = await response.json();
  //       setSurveyCode(data?.data?.code);
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  // useEffect(()=>{
  //   fetchCode()
  // },[])

  const handleSave = (e) => {
    e.preventDefault();
    // console.log("Form saved");
    // Add your save logic here
  };

  const handleCancel = (e) => {
    e.preventDefault();
    // console.log("Form cancelled");
    // Add your cancel logic here (maybe reset form or navigate)
  };

  const formRef = useRef(null);

  const officialLetterRef = useRef(null);
  const questionnaireRef = useRef(null);
  const listOfBenef = useRef(null);
  const financialSponsors = useRef(null);
  const objectiveStudy = useRef(null);
  const otherAttachments = useRef(null);

// const handleExportPDF = async () => {
//   if (!formRef.current) return;

//   setIsExportingPDF(true); // disable button

//   try {
//     const element = formRef.current;

//     const canvas = await html2canvas(element, {
//       scale: 2,
//       useCORS: true,
//     });

//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("p", "mm", "a4");

//     const imgProps = pdf.getImageProperties(imgData);
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

//     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//     pdf.save("RequestApprovalForSurvey.pdf");
//   } catch (error) {
//     console.error("PDF export failed:", error);
//   } finally {
//     setIsExportingPDF(false); // re-enable button
//   }
// };

 const handlePrint = () => {
    window.print();
  };
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // will include MIME type prefix
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const formik = useFormik({
    initialValues: {
      code: surveyCode,
      subjectOfSurvey: "",
      institute: "",
      requester: "",
      contactPerson: "",
      email: "",
      telephone: "",
      titleOfSurvey: "",
      durationFrom: "",
      durationTo: "",
      sourceOfSample: "",
      targetPopulation: "",
      coverage: "",
      notificationPreference: "",
      sampleSize: "",
      sampleRepresentation: "",
      officialLetter: null,
      questionnaire: null,
      beneficiaries: null,
      studyObjective: null,
      sponsors: null,
      attachments: null,
      dataAvailability: "",
      dataCollectionMethod: {
        faceToFace: false,
        selfInterpolation: false,
        phoneCalls: false,
        other: false,
      },
      otherSpecify: "",
    },
    validationSchema: Yup.object({
      code: Yup.string().required("Code is required"),
      subjectOfSurvey: Yup.string().required("field_required"),
      institute: Yup.string().required("field_required"),
      contactPerson: Yup.string().required("field_required"),
      requester: Yup.string().required("field_required"),
      email: Yup.string()
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "invalid_email")
        .required("field_required"),
      telephone: Yup.string()
        .required("field_required")
        .matches(/^\d+$/, "invalid_phone_number"),
      titleOfSurvey: Yup.string().required("field_required").max(250),
      durationFrom: Yup.string().required("field_required"),
      //     durationFrom: Yup.string()
      // .required("field_required")
      // .test("is-today-or-later", "From date must be today or later", function (value) {
      //   if (!value) return true; // Required is already handled
      //   const today = new Date();
      //   today.setHours(0, 0, 0, 0); // Normalize to midnight
      //   const inputDate = new Date(value);
      //   inputDate.setHours(0, 0, 0, 0);
      //   return inputDate >= today;
      // }),

      durationTo: Yup.string()
        .required("field_required")
        .test(
          "is-greater",
          "to_date_must_be_later_than_from_date",
          function (value) {
            const { durationFrom } = this.parent;
            if (!value || !durationFrom) return true; // Skip if either is empty (handled by required)
            return new Date(value) > new Date(durationFrom);
          }
        ),
      sourceOfSample: Yup.string().required("field_required"),
      targetPopulation: Yup.string().required("field_required"),
      coverage: Yup.string().required("field_required"),
      sampleSize: Yup.number().when("coverage", {
        is: "Sample",
        then: (schema) =>
          schema
            .required("field_required")
            .typeError("sample_size_must_be_number")
            .integer("sample_size_must_be_integer")
            .positive("sample_size_must_be_greater_than_zero"),
        otherwise: (schema) => schema.notRequired(),
      }),
      sampleRepresentation: Yup.string().required("field_required"),
      dataAvailability: Yup.string().required("field_required"),
      notificationPreference: Yup.string().required("field_required"),

      dataCollectionMethod: Yup.object()
        .test("at-least-one", "field_required", (value) =>
          Object.values(value || {}).some((v) => v === true)
        )
        .required(),
      otherSpecify: Yup.string().when("dataCollectionMethod.other", {
        is: true,
        then: (schema) => schema.required("field_required"),
        otherwise: (schema) => schema.notRequired(),
      }),

      officialLetter: Yup.mixed()
        .test(
          "fileFormat",
          "unsupported_file_format",
          (value) => !value || allowedFormats.includes(value.type)
        )
        .required("field_required"),
      questionnaire: Yup.mixed()
        .test(
          "fileFormat",
          "unsupported_file_format",
          (value) => !value || allowedFormats.includes(value.type)
        )
        .required("field_required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm ,setFieldValue}) => {
      setStatusMessage({ success: "", error: "" });

      try {
        const payload = {
          code: surveycode,
          subject: values.subjectOfSurvey,
          requester: values.requester,
          institute: values.institute,
          contact_person: values.contactPerson,
          email: values.email,
          telephone: values.telephone,
          title: values.titleOfSurvey,
          duration_from: formatDate(values.durationFrom),
          duration_to: formatDate(values.durationTo),
          target_population: values.targetPopulation,
          coverage: values.coverage,
          sample_size: values.sampleSize || "",
          sample_frame: values.sourceOfSample,
          sample_representation: values.sampleRepresentation,
          data_availability: values.dataAvailability,
          notification_preference: values.notificationPreference,
          other_method: values.otherSpecify || "N/A",
          data_collection_method: Object.entries(values.dataCollectionMethod)
            .filter(([_, checked]) => checked)
            ?.map(
              ([key]) =>
                ({
                  faceToFace: "Face to face interview",
                  selfInterpolation: "Self-interpolation",
                  phoneCalls: "Phone calls",
                  other: "Other",
                }[key])
            ),
          file_letter: values.officialLetter
            ? await toBase64(values.officialLetter)
            : null,
          file_questionnaire: values.questionnaire
            ? await toBase64(values.questionnaire)
            : null,
          file_beneficiaries: values.beneficiaries
            ? await toBase64(values.beneficiaries)
            : null,
          file_objective: values.studyObjective
            ? await toBase64(values.studyObjective)
            : null,
          file_sponsors: values.sponsors
            ? await toBase64(values.sponsors)
            : null,
          file_attachments: values.attachments
            ? await toBase64(values.attachments)
            : null,
        };

        const response = await fetch(`${baseUrl}V1/surveyrequests/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.message || "Submission failed");
        }

        setStatusMessage({
          success: result.message || "Submitted successfully",
          error: "",
        });
        resetForm();
        if(result.data.code){
          setShowModal(true)
          setSuccessCode(result.data.code)
          setSurveyCode(result.data.next_code);
          setFieldValue('code',result.data.next_code)
        }
        if (officialLetterRef.current) officialLetterRef.current.value = "";
        if (questionnaireRef.current) questionnaireRef.current.value = "";
        if (listOfBenef.current) listOfBenef.current.value = "";
        if (financialSponsors.current) financialSponsors.current.value = "";
        if (objectiveStudy.current) objectiveStudy.current.value = "";
        if (otherAttachments.current) otherAttachments.current.value = "";
      } catch (err) {
        setStatusMessage({ success: "", error: err.message });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
     <Head>
        <title>{t("request_for_approval_for_survey_poll")}</title>
    </Head>
    <section className="contact-section" style={{ backgroundColor: "#ffffff" }}>
      <div class="_breadcrumb">
        <p class="_breadcrumb-header leading-snug">
          {t("request_for_approval_for_survey_poll")}
        </p>
      </div>

      <div ref={formRef} className="container survey-req-container py-10 print-area">
        <form
          onSubmit={formik.handleSubmit}
          className="Froms form-horizontal regFrom"
        >
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-6">
              <div className="form-group">
                <div className="col-sm-4 control-label">
                  <span className="lbl" title="Name">
                    {t("code")}
                  </span>
                  <span className="Astr">*</span>
                </div>
                <div className="col-sm-8" style={{display:"flex",flexDirection:"column",gap:"5px"}} >
                  <input
                    type="text"
                    maxLength={255}
                    title="Name"
                    className="txtbox securinput"
                    name="code"
                    readOnly
                    value={surveyCode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.code && formik.errors.code ? (
                    <span className="RequiredAstr" style={{ color: "red", whiteSpace:"nowrap" }}>
                      {formik.errors.code}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-4 control-label">
                  <span className="lbl" title="subjectofsurvey">
                    {t("subject_of_survey")}
                  </span>
                  <span className="Astr">*</span>
                </div>
                <div className="col-sm-8" style={{display:"flex",flexDirection:"column",gap:"2px"}}>
                  <table>
                    <tbody>
                      <tr>
                        {options?.map(({ value, label }, index) => (
                          <td key={index}>
                            <input
                              type="radio"
                              id={`subject-${index}`}
                              name="subjectOfSurvey"
                              value={value}
                              checked={formik.values.subjectOfSurvey === value}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <label htmlFor={`subject-${index}`}>
                              {t(label)}
                            </label>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                  {formik.touched.subjectOfSurvey &&
                    formik.errors.subjectOfSurvey && (
                      <span className="RequiredAstr font-janna" style={{whiteSpace:"nowrap"}}>
                        {t(formik.errors.subjectOfSurvey)}
                      </span>
                    )}
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-4 control-label">
                  <span className="lbl" title="requester">
                    {t("requester")}
                  </span>
                  <span className="Astr">*</span>
                </div>
                <div className="col-sm-8" style={{display:"flex",flexDirection:"column",gap:"2px"}}>
                  <table>
                    <tbody>
                      <tr>
                        {RequesterOptions?.map(({ value, label }, index) => {
                          return (
                            <td key={index}>
                              <input
                                type="radio"
                                id={`requester-${index}`}
                                name="requester"
                                value={value}
                                checked={formik.values.requester === value}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                              <label htmlFor={`requester-${index}`}>
                                {t(label)}
                              </label>
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                  {formik.touched.requester && formik.errors.requester && (
                    <span className="RequiredAstr font-janna">
                      {t(formik.errors.requester)}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-4 control-label">
                  <span className="lbl" title="Email">
                    {t("institute")}
                  </span>
                  <span className="Astr">*</span>
                </div>
                <div className="col-sm-8" style={{display:"flex",flexDirection:"column",gap:"2px"}}>
                  <input
                    type="text"
                    maxLength={255}
                    title="Email"
                    className="txtbox"
                    name="institute"
                    value={formik.values.institute}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.institute && formik.errors.institute && (
                    <span className="RequiredAstr" style={{whiteSpace:"nowrap"}}>
                      {t(formik.errors.institute)}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-4 control-label">
                  <span className="lbl" title="Subject">
                    {t("contact_person_focal_point")}
                  </span>
                  <span className="Astr">*</span>
                </div>
                <div className="col-sm-8" style={{display:"flex",flexDirection:"column",gap:"2px"}}>
                  <input
                    type="text"
                    maxLength={255}
                    title="Subject"
                    className="txtbox securinput"
                    name="contactPerson"
                    value={formik.values.contactPerson}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.contactPerson &&
                    formik.errors.contactPerson && (
                      <span className="RequiredAstr" style={{whiteSpace:"nowrap"}}>
                        {t(formik.errors.contactPerson)}
                      </span>
                    )}
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-4 control-label">
                  <span className="lbl" title="Email">
                    {t("email")}
                  </span>
                  <span className="Astr">*</span>
                </div>
                <div className="col-sm-8" style={{display:"flex",flexDirection:"column",gap:"2px"}}>
                  <input
                    type="text"
                    maxLength={255}
                    title="Email"
                    className="txtbox"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <span className="RequiredAstr" style={{whiteSpace:"nowrap"}}>
                      {t(formik.errors.email)}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-4 control-label">
                  <span className="lbl" title="Subject">
                    {t("telephone")}
                  </span>
                  <span className="Astr">*</span>
                </div>
                <div className="col-sm-8" style={{display:"flex",flexDirection:"column",gap:"2px"}}>
                  <input
                    type="text"
                    maxLength={255}
                    title="Subject"
                    className="txtbox securinput"
                    name="telephone"
                    value={formik.values.telephone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.telephone && formik.errors.telephone && (
                    <span className="RequiredAstr" style={{whiteSpace:"nowrap"}}>
                      {t(formik.errors.telephone)}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-4 control-label">
                  <span className="lbl" title="Message">
                    {t("title_of_the_survey")}
                  </span>
                  <span className="Astr">*</span>
                </div>
                <div className="col-sm-8" style={{display:"flex",flexDirection:"column",gap:"2px"}}>
                  <textarea
                    rows={2}
                    cols={20}
                    title="Message"
                    className="txtbox securinput"
                    style={{ height: "100px", width: "100%" }}
                    maxLength={500}
                    name="titleOfSurvey"
                    value={formik.values.titleOfSurvey}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  ></textarea>
                  <span
                    id=""
                    title="Accept max 250 character"
                    class="lbl"
                    style={{ color: "rgb(7, 87, 145)", fontSize: "9px" }}
                  >
                    {t("accept_max_250_character")}
                  </span>
                  {formik.touched.titleOfSurvey &&
                    formik.errors.titleOfSurvey && (
                      <span className="RequiredAstr" style={{whiteSpace:"nowrap"}}>
                        {t(formik.errors.titleOfSurvey)}
                      </span>
                    )}
                </div>
              </div>

              {/* <div className="form-group">
                        <div className="col-xs-12 col-sm-12 col-md-12 btnsWrapper">
                            <button className="submitBtn" type="submit" title="Send">
                            {t('send')}
                            </button>
                        </div>
                        </div> */}
            </div>
          </div>

          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-6 Contactdetails">
              <div className="form-group">
                <div className="col-sm-4 control-label">
                  <span className="lbl" title="Email">
                    {t("duration_from")}
                  </span>
                  <span className="Astr">*</span>
                </div>
                <div className="col-sm-8" style={{display:"flex",flexDirection:"column",gap:"2px"}}>
                  <input
                    type="date"
                    maxLength={255}
                    title="Duration"
                    className="txtbox"
                    name="durationFrom"
                    value={formik.values.durationFrom}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.durationFrom &&
                    formik.errors.durationFrom && (
                      <span className="RequiredAstr" style={{whiteSpace:"nowrap"}}>
                        {t(formik.errors.durationFrom)}
                      </span>
                    )}
                  <span
                    className="RequiredAstr"
                    style={{ color: "red", whiteSpace:"nowrap", display: "none" }}
                  >
                    Invalid Email
                  </span>
                </div>
              </div>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-6 Contactdetails">
              <div className="form-group">
                <div className="col-sm-4 control-label">
                  <span className="lbl" title="Subject">
                    {t("duration_to")}
                  </span>
                  <span className="Astr">*</span>
                </div>
                <div className="col-sm-8" style={{display:"flex",flexDirection:"column",gap:"2px"}}>
                  <input
                    type="date"
                    maxLength={255}
                    title="Subject"
                    className="txtbox securinput"
                    name="durationTo"
                    value={formik.values.durationTo}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.durationTo && formik.errors.durationTo && (
                    <span className="RequiredAstr" style={{whiteSpace:"nowrap"}}>
                      {t(formik.errors.durationTo)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/*row end*/}

          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 Contactdetails">
              <div className="row form-group">
                <div className="col-sm-2 control-label">
                  <span className="lbl" title="Subject">
                    {t("target_population")}
                  </span>
                  <span className="Astr">*</span>
                </div>
                <div className="col-sm-10 mt-2 sm:mt-0">
                  {/* <textarea id="editor1" /> */}

                  {/* <textarea
                    rows={2}
                    cols={20}
                    title="Message"
                    className="txtbox securinput"
                    style={{ height: "100px", width: "100%" }}
                    maxLength={500}
                    name="targetPopulation"
                    value={formik.values.targetPopulation}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  ></textarea> */}

                  <ReactQuill
                    theme="snow"
                    value={formik.values.targetPopulation}
                    onChange={(content) =>
                      formik.setFieldValue("targetPopulation", content)
                    }
                    onBlur={() =>
                      formik.setFieldTouched("targetPopulation", true)
                    }
                    modules={modules}
                    formats={formats}
                    className="custom-quill"
                  />

                  {formik.touched.targetPopulation &&
                    formik.errors.targetPopulation && (
                      <span className="RequiredAstr" style={{whiteSpace:"nowrap"}}>
                        {t(formik.errors.targetPopulation)}
                      </span>
                    )}
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-6 Contactdetails">
              <div className="form-group">
                <div className="col-sm-4 control-label">
                  <span className="lbl" title="Subject">
                    {t("coverage")}
                  </span>
                  <span className="Astr">*</span>
                </div>
                <div className="col-sm-8" style={{display:"flex",flexDirection:"column",gap:"2px"}}>
                  <table id="rBtn_Coverage">
                    <tbody>
                      <tr>
                        <td>
                          <input
                            id="rBtn_Coverage_0"
                            type="radio"
                            name="coverage"
                            value="Full"
                            checked={formik.values.coverage === "Full"}
                            onChange={(e) => {
                              formik.setFieldValue("coverage", e.target.value);
                              formik.setFieldValue("sampleSize", ""); // Reset sample size if switching to Full
                            }}
                          />
                          <label htmlFor="rBtn_Coverage_0">{t("full")}</label>
                        </td>
                        <td>
                          <input
                            id="rBtn_Coverage_1"
                            type="radio"
                            name="coverage"
                            value="Sample"
                            checked={formik.values.coverage === "Sample"}
                            // onChange={(e) => {
                            //   formik.setFieldValue("coverage", e.target.value);
                            // }}
                            onChange={(e) => {
                              formik.setFieldValue("coverage", e.target.value);
                              if (e.target.value === "Sample") {
                                formik.setFieldTouched(
                                  "sampleSize",
                                  true,
                                  false
                                );
                              } else {
                                formik.setFieldValue("sampleSize", "");
                                formik.setFieldTouched(
                                  "sampleSize",
                                  false,
                                  false
                                );
                              }
                            }}
                          />
                          <label htmlFor="rBtn_Coverage_1">{t("sample")}</label>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <span className="lbl text-[10px] font-janna">
                    {t("sample_size")}
                  </span>
                  <input
                    id="txt_CoverageSample"
                    type="number"
                    className="txtbox"
                    name="sampleSize"
                    value={formik.values.sampleSize}
                    onChange={formik.handleChange}
                    disabled={formik.values.coverage !== "Sample"}
                  />
                  {formik.touched.coverage && formik.errors.coverage && (
                    <span className="RequiredAstr" style={{whiteSpace:"nowrap"}}>
                      {t(formik.errors.coverage)}
                    </span>
                  )}
                  {formik.values.coverage === "Sample" &&
                    formik.touched.sampleSize &&
                    formik.errors.sampleSize && (
                      <span className="RequiredAstr" style={{whiteSpace:"nowrap"}}>
                        {t(formik.errors.sampleSize)}
                      </span>
                    )}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-6 Contactdetails">
              <div className="form-group">
                <div className="col-sm-4 control-label">
                  <span className="lbl" title="">
                    {t("source_of_the_sample_frame")}
                  </span>
                  <span className="Astr">*</span>
                </div>
                <div className="col-sm-8" style={{display:"flex",flexDirection:"column",gap:"2px"}}>
                  <input
                    type="text"
                    maxLength={255}
                    title="Email"
                    className="txtbox"
                    name="sourceOfSample"
                    value={formik.values.sourceOfSample}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.sourceOfSample &&
                    formik.errors.sourceOfSample && (
                      <span className="RequiredAstr" style={{whiteSpace:"nowrap"}}>
                        {t(formik.errors.sourceOfSample)}
                      </span>
                    )}
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-6 Contactdetails">
              <div className="form-group">
                <div className="col-sm-4 control-label">
                  <span className="lbl" title="Email">
                    {t("sample_representation")}
                  </span>
                  <span className="Astr">*</span>
                </div>
                <div className="col-sm-8" style={{display:"flex",flexDirection:"column",gap:"2px"}}>
                  <table id="sampleRepresentationTable">
                    <tbody>
                      <tr>
                        <td>
                          <input
                            id="sampleRepresentation_0"
                            type="radio"
                            name="sampleRepresentation"
                            value="Represent the original population"
                            checked={
                              formik.values.sampleRepresentation ===
                              "Represent the original population"
                            }
                            onChange={formik.handleChange}
                          />
                          <label htmlFor="sampleRepresentation_0">
                            {t("represent_the_original_population")}
                          </label>
                        </td>
                        <td>
                          <input
                            id="sampleRepresentation_1"
                            type="radio"
                            name="sampleRepresentation"
                            value="Does not represent the original population"
                            checked={
                              formik.values.sampleRepresentation ===
                              "Does not represent the original population"
                            }
                            onChange={formik.handleChange}
                          />
                          <label htmlFor="sampleRepresentation_1">
                            {t("does_not_represent_the_original_population")}
                          </label>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {formik.touched.sampleRepresentation &&
                    formik.errors.sampleRepresentation && (
                      <span className="RequiredAstr" style={{ color: "red", whiteSpace:"nowrap" }}>
                        {t(formik.errors.sampleRepresentation)}
                      </span>
                    )}
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-6 Contactdetails">
              <div className="form-group">
                <div className="col-sm-4 control-label">
                  <span className="lbl" title="Data Collection Method">
                    {t("data_collection_method")}
                  </span>
                  <span className="Astr">*</span>
                </div>
                <div className="col-sm-8" style={{display:"flex",flexDirection:"column",gap:"2px"}}>
                  <table id="rBtn_DataCollectionMethod">
                    <tbody>
                      {[
                        {
                          name: "faceToFace",
                          label: t("face_to_face_interview"),
                        },
                        {
                          name: "selfInterpolation",
                          label: t("self_interpolation"),
                        },
                        { name: "phoneCalls", label: t("phone_calls") },
                        { name: "other", label: t("other") },
                      ]?.map((item, idx) => (
                        <tr key={item.name}>
                          <td>
                            <input
                              id={`rBtn_DataCollectionMethod_${idx}`}
                              type="checkbox"
                              name={`dataCollectionMethod.${item.name}`}
                              checked={
                                formik.values.dataCollectionMethod[item.name]
                              }
                              onChange={formik.handleChange}
                            />
                            <label htmlFor={`rBtn_DataCollectionMethod_${idx}`}>
                              {item.label}
                            </label>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {formik.touched.dataCollectionMethod &&
                    typeof formik.errors.dataCollectionMethod === "string" && (
                      <span className="RequiredAstr" style={{ color: "red", whiteSpace:"nowrap" }}>
                        {t(formik.errors.dataCollectionMethod)}
                      </span>
                    )}

                  <span className="lbl text-[10px] font-janna">
                    {t("other_specify")}
                  </span>
                  <input
                    name="otherSpecify"
                    type="text"
                    id="txt_OtherSpecify"
                    disabled={!formik.values.dataCollectionMethod.other}
                    className={
                      !formik.values.dataCollectionMethod.other
                        ? "aspNetDisabled txtbox"
                        : "txtbox"
                    }
                    value={formik.values.otherSpecify}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.values.dataCollectionMethod.other &&
                    formik.touched.otherSpecify &&
                    formik.errors.otherSpecify && (
                      <span className="RequiredAstr" style={{ color: "red", whiteSpace:"nowrap" }}>
                        {t(formik.errors.otherSpecify)}
                      </span>
                    )}
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-6 Contactdetails">
              <div className="form-group">
                <div className="col-sm-4 control-label">
                  <span className="lbl" title="Data Availability">
                    {t("data_availability")}
                  </span>
                  <span className="Astr">*</span>
                </div>
                <div className="col-sm-8" style={{display:"flex",flexDirection:"column",gap:"2px"}}>
                  <table id="dataAvailabilityTable">
                    <tbody>
                      <tr>
                        <td>
                          <input
                            id="dataAvailability_0"
                            type="radio"
                            name="dataAvailability"
                            value="For Institute Use"
                            checked={
                              formik.values.dataAvailability ===
                              "For Institute Use"
                            }
                            onChange={formik.handleChange}
                          />
                          <label htmlFor="dataAvailability_0">
                            {t("for_institute_use")}
                          </label>
                        </td>
                        <td>
                          <input
                            id="dataAvailability_1"
                            type="radio"
                            name="dataAvailability"
                            value="For Publication"
                            checked={
                              formik.values.dataAvailability ===
                              "For Publication"
                            }
                            onChange={formik.handleChange}
                          />
                          <label htmlFor="dataAvailability_1">
                            {t("for_publication")}
                          </label>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {formik.touched.dataAvailability &&
                    formik.errors.dataAvailability && (
                      <span className="RequiredAstr" style={{ color: "red", whiteSpace:"nowrap" }}>
                        {t(formik.errors.dataAvailability)}
                      </span>
                    )}
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-6 Contactdetails">
              <div className="form-group">
                <div className="col-sm-4 control-label">
                  <span className="lbl">
                    {t("official_letter_from_the_sponsor")}
                  </span>
                  <label className="Astr">*</label>
                </div>
                <div className="col-sm-8" style={{display:"flex",flexDirection:"column",gap:"2px"}}>
                  <input
                    ref={officialLetterRef}
                    type="file"
                    id="fu_OfficialLetter"
                    className="file_1 txtF"
                    onChange={(e) => {
                      const file = e.currentTarget.files[0];
                      formik.setFieldValue("officialLetter", file);
                    }}
                    accept=".pdf,.docx,.xlsx,image/*"
                  />

                  {/* {formik.values.officialLetter && (
                    <input
                      type="button"
                      value="X"
                      onClick={() =>
                        formik.setFieldValue("officialLetter", null)
                      }
                      className="DeletAttachement"
                    />
                  )} */}

                  {formik.touched.officialLetter &&
                    formik.errors.officialLetter && (
                      <span className="RequiredAstr" style={{ color: "red", whiteSpace:"nowrap" }}>
                        {t(formik.errors.officialLetter)}
                      </span>
                    )}
                </div>
              </div>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-6 Contactdetails">
              <div className="form-group">
                <div className="col-sm-4 control-label">
                  <span className="lbl">{t("objective_of_the_study")}</span>
                </div>
                <div className="col-sm-8" style={{display:"flex",flexDirection:"column",gap:"2px"}}>
                  <input
                    ref={objectiveStudy}
                    type="file"
                    id="fu_Objec"
                    className="file_1 txtF"
                    onChange={(e) => {
                      const file = e.currentTarget.files[0];
                      formik.setFieldValue("studyObjective", file);
                    }}
                    // onChange={handleOfficialLetterChange}
                    accept=".pdf,.docx,.xlsx,image/*"
                  />

                  {/* {officialLetterError && (
                    <span
                      id="rfv_OfficialLetter"
                      className="RequiredAstr"
                      style={{ display: "block", color: "red", whiteSpace:"nowrap" }}
                    >
                      {officialLetterError}
                    </span>
                  )} */}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-6 Contactdetails">
              <div className="form-group">
                <div className="col-sm-4 control-label">
                  <span className="lbl">{t("questionnaire")}</span>
                  <label className="Astr">*</label>
                </div>
                <div className="col-sm-8" style={{display:"flex",flexDirection:"column",gap:"2px"}}>
                  <input
                    type="file"
                    ref={questionnaireRef}
                    id="fu_que"
                    className="file_1 txtF"
                    onChange={(e) => {
                      const file = e.currentTarget.files[0];
                      formik.setFieldValue("questionnaire", file);
                    }}
                    accept=".pdf,.docx,.xlsx,image/*"
                  />

                  {formik.touched.questionnaire &&
                    formik.errors.questionnaire && (
                      <span className="RequiredAstr" style={{ color: "red", whiteSpace:"nowrap" }}>
                        {t(formik.errors.questionnaire)}
                      </span>
                    )}
                </div>
              </div>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-6 Contactdetails">
              <div className="form-group">
                <div className="col-sm-4 control-label">
                  <span className="lbl">{t("financial_sponsors")}</span>
                </div>
                <div className="col-sm-8" style={{display:"flex",flexDirection:"column",gap:"2px"}}>
                  <input
                    ref={financialSponsors}
                    type="file"
                    id="fu_StudyObjective"
                    className="file_1 txtF"
                    // onChange={handleStudyObjectiveChange}
                    onChange={(e) => {
                      const file = e.currentTarget.files[0];
                      formik.setFieldValue("sponsors", file);
                    }}
                    accept=".pdf,.docx,.xlsx,image/*"
                    // key={
                    //   studyObjectiveFile
                    //     ? studyObjectiveFile.name
                    //     : "studyObjective"
                    // }
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-6 Contactdetails">
              <div className="form-group">
                <div className="col-sm-4 control-label">
                  <span className="lbl">{t("list_of_beneficiaries")}</span>
                </div>
                <div className="col-sm-8" style={{display:"flex",flexDirection:"column",gap:"2px"}}>
                  <input
                    ref={listOfBenef}
                    type="file"
                    id="fu_OfficialLetter"
                    className="file_1 txtF"
                    // onChange={handleOfficialLetterChange}
                    onChange={(e) => {
                      const file = e.currentTarget.files[0];
                      formik.setFieldValue("beneficiaries", file);
                    }}
                    accept=".pdf,.docx,.xlsx,image/*"
                  />

                  {/* {officialLetterError && (
                    <span
                      id="rfv_OfficialLetter"
                      className="RequiredAstr"
                      style={{ display: "block", color: "red", whiteSpace:"nowrap" }}
                    >
                      {officialLetterError}
                    </span>
                  )} */}
                </div>
              </div>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-6 Contactdetails">
              <div className="form-group">
                <div className="col-sm-4 control-label">
                  <span className="lbl">{t("other_attachments")}</span>
                </div>
                <div className="col-sm-8" style={{display:"flex",flexDirection:"column",gap:"2px"}}>
                  <input
                    ref={otherAttachments}
                    type="file"
                    id="fu_StudyObjective"
                    className="file_1 txtF"
                    // onChange={handleStudyObjectiveChange}
                    onChange={(e) => {
                      const file = e.currentTarget.files[0];
                      formik.setFieldValue("attachments", file);
                    }}
                    accept=".pdf,.docx,.xlsx,image/*"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-6 Contactdetails">
              <div className="form-group">
                <div className="col-sm-4 control-label">
                  <span className="lbl" title="Notification Preference">
                    {t("notification_preference")}
                  </span>
                  <span className="Astr">*</span>
                </div>
                <div className="col-sm-8" style={{display:"flex",flexDirection:"column",gap:"2px"}}>
                  <table>
                    <tbody>
                      <tr>
                        {notificationPre?.map(({ id, value, label }) => (
                          <td key={id}>
                            <input
                              type="radio"
                              id={id}
                              name="notificationPreference"
                              value={value}
                              checked={
                                formik.values.notificationPreference === value
                              }
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <label htmlFor={id}>{t(label)}</label>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>

                  {formik.touched.notificationPreference &&
                    formik.errors.notificationPreference && (
                      <span className="RequiredAstr" style={{ color: "red", whiteSpace:"nowrap" }}>
                        {t(formik.errors.notificationPreference)}
                      </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 btnsWrapper">
              <button
                type="submit"
                className="submitBtn"
                id="btn_Submit"
                title="Submit"
              >
                {t("submit")}
              </button>

              {/* <button
                type="button"
                className="submitBtn"
                id="btn_Save"
                title="Save"
                onClick={handleSave}
              >
                {t("save")}
              </button> */}

              {/* <button
                type="button"
                className="cancelBtn"
                id="btn_Cancel"
                title="Cancel"
                onClick={handleCancel}
              >
                {t("cancel")}
              </button> */}
              <button
                type="button"
                className="submitBtn"
                style={{ padding: "9px 15px" }}
                onClick={handlePrint}
                title="Export PDF"
                disabled={isExportingPDF}
              >
                <i className="fas fa-file-pdf" aria-hidden="true"></i>
              </button>
            </div>

            {statusMessage.error && (
              <div className="contact-msg error">{statusMessage.error}</div>
            )}
            {statusMessage.success && (
              <div className="contact-msg success">{statusMessage.success}</div>
            )}
          </div>
        </form>
      </div>
      {showModal && (
        <SuccessModal
          message={`Your survey request sent successfully! please save the survey code ${successCode}`}
          onClose={() => setShowModal(false)}
        />
      )}
    </section>
    </>
  );
};

export default SurveyRequest;

export async function getStaticProps({ locale }) {
  let surveycode = null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}V1/surveycode`);
    const data = await res.json();
    surveycode = data?.data?.code || null;
  } catch (err) {
    console.error("Error fetching survey code:", err);
  }

  return {
    props: {
      surveycode,
      ...(await serverSideTranslations(locale, ["common"])),
    },
    revalidate: 60, // re-generate page every 60 seconds (ISR)
  };
}
