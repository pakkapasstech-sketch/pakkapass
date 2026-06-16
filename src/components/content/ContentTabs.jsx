import './contentTabs.css';

const tabs = [
  {
    label: 'All Content',
    value: 'all',
  },
  {
    label: 'Videos',
    value: 'video',
  },
  {
    label: 'Notes',
    value: 'notes',
  },

  {
    label: 'Question Papers',
    value: 'paper',
  },
];

const ContentTabs = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="content-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() =>
            setActiveTab(tab.value)
          }
          className={
            activeTab === tab.value
              ? 'tab-btn active'
              : 'tab-btn'
          }
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default ContentTabs;