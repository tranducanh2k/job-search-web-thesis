import Footer from '../components/Footer.js'
import Navbar from '../components/Navbar.js'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Navbar />
            <Component {...pageProps} />
            <Footer />
        </>
    )
}

export default MyApp
