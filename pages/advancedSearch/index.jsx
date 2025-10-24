import Head from "next/head";
import SearchFilterForm from "./SearchFilterForm";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const { useTranslation } = require("next-i18next")


const AdvancedSearch=()=>{
    const {t}=useTranslation("common")

    return (
        <>
              <Head>
        <title>{t("advanced_search")}</title>
      </Head>

        <div className="_breadcrumb">
          <p className="_breadcrumb-header">{t("Advanced Search")}</p>
        </div>
        <SearchFilterForm/>

        </>
    )
}
export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
export default AdvancedSearch;