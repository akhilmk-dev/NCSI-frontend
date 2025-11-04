// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>

         {/* ✅ Favicon */}
         <link rel="icon" href="/assets/images/favicon.ico" />
        {/* Local Styles */}
        {/* <link rel="stylesheet" href="/assets/fonts/fontawesome/css/fontawesome.css" /> */}
        {/* <link rel="stylesheet" href="/assets/fonts/droidKufi/DroidKufiRegular.css" />
        <link rel="stylesheet" href="/assets/fonts/english-and-arabic-fonts/stylesheet.css" />
        <link rel="stylesheet" href="/assets/fonts/home-icons/style.css" />
        <link rel="stylesheet" href="/assets/css/style.css" /> */}

        {/* <link rel="stylesheet" href="/assets/slider/assets/mobirise/css/mbr-additional.css" /> */}
        <link rel="stylesheet" href="/assets/mobirise/css/mbr-additional.css" />

        {/* <link rel="stylesheet" href="/assets/css/swiper.css" /> */}
        {/* <link rel="stylesheet" href="/assets/css/constants.css" />
        <link rel="stylesheet" href="/assets/css/responsive.css" />
        <link rel="stylesheet" href="/assets/fonts/gill-sans/style.css" />
        <link rel="stylesheet" href="/assets/fonts/salamandre/stylesheet.css" />
        <link rel="stylesheet" href="/assets/fonts/tungsten/stylesheet.css" />
        <link rel="stylesheet" href="/assets/fonts/language-button/style.css" />
        <link rel="stylesheet" href="/assets/fonts/tcf/stylesheet.css" /> */}
        <link rel="stylesheet" href="/assets/scripts/odometer/themes/odometer-theme-car.css" />
        {/* <link rel="stylesheet" href="/assets/jssocials/jssocials.css" /> */}
        {/* <link rel="stylesheet" href="/assets/jssocials/jssocials-theme-flat.css" /> */}
        {/* <link rel="stylesheet" href="/assets/mobirise/css/mbr-additional.css" /> */}
        {/* <link rel="stylesheet" href="/assets/web/assets/mobirise-icons/mobirise-icons.css" /> */}
        <link rel="stylesheet" href="/assets/css/animate.css" />
        {/* <link rel="shortcut icon" href="/assets/images/57.png" type="image/png" /> */}

        {/* Local External Styles */}
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/fontawesome.min.css" />
        <link rel="stylesheet" href="/assets/fonts/google-fonts/special-elite.css" />
        <link rel="stylesheet" href="/assets/fonts/google-fonts/antic-slab.css" />

        {/* Local jQuery */}
        <script src="/assets/scripts/jquery.min.js"></script>

      </Head>
      <body>
        <Main />
        <NextScript />
        {/* Scripts should be loaded using `next/script` or inside _app.js if needed per page */}
        {/* <script src="/assets/scripts/script.js"></script> */}

        {/* Local Scripts */}
        <script src="/assets/scripts/bootstrap.bundle.min.js"></script>
        <script src="/assets/scripts/popper.min.js"></script>
        <script src="/assets/scripts/bootstrap.min.js"></script>
        <script src="/assets/scripts/highcharts.js"></script>
        {/* <script type="text/javascript" src="assets/scripts/script.js"></script> */}
        {/* <script src="assets/tether/tether.min.js"></script> */}
        <script src="/assets/scripts/odometer/odometer.js"></script>
        <script src="/assets/scripts/wow.min.js"></script>
        {/* <script src="assets/bootstrapcarouselswipe/bootstrap-carousel-swipe.js"></script> */}
        <script src="/assets/slider/assets/bootstrapcarouselswipe/bootstrap-carousel-swipe.js"></script>
        {/* <script type="text/javascript" src="assets/scripts/jquery-ui.js"></script> */}
        {/* <script type="text/javascript" src="assets/scripts/jquery.dateselect.js"></script> */}
        {/* <script type="text/javascript" src="assets/scripts/jquery.mousewheel.min.js"></script> */}
        {/* <script type="text/javascript" src="assets/scripts/jquery.prettynumber.js"></script> */}
        {/* <script type="text/javascript" src="assets/scripts/moment.js"></script> */}
        <script src="/assets/scripts/swiper.js"></script>
        {/* <script src="https://cdn.ckeditor.com/4.25.1/standard/ckeditor.js"></script> */}

        {/* <script src="assets/touchswipe/jquery.touch-swipe.min.js"></script> */}
        {/* <script src="http://code.highcharts.com/highcharts.js"></script> */}

        {/* <script src="assets/jssocials/jssocials.js"></script> */}
        {/* <script src="assets/theme/js/script.js" type="text/javascript"></script> */}
        <script src="/assets/scripts/particles.min.js"></script>
          

          {/* === Mind Rockets Accessibility Scripts === */}
         <script src="https://cdn.mindrocketsapis.com/client/Latest/jquery-3.7.1.js"></script>
        <script src="https://cdn.mindrocketsapis.com/client/Latest/toolkit.js"></script>
        <script src="https://cdn.mindrocketsapis.com/client/Latest/mrmegapack.bundle.js"></script>
        <script src="https://cdn.mindrocketsapis.com/client/MRUAP/ncsi/integrator-uap.js"></script>
      </body>
    </Html>
  );
}
