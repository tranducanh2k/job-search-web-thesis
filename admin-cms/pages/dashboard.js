import MainLayout from "../components/MainLayout.js"
import cookies from "next-cookies";
import {AiFillMessage} from 'react-icons/ai'
import {BsFillBuildingFill} from 'react-icons/bs'
import {FaUserAlt} from 'react-icons/fa'

export default function Dashboard(props) {
    return <div id="dashboard">
        <h1>Dashboard</h1>
        <div>
            <div>
                <header><BsFillBuildingFill/>Number of Company</header>
                <span>{props.companies.length}</span>
            </div>
            <div>
                <header><FaUserAlt/>Number of Employee</header>
                <span>{props.employees.length}</span>
            </div>
            <div>
                <header><AiFillMessage/>Number of Interview</header>
                <span>{props.interview.length}</span>
            </div>
        </div>
    </div>
}

Dashboard.Layout = MainLayout;

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

    const responseEmployee = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employee`, {
        method: 'GET'
    })
    const resultEmployee = await responseEmployee.json();
    const responseInterview = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: 'GET'
    })
    const resultInterview = await responseInterview.json();
    
    return {
        props: {
            companies: resultCompany.company,
            employees: resultEmployee.employeeList,
            interview: resultInterview.interview
        }
    }
}