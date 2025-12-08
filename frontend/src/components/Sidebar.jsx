import React, { useState } from 'react';

const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState('services');
  const [expandedMenu, setExpandedMenu] = useState('services');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'nexus', label: 'Nexus', icon: '🔗' },
    { id: 'intake', label: 'Intake', icon: '📥' },
    {
      id: 'services',
      label: 'Services',
      icon: '⚙️',
      submenu: [
        { id: 'pre-active', label: 'Pre-active' },
        { id: 'active', label: 'Active' },
        { id: 'blocked', label: 'Blocked' },
        { id: 'closed', label: 'Closed' }
      ]
    },
    {
      id: 'invoices',
      label: 'Invoices',
      icon: '📄',
      submenu: [
        { id: 'proforma', label: 'Proforma Invoices' },
        { id: 'final', label: 'Final Invoices' }
      ]
    }
  ];

  const toggleMenu = (id) => {
    setExpandedMenu(expandedMenu === id ? null : id);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="vault-logo">
          <div className="logo-icon">V</div>
          <div className="logo-text">
            <div className="vault-title">Vault</div>
            <div className="vault-subtitle">Anurag Yadav</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <div key={item.id} className="nav-item-wrapper">
            <div
              className={`nav-item ${activeMenu === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveMenu(item.id);
                if (item.submenu) toggleMenu(item.id);
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.submenu && (
                <span className="nav-arrow">
                  {expandedMenu === item.id ? '˄' : '˅'}
                </span>
              )}
            </div>
            
            {item.submenu && expandedMenu === item.id && (
              <div className="submenu">
                {item.submenu.map(subitem => (
                  <div key={subitem.id} className="submenu-item">
                    <span className="submenu-icon">○</span>
                    <span className="submenu-label">{subitem.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;