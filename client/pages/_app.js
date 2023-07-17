import Footer from '../components/Footer.js';
import Navbar from '../components/Navbar.js';
import '../styles/globals.css';
import '../styles/layout.css';
import { wrapper } from '../redux/store.js';
import { PersistGate } from 'redux-persist/integration/react';
import { useStore } from 'react-redux';

function MyApp({ Component, pageProps }) {
    const store = useStore();

    return (
        <PersistGate persistor={store.__persistor} loading={<div>Loading...</div>}>
            <>
                <Navbar />
                <Component {...pageProps} />
                {/* <Footer /> */}
            </>
        </PersistGate>
    )
}

export default wrapper.withRedux(MyApp);
