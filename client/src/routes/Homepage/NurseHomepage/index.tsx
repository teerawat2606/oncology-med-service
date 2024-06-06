import { useState } from "react";
import ActionList from "../ActionList.tsx";
import TabList from "../TabList";
import CycleList from "../CycleList";
import HomepageNav from "../HomepageNav";
import { TaskType } from "../../../enums";

const NURSE_ACTIONS = [
  {
    name: "Open cycle",
    path: "/open-cycle",
  },
  {
    name: "Cycle case",
    path: "/all-patient",
  },
];

const NurseHomepage = () => {
  const [tab, setTab] = useState<TaskType>(TaskType.TODO);

  return (
    <div className="homepage">
      <HomepageNav>
        <TabList
          tab={tab}
          setTab={setTab}
          tabList={[TaskType.TODO, TaskType.WAITING]}
        />
        <ActionList actions={NURSE_ACTIONS} />
      </HomepageNav>
      {tab === TaskType.TODO ? (
        // cycles with Check status
        <CycleList taskType={TaskType.TODO} />
      ) : (
        // cycles with Appointment status
        <CycleList taskType={TaskType.WAITING} />
      )}
    </div>
  );
};

export default NurseHomepage;
