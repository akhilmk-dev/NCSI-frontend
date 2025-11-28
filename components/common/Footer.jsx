import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from "react";
import SurveyModal from '@/pages/survey/surveyModal';

export default function Footer() {
    const { t } = useTranslation('common');
    const { locale } = useRouter();

    const contactUsUrl = locale === 'ar' ? '/ar/contact-us' : '/contact-us';
    const surveyUrl = locale === 'ar' ? '/ar/survey' : '/survey';

    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <>
        <div class="footer-and-copyright  py-md-0">
            <div class="footer-main">
                <div class="row home-footer color-white">
                    <div class="col-6 col-sm-4 col-md-3  wow fadeInLeft" data-wow-delay="0.5s" data-wow-duration="0.5s">
                        <div class="footer-main">
                            <span><a href="/hierarchy">{t('who_are_we')}</a></span><br />
                            <span><a href="/newsPage    ">{t('news')}</a></span><br />
                            <span><a href="/Gov. Service-Guide.pdf" target='_blank'>{t('service_directory')}</a></span><br />
                           
                        </div>
                    </div>
                    <div class="col-6 col-sm-4 col-md-3  wow fadeInLeft" data-wow-delay="0.6s" data-wow-duration="0.5s">
                        <div class="footer-main">
                           <span> <a href="/Licenses">{t("licences")}</a></span><br />
                            <span><a href="/E-survey">{t('e_survey')}</a></span><br />
                           <span><a href="/guidesAndClassifications">{t('Guides_and_Classifications')}</a></span><br />
                                                                            
                        </div>
                    </div>
                    <div class="col-6 col-sm-4 col-md-3  wow fadeInLeft" data-wow-delay="0.7s" data-wow-duration="0.5s">
                        <div class="footer-main">                           
                            <span><a href="/Disclaimer">{t('privacy_policy')}</a></span><br />
                            <span><a href="/TermsAndConditions">{t('terms_of_use')}</a></span><br />
                              <span><a href="/importantLinks">{t('important_links')}</a></span><br />
                           
                        </div>
                    </div>

                    <div class="col-6 col-sm-4 col-md-3  wow fadeInLeft" data-wow-delay="0.9s" data-wow-duration="0.5s">
                        <div class="footer-main">
                            
                            <span><a href="https://tajawob.om/p/" target='_blank'>{t('tajawob')}</a></span><br />
                             <span><a href={contactUsUrl}>{t('contact_us')}</a></span><br />
                        </div>
                    </div>
                </div>
            </div>
            <div class="row home-copyright text-center">
                <div class="col text-bold">
                    {t('footer_copyright')}
                </div>
            </div>
        </div>
        <SurveyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </>
  );
}
