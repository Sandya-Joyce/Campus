import React, { useEffect, useMemo, useState } from 'react';
import { FaBookReader, FaPlus, FaTrash, FaEdit, FaCalendarAlt } from 'react-icons/fa';

const emptyForm = {
  title: '',
  time: '',
  scheduleType: 'Once',
  scheduleDetails: '',
  detail: '',
};

export default function TrainingSection({ trainings = [], role, onUpdateTrainings }) {
  const [items, setItems] = useState(trainings);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    setItems(trainings);
  }, [trainings]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.time.trim()) return;

    const payload = {
      id: editingId || `training-${Date.now()}`,
      title: form.title.trim(),
      time: form.time.trim(),
      scheduleType: form.scheduleType,
      scheduleDetails: form.scheduleDetails.trim(),
      detail: form.detail.trim() || 'Faith-filled training for the ministry team.',
    };

    const next = editingId
      ? items.map((item) => (item.id === editingId ? payload : item))
      : [payload, ...items];

    setItems(next);
    onUpdateTrainings?.(next);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title || '',
      time: item.time || '',
      scheduleType: item.scheduleType || 'Once',
      scheduleDetails: item.scheduleDetails || '',
      detail: item.detail || '',
    });
  };

  const handleRemove = (id) => {
    const next = items.filter((item) => item.id !== id);
    setItems(next);
    onUpdateTrainings?.(next);
    if (editingId === id) {
      setEditingId(null);
      setForm(emptyForm);
    }
  };

  const summary = useMemo(() => {
    return `${items.length} training${items.length === 1 ? '' : 's'} planned`;
  }, [items]);

  return (
    <section className="panel">
      <div className="panel-header">
        <div className="panel-heading-stack">
          <div className="section-icon-badge"><FaBookReader /></div>
          <div>
            <p className="eyebrow">Faith & learning</p>
            <h3>Training Sessions</h3>
            <p className="panel-subtitle">Admin can add, edit, or remove training sessions anytime.</p>
          </div>
        </div>
        <div className="panel-actions">
          {role === 'admin' ? <span className="read-only-pill">Manage</span> : <span className="read-only-pill">Read only</span>}
        </div>
      </div>

      <div className="attendance-summary-card">
        <div>
          <p className="eyebrow">Training planner</p>
          <h4>{summary}</h4>
        </div>
        <div className="attendance-summary-pill">
          <strong>{items.length}</strong>
          <span>Upcoming sessions</span>
        </div>
      </div>

      {role === 'admin' && (
        <form className="members-add-card" onSubmit={handleSubmit} style={{ marginBottom: 14 }}>
          <h4 style={{ marginTop: 0 }}>{editingId ? 'Edit training' : 'Add new training'}</h4>
          <div className="members-inline-form">
            <label className="field-block">
              <span>Training name</span>
              <input className="members-input" aria-label="Training name" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Training name" />
            </label>
            <label className="field-block">
              <span>Timings</span>
              <input className="members-input" aria-label="Timings" value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} placeholder="e.g. 7:00 PM" />
            </label>
            <label className="field-block">
              <span>Date rule</span>
              <select className="members-input" aria-label="Date rule" value={form.scheduleType} onChange={(event) => setForm({ ...form, scheduleType: event.target.value })}>
                <option value="Once">Once</option>
                <option value="Daily">Daily</option>
                <option value="Custom">Custom</option>
              </select>
            </label>
          </div>
          <div className="members-inline-form" style={{ marginTop: 8 }}>
            <label className="field-block">
              <span>Date details</span>
              <input className="members-input" aria-label="Date details" value={form.scheduleDetails} onChange={(event) => setForm({ ...form, scheduleDetails: event.target.value })} placeholder="e.g. Friday, 12 July" />
            </label>
            <label className="field-block">
              <span>Details</span>
              <input className="members-input" aria-label="Details" value={form.detail} onChange={(event) => setForm({ ...form, detail: event.target.value })} placeholder="Short description" />
            </label>
          </div>
          <div className="panel-actions" style={{ marginTop: 10 }}>
            <button className="ghost-btn" type="submit">{editingId ? 'Save training' : 'Add training'}</button>
            {editingId && <button className="mini-btn" type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</button>}
          </div>
        </form>
      )}

      <div className="attendance-table-wrap">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Training</th>
              <th>Timings</th>
              <th>Schedule</th>
              <th>Details</th>
              {role === 'admin' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.title}</strong></td>
                <td>{item.time}</td>
                <td>
                  <span className="pill">{item.scheduleType}</span>
                  {item.scheduleDetails ? <div className="muted-text">{item.scheduleDetails}</div> : null}
                </td>
                <td>{item.detail}</td>
                {role === 'admin' ? (
                  <td>
                    <div className="member-action-row">
                      <button className="mini-btn" type="button" onClick={() => handleEdit(item)}><FaEdit style={{ marginRight: 6 }} />Edit</button>
                      <button className="mini-btn" type="button" onClick={() => handleRemove(item.id)}><FaTrash style={{ marginRight: 6 }} />Remove</button>
                    </div>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
