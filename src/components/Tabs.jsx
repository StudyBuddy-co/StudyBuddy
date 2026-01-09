import * as React from "react";

const Tabs = ({ children, defaultValue = "", className = "" }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  // Provide context to children
  return (
    <div className={className}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </div>
  );
};

const TabsList = ({ children, className = "", activeTab, setActiveTab }) => (
  <div className={`flex ${className}`}>
    {React.Children.map(children, (child) =>
      React.cloneElement(child, { activeTab, setActiveTab })
    )}
  </div>
);

const TabsTrigger = ({ value, children, activeTab, setActiveTab, className = "" }) => (
  <button
    className={`flex-1 px-3 py-2 rounded-md font-medium transition ${
      activeTab === value
        ? "bg-teal-500 text-white"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    } ${className}`}
    onClick={() => setActiveTab(value)}
  >
    {children}
  </button>
);

const TabsContent = ({ value, children, activeTab, className = "" }) =>
  activeTab === value ? <div className={className}>{children}</div> : null;

export { Tabs, TabsList, TabsTrigger, TabsContent };