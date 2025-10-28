import Head from "next/head";
import SearchFilterForm from "./SearchFilterForm";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
const { useTranslation } = require("next-i18next");

const AdvancedSearch = () => {
  const { t } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{t("Advanced_search")}</title>
      </Head>

      <div className="_breadcrumb">
        <p className="_breadcrumb-header">{t("Advanced_search")}</p>
      </div>

      {/* ✅ Compact height and vertically centered layout */}
      <div className="flex justify-center items-center min-h-[55vh] lg:min-h-[50vh] bg-[#fff]">
        <div className="w-full max-w-[1100px] px-6 sm:px-8 md:px-10">
          <SearchFilterForm />
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default AdvancedSearch;
