import { useState } from "react";
import {
  FaUserCheck,
  FaBell,
  FaCalendar,
  FaChalkboardTeacher,
  FaBook,
  FaBuilding,
  FaChartBar,
  FaBars,
  FaTimes,
  FaCross,
  FaPrayingHands,
  FaBible,
  FaHeart,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";

import "./layout.css";

const linkGroups = [
  {
    title: 'Overview',
    links: [{ id: 'overview', label: 'Dashboard', icon: <FaPrayingHands /> }],
  },
  {
    title: 'Community',
    links: [
      { id: 'attendance', label: 'Attendance', icon: <FaHeart /> },
      { id: 'attendance-analytics', label: 'Analytics', icon: <FaChartBar /> },
      { id: 'members', label: 'Members', icon: <FaUserCheck /> },
      { id: 'updates', label: 'Updates', icon: <FaBell /> },
    ],
  },
  {
    title: 'Programs',
    links: [
      { id: 'worship', label: 'Worship', icon: <FaBible /> },
      { id: 'meetings', label: 'Meetings', icon: <FaCalendar /> },
      { id: 'trainings', label: 'Trainings', icon: <FaChalkboardTeacher /> },
      { id: 'classes', label: 'Classes', icon: <FaBook /> },
    ],
  },
  {
    title: 'Management',
    links: [
      { id: 'departments', label: 'Departments', icon: <FaBuilding /> },
      { id: 'reports', label: 'Reports', icon: <FaCross /> },
    ],
  },
];

export default function Sidebar({ activeSection, onSelect, role }) {
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState({
    Overview: true,
    Community: true,
    Programs: true,
    Management: true,
  });

  const toggleGroup = (title) => {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <div className={collapsed ? "sidebar collapsed" : "sidebar"}>
      <div className="sidebar-top">
        {!collapsed && (
          <div className="sidebar-brand">
            <span className="sidebar-brand-icon"><FaCross /></span>
            <div>
              <h2>Mathhias Hyderabad</h2>
              <p className="sidebar-brand-sub">Light of Zion</p>
            </div>
          </div>
        )}
        <button
          type="button"
          className="toggle-btn"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <FaBars /> : <FaTimes />}
        </button>
      </div>

      {!collapsed && (
        <div className="sidebar-badge-row">
          <span className="sidebar-badge"><FaBible /> Scripture</span>
          <span className="sidebar-badge"><FaHeart /> Care</span>
        </div>
      )}

      {!collapsed && <p className="sidebar-subtitle">{role === 'admin' ? 'Admin portal' : 'User portal'}</p>}

      <div className="sidebar-nav">
        {linkGroups.map((group) => {
          const isOpen = openGroups[group.title] !== false;
          const groupHasActive = group.links.some((l) => l.id === activeSection);
          return (
            <div className="sidebar-group" key={group.title}>
              {!collapsed && (
                <button
                  type="button"
                  className={"sidebar-group-toggle " + (groupHasActive ? 'active-group-header' : '')}
                  onClick={() => toggleGroup(group.title)}
                >
                  <span>{group.title}</span>
                  {isOpen ? <FaChevronDown /> : <FaChevronRight />}
                </button>
              )}
              {(!collapsed && isOpen) && group.links.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  className={activeSection === link.id ? 'active' : ''}
                  onClick={() => onSelect(link.id)}
                  title={collapsed ? link.label : undefined}
                >
                  {link.icon} <span>{link.label}</span>
                </button>
              ))}
              {collapsed && group.links.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  className={activeSection === link.id ? 'active' : ''}
                  onClick={() => onSelect(link.id)}
                  title={link.label}
                >
                  {link.icon}
                </button>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

