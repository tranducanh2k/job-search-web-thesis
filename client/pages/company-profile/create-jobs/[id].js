import CompanyProfileLayout from "../../../components/company-profile/CompanyProfileLayout.js";
import { Button, Space, Form, Input, Select, message, InputNumber, Checkbox } from "antd";
import cookies from "next-cookies";
import { useRouter } from "next/router.js";
import {BsArrowLeft} from "react-icons/bs";
import { JOB_LEVEL, JOB_TYPE } from "../../../utils/enum.js";

export default function EditJobs({ skills }) {
    const {form} = Form.useForm();
    const router = useRouter();
    const id = router.query.id;
    const formItemLayout = {
        labelCol: {
            xs: {
                span: 24,
            },
            sm: {
                span: 6,
            },
        },
        wrapperCol: {
            xs: {
                span: 24,
            },
            sm: {
                span: 16,
            },
        },
    };
    const tailFormItemLayout = {
        wrapperCol: {
            sm: {
                span: 24,
                offset: 18,
            },
        },
    };

    const onFinish = async (values) => {
        
    }
    
    return (
        <div id="edit-jobs">
            <Space align="baseline" size='large'>
                <Button onClick={()=> router.push('/company-profile/create-jobs')}><BsArrowLeft/></Button>
                <h2 style={{ marginTop: 0 }}>{id === 'add'? "Add Job" : "Edit Job"}</h2>
            </Space>
            <Form
                {...formItemLayout}
                form={form}
                scrollToFirstError
                onFinish={onFinish}
            >
                <Form.Item name='title' label='Title' rules={[{required: true}]} >
                    <Input />
                </Form.Item>
                <Form.Item name='requiredExperience' help="months" label='Required Experience' rules={[{required: true}, {type: 'number'}]} >
                    <InputNumber min={0} />
                </Form.Item>
                <Form.Item name='jobLevel' label='Job Level' rules={[{required: true}]}>
                    <Select placeholder='Select job level' >
                        {
                            Object.values(JOB_LEVEL).map(i => {
                                return <Option value={i}>{i}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item name='minSalary' label='Min Salary' >
                    <InputNumber prefix='$' min={0} />
                </Form.Item>
                <Form.Item name='maxSalary' label='Max Salary' >
                    <InputNumber prefix='$' min={0} />
                </Form.Item>
                <Form.Item name='jobType' label='Job Type' rules={[{required: true}]}>
                    <Select placeholder='Select job type' >
                        {
                            Object.values(JOB_TYPE).map(i => {
                                return <Option value={i}>{i}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item label="Is Fulltime" name="fullTime" valuePropName="checked">
                    <Checkbox>Yes</Checkbox>
                </Form.Item>
                <Form.Item name='requiredSkill' label='Required Skill Tags'>
                    <Select 
                        placeholder='Select skills' 
                        allowClear
                        mode="multiple"
                    >
                        {
                            skills.length && skills.map(s => {
                                return <Option value={s._id}>{s.skillName}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item
                    name='description'
                    label='Description'
                >
                    <Form.Item
                        name='role'
                        label='Role'
                    >
                        <Input.TextArea autoSize={{minRows: 3, maxRows: 6}} placeholder="Describe role and responsibility" />
                    </Form.Item>
                    <Form.Item
                        name='skillRequired'
                        label='Skill Required'
                    >
                        <Input.TextArea autoSize={{minRows: 3, maxRows: 6}} placeholder="Describe skill required" />
                    </Form.Item>
                    <Form.Item
                        name='benefit'
                        label='Benefit'
                    >
                        <Input.TextArea autoSize={{minRows: 3, maxRows: 6}} placeholder="Describe employee's benefit" />
                    </Form.Item>
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType='submit'>Submit Form</Button>
                </Form.Item>
            </Form>
        </div>
    );
}

EditJobs.Layout = CompanyProfileLayout;

export const getServerSideProps = async (ctx) => {
    let allCookies = cookies({req: ctx.req});
    const responseSkill = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/skill`, {
        method: 'GET'
    })
    const resultSkill = await responseSkill.json();

    return {
        props: {
            skills: resultSkill.skills
        }
    }
}