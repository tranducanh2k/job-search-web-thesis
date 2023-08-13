import { Input, Pagination, Skeleton, Button, Space, Form, Select, InputNumber, Checkbox } from 'antd';
import {FiFilter} from 'react-icons/fi';
const { Search } = Input;
import { useRouter } from 'next/router';
import { wrapper } from '../../redux/store.js';
import { useEffect, useState } from 'react';
import { JOB_LEVEL, JOB_TYPE,PROVINCES,INDUSTRY,COUNTRY } from "../../utils/enum.js";
import EmployeeItem from '../../components/employee/EmployeeItem.js';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Employee(props) {
    const [form] = Form.useForm();
    const router = useRouter();
    const pageSize = 9;
    const [employeeList, setEmployeeList] = useState(props.employeeList);
    const [curPage, setCurPage] = useState(1);
    const [curEmployees, setCurEmployees] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleJumpPage = (pageNumber) => {
        setCurPage(pageNumber);
    }
    const handleSearch = async (text) => {
        if(text) {
            setLoading(true);
            const response = await fetch(`${API_URL}/job/search`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    searchText: text
                })
            });
            if(response.status == 200) {
                let result = await response.json();
                setLoading(false);
                setJobsList(result.jobs);
            } else {
                setLoading(false);
            }
        } else {
            setJobsList(props.jobsList);
        }
    }
    const onFinish = (values) => {
        setJobsList(props.jobsList);
        if(values.salary) {
            switch(values.salary) {
                case 'Negotiable':
                    setJobsList(prev => prev.filter(item => !item.minSalary && !item.maxSalary));
                    break;
                case 'Under 500$':
                    setJobsList(prev => prev.filter(item => item.minSalary <= 500 || item.maxSalary <= 500));
                    break;
                case '500$ - 1000$':
                    setJobsList(prev => prev.filter(item => (item.minSalary >= 500 && item.minSalary <= 1000) || (item.maxSalary >= 500 && item.maxSalary <= 1000)));
                    break;
                case '1000$ - 3000$':
                    setJobsList(prev => prev.filter(item => (item.minSalary >= 1000 && item.minSalary <= 3000) || (item.maxSalary >= 1000 && item.maxSalary <= 3000)));
                    break;
                case '3000$ - 5000$':
                    setJobsList(prev => prev.filter(item => (item.minSalary >= 3000 && item.minSalary <= 5000) || (item.maxSalary >= 3000 && item.maxSalary <= 5000)));
                    break;
                case 'Over 5000$':
                    setJobsList(prev => prev.filter(item => item.minSalary >= 5000 || item.minSalary >= 5000));
                    break;
                default:
                    break;
            }
        }
        if(values.experience) {
            switch(values.experience) {
                case 'Under 6 months':
                    setJobsList(prev => prev.filter(item => item.requiredExperience <= 6));
                    break;
                case '6 - 12 months':
                    setJobsList(prev => prev.filter(item => item.requiredExperience >= 6 && item.requiredExperience <= 12));
                    break;
                case '1 - 3 years':
                    setJobsList(prev => prev.filter(item => item.requiredExperience >= 12 && item.requiredExperience <= 36));
                    break;
                case '3 - 6 years':
                    setJobsList(prev => prev.filter(item => item.requiredExperience >= 36 && item.requiredExperience <= 72));
                    break;
                case 'Over 6 years':
                    setJobsList(prev => prev.filter(item => item.requiredExperience >= 72));
                    break;
                default:
                    break;
            }
        }
        if(values.jobLevel) {
            setJobsList(prev => prev.filter(item => item.jobLevel === values.jobLevel));
        }
        if(values.jobType) {
            setJobsList(prev => prev.filter(item => item.jobType === values.jobType));
        }
        if(values.fullTime?.length == 1) {
            if(values.fullTime[0] == true) {
                setJobsList(prev => prev.filter(item => item.fullTime));
            } else {
                setJobsList(prev => prev.filter(item => item.fullTime == undefined || item.fullTime == false));
            }
        }
        if(values.province) {
            setJobsList(prev => prev.filter(item => item.companyId.province == values.province));
        }
        if(values.country) {
            setJobsList(prev => prev.filter(item => item.companyId.country == values.country));
        }
        if(values.industry) {
            setJobsList(prev => prev.filter(item => item.companyId.industry.includes(values.industry)));
        }
    } 

    useEffect(() => {
        setCurEmployees(employeeList.slice((curPage-1) * pageSize, curPage * pageSize));
    }, [curPage, employeeList]);

    return <div id='jobs' className='employee'>
        <div className='main-search'>
            <Search
                placeholder="Search by job, company, tech stack, ..."
                allowClear
                enterButton="Search"
                size="large"
                loading={loading}
                onKeyDown={e => {
                    e.key === "Enter" && handleSearch(e.target.value);
                }}
                onSearch={handleSearch}
            />
        </div>
        <div>
            <div className='search-result'>
                <div className='advanced-search'>
                    <h3 style={{marginTop:0, color:'#555557'}}>Advanced Filter</h3>
                    <Form
                        form={form}
                        onFinish={onFinish}
                        layout="vertical"
                    >
                        <Form.Item name='jobLevel' label='Job Level'>
                            <Select placeholder='Select job level' allowClear>
                                {
                                    Object.values(JOB_LEVEL).map(i => {
                                        return <Option value={i}>{i}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item name='jobType' label='Job Type' >
                            <Select placeholder='Select job type' allowClear>
                                {
                                    Object.values(JOB_TYPE).map(i => {
                                        return <Option value={i}>{i}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="Full-time or Part-time" name="fullTime">
                            <Checkbox.Group>
                                <Checkbox value={true}>Full-time</Checkbox>
                                <Checkbox value={false}>Part-time</Checkbox>
                            </Checkbox.Group>
                            {/* <Checkbox value={false}>Part-time</Checkbox> */}
                        </Form.Item>
                        <Form.Item name='province' label='Province' >
                            <Select placeholder='Select province' allowClear>
                                {
                                    Object.values(PROVINCES).map(i => {
                                        return <Option value={i}>{i}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item name='country' label='Country' >
                            <Select placeholder='Select country' allowClear>
                                {
                                    Object.values(COUNTRY).map(i => {
                                        return <Option value={i}>{i}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item name='industry' label='Industry' >
                            <Select placeholder='Select industry' allowClear>
                                {
                                    Object.values(INDUSTRY).map(i => {
                                        return <Option value={i}>{i}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Space size='large'>
                                <Button type="primary" htmlType='submit' icon={<FiFilter/>}>Filter</Button>
                                <Button onClick={()=> form.resetFields()}>Clear Filter</Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </div>
                {
                    loading? <div style={{width: '100%'}}> 
                        <Skeleton active />
                        <Skeleton active />
                        <Skeleton active />
                        <Skeleton active />
                    </div>
                    :
                    <div className='employee-result'>
                        {
                            !employeeList.length ? <h2>0 search result</h2> :
                            employeeList.map(job => <EmployeeItem employeeData={job} />)
                        }
                        <Pagination 
                            showQuickJumper
                            total={employeeList.length}
                            pageSize={pageSize}
                            current={curPage}
                            onChange={handleJumpPage}
                        />
                    </div>
                }
            </div>
        </div>
    </div>
}

export const getServerSideProps =  wrapper.getServerSideProps(store => async (ctx) => {
    const response = await fetch(`${API_URL}/employee`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });
    let result = await response.json();

    return {
        props: {
            employeeList: result.employeeList
        }
    }
})