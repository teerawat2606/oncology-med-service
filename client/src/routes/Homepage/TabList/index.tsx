import { TaskType } from "../../../enums";
import "./index.css";
import { Dispatch, SetStateAction } from "react";

const TabNames = {
  [TaskType.TODO]: "To-do list",
  [TaskType.WAITING]: "Waiting list",
  [TaskType.CREATE_USER]: "Create user",
  [TaskType.ALL_USERS]: "All users",
  [TaskType.EXPORT_CSV]: "Export CSV",
};

interface SetTabButtonProps {
  tab: TaskType;
  setTab: Dispatch<SetStateAction<TaskType>>;
  taskType: TaskType;
}

const SetTabButton: React.FC<SetTabButtonProps> = ({
  tab,
  setTab,
  taskType,
}) => {
  return (
    <button
      className={"tab-button"}
      style={{
        backgroundColor: tab === taskType ? "#06264e" : "white",
        color: tab === taskType ? "white" : "#06264e",
      }}
      onClick={() => setTab(taskType)}
    >
      {TabNames[taskType]}
    </button>
  );
};
interface Props {
  tab: TaskType;
  setTab: Dispatch<SetStateAction<TaskType>>;
  tabList: TaskType[];
}

const TabList: React.FC<Props> = ({ tab, setTab, tabList }) => {
  return (
    <div className="tab-list">
      {tabList.map((taskType) => (
        <SetTabButton
          key={taskType}
          tab={tab}
          setTab={setTab}
          taskType={taskType}
        />
      ))}
    </div>
  );
};

export default TabList;
