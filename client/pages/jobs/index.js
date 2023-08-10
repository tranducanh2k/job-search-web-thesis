import { Input, Pagination, Skeleton, Button, Space, Form, Select, InputNumber, Checkbox } from 'antd';
import {FiFilter} from 'react-icons/fi';
const { Search } = Input;
import { useRouter } from 'next/router';
import { wrapper } from '../../redux/store.js';
import JobItem from '../../components/jobs/JobItem.js';
import { useEffect, useState } from 'react';
import { JOB_LEVEL, JOB_TYPE,PROVINCES,INDUSTRY,COUNTRY } from "../../utils/enum.js";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Jobs(props) {
    const [form] = Form.useForm();
    const router = useRouter();
    const pageSize = 8;
    const [jobsList, setJobsList] = useState(props.jobsList);
    const [curPage, setCurPage] = useState(1);
    const [curJobs, setCurJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const experienceFilter = ['Under 6 months', '6 - 12 months', '1 - 3 years', '3 - 6 years', 'Over 6 years'];
    const salaryFilter = ['Negotiable','Under 500$', '500$ - 1000$', '1000$ - 3000$', '3000$ - 5000$', 'Over 5000$'];

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
        setCurJobs(jobsList.slice((curPage-1) * pageSize, curPage * pageSize));
    }, [curPage, jobsList]);

    return <div id='jobs'>
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
                        <Form.Item name='salary' label='Salary'>
                            <Select placeholder='Select salary' allowClear>
                                {
                                    salaryFilter.map(i => {
                                        return <Option value={i}>{i}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item name='experience' label='Experience'>
                            <Select placeholder='Select experience' allowClear>
                                {
                                    experienceFilter.map(i => {
                                        return <Option value={i}>{i}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
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
                    <div className='jobs-result'>
                        {
                            !jobsList.length ? <h2>0 search result</h2> :
                            curJobs.map(job => <JobItem jobData={job} />)
                        }
                        <br/>
                        <Pagination 
                            showQuickJumper
                            total={jobsList.length}
                            pageSize={pageSize}
                            current={curPage}
                            onChange={handleJumpPage}
                        />
                        <br/><br/>
                    </div>
                }
            </div>
        </div>
    </div>
}

export const getServerSideProps =  wrapper.getServerSideProps(store => async (ctx) => {
    const response = await fetch(`${API_URL}/job/get-all`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });
    let result = await response.json();

    return {
        props: {
            jobsList: result.jobs
        }
    }
})