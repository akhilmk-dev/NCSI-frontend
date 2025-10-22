"use client";
import { useTranslation } from "next-i18next";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const EventAccordion = ({ eventData = [] }) => {
  const { t } = useTranslation("common");
  const { locale } = useRouter();

  const eventsUrl = locale === "ar" ? "/ar/events" : "/events";

  const router = useRouter();
  const isRTL = router.locale === "ar";

  return (
    <div className="accordion flex lg:flex-row w-full max-w-7xl mx-auto gap-0 p-0">
      {/* Left Column (Events) */}
      <div className="events-accord flex flex-col gap-[4px] flex-[3]">
        {eventData?.items?.map((event, index) => {
          const eventDate = new Date(event.from_date);
          const day = eventDate.getDate();
          const month = eventDate.toLocaleString("default", { month: "long" }); // "June", etc.

          return (
            <Link href={`/event-details/${event.id}`}>
              <div className="title h-[68px] flex justify-center cursor-pointer hover:bg-gray-100">
                <div className="w-full flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <div className="accinnerDateInner text-center"style={{minWidth:"70px"}}>
                      <h5 className="text-2xl font-bold ">
                        {String(day).padStart(2, "0")}
                      </h5>
                      <span className="sub-text text-sm ">{t(month)}</span>
                    </div>
                    <div>
                      <div className="event-acc-text text-md font-semibold text-gray-900">
                        {isRTL ? event.title_ar : event.title_en}
                      </div>
                      <span className="event-acc-text text-gray-500 text-center">
                        {t(month)} {eventDate.getFullYear()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <i className="customeIconHome-arrow-left color-theme text-[28px]"></i>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Right Column */}
      <div className="bookletWrapWrap">
        <Link href={eventsUrl}>
          <div className="bookletWrap">
            <span className="text-[18px] font-semibold block">
              {t("events")}
            </span>
            <h4 className="text-[18px] font-bold m-0">{t("and")}</h4>
            <span className="text-[18px] font-semibold block">
              {t("occasions")}
            </span>
            <img
              src="assets/images/spiral.png"
              alt="spiral binding"
              className="spiralbind"
            />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default EventAccordion;
