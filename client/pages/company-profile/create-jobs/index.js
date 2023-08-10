import CompanyProfileLayout from "../../../components/company-profile/CompanyProfileLayout.js";
import { Button, Popconfirm, Space, Table, Tag, message } from "antd";
import cookies from "next-cookies";
import { useRouter } from 'next/router';
import { getRandomColor } from "../../../utils/helper.js";
import { getCookiesClientSide } from "../../../utils/cookieHandler.js";

export default function CreateJobs({jobs}) {
    const router = useRouter();
    const token = getCookiesClientSide('jwt');
    const [messageApi, contextHolder] = message.useMessage();

    const handleDelete = async (id) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/job/delete/${id}`, {
            method: 'DELETE',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        let result = await response.json();
        if(response.status === 200) {
            messageApi.success(result.message);
            router.push('/company-profile/create-jobs');
        } else {
            messageApi.error(result.message);
        }
    }

    const columns = [
        {
            title: "Job title",
            dataIndex: "title",
            key: "title",
            render: (text, {key}) => <a onClick={()=> router.push(`/company-profile/create-jobs/${key}`)}>{text}</a>,
        },
        {
            title: "Tags",
            key: "tags",
            dataIndex: "tags",
            render: (_, { tags }) => (
                <>
                    {tags.map((tag) => {
                        return (
                            <Tag color={getRandomColor()} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (_, {key}) => (
                <Space size="middle">
                    <a onClick={()=> router.push(`/company-profile/create-jobs/${key}`)}>Edit</a>
                    <Popconfirm
                        title="Delete this job"
                        description="Are you sure to delete this job?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={()=> handleDelete(key)}
                    >
                        <a>Delete</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];
    const data = jobs.map(job => {
        return {
            key: job._id,
            title: job.title,
            tags: job.requiredSkill.map(r => r.skillName)
        }
    })

    return (
        <div id="create-jobs">
            {contextHolder}
            <div>
                <h2 style={{ marginTop: 0 }}>Create Jobs</h2>
                <Button 
                    type="primary" 
                    size="large"
                    onClick={() => router.push('/company-profile/create-jobs/add')}
                >
                    Create a job
                </Button>
            </div>
            <Table columns={columns} dataSource={data} />
        </div>
    );
}

CreateJobs.Layout = CompanyProfileLayout;

export const getServerSideProps = async (ctx) => {
    let allCookies = cookies({req: ctx.req});
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/job/get-by-company-id/${allCookies.companyId}`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${allCookies.jwt}`
        }
    });
    let jobs = [];
    if(response.status == 200) {
        let result = await response.json();
        jobs = result.jobs;
    }

    return {
        props: {
            jobs
        }
    }
}