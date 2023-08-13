import { Table, message, Button, Space, Input } from "antd";
import MainLayout from "../components/MainLayout.js"
import cookies from "next-cookies";
import { useState } from "react";
import { useRouter } from "next/router.js";

export default function Skill({skills}) {
    const [messageApi, contextHolder] = message.useMessage();
    const [skillInput, setSkillInput] = useState('')
    const router = useRouter()

    const handleAdd = async () => {
        if(skillInput) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/skill/create`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({skillName: skillInput})
            });
            let result = await response.json();
            if(response.status === 200) {
                messageApi.success(result.message);
                router.push('/skill');
            } else {
                messageApi.error(result.message);
            }
        }
    }
    const hanldeDelete = async (id) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/skill/delete/${id}`, {
            method: 'DELETE',
            headers: { 
                'Content-Type': 'application/json'
            }
        });
        let result = await response.json();
        if(response.status === 200) {
            messageApi.success(result.message);
            router.push('/skill');
        } else {
            messageApi.error(result.message);
        }
    }

    const columns = [
        {
            title: "Skill",
            key: "skill",
            dataIndex: "skill",
            render: (_, { skill }) => (
                <div>{skill}</div>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (_, {key}) => (
                <Space size="middle">
                    <a onClick={()=> hanldeDelete(key)}>Delete</a>
                </Space>
            ),
        },
    ];
    const data = skills.map(i => {
        return {
            key: i._id,
            skill: i.skillName
        }
    })

    return <div id="skill">
        <h1>Skill</h1>
        {contextHolder}
        <div className="add-skill">
            <Input value={skillInput} onChange={(e)=>setSkillInput(e.target.value)} placeholder="Write new skill name" size="large4"w2 />
            <Button 
                type="primary" 
                size="large"
                onClick={() => handleAdd()}
            >
                Add this skill
            </Button>
        </div>
        <Table columns={columns} dataSource={data} />
    </div>
}

Skill.Layout = MainLayout;

export const getServerSideProps = async (ctx) => {
    let allCookies = cookies({req: ctx.req});
    if(!allCookies.jwt) {
        return {redirect: {
            permanent: false,
            destination: "/",
        }}
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/skill`, {
        method: 'GET'
    })
    const result = await response.json();
    
    return {
        props: {
            skills: result.skills
        }
    }
}