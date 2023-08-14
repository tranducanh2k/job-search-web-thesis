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
            const response = await fetch(`${API_URL}/employee/search`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    searchText: text
                })
            });
            if(response.status == 200) {
                let result = await response.json();
                setLoading(false);
                setEmployeeList(result.employees);
            } else {
                setLoading(false);
            }
        } else {
            setEmployeeList(props.employeeList);
        }
    }
    const onFinish = (values) => {
        setEmployeeList(props.employeeList);
        if(values.minAge) {
            setEmployeeList(prev => prev.filter(item => item.age >= values.minAge))
        }
        if(values.maxAge) {
            setEmployeeList(prev => prev.filter(item => item.age <= values.maxAge))
        }
        if(values.gender?.length == 1) {
            if(values.gender[0] == 'male') {
                setEmployeeList(prev => prev.filter(item => item.gender == 'male'));
            } else {
                setEmployeeList(prev => prev.filter(item => item.gender == 'female'));
            }
        }
        if(values.skill) {
            setEmployeeList(prev => prev.filter(item => item.skill.filter(s => s.skillName == values.skill).length))
        }
    } 

    useEffect(() => {
        setCurEmployees(employeeList.slice((curPage-1) * pageSize, curPage * pageSize));
    }, [curPage, employeeList]);

    return <div id='jobs' className='employee'>
        <div className='main-search'>
            <Search
                placeholder="Search by name, gender, address, province, school, company, certificate"
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
                        <Form.Item name='minAge' label='Min Age'>
                            <InputNumber min={0} />
                        </Form.Item>
                        <Form.Item name='maxAge' label='Max Age'>
                            <InputNumber min={0} />
                        </Form.Item>
                        <Form.Item name='skill' label='Skill' >
                            <Select placeholder='Select skill' allowClear>
                                {
                                    props.skills.map(i => {
                                        return <Option value={i.skillName}>{i.skillName}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="Gender" name="gender">
                            <Checkbox.Group>
                                <Checkbox value={'male'}>Male</Checkbox>
                                <Checkbox value={'female'}>Female</Checkbox>
                            </Checkbox.Group>
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

    const responseSkill = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/skill`, {
        method: 'GET'
    })
    const resultSkill = await responseSkill.json();

    return {
        props: {
            employeeList: result.employeeList,
            skills: resultSkill.skills
        }
    }
})