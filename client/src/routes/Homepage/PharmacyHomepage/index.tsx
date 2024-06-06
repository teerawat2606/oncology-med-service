import { useState } from "react";
import ActionList from "../ActionList.tsx";
import CycleList from "../CycleList";
import HomepageNav from "../HomepageNav";
import TabList from "../TabList";
import { TaskType } from "../../../enums";

const PHARMACY_ACTIONS = [
  { name: "Generate report", path: "/generate-report" },
];

const PharmacyHomepage = () => {
  const [tab, setTab] = useState<TaskType>(TaskType.TODO);

  return (
    <div className="homepage">
      <HomepageNav>
        <TabList
          tab={tab}
          setTab={setTab}
          tabList={[TaskType.TODO, TaskType.WAITING]}
        />
        <ActionList actions={PHARMACY_ACTIONS} />
      </HomepageNav>
      {tab === TaskType.TODO ? (
        // cycles with Pharmacy type
        <CycleList taskType={TaskType.TODO} />
      ) : (
        // cycles with Ready type
        <CycleList taskType={TaskType.WAITING} />
      )}
    </div>
  );
};

export default PharmacyHomepage;
