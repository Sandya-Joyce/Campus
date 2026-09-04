import React, { useState } from 'react';

function ClassBlock({ cls, role }) {
  const [open, setOpen] = useState(false);
  const [openTeams, setOpenTeams] = useState({});

  const toggleTeam = (teamId) => {
    setOpenTeams((s) => ({ ...s, [teamId]: !s[teamId] }));
  };

  return (
    <div className="class-block">
      <div className="list-item">
        <div>
          <h4 onClick={() => setOpen((v) => !v)} style={{ cursor: 'pointer' }}>{cls.title}</h4>
          <p>{cls.detail}</p>
        </div>
        <div className="item-meta">
          <span className="pill">{cls.badge}</span>
        </div>
      </div>
      {open && (
        <div className="team-list">
          {cls.teams.map((t) => (
            <div key={t.id} className="team-block">
              <div className="list-item">
                <div>
                  <h4 onClick={() => toggleTeam(t.id)} style={{ cursor: 'pointer', fontSize: '1rem' }}>{t.name}</h4>
                  <p>{t.students.length} students</p>
                </div>
                <div className="item-meta">
                  <button className="mini-btn" onClick={() => toggleTeam(t.id)}>{openTeams[t.id] ? 'Hide' : 'Show'}</button>
                </div>
              </div>
              {openTeams[t.id] && (
                <div className="student-list" style={{ paddingLeft: 18 }}>
                  {t.students.map((s) => (
                    <div key={s.id} className="list-item">
                      <div>
                        <h4>{s.name} <span style={{ fontSize: '0.9rem', color: '#64748b' }}>({s.roll})</span></h4>
                        <p style={{ margin: 0 }}>{s.email} · Student ID: {s.id}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Classes({ classes, role, onExportClass, onExportAll }) {
  const [classSearch, setClassSearch] = useState('');

  const visible = classes.filter((c) => {
    if (!classSearch) return true;
    const q = classSearch.toLowerCase();
    if (c.title.toLowerCase().includes(q)) return true;
    if (c.teams.some((t) => t.name.toLowerCase().includes(q))) return true;
    if (c.teams.some((t) => t.students.some((s) => s.name.toLowerCase().includes(q)))) return true;
    return false;
  });

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Campus module</p>
          <h3>Classes & Teams</h3>
          <p className="panel-subtitle">Browse classes, teams and student lists.</p>
        </div>
        <div className="panel-actions">
          {role === 'admin' ? (
            <>
              <button className="ghost-btn" onClick={onExportAll}>Export All CSV</button>
              <button className="ghost-btn">Manage classes</button>
            </>
          ) : (
            <span className="read-only-pill">Read only</span>
          )}
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <input
          placeholder="Search classes, teams, students"
          value={classSearch}
          onChange={(e) => setClassSearch(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', width: '100%' }}
        />
      </div>

      <div className="stack-list">
        {visible.map((c) => (
          <div key={c.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <ClassBlock cls={c} role={role} />
              {role === 'admin' && <button className="mini-btn" onClick={() => onExportClass(c.id)} style={{ marginLeft: 8 }}>Export CSV</button>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
