"use client";
import React, { useEffect, useState } from "react";
import OdoMeter from "../common/OdoMeter";
import DonutChart from "../common/DonutChart";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const PopulationClock = ({ populationData }) => {
  const { t } = useTranslation("common");
  const [noData, setNoData] = useState(false);
  const { locale } = useRouter();

  const populationUrl = locale === "ar" ? "/ar/populationClock" : "/populationClock";

  const populationList = (populationData || []).sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  // const populationList = populationData || [];
  
  // console.log(populationList, "pop list----------")
  
  const getValidPopulation = (date) => {
    const formatted = date.toISOString().split("T")[0]; // 'YYYY-MM-DD'
    return populationList.find((p) => p.date.startsWith(formatted));
  };

const [selectedDate, setSelectedDate] = useState(() => {
  const latest = populationList?.[0]; // First item is latest after descending sort
  return latest ? new Date(latest.date) : new Date();
});

  const [filteredPopulation, setFilteredPopulation] = useState(() =>
    getValidPopulation(selectedDate)
  );

  useEffect(() => {
    const found = getValidPopulation(selectedDate);
    if (found) {
      setFilteredPopulation(found);
      setNoData(false);
    } else {
      console.log("No data found for", selectedDate.toISOString());
      // setFilteredPopulation(null);
      setNoData(true);
    }
  }, [selectedDate]);

  // useEffect(() => {
  //   console.log(filteredPopulation, "----🟢filtered population")
  //   const found = getValidPopulation(selectedDate);
  //   if (found) {
  //     setFilteredPopulation(found);
  //   } else {
  //     console.log("No data found for", selectedDate.toISOString());
  //   }
  // }, [selectedDate]);

  // if (!filteredPopulation) {
  //   return <div>{t("no_population_data")}</div>;
  // }

  const omanis = Number(filteredPopulation?.omanis);
  const expatriates = Number(filteredPopulation?.expatriates);
  const total = omanis + expatriates;

  const data = [
    {
      name: t("omanis"),
      y: Number(((omanis / total) * 100).toFixed(1)),
      color: "#0F3173",
      count: omanis.toLocaleString("en-US"),
    },
    {
      name: t("expatriates"),
      y: Number(((expatriates / total) * 100).toFixed(1)),
      color: "#f67f21",
      count: expatriates.toLocaleString("en-US"),
    },
  ];

  const weekdayName = selectedDate.toLocaleDateString("en-GB", {
    weekday: "short",
  });
  const dayNumber = selectedDate.getDate();
  const monthName = selectedDate.toLocaleDateString("en-GB", {
    month: "short",
  });
  const monthNumber = selectedDate.getMonth() + 1;
  const year = selectedDate.getFullYear();

  const changeDate = (unit, amount) => {
    // console.log('change date')
    const newDate = new Date(selectedDate);
    if (unit === "day") {
      newDate.setDate(newDate.getDate() + amount);
    } else if (unit === "month") {
      newDate.setMonth(newDate.getMonth() + amount);
    } else if (unit === "year") {
      newDate.setFullYear(newDate.getFullYear() + amount);
    }
    setSelectedDate(newDate);
  };

  return (
    <div className="row population-clock-main-row">
      <div className="col">
        <div className="population-clock-header bg-theme color-white text-bold">
          <div className="row align-items-center ">
            <div className="col-2 " >
              <i className="customeIconHome-clock section-head-icon"></i>
            </div>
            <div className="col-10 px-0" style={{marginLeft:"-17px",marginRight:"-18px"}}>
              <a
                href={populationUrl}
                className="clock-head text-decoration-none "
              >
                <span id="hdPopulationClock" className="section-head">
                  {t("population_clock")}
                </span>
              </a>
            </div>
          </div>
        </div>
        <div
          className="population-clock-content bg-white"
          style={{ height: "568px", padding: "15px 0px" }}
        >
          <OdoMeter value={total.toLocaleString()} />

          <div className="row text-center padding-15">
            <div id="hdTotalPopulation" className="col text-25 text-bold" style={{zIndex:'2'}}>
              {t("total_population")}
            </div>
          </div>

          <DonutChart data={data} />

          <div className={`deemed ${noData ? "visible" : ""}`}>
           {t('no_data_found')}
          </div>

          <div className="PopulationBL" id="PopulationBL">
            <span className="Dpop">
              {selectedDate.toLocaleDateString("en-GB")}
            </span>
            <span className="DpopT">
              <div className="date-select" style={{ width: "100%" }}>
                <div className="popup flex justify-around">
                  {/* Day */}
                  <div className="flex-1 flex flex-col gap-1 day border-none">
                    <a
                      href=""
                      onClick={(e) => {
                        e.preventDefault();
                        changeDate("day", 1);
                      }}
                      className="btn-arrow btn-up"
                    >
                      <i className="fas fa-caret-up"></i>
                    </a>
                    <div>
                      <span className="text">{t(weekdayName)}</span>
                      <span className="num">{dayNumber}</span>
                    </div>
                    <a
                      href=""
                      onClick={(e) => {
                        e.preventDefault();
                        changeDate("day", -1);
                      }}
                      className="btn-arrow btn-down"
                    >
                      <i className="fas fa-caret-down"></i>
                    </a>
                  </div>

                  {/* Month */}
                  <div className="flex-1 flex flex-col gap-1 month">
                    <a
                      href=""
                      onClick={(e) => {
                        e.preventDefault();
                        changeDate("month", 1);
                      }}
                      className="btn-arrow btn-up"
                    >
                      <i className="fas fa-caret-up"></i>
                    </a>
                    <div>
                      <span className="text">{t(monthName)}</span>&nbsp;
                      <span className="num">{monthNumber}</span>
                    </div>
                    <a
                      href=""
                      onClick={(e) => {
                        e.preventDefault();
                        changeDate("month", -1);
                      }}
                      className="btn-arrow btn-down"
                    >
                      <i className="fas fa-caret-down"></i>
                    </a>
                  </div>

                  {/* Year */}
                  <div className="flex-1 flex flex-col gap-1 year">
                    <a
                      href=""
                      onClick={(e) => {
                        e.preventDefault();
                        changeDate("year", 1);
                      }}
                      className="btn-arrow btn-up"
                    >
                      <i className="fas fa-caret-up"></i>
                    </a>
                    <span className="num">{year}</span>
                    <a
                      href=""
                      onClick={(e) => {
                        e.preventDefault();
                        changeDate("year", -1);
                      }}
                      className="btn-arrow btn-down"
                    >
                      <i className="fas fa-caret-down"></i>
                    </a>
                  </div>
                </div>
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopulationClock;
