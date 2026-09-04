import React from 'react';
import { FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaUserCheck } from 'react-icons/fa';

export default function Attendance({ role, isPresent, markAttendance }) {
  const attendanceItems = [
    { id: 'att-1', title: 'Sunday Worship', detail: '9:00 AM · Main Hall', date: 'Jun 30' },
    { id: 'att-2', title: 'Cell Group', detail: '11:00 AM · Prayer Room', date: 'Jul 02' },
    { id: 'att-3', title: 'Bible Study', detail: '2:00 PM · Learning Center', date: 'Jul 04' },
  ];

  const total = attendanceItems.length;
  const presentCount = attendanceItems.reduce((acc, it) => acc + (isPresent(it.id) ? 1 : 0), 0);
  const personalPercent = Math.round((presentCount / Math.max(1, total)) * 100);

  return (
    <section className="panel">
      <div className="panel-header">
        <div className="panel-heading-stack">
          <div className="section-icon-badge"><FaUserCheck /></div>
          <div>
            <p className="eyebrow">Campus module</p>
            <h3>Attendance</h3>
            <p className="panel-subtitle">{role === 'admin' ? 'Manually mark attendance in a clear table format.' : 'View your personal attendance percentage and history.'}</p>
          </div>
        </div>
        <div className="panel-actions">
          {role === 'admin' ? <button className="ghost-btn">Export CSV</button> : <span className="read-only-pill">Read only</span>}
        </div>
      </div>

      <div className="attendance-summary-card">
        <div>
          <p className="eyebrow">Manual attendance</p>
          <h4>Your current record</h4>
        </div>
        <div className="attendance-summary-pill">
          <strong>{personalPercent}%</strong>
          <span>{presentCount}/{total} marked present</span>
        </div>
      </div>

      <div className="attendance-table-wrap">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Session</th>
              <th>Date</th>
              <th>Schedule</th>
              <th>Status</th>
              <th>{role === 'admin' ? 'Action' : 'Note'}</th>
            </tr>
          </thead>
          <tbody>
            {attendanceItems.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.date}</td>
                <td>{item.detail}</td>
                <td>
                  <span className={`attendance-status ${isPresent(item.id) ? 'present' : 'absent'}`}>
                    {isPresent(item.id) ? <FaCheckCircle /> : <FaTimesCircle />}
                    {isPresent(item.id) ? 'Present' : 'Absent'}
                  </span>
                </td>
                <td>
                  {role === 'admin' ? (
                    <button className={`attendance-action-btn ${isPresent(item.id) ? 'present' : 'absent'}`} onClick={() => markAttendance(item.id)}>
                      {isPresent(item.id) ? 'Mark absent' : 'Mark present'}
                    </button>
                  ) : (
                    <span className="attendance-note">{isPresent(item.id) ? 'Confirmed' : 'Pending'}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
