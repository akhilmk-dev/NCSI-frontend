import { useState } from 'react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

import ContactCeoModal from './ContatctCeoModal';
// import '../../public/assets/fonts/fontawesome/css/fontawesome.css';
// import 'bootstrap/dist/css/bootstrap.min.css';


export default function Layout({ children }) {

  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
 
  return (
    <>
      {/* <Head>
        <link
          href="https://fonts.googleapis.com/css?family=Antic+Slab&display=swap"
          rel="stylesheet"
        />
      </Head> */}
      <Header onOpenModal={openModal} />
      <main>{children}</main>
      <ContactCeoModal isOpen={showModal} onClose={() => setShowModal(false)} />
      <Footer />
    </>
  );
}
