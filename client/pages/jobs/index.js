import { Input, Space } from 'antd';
const { Search } = Input;
import { useRouter } from 'next/router';
import { wrapper } from '../../redux/store.js';
import JobItem from '../../components/jobs/JobItem.js';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Jobs(props) {
    const router = useRouter();

    return <div id='jobs'>
        <div className='main-search'>
            <Search
                placeholder="input search text"
                allowClear
                enterButton="Search"
                size="large"
                onSearch={Search}
            />
        </div>
        <div>
            <div className='search-result'>
                <div className='advanced-search'>
                    advanced search
                </div>
                <div className='jobs-result'>
                    {
                        props.jobsList.map(job => <JobItem jobData={job} />)
                    }
                </div>
            </div>
        </div>
    </div>
}

export const getServerSideProps =  wrapper.getServerSideProps(store => async (ctx) => {
    let {page} = ctx.query;
    if(!page) {
        page = 1;
    }

    const response = await fetch(`${API_URL}/job/get-jobs-by-page?page=${page}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });
    let result = await response.json();

    return {
        props: {
            jobsList: result.jobsList
        }
    }
})