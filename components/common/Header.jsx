import Image from 'next/image';
import { FaStar, FaHeart, FaBell, FaUser, FaCog, FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { IoLogoAndroid } from "react-icons/io";

// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const icons = [FaStar, FaHeart, FaBell, FaUser, FaCog, FaSearch];

const Header = ({ onOpenModal }) => {

   const { t } = useTranslation('common');


   const SearchTextEnterClick = (event) => {
      if (event.key === 'Enter') {
        console.log( 'Enter pressed');
         // your search logic here
      }
   };

   const { locale } = useRouter();

   const logoSrc = locale === 'ar'
      ? '/assets/images/logo-ar.png'
      : '/assets/images/logo.png';


   const homeUrl = locale === 'ar' ? '/ar' : '/';

   return (
      <div className="container custom-container text-center" >
         <div className="row header-row">
            <div className="col-sm-12 col-md-4 col-lg-2 text-left banner-image wow fadeInLeft" data-wow-delay="0.2s" data-wow-duration="0.6s">
               <a href={homeUrl}>
       <Image
          src={locale === 'ar'
          ? '/assets/images/logo-ar.png'
          : '/assets/images/logo.png'}
         alt="Logo"
         width={300}
          height={100}
          unoptimized
         priority
         className="logo-image object-contain"
      />
               </a>
            </div>
            <div className="col-sm-12 col-md-8 col-lg-6 align-self-center header-row-col header-row-col-middle">
               <div className="header-row-col-middle-sub" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  width: '100%'
               }}>
                  <div className="row " >
                     {/* <div className="col col-6 middle-col-small-device">
                        <div className="header-middle-buttons">
                           <div className="row wow fadeInLeft" data-wow-delay="0.2s" data-wow-duration="0.5s">
                              <div className="col-sm-4 header-middle-buttons-first-col text-center">
                                  {t('login')}
                              </div>
                              <div className="col-sm-8 header-middle-buttons-second-col" id="user-login">
                                  {t('login_here')}
                              </div>
                           </div>
                        </div>
                     </div> */}
                     <div className="col col-6 middle-col-small-device" style={{ width: '100%' }}>
                        <div className="header-middle-buttons me-1" id="contact-ceo" >
                           <div className="row wow fadeInLeft" onClick={onOpenModal} data-wow-delay="0.4s" data-wow-duration="0.5s" style={{ width: '100%',minWidth:"215px" }}>
                              <div className="col-sm-4 header-middle-buttons-first-col text-center">
                                 <span >{t('contact')}</span>
                              </div>
                              <div className="col-sm-8 header-middle-buttons-second-col cursor-pointer">
                                 {t('contact_ceo')}
                               </div>  
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="row margin-top-on-small-screen" >
                        <div className="col col-6 middle-col-small-device" style={{ width: '100%' }}>
                           <div className="header-middle-buttons me-1" >
                              <div className="row wow fadeInLeft" data-wow-delay="0.6s" data-wow-duration="0.5s" style={{ width: '100%',minWidth:"215px" }}>
                                 <div className="col-sm-4 header-middle-buttons-first-col text-center">
                                    {t('search')}
                                 </div>
                                 <div className="col-sm-8 px-2 header-middle-buttons-second-col">
                                    <input
                                       type="text"
                                       className="home-search txtS"
                                       id="Searchtxt"
                                       onKeyPress={SearchTextEnterClick}
                                       placeholder={t('keyword_search')}
                                    />
                                 </div>
                              </div>
                           </div>
                        </div>
                        {/* <div className="col col-6 middle-col-small-device">
                        <div className="header-middle-buttons">
                           <div className="row wow fadeInLeft" data-wow-delay="0.8s" data-wow-duration="0.5s">
                              <div className="col-sm-4 header-middle-buttons-first-col text-center">
                                  {t('subscribe')}
                              </div>
                              <div className="col-sm-8 header-middle-buttons-second-col">
                                 <input type="text" className="home-search txtS" id="subscribeNews" placeholder={t('the_newsletter')} autoComplete="off" name="subscribe"/>
                              </div>
                           </div>
                        </div>
                     </div> */}
                     </div>
                  </div>
               </div>
               <div className="col-sm-12 col-md-12 col-lg-4 align-self-center header-row-col header-row-col-social">
                  <div className="row header-icons-grid">
                     <div className="col col-2 text-center wow fadeInDown" data-wow-delay="0.7s" data-wow-duration="0.5s" id="sideMenu">
                        <i className="fas fa-wheelchair header-icons icon-accessibility bg-theme"></i>

                        <div id="VSidemenu">
                           <a href="#" className="IAplus" id="IAplus"></a>
                           {/* <input id="qty" value="0"/> */}
                           <a href="#" className="IAMin DActivatehref" id="IAMin"></a>
                           <div id="S4Home" style={{ display: 'block' }}>
                              <hr className="Line" />
                              <div className="SPTalkHome ISound">
                                 <div id="Div2" className="rs_skip rsbtn rs_preserve SPtalk ">
                                    <a className="rsbtn_play" accessKey="L" title="Listen to this page using ReadSpeaker" href="#">
                                       <span className="rsbtn_left rsimg rspart"><span className="rsbtn_text"><span>استمع</span></span></span>
                                       <span className="rsbtn_right rsimg rsplay rspart SPKView"></span>
                                    </a>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="col col-2 text-center wow fadeInDown" data-wow-delay="0.6s" data-wow-duration="0.5s">
                        <a href="https://apps.apple.com/eg/developer/national-center-for-statistics-and-information-oman/id721507459" target="_blank">
                           <i className="fab fa-apple header-icons icon-apple"></i>
                        </a>
                     </div>
                     <div className="col col-2 text-center wow fadeInDown" data-wow-delay="0.5s" data-wow-duration="0.5s">
                        <a href="https://play.google.com/store/search?q=%22National%20Center%20for%20Statistics%22%20Oman&c=apps&hl=en" target="_blank" className='flex justify-center'>
                           {/* <i className="fab fa-android fa-3x header-icons icon-android"></i> */}
                           <IoLogoAndroid className='head-android-icon' />
                        </a>
                     </div>
                     <div className="col col-2 text-center wow fadeInDown" data-wow-delay="0.4s" data-wow-duration="0.5s">
                        <a href="mailto:info@ncsi.gov.om">
                           <i className="fab fa-at header-icons icon-windows"></i>
                        </a>
                     </div>
                     <div className="col col-2 text-center wow fadeInDown" data-wow-delay="0.3s" data-wow-duration="0.5s">
                        <a href="#">
                           <i className="fas fa-rss header-icons icon-rss"></i>
                        </a>
                     </div>
                     <div className="col col-2 text-center wow fadeInDown" data-wow-delay="0.2s" data-wow-duration="0.5s">
                        <a href="tel:80076274">
                           <i className="fas fa-headphones-alt header-icons icon-headphone"></i>
                        </a>
                     </div>
                  </div>
                  <div className="row header-icons-grid margin-top-on-small-screen">
                     <div className="col col-2 text-center wow fadeInDown" data-wow-delay="1.3s" data-wow-duration="0.5s">
                        {/* <a href="#" onclick={toggleLanguage}>
                     <i className="icons-custom-AR header-icons icon-en-ar bg-orange"></i>
                  </a> */}
                        <LanguageSwitcher />
                     </div>
                     <div className="col col-2 text-center wow fadeInDown" data-wow-delay="1.2s" data-wow-duration="0.5s">
                        <a href="https://api.whatsapp.com/send?phone=96891459145&text=I%20Would%20like%20to%20get%20more%20informations" target="_blank">
                           <i className="fab fa-whatsapp header-icons icon-whatsapp"></i>
                        </a>
                     </div>
                     <div className="col col-2 text-center wow fadeInDown" data-wow-delay="1.1s" data-wow-duration="0.5s">
                        <a href="https://www.youtube.com/user/NCSIOman" target="_blank">
                           <i className="fab fa-youtube header-icons icon-youtube" style={{ padding: '7px 6px' }}></i>
                        </a>
                     </div>
                     <div className="col col-2 text-center wow fadeInDown" data-wow-delay="1.0s" data-wow-duration="0.5s">
                        <a href="https://twitter.com/NCSIOman" target="_blank">
                           <i className="fa-brands fa-x-twitter header-icons icon-twitter"></i>
                        </a>
                     </div>
                     <div className="col col-2 text-center wow fadeInDown" data-wow-delay="0.9s" data-wow-duration="0.5s">
                        <a href="https://www.instagram.com/NCSIOman/" target="_blank">
                           <i className="fab fa-instagram header-icons icon-instagram"></i>
                        </a>
                     </div>
                     <div className="col col-2 text-center wow fadeInDown" data-wow-delay="0.8s" data-wow-duration="0.5s">
                        <a href="https://www.facebook.com/OmanNCSI?ref=hl" target="_blank">
                           <i className="fab fa-facebook-f header-icons icon-facebook"></i>
                        </a>
                     </div>
                  </div>
               </div>
            </div>
            <div className="row header-row-marquee text-red text-16 text-bold" style={{ padding: '4px 10px' }}>
               <div className="col">
                  {/* <marquee>A scrolling text created with HTML Marquee element.</marquee> */}
               </div>
            </div>
         </div>
         );
};

         export default Header;

         export async function getStaticProps({locale}) {
   return {
            props: {
            ...(await serverSideTranslations(locale, ['common'])), // load your namespaces
      },
   };
}

