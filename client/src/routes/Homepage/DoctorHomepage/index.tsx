import CycleList from "../CycleList";
import HomepageNav from "../HomepageNav";
import DoctorTabList from "./DoctorTabList";

const DoctorHomepage = () => {
  return (
    <div className="homepage">
      <HomepageNav>
        <DoctorTabList />
      </HomepageNav>

      {/* Open Cycles */}
      <CycleList />
    </div>
  );
};

export default DoctorHomepage;
