// pages/hierarchy.js

import Head from "next/head";
import { useTranslation } from 'next-i18next';

import React from 'react'
import { useRouter } from "next/router";
import styles from "./hierarchy.module.css";
import HoverCard from "@/components/cards/hoverCard";
import OrganizationChart from "./Organization-img";
import Image from "next/image";
import PersonCard from "./PersonCard";
import HoverTextCard from "./hoverTextCard";
import AwardsCarousel from "./AwardsCarousel";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";



const hierarchy = () => {
  const { t } = useTranslation("common");
  const { locale } = useRouter();



  return (

    <>
      <Head>
        <title>{t('hierarchy')}</title>
      </Head>
      <section className="events-section px-0 md:px-12 lg:px-20">
        <div class="_breadcrumb">
          <p class="_breadcrumb-header">{t('Who Are We')}</p>
        </div>
        <div className={`${styles['home-body-hierarchy']}`}>
          <div className="max-w-[85rem] mx-auto bg-white shadow-md leading-relaxed py-9 px-3 md:px-16 content-width">

            {/* CEO Message */}
            <section className="text-[#333]">
              <h2 className="text-[16px] font-semibold text-[#003366] mb-2">
                CEO Message
              </h2>

              <p className="text-justify text-[14px]">
                Based on the highly appreciated instructions of His Majesty, Sultan of
                the Country, may Allah protect him, directed to all governmental
                institutions to make haste in boosting their performance & facilitating
                their services by using digital technology in the course of elevating and
                promoting the Sultanate up to the modern, renewed horizons of knowledge.
                Since the start of the third millennium, we have been living in a world of
                modern societies that are increasingly & greatly depending on the
                technology of information & communication, which are globally connected in
                forming wide horizons of mutual benefit. This, in its turn, increases our
                urgent need to improve our capabilities to accommodate, store & analyze an
                extensive, ample number of information in the course of reaching
                knowledge, which is the crown & summit of thought....
              </p>

              <div className="text-right mt-4">
                <a
                  href="#"
                  className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
                >
                  Read more...
                </a>
              </div>
              <div className="bg-[#00a895] flex items-center justify-center mt-6 h-[40px]">
                <h2 className="text-white text-lg md:text-xl font-semibold">
                  Decrees, Laws and Decisions
                </h2>
              </div>
            </section>

            {/* === Decrees, Laws and Decisions Section === */}
            <section className="bg-white py-14 md:py-16">

              {/* Decrees content */}
              <div className={`${styles['decrees-container']} grid grid-cols-1 md:grid-cols-2 gap-x-14`}>
                <div>
                  <p>
                    Royal Decree 104/2020 Amending Some Provisions of the Royal Decrees
                    Establishing the National Centre for Statistics and Information and
                    Promulgating its System
                  </p>
                  <p>Royal Decree Promulgating the Statistics and Information Law</p>
                  <p>Royal Decree on Conducting the Electronic Census 2020</p>
                  <p>Royal Decree Amending Some Provisions of Royal Decree Establishing the Centre</p>
                  <p>The executive regulation of the Statistics and Information Law.</p>
                  <p>
                    Data quality assurance framework for the National Centre for Statistics and
                    Information
                  </p>
                </div>

                <div>
                  <p>
                    Royal Decree Amending the Provisions of the Electronic Census Procedure
                  </p>
                  <p>
                    Administrative and financial system for the electronic census project 2020
                  </p>
                  <p>Royal Decree Promulgating the System of the Centre</p>
                  <p className="font-semibold">
                    ISSUING THE NATIONAL DATA STRATEGY
                  </p>
                  <p>General framework for information availability</p>
                  <p>Royal Decree establishing NCSI</p>
                </div>
              </div>

              {/* Roadmap bar */}
              <div className="bg-[#00a895] flex items-center justify-center mt-6 h-[40px]">
                <h2 className="text-white text-[20px] font-semibold tracking-wide">
                  Roadmap
                </h2>
              </div>

              {/* Hover cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8">
                <HoverCard
                  title="Our Vision"
                  color="#FF851B"
                  description="Enhancing Knowledge"
                />
                <HoverCard
                  title="Our Mission"
                  color="#FF851B"
                  description="To satisfy the governments need of official statistics and reliable information to be used in setting policies and programs on local, regional and international levels; ..."
                  linkText="Show More"
                  fullText={`To satisfy the government's need of official statistics and reliable information to be used in setting policies and programs on local, regional and international levels; taking into consideration the accelerating economic and social variables. We also seek to satisfy the needs of all authorities in acquiring data in all areas of development.`}
                />
                <HoverCard
                  title="the strategic goals of the ncsi"
                  color="#FF851B"
                  description="Partnership-The NCSI is committed to building strong partnerships across all ranges and sectors, both inside and outside Oman..."
                  linkText="Show More"
                  fullText={`The NCSI is committed to building strong partnerships across all ranges and sectors, both inside and outside Oman. The values and aspirations of the NSCI extends to consider all data producers and data users as real partners, and they have all the rights to participate with the centre in figure industry and take advantage of it to serve all aspects of growth and development.`}
                />
                <HoverCard
                  title="Our Values"
                  color="#FF851B"
                  description="Partnership-The NCSI is committed to building strong partnerships across all ranges and sectors, both inside and outside Oman..."
                  linkText="Show More"
                  fullText={`OUR VALUES
Partnership
The NCSI is committed to building strong partnerships across all ranges and sectors, both inside and outside Oman.The values and aspirations of the NSCI extends to consider all data producers and data users as real partners, and they have all the rights to participate with the centre in figure industry and take advantage of it to serve all aspects of growth and development.
Professionalism
The NCSI remains committed to a high degree of professionalism, exceeding standards both regionally and internationally.This is achieved through continuous communication with all international parties based on the scientific researches and methods.
Transparency
Due to the importance of statistics in the decision-making process,the NCSI puts an emphasis on accuracy across the application of international systemsfor the managing the overall quality of statistical operations. Transparency is vital from initial data collection right through to publication in informative forms .It is necessary to apply the highest degree of transparency in all phases of the figure industry operations in the Sultanate as the figures are not sufficient by themselves,they have to be supported by the knowledge or statistical information about them.
Knowledge Manage​​​ment
The NCSI believes in the importance of an integrated management process for knowledge, which is based on transferring and maximizing knowledge and experience-from generation to generation, and between different departments. This will benefit the final output of the statistical process, and at the same time support decision-making. Investing in people is our main priority.
Dissemination
The dissemination of comprehensive information, a high degree of transparency, impartiality and objectivity are the most important determinants of the NCSI’s values ​.This makes the NCSI a center for thought and knowledge in Oman.`}
                />
              </div>


              <div className="bg-[#00a895] flex items-center justify-center mt-6 h-[40px]">
                <h2 className="text-white text-[20px] font-semibold tracking-wide">
                  Organization Chart
                </h2>
              </div>
              <section className="bg-[#f4f4f4] py-10">
                {/* Chief Executive (centered top card) */}
                <div className="flex justify-center mb-12">
                  <div className="relative group w-[240px] md:w-[300px] h-[450px]   overflow-hidden shadow-md">
                    <Image
                      src="/assets/images/gallery/hierarchy-img-1.png"
                      alt="Chief Executive"
                      width={300}
                      height={400}
                      className="w-full h-auto object-cover"
                    />
                    <div className="absolute bottom-0 left-0 w-full h-[110px] bg-[#6d6e71] text-white text-center py-3 font-semibold text-[15px]  group-hover:bg-[#133c8b]">
                      <span className="block group-hover:hidden">Chief Executive</span>
                      <span className="hidden group-hover:block">
                        H.E. Dr. Khalifa bin Abdullah bin Hamad Al Barwani
                      </span>
                    </div>
                  </div>
                </div>

                {/* Directors grid */}
                <div
                  className="max-w-[85rem] mx-auto px-12 md:px-4 flex flex-wrap justify-start gap-x-14 gap-y-10"
                >
                  <PersonCard
                    image="/assets/images/gallery/hierarchy-img-2.jpg"
                    title="Director General of the General Directorate of Support Services"
                    hoverTitle="Mr. Mohammed bin Said Al Rashdi"
                  />
                  <PersonCard
                    image="/assets/images/gallery/hierarchy-img-3.jpg"
                    title="Director General of the General Directorate of Information"
                    hoverTitle="Ms. Aisha bint Hamad Al Busaidiya"
                  />
                  <PersonCard
                    image="/assets/images/gallery/hierarchy-img-4.png"
                    title="Director General of the General Directorate of National Statistics"
                    hoverTitle="Mr. Ahmed bin Ali Al Hinai"
                  />
                </div>
                <div
                  className="max-w-[85rem] mx-auto px-12 md:px-4 flex flex-wrap justify-start gap-x-14 gap-y-10 py-5"
                >
                  <HoverTextCard
                    title="Director of Electronic Applications and Systems Department"
                    hoverTitle="Saud Humaid Al-Ruqaisi"
                  />
                  <HoverTextCard
                    title="Director of Electronic Applications and Systems Department"
                    hoverTitle="Saud Humaid Al-Ruqaisi"
                  />
                  <HoverTextCard
                    title="Director of Electronic Applications and Systems Department"
                    hoverTitle="Saud Humaid Al-Ruqaisi"
                  />


                </div>
                <div
                  className="max-w-[85rem] mx-auto px-12 md:px-4 flex flex-wrap justify-start gap-x-14 gap-y-10 py-5"
                >
                  <HoverTextCard
                    title="Director of Electronic Applications and Systems Department"
                    hoverTitle="Saud Humaid Al-Ruqaisi"
                  />
                  <HoverTextCard
                    title="Director of Electronic Applications and Systems Department"
                    hoverTitle="Saud Humaid Al-Ruqaisi"
                  />
                  <HoverTextCard
                    title="Director of Electronic Applications and Systems Department"
                    hoverTitle="Saud Humaid Al-Ruqaisi"
                  />


                </div>
                <div
                  className="max-w-[85rem] mx-auto px-12 md:px-4 flex flex-wrap justify-start gap-x-14 gap-y-10 py-5"
                >
                  <HoverTextCard
                    title="Director of Electronic Applications and Systems Department"
                    hoverTitle="Saud Humaid Al-Ruqaisi"
                  />
                  <HoverTextCard
                    title="Director of Electronic Applications and Systems Department"
                    hoverTitle="Saud Humaid Al-Ruqaisi"
                  />
                  <HoverTextCard
                    title="Director of Electronic Applications and Systems Department"
                    hoverTitle="Saud Humaid Al-Ruqaisi"
                  />


                </div>


              </section>

              <div className="bg-[#00a895] flex items-center justify-center mt-6 h-[40px]">
                <h2 className="text-white text-[20px] font-semibold tracking-wide">
                  Achievements
                </h2>
              </div>
              <AwardsCarousel />

            </section>
          </div>
        </div>
      </section>
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

export default hierarchy;



