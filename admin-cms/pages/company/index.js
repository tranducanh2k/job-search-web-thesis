import MainLayout from "../../components/MainLayout.js"
import cookies from "next-cookies";

export default function Company(props) {
    return <div id="company">
        <h1>Company</h1>
        
    </div>
}

Company.Layout = MainLayout;

export const getServerSideProps = async (ctx) => {
    let allCookies = cookies({req: ctx.req});
    if(!allCookies.jwt) {
        return {redirect: {
            permanent: false,
            destination: "/",
        }}
    }

    const responseCompany = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company`, {
        method: 'GET'
    })
    const resultCompany = await responseCompany.json();
    
    return {
        props: {
            companies: resultCompany.company
        }
    }
}