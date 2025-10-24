import { Rating } from "@mui/material";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import Head from "next/head";
const CustomRating = styled(Rating)({
  "& .MuiSvgIcon-root": {
    fontSize: "18px",
    height: 26,
    cursor: "pointer",
    verticalAlign: "middle", // Fix vertical alignmen            // Tighten line height
    position: "relative", // Prevent overflow
  },
  "& .MuiRating-iconFilled": {
    color: "#144d85", // e.g. pink/red (change to your preferred color)
  },
  "& .MuiRating-iconEmpty": {
    color: "#144d85", // e.g. light gray
  },
  "& .MuiRating-icon": {
    padding: 0,
    margin: "0",
    overflow: "hidden", // Hide any overflow outside star container
  },
});
const PopulationClock = () => {
  const { t } = useTranslation("common");
  const [value, setValue] = useState(2.5);

    const router = useRouter();
    const isRTL = router.locale === "ar";

   const bannerImage = isRTL
    ? "/assets/images/Indicators_List_bg_ar.jpg"
    : "/assets/images/populationBanner";

  return (
    <>
     <Head>
        <title>{t("population_clock")}</title>
      </Head>
    <div style={{ backgroundColor: "#f0f0f0",height:"550px" }}>
              <div class="_breadcrumb">
          <p class="_breadcrumb-header">{t('Population Clock  ')}</p>
        </div>
      <div className="container-population py-4">
        {/* <div
          style={{ paddingTop: "8px !important" }}
          id="ctl00_g_b915632e_61c3_4200_8685_4dee870ed921"
          __markuptype="vsattributemarkup"
          __webpartid="{B915632E-61C3-4200-8685-4DEE870ED921}"
          webpart="true"
          partorder="2"
        >
          <div class="breadcrumb">
            <span>
              <span>
                <a href="/">{t("home")}</a>
              </span>
              <span> &gt; </span>
              <span>
                <a href="#">{t("who_are_we")}</a>
              </span>
              <span> &gt; </span>
              <span>{t("population_clock")}</span>
            </span>
          </div>
        </div> */}
        
        <div data-name="ContentPlaceHolderMain">
          <span id="DeltaPlaceHolderMain">
            

            {/* <div
              class={`row TITPage Header_2 ${isRTL ? "bg-ar" : "bg-en"}`}
              style={{
                backgroundSize: "cover",
              }}
            >
              <p
                class="divEnglishContnet gill-font p-0"
                style={{ display: "block" }}
              >
                <span>{t("population_clock")}</span>
              </p>
            </div> */}

            <div class="clr"></div>
            <div id="Div2" class="rs_skip rsbtn rs_preserve SPtalk ">
              <a
                class="rsbtn_play"
                accesskey="L"
                title="Listen to this page using ReadSpeaker"
                href="https://app-as.readspeaker.com/cgi-bin/rsent?customerid=8046&amp;lang=en_uk&amp;readid=divEnglishContnet&amp;url="
                data-rsevent-id="rs_100317"
                role="button"
              >
                <span class="rsbtn_left rsimg rspart">
                  <span class="rsbtn_text">
                    <span>{t("Listen")}</span>
                  </span>
                </span>
                <span class="rsbtn_right rsimg rsplay rspart SPKView"></span>
              </a>
            </div>

            <div id="Img" class="Imgtempright">
              <div
                id="ctl00_PlaceHolderMain_ctl02_label"
                style={{ display: "none" }}
              >
                {t("Image")}
              </div>
              <div
                id="ctl00_PlaceHolderMain_ctl02__ControlWrapper_RichImageField"
                class="ms-rtestate-field"
                style={{ display: "inline" }}
                aria-labelledby="ctl00_PlaceHolderMain_ctl02_label"
              >
                <div class="ms-rtestate-field"></div>
              </div>
            </div>

            <div
              id="divEnglishContnet"
              class="divEnglishContnet"
              style={{ display: "block" }}
            >
              <div class="Contentlayoutsviewtemp">
                <div
                  id="ctl00_PlaceHolderMain_ctl04_label"
                  style={{ display: "none" }}
                >
                  Body (En)
                </div>
                <div
                  id="ctl00_PlaceHolderMain_ctl04__ControlWrapper_RichHtmlField"
                  class="ms-rtestate-field populaton_clock_text_div"
                  style={{ display: "inline" }}
                  aria-labelledby="ctl00_PlaceHolderMain_ctl04_label"
                >
                  <p style={{ textAlign: "left" }}></p>
                  <p style={{ textAlign: isRTL ? "right" : "left" }}>
                    
                    {t('daily_actual_number')}
                  </p>
                  <h2
                    class="ms-rteElement-H2B"
                    style={{
                      textAlign: isRTL ? "right" : "left",
                      color: "#00485B",
                      marginTop: "20px",
                      marginBottom: "10px",
                      fontWeight: "normal",
                      fontFamily: "GillSansMT, Arial",
                      fontSize: "30px",
                    }}
                  >
                     {t('first_omani_population')}
                  </h2>
                  <p style={{ textAlign: isRTL ? "right" : "left" }}>
                    {t('includes_all_alive')}
                  </p>
                  <h2
                    class="ms-rteElement-H2B"
                    style={{
                      textAlign: isRTL ? "right" : "left",
                      color: "#00485B",
                      marginTop: "20px",
                      marginBottom: "10px",
                      fontFamily: "GillSansMT, Arial",
                      fontWeight: "normal",
                      fontSize: "30px",
                    }}
                  >
                   
                    {t('second_expa_popu')}
                  </h2>
                  <p style={{ textAlign: isRTL ? "right" : "left" }}>
                    
                    {t('include_all_residents')}
                  </p>
                  <p style={{ textAlign: isRTL ? "right" : "left" }}>
                    
                    {t('note_that_the_residence')}
                  </p>
                </div>
              </div>
            </div>
            {/* <CustomRating
              name="custom-rating"
              defaultValue={3}
              precision={0.5}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
            /> */}
            {/* <span>
              <div class="giveUsUrFB">
                <div class="RC">
                  <img
                    src="/assets/images/FeedbackIcon.png"
                    
                    alt=""
                    className="feedback-icon-popu-clock"
                  />
                  <span id="ctl00_PlaceHolderMain_Label1" style={{marginRight:'10px'}}>
                     {t('give_us_feed_back')}
                  </span>
                </div>
              </div>
            </span> */}

            {/* <input
              type="hidden"
              name="ctl00$PlaceHolderMain$CustomComments$hdf_UserImage"
              id="hdf_UserImage"
            />
            <input
              type="hidden"
              name="ctl00$PlaceHolderMain$CustomComments$hdf_UserName"
              id="hdf_UserName"
            /> */}
            {/* <div class="CommentCTRL">
              <div>
                <div class="row">
                  <div class="form-group">
                    <div class="col-sm-12">
                      <textarea
                        name="ctl00$PlaceHolderMain$CustomComments$txtahComment"
                        rows="3"
                        cols="20"
                        id="txtahComment"
                        class="txtbox"
                        style={{
                          height: "75px",
                          width: "100%",
                          border: "1px solid #333333",
                          padding: "2px 5px",
                        }}
                        maxlength="400"
                      ></textarea>
                      <span style={{ color: "rgb(7, 87, 145)" }}>
                        
                        {t('your_comment_should_not_exceed_400_haracter')}
                      </span>
                      <span
                        id="rfvPostComment"
                        class="RequiredAstr"
                        style={{ visibility: "hidden" }}
                      >
                        {t('To post a note, please enter some text in the box above.')}
                      </span>
                    </div>
                  </div>
                </div>
                <a
                  id="btnPost"
                  href="#"
                  title="Post"
                  class="submitBtn Must_Login"
                  onclick="AddNewComment()"
                >
                {t('post')}
                </a>

                <img src="/Style Library/themes/ajax-loader.gif" alt="Working...." id="imgLoader" style={{ display: "block" }} />
              </div>

              <div id="divComments"></div>
            </div> */}
            {/* <div style={{display:"none"}} id="hidZone"><menu class="ms-hide">
                    <ie:menuitem id="MSOMenu_Help" iconsrc="/_layouts/15/images/HelpIcon.gif" onmenuclick="MSOWebPartPage_SetNewWindowLocation(MenuWebPart.getAttribute('helpLink'), MenuWebPart.getAttribute('helpMode'))" text="Help" type="option" style={{display:"none"}}>

                    </ie:menuitem>
                </menu></div> */}
          </span>
        </div>
      </div>
    </div>
    </>
  );
};

export default PopulationClock;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
