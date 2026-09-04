import React, { useState } from 'react';
import { FaUsers, FaPlus, FaTrash, FaUpload, FaDownload, FaChevronDown, FaChevronRight, FaUserPlus, FaBible, FaHeart, FaCross, FaPrayingHands } from 'react-icons/fa';

export default function Members({ teams, role, onUpdateTeams }) {
  const [expandedTeams, setExpandedTeams] = useState({});
  const [expandedCells, setExpandedCells] = useState({});
  const [viewMode, setViewMode] = useState('hierarchy'); // 'hierarchy' or 'table'
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamLeader, setNewTeamLeader] = useState('');
  const [newCellName, setNewCellName] = useState('');
  const [newCellLeader, setNewCellLeader] = useState('');
  const [newMemberData, setNewMemberData] = useState({ name: '', address: '' });
  const [selectedTeamForCell, setSelectedTeamForCell] = useState('');
  const [selectedTeamForMember, setSelectedTeamForMember] = useState('');
  const [selectedCellForMember, setSelectedCellForMember] = useState('');

  const toggleTeam = (teamId) => {
    setExpandedTeams((s) => ({ ...s, [teamId]: !s[teamId] }));
  };

  const toggleCell = (cellId) => {
    setExpandedCells((s) => ({ ...s, [cellId]: !s[cellId] }));
  };

  const handleAddTeam = () => {
    if (!newTeamName.trim()) return;
    const newTeam = {
      id: `team-${Date.now()}`,
      name: newTeamName,
      teamLeader: newTeamLeader.trim() || 'To be assigned',
      cells: [],
    };
    onUpdateTeams([...teams, newTeam]);
    setNewTeamName('');
    setNewTeamLeader('');
  };

  const handleDeleteTeam = (teamId) => {
    if (!window.confirm('Delete this team and all its cells/members?')) return;
    onUpdateTeams(teams.filter((t) => t.id !== teamId));
  };

  const handleAddCell = (teamId) => {
    if (!newCellName.trim()) return;
    const updated = teams.map((t) => {
      if (t.id === teamId) {
        return {
          ...t,
          cells: [
            ...t.cells,
            { id: `cell-${Date.now()}`, name: newCellName, cellLeader: newCellLeader.trim() || 'To be assigned', members: [] },
          ],
        };
      }
      return t;
    });
    onUpdateTeams(updated);
    setNewCellName('');
    setNewCellLeader('');
    setSelectedTeamForCell('');
  };

  const handleDeleteCell = (teamId, cellId) => {
    if (!window.confirm('Delete this cell and all its members?')) return;
    const updated = teams.map((t) => {
      if (t.id === teamId) {
        return {
          ...t,
          cells: t.cells.filter((c) => c.id !== cellId),
        };
      }
      return t;
    });
    onUpdateTeams(updated);
  };

  const handleAddMember = () => {
    if (!newMemberData.name.trim() || !selectedTeamForMember || !selectedCellForMember) {
      alert('Please fill all fields');
      return;
    }
    const updated = teams.map((t) => {
      if (t.id === selectedTeamForMember) {
        return {
          ...t,
          cells: t.cells.map((c) => {
            if (c.id === selectedCellForMember) {
              const cellName = c.name;
              return {
                ...c,
                members: [
                  ...c.members,
                  {
                    id: `m${Date.now()}`,
                    name: newMemberData.name,
                    cellGroup: cellName,
                    address: newMemberData.address,
                    attendance: 0,
                  },
                ],
              };
            }
            return c;
          }),
        };
      }
      return t;
    });
    onUpdateTeams(updated);
    setNewMemberData({ name: '', address: '' });
    setSelectedTeamForMember('');
    setSelectedCellForMember('');
  };

  const handleDeleteMember = (teamId, cellId, memberId) => {
    if (!window.confirm('Delete this member?')) return;
    const updated = teams.map((t) => {
      if (t.id === teamId) {
        return {
          ...t,
          cells: t.cells.map((c) => {
            if (c.id === cellId) {
              return {
                ...c,
                members: c.members.filter((m) => m.id !== memberId),
              };
            }
            return c;
          }),
        };
      }
      return t;
    });
    onUpdateTeams(updated);
  };

  const handleUpdateAttendance = (teamId, cellId, memberId, value) => {
    const updated = teams.map((t) => {
      if (t.id === teamId) {
        return {
          ...t,
          cells: t.cells.map((c) => {
            if (c.id === cellId) {
              return {
                ...c,
                members: c.members.map((m) => {
                  if (m.id === memberId) {
                    return { ...m, attendance: parseInt(value, 10) };
                  }
                  return m;
                }),
              };
            }
            return c;
          }),
        };
      }
      return t;
    });
    onUpdateTeams(updated);
  };

  const downloadTemplate = () => {
    const headers = 'Team,Cell,MemberName,Address,Attendance';
    const rows = [];
    teams.forEach((team) => {
      team.cells.forEach((cell) => {
        cell.members.forEach((member) => {
          rows.push(`${team.name},${cell.name},${member.name},${member.address},${member.attendance}`);
        });
      });
    });
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'members_template.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleUploadCSV = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (!text) return;
      const lines = text.split('\n').slice(1);
      const updated = JSON.parse(JSON.stringify(teams));

      lines.forEach((line) => {
        if (!line.trim()) return;
        const [teamName, cellName, memberName, address, attendance] = line.split(',').map((s) => s.trim());

        let team = updated.find((t) => t.name === teamName);
        if (!team) {
          team = { id: `team-${Date.now()}`, name: teamName, cells: [] };
          updated.push(team);
        }

        let cell = team.cells.find((c) => c.name === cellName);
        if (!cell) {
          cell = { id: `cell-${Date.now()}`, name: cellName, members: [] };
          team.cells.push(cell);
        }

        const existingMember = cell.members.find((m) => m.name === memberName);
        if (!existingMember) {
          cell.members.push({
            id: `m${Date.now()}`,
            name: memberName,
            cellGroup: cellName,
            address,
            attendance: parseInt(attendance, 10) || 0,
          });
        }
      });

      onUpdateTeams(updated);
      alert('CSV imported successfully!');
    };
    reader.readAsText(file);
  };

  const getAllMembers = () => {
    const members = [];
    teams.forEach((team) => {
      team.cells.forEach((cell) => {
        cell.members.forEach((member) => {
          members.push({ ...member, teamName: team.name, teamId: team.id, cellId: cell.id });
        });
      });
    });
    return members;
  };

  const allMembers = getAllMembers();
  const totalTeams = teams.length;
  const totalCells = teams.reduce((sum, team) => sum + team.cells.length, 0);
  const totalMembers = allMembers.length;

  return (
    <section className="panel">
      <div className="panel-header">
        <div className="panel-heading-stack">
          <div className="section-icon-badge"><FaUsers /></div>
          <div>
            <p className="eyebrow">Campus module</p>
            <h3>Members Management</h3>
            <p className="panel-subtitle">Manage teams, cells, and member details with attendance tracking.</p>
          </div>
        </div>
        <div className="panel-actions">
          {role === 'admin' ? (
            <>
              <button className="ghost-btn" onClick={downloadTemplate}><FaDownload style={{ marginRight: 6 }} />Download CSV</button>
              <button className="ghost-btn" onClick={() => document.getElementById('csvUpload')?.click()}><FaUpload style={{ marginRight: 6 }} />Upload CSV</button>
              <input
                type="file"
                accept=".csv"
                onChange={handleUploadCSV}
                style={{ display: 'none' }}
                id="csvUpload"
              />
            </>
          ) : (
            <span className="read-only-pill">Read only</span>
          )}
        </div>
      </div>

      <div className="members-shell">
        <div className="members-hero">
          <div className="members-hero-card">
            <p className="eyebrow">Members hub</p>
            <div className="members-hero-badges">
              <span className="faith-sticker"><FaBible /> Scripture</span>
              <span className="faith-sticker"><FaHeart /> Care</span>
            </div>
            <h4>Organized, elegant, and easy to manage</h4>
            <p>Keep teams, cells, and member attendance beautifully structured with a calm, modern workspace.</p>
            <div className="members-stats">
              <div className="members-metric">
                <strong>{totalTeams}</strong>
                <span>Teams</span>
              </div>
              <div className="members-metric">
                <strong>{totalCells}</strong>
                <span>Cells</span>
              </div>
              <div className="members-metric">
                <strong>{totalMembers}</strong>
                <span>Members</span>
              </div>
            </div>
          </div>
          <div className="members-hero-card members-hero-card-soft">
            <p className="eyebrow">Admin quick actions</p>
            <div className="members-hero-badges">
              <span className="faith-sticker"><FaPrayingHands /> Prayer</span>
              <span className="faith-sticker"><FaCross /> Grace</span>
            </div>
            <h4>Stay on top of every update</h4>
            <p>Upload lists, manage attendance, and keep records neat in one place.</p>
            <div className="members-badge-row">
              <span className="members-badge">Live updates</span>
              <span className="members-badge">Attendance ready</span>
              <span className="members-badge">CSV import</span>
            </div>
          </div>
        </div>

        <div className="members-toolbar">
          <div className="members-toggle">
            <button
              className={viewMode === 'hierarchy' ? 'active' : ''}
              onClick={() => setViewMode('hierarchy')}
            >
              Hierarchy View
            </button>
            <button
              className={viewMode === 'table' ? 'active' : ''}
              onClick={() => setViewMode('table')}
            >
              Table View
            </button>
          </div>

          <div className="members-toolbar-actions">
            {role === 'admin' ? (
              <>
                <label className="members-upload-btn" htmlFor="csvUploadMain">
                  <span>Upload CSV</span>
                </label>
                <button className="ghost-btn members-action-btn" onClick={downloadTemplate}>Download CSV</button>
              </>
            ) : (
              <span className="read-only-pill">Read only</span>
            )}
          </div>
        </div>

        {role === 'admin' && (
          <div className="members-add-card">
            <h4>Add New Team</h4>
            <div className="members-inline-form">
              <input
                className="members-input"
                placeholder="Team name"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
              />
              <input
                className="members-input"
                placeholder="Team leader"
                value={newTeamLeader}
                onChange={(e) => setNewTeamLeader(e.target.value)}
              />
              <button onClick={handleAddTeam} className="ghost-btn members-action-btn">
                <FaPlus style={{ marginRight: 6 }} />Add Team
              </button>
            </div>
          </div>
        )}

      {viewMode === 'hierarchy' ? (
        <div className="members-list-stack">
          {teams.map((team) => (
            <div key={team.id} className="members-team-card">
              <div className="members-team-header">
                <div>
                  <h3 className="members-team-title" onClick={() => toggleTeam(team.id)}>
                    <span className="team-icon"><FaUsers /></span>
                    <span>{expandedTeams[team.id] ? <FaChevronDown /> : <FaChevronRight />}</span>
                    <span>{team.name}</span>
                    <span className="members-count-pill">{team.cells.length} cells</span>
                  </h3>
                  <p className="members-leader-line">Team Leader: {team.teamLeader || 'To be assigned'}</p>
                </div>
                {role === 'admin' && (
                  <button onClick={() => handleDeleteTeam(team.id)} className="mini-btn">
                    <FaTrash style={{ marginRight: 6 }} />Delete Team
                  </button>
                )}
              </div>

              {expandedTeams[team.id] && (
                <div className="members-team-body">
                  {role === 'admin' && (
                    <div className="members-add-card members-add-card-inline">
                      <div className="members-inline-form">
                        <input
                          className="members-input"
                          placeholder="Cell name"
                          value={selectedTeamForCell === team.id ? newCellName : ''}
                          onChange={(e) => {
                            setSelectedTeamForCell(team.id);
                            setNewCellName(e.target.value);
                          }}
                        />
                        <input
                          className="members-input"
                          placeholder="Cell leader"
                          value={selectedTeamForCell === team.id ? newCellLeader : ''}
                          onChange={(e) => {
                            setSelectedTeamForCell(team.id);
                            setNewCellLeader(e.target.value);
                          }}
                        />
                        <button onClick={() => handleAddCell(team.id)} className="mini-btn">
                          <FaPlus style={{ marginRight: 6 }} />Add Cell
                        </button>
                      </div>
                    </div>
                  )}

                  {team.cells.map((cell) => (
                    <div key={cell.id} className="members-cell-card">
                      <div className="members-cell-header">
                        <div>
                          <h4 className="members-cell-title" onClick={() => toggleCell(cell.id)}>
                            <span className="cell-icon"><FaBible /></span>
                            <span>{expandedCells[cell.id] ? <FaChevronDown /> : <FaChevronRight />}</span>
                            <span>{cell.name}</span>
                            <span className="members-count-pill">{cell.members.length} members</span>
                          </h4>
                          <p className="members-leader-line">Cell Leader: {cell.cellLeader || 'To be assigned'}</p>
                        </div>
                        {role === 'admin' && (
                          <button onClick={() => handleDeleteCell(team.id, cell.id)} className="mini-btn">
                            <FaTrash style={{ marginRight: 6 }} />Delete Cell
                          </button>
                        )}
                      </div>

                      {expandedCells[cell.id] && (
                        <div className="members-cell-body">
                          {cell.members.map((member) => (
                            <div key={member.id} className="members-member-row">
                              <div className="members-member-meta">
                                <div className="member-icon"><FaHeart /></div>
                                <p className="members-member-name">{member.name}</p>
                                <p className="members-member-sub">ID: {member.id} · {member.address}</p>
                              </div>
                              <div className="members-member-actions">
                                {role === 'admin' ? (
                                  <>
                                    <input
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={member.attendance}
                                      onChange={(e) => handleUpdateAttendance(team.id, cell.id, member.id, e.target.value)}
                                      className="members-attendance-input"
                                    />
                                    <span className="members-attendance-label">%</span>
                                    <button onClick={() => handleDeleteMember(team.id, cell.id, member.id)} className="mini-btn">
                                      <FaTrash style={{ marginRight: 6 }} />Delete
                                    </button>
                                  </>
                                ) : (
                                  <span className="pill">{member.attendance}%</span>
                                )}
                              </div>
                            </div>
                          ))}

                          {role === 'admin' && (
                            <div className="members-add-card members-add-card-inline">
                              <div className="members-inline-form members-inline-form-compact">
                                <input
                                  className="members-input"
                                  placeholder="Member name"
                                  value={selectedCellForMember === cell.id ? newMemberData.name : ''}
                                  onChange={(e) => {
                                    setSelectedTeamForMember(team.id);
                                    setSelectedCellForMember(cell.id);
                                    setNewMemberData({ ...newMemberData, name: e.target.value });
                                  }}
                                />
                                <input
                                  className="members-input"
                                  placeholder="Address"
                                  value={selectedCellForMember === cell.id ? newMemberData.address : ''}
                                  onChange={(e) => {
                                    setSelectedTeamForMember(team.id);
                                    setSelectedCellForMember(cell.id);
                                    setNewMemberData({ ...newMemberData, address: e.target.value });
                                  }}
                                />
                                <button onClick={handleAddMember} className="mini-btn">
                                  <FaUserPlus style={{ marginRight: 6 }} />Add Member
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="members-table-wrap">
          <table className="members-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Team</th>
                <th>Team Leader</th>
                <th>Cell Group</th>
                <th>Cell Leader</th>
                <th>Address</th>
                <th>Attendance</th>
                {role === 'admin' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {allMembers.map((member) => (
                <tr key={member.id}>
                  <td>{member.id}</td>
                  <td>{member.name}</td>
                  <td>{member.teamName}</td>
                  <td>{teams.find((team) => team.id === member.teamId)?.teamLeader || 'To be assigned'}</td>
                  <td>{member.cellGroup}</td>
                  <td>{teams.find((team) => team.id === member.teamId)?.cells.find((cell) => cell.id === member.cellId)?.cellLeader || 'To be assigned'}</td>
                  <td>{member.address}</td>
                  <td>
                    {role === 'admin' ? (
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={member.attendance}
                        onChange={(e) => handleUpdateAttendance(member.teamId, member.cellId, member.id, e.target.value)}
                        className="members-attendance-input"
                      />
                    ) : (
                      <span className="pill">{member.attendance}%</span>
                    )}
                  </td>
                  {role === 'admin' && (
                    <td>
                      <button onClick={() => handleDeleteMember(member.teamId, member.cellId, member.id)} className="mini-btn">
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {role === 'admin' && (
        <div className="members-upload-card">
          <label className="members-upload-btn" htmlFor="csvUploadMain">
            <span>Upload CSV</span>
          </label>
          <input id="csvUploadMain" type="file" accept=".csv" onChange={handleUploadCSV} style={{ display: 'none' }} />
        </div>
      )}
    </div>
    </section>
  );
}
