const DoctorTabList: React.FC = () => {
  return (
    <div className="tab-list">
      <button
        className={"tab-button"}
        style={{
          backgroundColor: "#06264e",
          color: "white",
        }}
      >
        Open Cycles
      </button>
    </div>
  );
};

export default DoctorTabList;
