import React from "react";

const Tabs = ({ activeTab, setActiveTab, tabs }) => (
  <div className="admin-tabs">
    {tabs.map((tab) => (
      <button
        key={tab}
        className={activeTab === tab ? "active-tab" : ""}
        onClick={() => setActiveTab(tab)}
      >
        {tab}
      </button>
    ))}
  </div>
);

export default Tabs;
