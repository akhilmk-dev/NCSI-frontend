// pages/survey.js
import Head from "next/head";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react'
import { useRouter } from "next/router";

const Survey = () => {
    const { t } = useTranslation("common");
      const { locale } = useRouter();

  const surReqUrl = locale === "ar" ? "/ar/survey-request" : "/survey-request";
    
    return (
        <>
        <Head>
            <title>{t('survey_request')}</title>
        </Head>
        <div class="_breadcrumb">
           <p class="_breadcrumb-header">{t('survey_request')}</p>
        </div>
        <div className='container-survey'>
            <div class="ms-webpart-zone ms-fullWidth">
                <div id="MSOZoneCell_WebPartctl00_ctl41_g_582b3796_6aa3_4d31_b5e3_f69be0e2388e" class="s4-wpcell-plain ms-webpartzone-cell ms-webpart-cell-vertical ms-fullWidth">
                    <div class="ms-webpart-chrome ms-webpart-chrome-vertical ms-webpart-chrome-fullWidth">
                        <div webpartid="582b3796-6aa3-4d31-b5e3-f69be0e2388e" haspers="false" id="WebPartctl00_ctl41_g_582b3796_6aa3_4d31_b5e3_f69be0e2388e" width="100%" class="ms-WPBody noindex" allowdelete="false" allowexport="false" ><div id="ctl00_ctl41_g_582b3796_6aa3_4d31_b5e3_f69be0e2388e">

                            {/* <script type="text/javascript">
                                function ShowEserviceLoginPopup() {
                                    // $('#myModalLogin').modal('show');
                                    $('#user-login').click();
    }
                            </script> */}
                            <input type="hidden" name="ctl00$ctl41$g_582b3796_6aa3_4d31_b5e3_f69be0e2388e$ctl00$hdnPrefix" id="ctl00_ctl41_g_582b3796_6aa3_4d31_b5e3_f69be0e2388e_ctl00_hdnPrefix" value="SurveyRequest_" />

                            <div id="View" style={{marginTop:"40px"}}>
                                <div class="col-xs-12 col-sm-12 col-md-12 ListPage">
                                    <h6>{t('overview')}</h6>
                                    <hr />
                                    <p> {t('under_the_statistics_and')}


                                        <a href="#">  {t('web_link_for_stat')}</a>

                                        ،
                                        <a href="#">  {t('executive_regulations')}</a>
                                    </p>
                                </div>
                                <div class="col-xs-12 col-sm-12 col-md-12 ListPage">
                                    <h6> {t('who_can_request_service')}</h6>
                                    <hr />
                                    <p> {t('all_gov_non_gov')}</p>
                                </div>
                                <div class="col-xs-12 col-sm-12 col-md-12 ListPage">
                                    <h6> {t('steps_to_req_service')}</h6>
                                    <hr />
                                    <p>{t('steps_to_req_description')}
                                    </p>
                                </div>
                                <div class="col-xs-12 col-sm-12 col-md-12 ListPage">
                                    <h6> {t('what_doc_needed')}</h6>
                                    <hr />
                                    <p>-</p>
                                </div>
                                <div class="col-xs-12 col-sm-12 col-md-12 ListPage">
                                    <h6>{t('how_long_does_take')}</h6>
                                    <hr />
                                    <p> {t('a_decision_on_the_application')}</p>
                                </div>

                                <div class="row">
                                    <div class="col-xs-12 col-sm-12 col-md-12 btnsWrapper">

                                        <a href={'/survey-request'} id="ctl00_ctl41_g_582b3796_6aa3_4d31_b5e3_f69be0e2388e_ctl00_lnk_EserviceLogin" class="submitBtn" >
                                            {t('request_for_approval_for_survey_poll')}</a>


                                    </div>
                                </div>
                            </div>
                            {/* none */}
                            <div id="Edit" class="regFrom" style={{ display: "none" }}>
                                <div class="row">
                                    <div class="col-xs-12 col-sm-12 col-md-6">
                                        <div class="form-group">
                                            <div class="col-sm-4  control-label">
                                                <span title="Overview" class="lbl">Overview</span>
                                                <span class="Astr">*</span>
                                            </div>
                                            <div class="col-sm-8">
                                                <textarea name="ctl00$ctl41$g_582b3796_6aa3_4d31_b5e3_f69be0e2388e$ctl00$txtServiceOverview" rows="2" cols="20" id="ctl00_ctl41_g_582b3796_6aa3_4d31_b5e3_f69be0e2388e_ctl00_txtServiceOverview" title="Overview" class="txtbox" style={{ height: "94px", width: "100%" }}></textarea>

                                                <span id="ctl00_ctl41_g_582b3796_6aa3_4d31_b5e3_f69be0e2388e_ctl00_rfvahSummeryArb" class="RequiredAstr" style={{ visibility: "hidden" }}>* Mandatory Field</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xs-12 col-sm-12 col-md-6">
                                        <div class="form-group">
                                            <div class="col-sm-4  control-label">
                                                <span title="Who Can Request The Service?" class="lbl">Who Can Request The Service?</span>
                                                <span class="Astr">*</span>
                                            </div>
                                            <div class="col-sm-8">
                                                <textarea name="ctl00$ctl41$g_582b3796_6aa3_4d31_b5e3_f69be0e2388e$ctl00$txtServiceRequestor" rows="2" cols="20" id="ctl00_ctl41_g_582b3796_6aa3_4d31_b5e3_f69be0e2388e_ctl00_txtServiceRequestor" title="Who Can Request The Service?" class="txtbox" style={{ height: "94px", width: "100%" }}></textarea>

                                                <span id="ctl00_ctl41_g_582b3796_6aa3_4d31_b5e3_f69be0e2388e_ctl00_RequiredFieldValidator1" class="RequiredAstr" style={{ visibility: "hidden" }}>* Mandatory Field</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-xs-12 col-sm-12 col-md-6">
                                        <div class="form-group">
                                            <div class="col-sm-4  control-label">
                                                <span title="What Are The Steps To Request The Service?" class="lbl">What Are The Steps To Request The Service?</span>
                                                <span class="Astr">*</span>
                                            </div>
                                            <div class="col-sm-8">
                                                <textarea name="ctl00$ctl41$g_582b3796_6aa3_4d31_b5e3_f69be0e2388e$ctl00$txtServiceRequestSteps" rows="2" cols="20" id="ctl00_ctl41_g_582b3796_6aa3_4d31_b5e3_f69be0e2388e_ctl00_txtServiceRequestSteps" title="What Are The Steps To Request The Service?" class="txtbox" style={{ height: "94px", width: "100%" }}></textarea>

                                                <span id="ctl00_ctl41_g_582b3796_6aa3_4d31_b5e3_f69be0e2388e_ctl00_RequiredFieldValidator3" class="RequiredAstr" style={{ visibility: "hidden" }}>* Mandatory Field</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xs-12 col-sm-12 col-md-6">
                                        <div class="form-group">
                                            <div class="col-sm-4  control-label">
                                                <span title="What Documents Are Needed?" class="lbl">What Documents Are Needed?</span>
                                                <span class="Astr">*</span>
                                            </div>
                                            <div class="col-sm-8">
                                                <textarea name="ctl00$ctl41$g_582b3796_6aa3_4d31_b5e3_f69be0e2388e$ctl00$txtServiceDocuments" rows="2" cols="20" id="ctl00_ctl41_g_582b3796_6aa3_4d31_b5e3_f69be0e2388e_ctl00_txtServiceDocuments" title="What Documents Are Needed?" class="txtbox" style={{ height: "94px", width: "100%" }}></textarea>

                                                <span id="ctl00_ctl41_g_582b3796_6aa3_4d31_b5e3_f69be0e2388e_ctl00_RequiredFieldValidator5" class="RequiredAstr" style={{ visibility: "hidden" }}>* Mandatory Field</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-xs-12 col-sm-12 col-md-6">
                                        <div class="form-group">
                                            <div class="col-sm-4  control-label">
                                                <span title="How Long Does It Take?" class="lbl">How Long Does It Take?</span>
                                                <span class="Astr">*</span>
                                            </div>
                                            <div class="col-sm-8">
                                                <textarea name="ctl00$ctl41$g_582b3796_6aa3_4d31_b5e3_f69be0e2388e$ctl00$txtServicePeriod" rows="2" cols="20" id="ctl00_ctl41_g_582b3796_6aa3_4d31_b5e3_f69be0e2388e_ctl00_txtServicePeriod" title="How Long Does It Take?" class="txtbox" style={{ height: "94px", width: "100%" }}></textarea>

                                                <span id="ctl00_ctl41_g_582b3796_6aa3_4d31_b5e3_f69be0e2388e_ctl00_RequiredFieldValidator7" class="RequiredAstr" style={{ visibility: "hidden" }}>* Mandatory Field</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-xs-12 col-sm-12 col-md-12 btnsWrapper">
                                        <a id="ctl00_ctl41_g_582b3796_6aa3_4d31_b5e3_f69be0e2388e_ctl00_btnSave" title="Save" class="submitBtn" href="javascript:WebForm_DoPostBackWithOptions(new WebForm_PostBackOptions(&quot;ctl00$ctl41$g_582b3796_6aa3_4d31_b5e3_f69be0e2388e$ctl00$btnSave&quot;, &quot;&quot;, true, &quot;vgService&quot;, &quot;&quot;, false, true))">Save</a>
                                        <a onclick="return Cancel();" id="ctl00_ctl41_g_582b3796_6aa3_4d31_b5e3_f69be0e2388e_ctl00_btnCancel" title="Cancel" class="cancelBtn" href="javascript:WebForm_DoPostBackWithOptions(new WebForm_PostBackOptions(&quot;ctl00$ctl41$g_582b3796_6aa3_4d31_b5e3_f69be0e2388e$ctl00$btnCancel&quot;, &quot;&quot;, true, &quot;&quot;, &quot;&quot;, false, true))">Cancel</a>
                                    </div>
                                </div>
                            </div>
                            {/* <script type="text/javascript">
                                    $(document).ready(function () {

                                    });


                                    if (typeof String.prototype.trim !== 'function') {
                                        String.prototype.trim = function () {
                                            return this.replace(/^\s+|\s+$/g, '');
                                        }
                                    }

                                    function ShowEditMode() {
        var divs = $("#View").find("div");
                                    if (divs.length == 17) {
                                        $('#ctl00_ctl41_g_582b3796_6aa3_4d31_b5e3_f69be0e2388e_ctl00_txtServiceOverview').val($(divs[2]).text().trim());
                                    $('#ctl00_ctl41_g_582b3796_6aa3_4d31_b5e3_f69be0e2388e_ctl00_txtServiceRequestor').val($(divs[5]).text().trim());
                                    $('#ctl00_ctl41_g_582b3796_6aa3_4d31_b5e3_f69be0e2388e_ctl00_txtServiceRequestSteps').val($(divs[8]).text().trim());
                                    $('#ctl00_ctl41_g_582b3796_6aa3_4d31_b5e3_f69be0e2388e_ctl00_txtServiceDocuments').val($(divs[11]).text().trim());
                                    $('#ctl00_ctl41_g_582b3796_6aa3_4d31_b5e3_f69be0e2388e_ctl00_txtServicePeriod').val($(divs[14]).text().trim());
        }
                                    $("#View").hide();
                                    $("#Edit").show();
                                    return false;
    }

                                    function Cancel() {
                                        $("#Edit").hide();
                                    Clear();
                                    $("#View").show();
                                    return false;
    }

                                    function Clear() {
                                        $('#ctl00_ctl41_g_582b3796_6aa3_4d31_b5e3_f69be0e2388e_ctl00_txtServiceOverview').val("");
                                    $('#ctl00_ctl41_g_582b3796_6aa3_4d31_b5e3_f69be0e2388e_ctl00_txtServiceRequestor').val("");
                                    $('#ctl00_ctl41_g_582b3796_6aa3_4d31_b5e3_f69be0e2388e_ctl00_txtServiceRequestSteps').val("");
                                    $('#ctl00_ctl41_g_582b3796_6aa3_4d31_b5e3_f69be0e2388e_ctl00_txtServiceDocuments').val("");
                                    $('#ctl00_ctl41_g_582b3796_6aa3_4d31_b5e3_f69be0e2388e_ctl00_txtServicePeriod').val("");
    }
                                </script> */}

                        </div><div class="ms-clear"></div></div>
                    </div>
                </div>
            </div>
        </div>
        </>
       
    )
}
export default Survey;
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}


