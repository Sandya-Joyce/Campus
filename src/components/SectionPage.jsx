import React from 'react';
import { FaBible, FaHeart, FaUsers, FaCalendarAlt, FaBookReader, FaBuilding, FaChartBar, FaCross } from 'react-icons/fa';

const iconMap = {
  'Recent Updates': <FaBible />,
  'Worship Service': <FaCross />,
  'Upcoming Meetings': <FaCalendarAlt />,
  'Training Calendar': <FaBookReader />,
  'Departments': <FaBuilding />,
  'Members Management': <FaUsers />,
  'Updates': <FaBible />,
  'Attendance': <FaHeart />,
  'Reports': <FaChartBar />,
};

export default function SectionPage({ title, subtitle, items, role, actionLabel, allowManage = true, onAction }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div className="panel-heading-stack">
          <div className="section-icon-badge">{iconMap[title] || <FaHeart />}</div>
          <div>
            <p className="eyebrow">Campus module</p>
            <h3>{title}</h3>
            <p className="panel-subtitle">{subtitle}</p>
          </div>
        </div>
        <div className="panel-actions">
          {role === 'user' ? <span className="read-only-pill">Read only</span> : allowManage && <button className="ghost-btn">{actionLabel}</button>}
        </div>
      </div>
      <div className="stack-list">
        {items.map((item) => (
          <div className="list-item" key={item.title}>
            <div className="list-item-main">
              <div className="list-item-icon">{iconMap[item.title] || <FaHeart />}</div>
              <div>
                <h4>{item.title}</h4>
                <p>{item.detail}</p>
              </div>
            </div>
            <div className="item-meta">
              {role === 'user' && item.actionLabel && <button className="mini-btn" type="button" onClick={() => onAction && onAction(item.id)}>{item.actionLabel}</button>}
              {item.badge && <span className="pill">{item.badge}</span>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
