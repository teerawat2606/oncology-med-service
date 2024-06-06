import { useState } from "react";
import TabList from "../TabList";
import { TaskType } from "../../../enums";
import CycleList from "../CycleList";
import HomepageNav from "../HomepageNav";

const InventoryHomepage = () => {
  const [tab, setTab] = useState<TaskType>(TaskType.TODO);

  return (
    <div className="homepage">
      <HomepageNav>
        <TabList
          tab={tab}
          setTab={setTab}
          tabList={[TaskType.TODO, TaskType.WAITING]}
        />
      </HomepageNav>
      {tab === TaskType.TODO ? (
        // cycles with Inventory and Return status
        <CycleList taskType={TaskType.TODO} />
      ) : (
        // cycles with Order status
        <CycleList taskType={TaskType.WAITING} />
      )}
    </div>
  );
};

export default InventoryHomepage;
