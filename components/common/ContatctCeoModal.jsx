import React, { useEffect, useState, useRef, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

// import '../../styles/ncsi.css';

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import api from "@/utils/axiosInstance";

const ContactCeoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const { t } = useTranslation("common");
  const hasFetchedCaptcha = useRef(false);
  const captchaRef = useRef(null);
  const [captchaText, setCaptchaText] = useState("");

  // const styledCaptcha = useMemo(() => {
  //   return captchaText.split("").map((char) => ({
  //     char,
  //     y: Math.floor(Math.random() * 6) - 3,
  //     rotate: Math.floor(Math.random() * 11) - 5,
  //   }));
  // }, [captchaText]);

  // const router = useRouter();
  // const isRTL = router.locale === "ar";
  // const normalizedCaptchaText = isRTL
  //   ? captchaText.split("").reverse().join("")
  //   : captchaText;

  

  const fetchCaptcha = async () => {
    // const data =  Math.random().toString(36).substring(2, 7).toUpperCase();
    // setCaptchaText(data);
    try {
      // Call your CAPTCHA API
      const res = await api.get(`V1/captcha`);
      if (res.data) {
       setCaptchaText(res.data)
      } else {
        console.error("Failed to fetch captcha:", res.statusText);
      }
    } catch (err) {
      console.error("Captcha API error:", err.message);
    }
  };

  useEffect(() => {
      fetchCaptcha();
  }, []);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [statusMessage, setStatusMessage] = useState({
    success: "",
    error: "",
  });
  const [captchaValue, setCaptchaValue] = useState(""); 

  // Function to refresh the CAPTCHA image
  // const refreshCaptcha = () => {
  //   if (captchaRef.current) {
  //     captchaRef.current.src = `/api/generate-captcha?reload=${Date.now()}`;
  //     setCaptchaValue(""); // Clear the input field when captcha refreshes
  //   }
  // };

  // useEffect(() => {
  //   // Refresh captcha when the modal opens
  //   if (isOpen) {
  //     refreshCaptcha();
  //   }
  // }, [isOpen]);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      confirmEmail: "",
      subject: "",
      message: "",
      captcha: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required(t("mandatory_field")),
      email: Yup.string()
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, t("invalid_email_contactus"))
        .required(t("mandatory_field")),

      confirmEmail: Yup.string()
        .oneOf([Yup.ref("email"), null], t('email_not_match'))
        .required(t("mandatory_field")),
      subject: Yup.string().required(t('mandatory_field')),
      message: Yup.string().required(t('mandatory_field')),
      captcha: Yup.string().required(t('mandatory_field')),
    }),
    onSubmit: async (values, { setSubmitting, resetForm, setFieldError }) => {
      setStatusMessage({ success: "", error: "" });

      try {
        // if (values.captcha.toUpperCase() !== normalizedCaptchaText) {
        //   setFieldError("captcha", t("captcha_validation_failed")); // Set Formik error
        //   fetchCaptcha();
        //   return;
        // }

        const payload = {
          name: values.name,
          email: values.email,
          confirm_email: values.confirmEmail,
          subject: values.subject,
          message: values.message,
          captcha_id: captchaText?.id,
          answer: values?.captcha
        };

        const response = await fetch(`${baseUrl}V1/contact-ceo`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || t("submission_failed"));
        }

        setStatusMessage({
          success: result.message || t("submission_success"),
          error: "",
        });
        resetForm();
        fetchCaptcha();
        // refreshCaptcha();
      } catch (err) {
        setStatusMessage({ success: "", error: err.message });
        fetchCaptcha();
        // refreshCaptcha();
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div
      className="modal fade show"
      style={{
        display: "flex",
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: "100",
        justifyContent:'center',
        paddingLeft: "10px",
    paddingRight: "10px",
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="modal-dialog" id="divShowContactCeo">
          <div className="modal-content p-0">
            <div className="modal-header justify-center">
              <button type="button" className="close" onClick={onClose}>
                <span>&times;</span>
              </button>
              <h4 className="modal-title text-[1.5rem]  text-[#6d6e71]">
                {t("contact_ceo")}
              </h4>
            </div>

            <div className="modal-body regFrom w-100">
              <div className="Froms form-horizontal" style={{ padding: "5px" }}>
                <div className="col-xs-12 col-sm-12 col-md-12">
                  <div className="form-group">
                    <p>{t("feedback_intro")}</p>
                  </div>
                </div>

                <div className="">
                  <div className="col-xs-12 col-sm-12 col-md-12">
                    <div className="form-group">
                      <label className="col-sm-4 control-label">
                        {t("name")}
                        <span className="Astr">*</span>
                      </label>
                      <div className="col-sm-8">
                        <input
                          type="text"
                          name="name"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.name}
                          className=""
                        />
                        {formik.touched.name && formik.errors.name && (
                          <span className="RequiredAstr">
                            {formik.errors.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="col-sm-4 control-label">
                        {t("email")} <span className="Astr">*</span>
                      </label>
                      <div className="col-sm-8">
                        <input
                          type="email"
                          name="email"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.email}
                          className=""
                        />
                        {formik.touched.email && formik.errors.email && (
                          <span className="RequiredAstr">
                            {formik.errors.email}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="col-sm-4 control-label">
                        {t("email_confirm")} <span className="Astr">*</span>
                      </label>
                      <div className="col-sm-8">
                        <input
                          type="email"
                          name="confirmEmail"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.confirmEmail}
                          className=""
                        />
                        {formik.touched.confirmEmail &&
                          formik.errors.confirmEmail && (
                            <span className="RequiredAstr">
                              {formik.errors.confirmEmail}
                            </span>
                          )}
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="col-sm-4 control-label">
                        {t("subject")} <span className="Astr">*</span>
                      </label>
                      <div className="col-sm-8">
                        <input
                          type="text"
                          name="subject"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.subject}
                          className=""
                        />
                        {formik.touched.subject && formik.errors.subject && (
                          <span className="RequiredAstr">
                            {formik.errors.subject}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="col-sm-4 control-label">
                        {t("message")} <span className="Astr">*</span>
                      </label>
                      <div className="col-sm-8">
                        <textarea
                          name="message"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.message}
                          className=""
                          rows="4"
                        ></textarea>
                        {formik.touched.message && formik.errors.message && (
                          <span className="RequiredAstr">
                            {formik.errors.message}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Captcha Placeholder */}
                    <div className="form-group">
                      <div className="col-sm-4 control-labe"></div>
                      <div className="col-sm-8">
                        {/* <div
                          style={{
                            height: "50px",
                            width: "180px",
                            backgroundColor: "#eaeaea",
                            color: "#6d6e71",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "28px",
                            fontWeight: "bold",
                            letterSpacing: "7px",
                            fontStyle: "italic",
                            fontFamily: "'Special Elite', monospace",
                            backgroundImage:
                              "url('/assets/images/captcha-bg.jpg')", // <-- fixed line
                            backgroundSize: "cover", // optional: ensure full coverage
                            backgroundRepeat: "no-repeat",
                          }}
                        >
                          {styledCaptcha.map((item, index) => (
                            <span
                              key={index}
                              style={{
                                transform: `translateY(${item.y}px) rotate(${item.rotate}deg)`,
                                display: "inline-block",
                              }}
                            >
                              {item.char}
                            </span>
                          ))}
                        </div> */}
                        <img
                          src={captchaText?.image}
                          alt="Captcha"
                          style={{
                            height: "50px",
                            width: "180px",
                            display: "block",
                          }}
                        />
                        <input
                          type="text"
                          name="captcha"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.captcha}
                          className="mt-2"
                          placeholder=""
                        />
                        {formik.touched.captcha && formik.errors.captcha && (
                          <span className="RequiredAstr">
                            {formik.errors.captcha}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* {formik.status && formik.status.error && (
                      <div className="contact-msg error">
                        {formik.status.error}
                      </div>
                    )}
                    {formik.status && formik.status.success && (
                      <div className="contact-msg success">
                        {formik.status.success}
                      </div>
                    )} */}

                    {statusMessage.error && (
                      <div className="contact-msg error">
                        {statusMessage.error}
                      </div>
                    )}
                    {statusMessage.success && (
                      <div className="contact-msg success">
                        {t("Your request has been sent")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer btnsWrapper">
              <button type="submit" className="submitBtn">
                {t("send")}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContactCeoModal;
