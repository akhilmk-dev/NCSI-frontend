import React, { useMemo } from 'react';
// import './MenuList.css'; 
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';



const MenuList = ({ portalLinks, hideHeader }) => {

  const { locale } = useRouter();

  const menuItems = useMemo(() => {
    if (portalLinks && portalLinks.length > 0) {
      return portalLinks.map(link => ({
        label: link.title,
        href: link.link,
        isExternal: link.link.startsWith('http')
      }));
    }
    return [];
  }, [portalLinks]);

  const { t } = useTranslation('common');
  return (
    <div className={`row home-menu text-bold ${hideHeader ? 'mt-0' : ''}`}>
      <div className="col">
        {!hideHeader && (
          <div className="population-clock-header bg-theme color-white text-bold">
            <div className="" style={{ display: 'flex' }}>
              <div className=" text-center wow fadeInLeft" data-wow-delay="0.2s" data-wow-duration="0.5s" style={{ display: "flex", justifyContent: "end", gap: "3px" }}>
                <i className="customeIconHome-menu section-head-icon vertical-middle main-menu-icon"></i>

                {locale !== "ar" && <div className=" wow fadeInLeft"
                  data-wow-delay="0.3s" data-wow-duration="0.5s">
                  <span className="section-head vertical-middle">{t('main_menu')}</span>
                </div>}
                {locale == "ar" && <div className=" wow fadeInLeft"
                  data-wow-delay="0.3s" data-wow-duration="0.5s">
                  <span className="section-head vertical-middle">{t('main_menu')}</span>
                </div>}
              </div>
            </div>
          </div>
        )}

        <div className="row mt-3">
          {menuItems?.map((item, index) => {
            const delay = 0.35 + index * 0.05;
            const isExternal = item.isExternal ?? item.href.startsWith('http');

            return (
              <div className="w-100" key={index}>
                <div className="row menu-item mx-0">
                  <div
                    className="col-2 text-center text-20 align-self-center wow fadeInLeft rotate-icon"
                    data-wow-delay={`${delay.toFixed(2)}s`}
                    data-wow-duration="0.5s"
                  >
                    <i className="customeIconHome-arrow-circle color-theme "></i>
                  </div>
                  <div
                    className="col align-self-center wow fadeInLeft"
                    data-wow-delay={`${(delay + 0.05).toFixed(2)}s`}
                    data-wow-duration="0.5s"
                  >
                    <a
                      key={index}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      href={item.href}
                    >
                      {item.labelKey ? t(item.labelKey) : item.label}
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MenuList;
