import Head from "next/head";
import Link from "next/link";

const { useTranslation } = require("next-i18next")

const Esurvey=()=>{
    const {t}=useTranslation("common");


    return (
        <>
        <Head>
            <title>
                {t("e_survey")}
            </title>
        </Head>
          
                <section className="events-section px-0 md:px-12 lg:px-20 bg-[#f4f4f4]">
                  {/* Breadcrumb */}
                  <div className="_breadcrumb">
                    <p className="_breadcrumb-header">{t("e_survey")}</p>
                  </div>

                   <div className="bg-white py-12 flex flex-col gap-3 items-start px-6 md:px-20">
          <Link
            href="#"
            className="text-[#149DCC] hover:underline text-[14px]"
                        style={{
              fontFamily: '"Gill Sans MT", Arial, sans-serif',
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            - Producer Price Index Survey
          </Link>

          <Link
            href="#"
            className="text-[#149DCC] hover:underline text-[14px]"
                        style={{
              fontFamily: '"Gill Sans MT", Arial, sans-serif',
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            - Foreign Investment Survey
          </Link>
        </div>
          
                </section>

        </>
    )
}

export default Esurvey;