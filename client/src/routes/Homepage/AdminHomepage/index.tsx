import { useEffect, useState } from "react";
import { TableName, TaskType } from "../../../enums";
import HomepageNav from "../HomepageNav";
import TabList from "../TabList";
import {
  Button,
  Col,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  message,
  Select,
} from "antd";
import { BACKEND_URL, generalApi, userApi } from "../../../api";
import "./index.css";
import { AllUser } from "../../../interfaces/AllUser";

const dropdownItems = [
  {
    label: "User",
    value: TableName.USER,
  },
  {
    label: "Cycle",
    value: TableName.CYCLE,
  },
  {
    label: "Bottle",
    value: TableName.BOTTLE,
  },
];

const onChange = (value: string) => {
  console.log(`selected ${value}`);
};
const onSearch = (value: string) => {
  console.log("search:", value);
};
const filterOption = (
  input: string,
  option?: { label: string; value: string }
) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

const handleOpenCycle = async (values: any) => {
  try {
    const url = `${BACKEND_URL}/auth/signup`;
    const userData = {
      username: values.username,
      password: values.password,
      name: values.name,
      role: values.role,
      employeeId: values.employeeId,
      lineId: values.lineId,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json(); // Parse JSON response

    if (response.ok) {
      // Check if the HTTP status code is 2xx
      console.log("Success:", data);
      // Option 1: Reload the current page
      window.location.reload();

      // Option 2: Navigate to another route (uncomment the next line to use)
      // navigate("/homepage", { replace: true });
    } else {
      throw new Error(data.message || "An error occurred during signup");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};
const AdminHomepage = () => {
  const [tab, setTab] = useState<TaskType>(TaskType.ALL_USERS);
  const [objUrl, setObjUrl] = useState<string>("");
  const [tableName, setTableName] = useState<TableName>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [userData, setUserData] = useState<AllUser[]>([]);
  const handleChangeTable = async (tableName: TableName) => {
    const tableData = await generalApi.getTableData(tableName);
    console.log(tableData);

    if (tableData.length === 0) {
      setObjUrl("");
      setTableName(tableName);
      return;
    }

    const titleKeys = Object.keys(tableData[0]);

    const refinedData = [];
    refinedData.push(titleKeys);

    tableData.forEach((item) => {
      refinedData.push(Object.values(item));
    });

    let csvContent = "";

    refinedData.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8," });
    setObjUrl(URL.createObjectURL(blob));
    setTableName(tableName);
  };
  const filteredUserData = userData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  const pageHandler = (type: string) => {
    if (type === "minus" && page !== 1) {
      setPage((prevPage) => prevPage - 1);
    } else if (
      type === "add" &&
      filteredUserData &&
      page < Math.ceil(filteredUserData.length / 10)
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };
  const confirm = async (id: number) => {
    try {
      const res = await userApi.deleteUser(id);
      const result = await res.json();
      window.location.reload();
      // message.success("Regimen deleted successfully");
      // navigate("/medicine-and-regimen", { replace: true });
    } catch (error) {
      console.error("Error deleting user:", error);
      // message.error("Failed to delete regimen");
    }
  };

  const cancel = () => {
    message.error("Click on No");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await userApi.getAllUser();
        if (res) {
          setUserData(res);
          console.log(userData);
        } else {
          console.error("Response is undefined");
        }
      } catch (error) {
        console.error("Error fetching drug data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="homepage">
      <HomepageNav>
        <TabList
          tab={tab}
          setTab={setTab}
          tabList={[
            TaskType.ALL_USERS,
            TaskType.CREATE_USER,
            TaskType.EXPORT_CSV,
          ]}
        />
      </HomepageNav>
      {tab === TaskType.CREATE_USER ? (
        // TODO: create user form
        <div className="table-container-open">
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={handleOpenCycle}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <div>
              <h2>Create User</h2>
            </div>
            <div className="container">
              <div className="pattient-information">
                <Col span={16}>
                  <Form.Item
                    name="username"
                    label="Username"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={16}>
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item
                    name="name"
                    label="Name"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item
                    name="role"
                    label="Role"
                    rules={[{ required: true }]}
                  >
                    <Select
                      showSearch
                      placeholder="Select Role"
                      optionFilterProp="children"
                      onChange={onChange}
                      onSearch={onSearch}
                      filterOption={filterOption}
                      options={[
                        {
                          value: "doctor",
                          label: "Doctor",
                        },
                        {
                          value: "nurse",
                          label: "Nurse",
                        },
                        {
                          value: "pharmacy",
                          label: "Pharmacy",
                        },
                        {
                          value: "inventory",
                          label: "Inventory",
                        },
                        {
                          value: "admin",
                          label: "Admin",
                        },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item
                    name="employeeId"
                    label="Employee ID"
                    rules={[{ required: true }]}
                  >
                    <InputNumber />
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item
                    name="lineId"
                    label="Line ID"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </div>
            </div>
            <div className="allopencyclebutton">
              <Form.Item>
                <Button htmlType="submit" className="submit-button5">
                  Create user
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      ) : tab === TaskType.ALL_USERS ? (
        // TODO: all users list
        <div className="table-containerss">
          <div className="search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search Name"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <div className="">
            <table className="medicineandregimentable">
              <thead>
                <tr className="medicineandregimenrow">
                  <th className="medicineandregimenheader">Username</th>
                  <th className="medicineandregimenheader">Name</th>
                  <th className="medicineandregimenheader">Role</th>
                  {/* <th className="medicineandregimenheader">List of Medicine</th>ç */}
                  <th className="medicineandregimenheader">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUserData
                  .slice(10 * page - 10, 10 * page)
                  .map(({ id, username, name, role }) => (
                    <tr className="medicineandregimenrow" key={id}>
                      <td className="medicineandregimenbody">{username}</td>
                      <td className="medicineandregimenbody">{name}</td>
                      <td className="medicineandregimenbody">{role}</td>

                      {/* <td className="medicineandregimenbody">
                      {drugs.map((drug) => (
                        <div key={drug.id}>{drug.name}</div>
                      ))}
                    </td> */}
                      <td className="medicineandregimenbody3">
                        <Popconfirm
                          title="Delete the user"
                          description="Are you sure to delete this regimen?"
                          onConfirm={() => confirm(id)}
                          onCancel={cancel}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button danger>Delete</Button>
                        </Popconfirm>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="pagess">
              <button
                onClick={() => pageHandler("minus")}
                style={{ backgroundColor: "white" }}
              >
                {"<"}
              </button>
              <p>{page}</p>
              <button
                onClick={() => pageHandler("add")}
                style={{ backgroundColor: "white" }}
              >
                {">"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <Dropdown
            menu={{
              items: dropdownItems.map((item) => ({
                key: item.value,
                label: item.label,
                onClick: () => handleChangeTable(item.value),
              })),
              selectable: true,
            }}
          >
            <Button className="select-table-button">
              {tableName ? tableName : "Select Table"}
            </Button>
          </Dropdown>
          <Button
            onClick={() => {
              const a = document.createElement("a");
              a.href = objUrl;
              a.download = `${tableName}.csv`;
              a.click();
            }}
            disabled={!objUrl}
          >
            {objUrl ? "Download CSV" : "No Data to Download"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminHomepage;
