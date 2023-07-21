import { Input, Space } from 'antd';
const { Search } = Input;

export default function Companies() {
    return <div id='companies'>
        <Search
            placeholder="input search text"
            allowClear
            enterButton="Search"
            size="large"
            onSearch={Search}
        />
    </div>
}