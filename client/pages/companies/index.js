import { Input, Pagination, Skeleton, Select, Image, Form, Tag,Space,Button } from 'antd';
import {FiFilter} from 'react-icons/fi';
const { Search } = Input;
import { useRouter } from 'next/router';
import { wrapper } from '../../redux/store.js';
import JobItem from '../../components/jobs/JobItem.js';
import { useEffect, useState } from 'react';
import { JOB_LEVEL, JOB_TYPE,PROVINCES,INDUSTRY,COUNTRY, COMPANY_SIZE } from "../../utils/enum.js";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
import {getRandomColor} from '../../utils/helper.js'

export default function Companies(props) {
    const [form] = Form.useForm();
    const router = useRouter();
    const pageSize = 8;
    const [companyList, setCompanyList] = useState(props.companyList);
    const [curPage, setCurPage] = useState(1);
    const [curCompanies, setCurCompanies] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleJumpPage = (pageNumber) => {
        setCurPage(pageNumber);
    }
    const handleSearch = async (text) => {
        if(text) {
            setLoading(true);
            const response = await fetch(`${API_URL}/company/search`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    searchText: text
                })
            });
            if(response.status == 200) {
                let result = await response.json();
                setLoading(false);
                setCompanyList(result.companies);
            } else {
                setLoading(false);
            }
        } else {
            setCompanyList(props.companyList);
        }
    }
    const onFinish = (values) => {
        setCompanyList(props.companyList);
        if(values.companySize) {
            setCompanyList(prev => prev.filter(item => item.companySize === values.companySize));
        }
        if(values.tech) {
            setCompanyList(prev => prev.filter(item => item.tech.filter(s => s.skillName == values.tech).length))
        }
    } 

    useEffect(() => {
        setCurCompanies(companyList.slice((curPage-1) * pageSize, curPage * pageSize));
    }, [curPage, companyList]);

    return <div id='jobs'>
        <div className='main-search' >
            <Search
                placeholder="Search by name, province, address, industry, country"
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
                        <Form.Item name='companySize' label='Company Size' >
                            <Select placeholder='Select company size' allowClear>
                                {
                                    Object.values(COMPANY_SIZE).map(i => {
                                        return <Option value={i}>{i}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item name='tech' label='Tech' >
                            <Select placeholder='Select tech' allowClear>
                                {
                                    props.skills.map(i => {
                                        return <Option value={i.skillName}>{i.skillName}</Option>
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
                            !companyList.length ? <h2>0 search result</h2> :
                            curCompanies.map(i => <a id='job-item' >
                                <div>
                                    <Image 
                                        width={133}
                                        height={133}
                                        style={{border:'1px solid #d4d4d4', borderRadius:'6px'}}
                                        src={i.image}
                                        fallback="https://static.vecteezy.com/system/resources/previews/004/141/669/original/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
                                    />
                                </div>
                                <div>
                                    <div onClick={() => router.push(`/companies/${i._id}`)}>
                                        <h3>{i.name}</h3>
                                    </div>
                                    <div className='job-sub-info'>{i.province}</div>
                                    <div>
                                        <div>
                                            Tech: &nbsp;
                                            {
                                                i.tech.slice(0,5).map(skill => {
                                                    let color = getRandomColor();
                                                    return <Tag color={color}>{skill.skillName}</Tag>
                                                })
                                            }
                                        </div>
                                        <div>
                                            Industry: &nbsp;
                                            {
                                                i.industry.slice(0,5).map(item => {
                                                    let color = getRandomColor();
                                                    return <Tag color={color}>{item}</Tag>
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </a>)
                        }
                        <br/>
                        <Pagination 
                            showQuickJumper
                            total={companyList.length}
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
    const responseCompany = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company`, {
        method: 'GET'
    })
    const resultCompany = await responseCompany.json();
    let companyList = resultCompany.company.filter(item => item.status == 'enabled')

    const responseSkill = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/skill`, {
        method: 'GET'
    })
    const resultSkill = await responseSkill.json();

    return {
        props: {
            companyList: companyList,
            skills: resultSkill.skills
        }
    }
})