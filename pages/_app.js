import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { appWithTranslation } from 'next-i18next';
import Image from 'next/image';
import Script from 'next/script';
import Layout from '@/components/common/Layout';

import '@/styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import '../public/assets/fonts/fontawesome/css/fontawesome.css';
import '../public/assets/fonts/droidKufi/DroidKufiRegular.css';
import '../styles/base.css';
import '../styles/animate.css';
import '../styles/constants.css';
import '../styles/ncsi.css';
import '../styles/responsive.css';
import '../public/assets/fonts/language-button/style.css';

// import '../public/assets/fonts/droidKufi/DroidKufiRegular.css';
import '../public/assets/fonts/english-and-arabic-fonts/stylesheet.css';
import '../public/assets/fonts/home-icons/style.css';
import '../public/assets/css/style.css';
// import '../public/assets/mobirise/css/mbr-additional.css';
import '../public/assets/css/constants.css';
import '../public/assets/css/responsive.css';
import '../public/assets/fonts/gill-sans/style.css';
import '../public/assets/fonts/salamandre/stylesheet.css';
import '../public/assets/fonts/tungsten/stylesheet.css';
import '../public/assets/fonts/language-button/style.css';
import '../public/assets/fonts/tcf/stylesheet.css';
import '../styles/home.css'
import "../styles/events.css";
import '../styles/publications.css';

////////////

import '../styles/contactus.css'
import Head from 'next/head';
import Cookies from 'js-cookie';
// import '../public/assets/scripts/odometer/themes/odometer-theme-car.css';
// import '../public/assets/css/animate.css';

function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    if (router.locale === 'ar') {
      document.documentElement.dir = 'rtl';
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
    } else {
      document.documentElement.dir = 'ltr';
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
    }
  }, [router.locale]);

  useEffect(() => {
    if(!Cookies.get('lng')){
      Cookies.set('lng','ar')
      window.location.reload()
    }
    if (typeof window !== 'undefined' && window.WOW) {
      new window.WOW().init();
    }
  }, []);

  const noLayout = Component.noLayout || false;

  if (noLayout) {
    return <Component {...pageProps} />;
  }

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "NCSI",
              "alternateName": "NCSI",
              "url": "http://13.233.166.184:3002/",
              "logo": "http://13.233.166.184:3002/_next/image?url=%2Fassets%2Fimages%2Flogo.png&w=640&q=75",
              "sameAs": [
                "https://www.facebook.com/OmanNCSI?ref=hl",
                "https://www.instagram.com/NCSIOman/",
                "https://twitter.com/NCSIOman"
              ]
            })
          }}
        />
      </Head>
      <Layout>
        {/* <Script src="/assets/scripts/wow.min.js" strategy="afterInteractive" /> */}
        <Component {...pageProps} />
        {/* <div id="MrAccessInHand" title="Assist using site">
        <Image
          src="/assets/images/accessability.png"
          width={50}
          height={50}
          alt="Assist using site"
        />
      </div> */}
      </Layout>
    </>
  );
}

export default appWithTranslation(App);
