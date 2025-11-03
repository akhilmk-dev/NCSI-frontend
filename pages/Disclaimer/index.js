import Head from "next/head";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const PrivacyPolicy = () => {
  const { t } = useTranslation("common");
  const { locale } = useRouter();

  // choose font dynamically based on locale
  const fontStyle =
    locale?.startsWith("ar")
      ? { fontFamily: '"Janna LT", "DroidKufiRegular", sans-serif' }
      : { fontFamily: "Cambria, serif" };

  // adjust line height only for Arabic
  const lineHeightStyle = locale?.startsWith("ar")
    ? { lineHeight: "1.4" } // tighter spacing for Arabic
    : { lineHeight: "1.85" }; // default spacing

  return (
    <>
      <Head>
        <title>{t("privacy_policy")}</title>
      </Head>

      <section className="events-section px-0 md:px-12 lg:px-20">
        {/* === Breadcrumb Header === */}
        <div className="_breadcrumb">
          <p className="_breadcrumb-header">{t("privacy_policy")}</p>
        </div>

        {/* === Privacy Policy Section === */}
        <div className="bg-[#ffff] py-28 px-6 sm:px-6 md:px-10 lg:px-[4rem]">
          <div className="w-full">
            {/* Red Heading */}
<h2
  className={`text-[#b30000] text-[15px] md:text-[15.5px] mb-1 ${
    locale?.startsWith("ar") ? "" : "px-5"
  }`}
>
  {t("privacy_policy")}
</h2>


            {/* Bullet Points */}
<ul
  className={`list-none text-[#3A372A] text-[16px] md:text-[16.5px] space-y-3 ${
    locale?.startsWith("ar") ? "py-12" : "mt-2"
  }`}
  style={{ ...fontStyle, ...lineHeightStyle }}
>
  {/* === List 1 === */}
  <li className="text-muted text-[14px] flex items-start">
    {!locale?.startsWith("ar") && (
      <span
        className="inline-block w-[18px] mr-2 text-center"
        style={{ fontFamily: '"Wingdings", "Arial Unicode MS", sans-serif' }}
      >
        ✓
      </span>
    )}
    <span className="flex-1">
      {locale?.startsWith("ar") ? (
        t("privacy_policy_list1_ar")
      ) : (
        <>
          {t("privacy_policy_list1_li")}
          <p className="inline underline text-sm">
            {t("privacy_policy_list1_p")}
          </p>
        </>
      )}
    </span>
  </li>

  {/* === List 2 === */}
  <li className="text-muted text-[14px] flex items-start">
    {!locale?.startsWith("ar") && (
      <span
        className="inline-block w-[18px] mr-2 text-center"
        style={{ fontFamily: '"Wingdings", "Arial Unicode MS", sans-serif' }}
      >
        ✓
      </span>
    )}
    <span className="flex-1">{t("privacy_policy_list2")}</span>
  </li>

  {/* === List 3 === */}
  <li className="text-muted text-[14px] flex items-start">
    {!locale?.startsWith("ar") && (
      <span
        className="inline-block w-[18px] mr-2 text-center"
        style={{ fontFamily: '"Wingdings", "Arial Unicode MS", sans-serif' }}
      >
        ✓
      </span>
    )}
    <span className="flex-1">{t("privacy_policy_list3")}</span>
  </li>

  {/* === List 4 === */}
  <li className="text-muted text-[14px] flex items-start">
    {!locale?.startsWith("ar") && (
      <span
        className="inline-block w-[18px] mr-2 text-center"
        style={{ fontFamily: '"Wingdings", "Arial Unicode MS", sans-serif' }}
      >
        ✓
      </span>
    )}
    <span className="flex-1">{t("privacy_policy_list4")}</span>
  </li>

  {/* === List 5 === */}
  <li className="text-muted text-[14px] flex items-start">
    {!locale?.startsWith("ar") && (
      <span
        className="inline-block w-[18px] mr-2 text-center"
        style={{ fontFamily: '"Wingdings", "Arial Unicode MS", sans-serif' }}
      >
        ✓
      </span>
    )}
    <span className="flex-1">{t("privacy_policy_list5")}</span>
  </li>

  {/* === List 6 === */}
  <li className="text-muted text-[14px] flex items-start">
    {!locale?.startsWith("ar") && (
      <span
        className="inline-block w-[18px] mr-2 text-center"
        style={{ fontFamily: '"Wingdings", "Arial Unicode MS", sans-serif' }}
      >
        ✓
      </span>
    )}
    <span className="flex-1">{t("privacy_policy_list6")}</span>
  </li>

  {/* === List 7 === */}
  <li className="text-muted text-[14px] flex items-start">
    {!locale?.startsWith("ar") && (
      <span
        className="inline-block w-[18px] mr-2 text-center"
        style={{ fontFamily: '"Wingdings", "Arial Unicode MS", sans-serif' }}
      >
        ✓
      </span>
    )}
    <span className="flex-1">
      {locale?.startsWith("ar") ? (
        t("privacy_policy_list7_ar")
      ) : (
        <>
          {t("privacy_policy_list7_li")}{" "}
          <p
            className="inline underline text-sm"
            style={{ fontFamily: '"Gill Sans MT", Arial, sans-serif' }}
          >
            {t("privacy_policy_list7_name")}
          </p>{" "}
          {t("privacy_policy_list7_end")}
        </>
      )}
    </span>
  </li>

  {/* === List 8 === */}
  <li className="text-muted text-[14px] flex items-start">
    {!locale?.startsWith("ar") && (
      <span
        className="inline-block w-[18px] mr-2 text-center"
        style={{ fontFamily: '"Wingdings", "Arial Unicode MS", sans-serif' }}
      >
        ✓
      </span>
    )}
    <span className="flex-1">{t("privacy_policy_list8")}</span>
  </li>

  {/* === List 9 === */}
  <li className="text-muted text-[14px] flex items-start">
    {!locale?.startsWith("ar") && (
      <span
        className="inline-block w-[18px] mr-2 text-center"
        style={{ fontFamily: '"Wingdings", "Arial Unicode MS", sans-serif' }}
      >
        ✓
      </span>
    )}
    <span className="flex-1">
      {locale?.startsWith("ar") ? (
        t("privacy_policy_list9_ar")
      ) : (
        <>
          <p className="inline underline text-sm">
            {t("privacy_policy_list9_p")}
          </p>{" "}
          {t("privacy_policy_list9_li")}
        </>
      )}
    </span>
  </li>
</ul>



          </div>
        </div>  
      </section>
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

export default PrivacyPolicy;
