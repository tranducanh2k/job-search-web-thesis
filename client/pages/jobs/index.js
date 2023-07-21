import { Input, Space } from 'antd';
const { Search } = Input;
import { useRouter } from 'next/router';


export default function Jobs() {
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
                    <button onClick={() => router.push({pathname:'/jobs', query: {page: 1}})}>1</button>
                    <button onClick={() => router.push({pathname:'/jobs', query: {page: 2}})}>2</button>
                </div>
            </div>
        </div>
    </div>
}

export const getServerSideProps = async (ctx) => {
    const {page} = ctx.query;
    console.log(page)

    return {
        props: {
            
        }
    }
}