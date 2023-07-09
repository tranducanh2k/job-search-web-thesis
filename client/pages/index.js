import {Input} from 'antd';

const {Search} = Input;

export default function Home() {
    return (
        <div>
            <Search
                placeholder="input search text"
                allowClear
                enterButton="Search"
                size="large"
                onSearch={() => {}}
            />
        </div>
    )
}
