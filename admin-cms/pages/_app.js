import '../styles/globals.css';
import '../styles/login.css';
import '../styles/layout.css'
import '../styles/dashboard.css'
import '../styles/skill.css'
import { wrapper } from '../redux/store.js';
import { PersistGate } from 'redux-persist/integration/react';
import { useStore } from 'react-redux';

function MyApp({ Component, pageProps }) {
    const store = useStore();

    return (
        <PersistGate persistor={store.__persistor} loading={<div>Loading...</div>}>
            {
                Component.Layout? 
                <>
                    <Component.Layout>
                        <Component {...pageProps} />
                    </Component.Layout> 
                    {/* <Footer /> */}
                </>
                :
                <>
                    <Component {...pageProps} />
                    {/* <Footer /> */}
                </>
            }
        </PersistGate>
    )
}

export default wrapper.withRedux(MyApp);
