import CompanyProfileLayout from "../../components/company-profile/CompanyProfileLayout.js";
import { Space, Table, Tag } from "antd";

export default function CreateJobs() {
    const columns = [
        {
            title: "Job title",
            dataIndex: "title",
            key: "title",
            render: (text) => <a>{text}</a>,
        },
        {
            title: "Age",
            dataIndex: "age",
            key: "age",
        },
        {
            title: "Tags",
            key: "tags",
            dataIndex: "tags",
            render: (_, { tags }) => (
                <>
                    {tags.map((tag) => {
                        let color = tag.length > 5 ? "geekblue" : "purple";
                        if (tag === "loser") {
                            color = "volcano";
                        }
                        return (
                            <Tag color={color} key={tag}>
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
            render: (_, record) => (
                <Space size="middle">
                    <a>Invite {record.name}</a>
                    <a>Delete</a>
                </Space>
            ),
        },
    ];
    const data = [
        {
            key: "1",
            name: "John Brown",
            age: 32,
            address: "New York No. 1 Lake Park",
            tags: [
                "nice",
                "developer",
                "ejfl",
                "efkje",
                "feij",
                "developer",
                "ejfl",
                "efkje",
                "feij",
                "developer",
                "ejfl",
                "efkje",
                "feij",
                "developer",
                "ejfl",
                "efkje",
                "feij",
                "developer",
                "ejfl",
                "efkje",
                "feij",
            ],
        },
        {
            key: "2",
            name: "Jim Green",
            age: 42,
            address: "London No. 1 Lake Park",
            tags: ["loser"],
        },
        {
            key: "3",
            name: "Joe Black",
            age: 32,
            address: "Sydney No. 1 Lake Park",
            tags: ["cool", "teacher"],
        },
    ];

    return (
        <div id="create-jobs">
            <h2 style={{ marginTop: 0 }}>Create Jobs</h2>
            <Table columns={columns} dataSource={data} />
        </div>
    );
}

CreateJobs.Layout = CompanyProfileLayout;
