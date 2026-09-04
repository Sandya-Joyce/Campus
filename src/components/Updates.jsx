import React, { useState } from 'react';
import { FaBible, FaHeart, FaCross } from 'react-icons/fa';

export default function Updates({ updates, role, onAddUpdate }) {
  const [filter, setFilter] = useState('All');
  const [showComposer, setShowComposer] = useState(false);
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [badge, setBadge] = useState('New');
  const [category, setCategory] = useState('General');

  const categories = ['All', ...new Set((updates || []).map((u) => u.category).filter(Boolean))];
  const filtered = filter === 'All' ? updates : updates.filter((u) => u.category === filter);

  const handlePublish = (event) => {
    event.preventDefault();
    if (!title.trim() || !detail.trim()) return;

    onAddUpdate?.({
      title: title.trim(),
      detail: detail.trim(),
      badge: badge.trim() || 'New',
      category: category.trim() || 'General',
    });

    setTitle('');
    setDetail('');
    setBadge('New');
    setCategory('General');
    setShowComposer(false);
  };

  return (
    <section className="panel">
      <div className="panel-header">
        <div className="panel-heading-stack">
          <div className="section-icon-badge"><FaBible /></div>
          <div>
            <p className="eyebrow">Campus module</p>
            <h3>Updates</h3>
            <p className="panel-subtitle">{role === 'admin' ? 'Publish and review campus announcements.' : 'View announcements from admin in a read-only feed.'}</p>
          </div>
        </div>
        <div className="panel-actions">
          {role === 'admin' ? (
            <button className="ghost-btn" onClick={() => setShowComposer((prev) => !prev)}>
              {showComposer ? 'Close composer' : 'Publish update'}
            </button>
          ) : (
            <span className="read-only-pill">Read only</span>
          )}
        </div>
      </div>

      {role === 'admin' && showComposer && (
        <form className="members-add-card" onSubmit={handlePublish} style={{ marginBottom: 16 }}>
          <h4 style={{ marginTop: 0 }}>Create announcement</h4>
          <div className="members-inline-form" style={{ marginBottom: 8 }}>
            <input className="members-input" placeholder="Update title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input className="members-input" placeholder="Badge" value={badge} onChange={(e) => setBadge(e.target.value)} />
            <input className="members-input" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <textarea
            className="members-input"
            placeholder="Share details"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            rows={3}
            style={{ width: '100%', resize: 'vertical', marginBottom: 8 }}
          />
          <button className="ghost-btn" type="submit">Publish</button>
        </form>
      )}

      <div className="filter-row">
        {categories.map((f) => (
          <button key={f} type="button" className={filter === f ? 'filter-chip active' : 'filter-chip'} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      <div className="stack-list">
        {filtered.map((item) => (
          <div className="list-item" key={item.id || item.title}>
            <div className="list-item-main">
              <div className="list-item-icon">{item.category === 'Worship' ? <FaCross /> : <FaHeart />}</div>
              <div>
                <h4>{item.title}</h4>
                <p>{item.detail}</p>
              </div>
            </div>
            <span className="pill">{item.badge}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
