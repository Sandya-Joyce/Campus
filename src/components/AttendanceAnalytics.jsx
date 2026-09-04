import React, { useState } from 'react';

export default function AttendanceAnalytics({ teams, role }) {
  const [viewMode, setViewMode] = useState('team'); // 'team' or 'cell'

  // Calculate team-wise attendance
  const getTeamStats = () => {
    return teams.map((team) => {
      const allMembers = [];
      team.cells.forEach((cell) => {
        allMembers.push(...cell.members);
      });
      const avgAttendance = allMembers.length > 0
        ? Math.round(allMembers.reduce((sum, m) => sum + m.attendance, 0) / allMembers.length)
        : 0;
      return {
        name: team.name,
        attendance: avgAttendance,
        memberCount: allMembers.length,
      };
    });
  };

  // Calculate cell-wise attendance for all teams
  const getCellStats = () => {
    const stats = [];
    teams.forEach((team) => {
      team.cells.forEach((cell) => {
        const avgAttendance = cell.members.length > 0
          ? Math.round(cell.members.reduce((sum, m) => sum + m.attendance, 0) / cell.members.length)
          : 0;
        stats.push({
          teamName: team.name,
          cellName: cell.name,
          attendance: avgAttendance,
          memberCount: cell.members.length,
        });
      });
    });
    return stats;
  };

  const teamStats = getTeamStats();
  const cellStats = getCellStats();

  const SimpleBarChart = ({ data, label, maxWidth = 300 }) => {
    return (
      <div style={{ marginBottom: 20 }}>
        {data.map((item) => (
          <div key={item.name || `${item.teamName}-${item.cellName}`} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <strong>{item.name || `${item.teamName} - ${item.cellName}`}</strong>
              <span style={{ color: '#2e7d32', fontWeight: 700 }}>{item.attendance}%</span>
            </div>
            <div style={{ background: '#e0e0e0', borderRadius: 8, height: 24, overflow: 'hidden' }}>
              <div
                style={{
                  background: item.attendance >= 80 ? '#66bb6a' : item.attendance >= 60 ? '#ffb74d' : '#ef5350',
                  height: '100%',
                  width: `${(item.attendance / 100) * maxWidth}px`,
                  transition: 'width 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                }}
              >
                {item.attendance > 10 && `${item.attendance}%`}
              </div>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#666' }}>
              {item.memberCount} members
            </p>
          </div>
        ))}
      </div>
    );
  };

  const OverallStats = () => {
    const allMembers = [];
    teams.forEach((team) => {
      team.cells.forEach((cell) => {
        allMembers.push(...cell.members);
      });
    });

    const totalMembers = allMembers.length;
    const avgAttendance = totalMembers > 0
      ? Math.round(allMembers.reduce((sum, m) => sum + m.attendance, 0) / totalMembers)
      : 0;
    const highAttendance = allMembers.filter((m) => m.attendance >= 80).length;
    const lowAttendance = allMembers.filter((m) => m.attendance < 60).length;

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        <div style={{ background: '#e8f5e9', padding: 16, borderRadius: 10 }}>
          <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Total Members</p>
          <h3 style={{ margin: 0, color: '#2e7d32', fontSize: '1.8rem' }}>{totalMembers}</h3>
        </div>
        <div style={{ background: '#e8f5e9', padding: 16, borderRadius: 10 }}>
          <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Avg Attendance</p>
          <h3 style={{ margin: 0, color: '#2e7d32', fontSize: '1.8rem' }}>{avgAttendance}%</h3>
        </div>
        <div style={{ background: '#e8f5e9', padding: 16, borderRadius: 10 }}>
          <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>High (≥80%)</p>
          <h3 style={{ margin: 0, color: '#66bb6a', fontSize: '1.8rem' }}>{highAttendance}</h3>
        </div>
        <div style={{ background: '#ffebee', padding: 16, borderRadius: 10 }}>
          <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Low ({"<"}60%)</p>
          <h3 style={{ margin: 0, color: '#ef5350', fontSize: '1.8rem' }}>{lowAttendance}</h3>
        </div>
      </div>
    );
  };

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Campus module</p>
          <h3>Attendance Analytics</h3>
          <p className="panel-subtitle">View attendance trends by team and cell with visual charts.</p>
        </div>
        <div className="panel-actions">
          {role === 'user' && <span className="read-only-pill">Read only</span>}
        </div>
      </div>

      <OverallStats />

      <div style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
        <button
          className={viewMode === 'team' ? 'filter-chip active' : 'filter-chip'}
          onClick={() => setViewMode('team')}
        >
          Team-wise Attendance
        </button>
        <button
          className={viewMode === 'cell' ? 'filter-chip active' : 'filter-chip'}
          onClick={() => setViewMode('cell')}
        >
          Cell-wise Attendance
        </button>
      </div>

      <div style={{ background: '#fafafa', padding: 16, borderRadius: 10 }}>
        {viewMode === 'team' ? (
          <>
            <h4 style={{ marginTop: 0 }}>Attendance by Team</h4>
            <SimpleBarChart data={teamStats} label="Team" maxWidth={300} />
          </>
        ) : (
          <>
            <h4 style={{ marginTop: 0 }}>Attendance by Cell</h4>
            <SimpleBarChart data={cellStats} label="Cell" maxWidth={300} />
          </>
        )}
      </div>

      {/* Distribution Chart */}
      <div style={{ marginTop: 24 }}>
        <h4>Attendance Distribution</h4>
        <DistributionChart teams={teams} />
      </div>
    </section>
  );
}

function DistributionChart({ teams }) {
  // Count members in each attendance range
  const ranges = [
    { label: '0-20%', min: 0, max: 20, count: 0 },
    { label: '21-40%', min: 21, max: 40, count: 0 },
    { label: '41-60%', min: 41, max: 60, count: 0 },
    { label: '61-80%', min: 61, max: 80, count: 0 },
    { label: '81-100%', min: 81, max: 100, count: 0 },
  ];

  teams.forEach((team) => {
    team.cells.forEach((cell) => {
      cell.members.forEach((member) => {
        const range = ranges.find((r) => member.attendance >= r.min && member.attendance <= r.max);
        if (range) range.count += 1;
      });
    });
  });

  const maxCount = Math.max(...ranges.map((r) => r.count), 1);

  return (
    <div style={{ background: '#fafafa', padding: 16, borderRadius: 10 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', height: 200, gap: 8, justifyContent: 'center' }}>
        {ranges.map((range) => (
          <div key={range.label} style={{ textAlign: 'center', flex: 1 }}>
            <div
              style={{
                background: '#4caf50',
                height: `${(range.count / maxCount) * 180}px`,
                borderRadius: '8px 8px 0 0',
                marginBottom: 8,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 700,
                paddingBottom: 4,
              }}
            >
              {range.count > 0 && <span style={{ fontSize: '0.9rem' }}>{range.count}</span>}
            </div>
            <label style={{ fontSize: '0.85rem', color: '#666' }}>{range.label}</label>
          </div>
        ))}
      </div>
    </div>
  );
}
