import { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './Sidebar/Sidebar';
import { overviewStats, updates as initialUpdates, meetings, trainings, worshipServices, initialClasses, departments, reports, initialTeams } from './data';
import SectionPage from './components/SectionPage';
import Attendance from './components/Attendance';
import AttendanceAnalytics from './components/AttendanceAnalytics';
import Classes from './components/Classes';
import Updates from './components/Updates';
import Members from './components/Members';
import TrainingSection from './components/TrainingSection';

function App() {
  const [role, setRole] = useState('admin');
  const [activeSection, setActiveSection] = useState('overview');
  const [updatesList, setUpdatesList] = useState(initialUpdates);
  const [trainingList, setTrainingList] = useState(() => {
    try {
      const raw = localStorage.getItem('campus_trainings');
      return raw ? JSON.parse(raw) : trainings;
    } catch (e) {
      return trainings;
    }
  });
  const [attendanceRecords, setAttendanceRecords] = useState(() => {
    try {
      const raw = localStorage.getItem('attendance_records');
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  });
  const [classes, setClasses] = useState(() => {
    try {
      const raw = localStorage.getItem('campus_classes');
      return raw ? JSON.parse(raw) : initialClasses;
    } catch (e) {
      return initialClasses;
    }
  });
  const [teams, setTeams] = useState(() => {
    try {
      const raw = localStorage.getItem('campus_teams');
      return raw ? JSON.parse(raw) : initialTeams;
    } catch (e) {
      return initialTeams;
    }
  });
  const currentUserId = 'me';

  const handleAddUpdate = (newUpdate) => {
    setUpdatesList((prev) => [
      { id: `update-${Date.now()}`, ...newUpdate },
      ...prev,
    ]);
  };

  const markAttendance = (itemId, userId = currentUserId) => {
    setAttendanceRecords((prev) => {
      const next = { ...prev };
      if (!next[itemId]) next[itemId] = {};
      next[itemId][userId] = !next[itemId][userId];
      return next;
    });
  };

  useEffect(() => {
    try {
      localStorage.setItem('attendance_records', JSON.stringify(attendanceRecords));
    } catch (e) {
      // ignore
    }
  }, [attendanceRecords]);

  useEffect(() => {
    try {
      localStorage.setItem('campus_trainings', JSON.stringify(trainingList));
    } catch (e) {
      // ignore
    }
  }, [trainingList]);

  useEffect(() => {
    try {
      localStorage.setItem('campus_classes', JSON.stringify(classes));
    } catch (e) {
      // ignore
    }
  }, [classes]);

  useEffect(() => {
    try {
      localStorage.setItem('campus_teams', JSON.stringify(teams));
    } catch (e) {
      // ignore
    }
  }, [teams]);

  const isPresent = (itemId, userId = currentUserId) => {
    return !!(attendanceRecords[itemId] && attendanceRecords[itemId][userId]);
  };

  const exportClassCSV = (classId) => {
    const cls = classes.find((x) => x.id === classId);
    if (!cls) return;
    if (!window.confirm(`Export roster for ${cls.title}?`)) return;
    const rows = ['Class,Team,StudentID,StudentName,Email,Roll'];
    cls.teams.forEach((t) => {
      t.students.forEach((s) => rows.push(`${cls.title},${t.name},${s.id},${s.name},${s.email || ''},${s.roll || ''}`));
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cls.title.replace(/\s+/g, '_')}_roster.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const exportAllCSV = () => {
    if (!window.confirm('Export roster for ALL classes?')) return;
    const rows = ['Class,Team,StudentID,StudentName,Email,Roll'];
    classes.forEach((cls) => {
      cls.teams.forEach((t) => {
        t.students.forEach((s) => rows.push(`${cls.title},${t.name},${s.id},${s.name},${s.email || ''},${s.roll || ''}`));
      });
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all_classes_roster.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const renderContent = () => {
    if (activeSection === 'attendance') {
      return <Attendance role={role} isPresent={isPresent} markAttendance={markAttendance} />;
    }

    if (activeSection === 'attendance-analytics') {
      return <AttendanceAnalytics teams={teams} role={role} />;
    }

    if (activeSection === 'updates') {
      return <Updates updates={updatesList} role={role} onAddUpdate={handleAddUpdate} />;
    }

    if (activeSection === 'members') {
      return <Members teams={teams} role={role} onUpdateTeams={setTeams} />;
    }

    if (activeSection === 'worship') {
      return <SectionPage title="Worship Service" subtitle={role === 'admin' ? 'Manage worship schedules and Zoom details.' : 'View worship Zoom timings, replay schedule, and weekly recordings.'} items={worshipServices} role={role} actionLabel="Open worship" allowManage={false} />;
    }

    if (activeSection === 'meetings') {
      return <SectionPage title="Meeting Schedules" subtitle={role === 'admin' ? 'Schedule and manage meetings for faculty and departments.' : 'View your upcoming meetings, agenda, and location.'} items={meetings} role={role} actionLabel="Schedule meeting" onAction={(id) => markAttendance(id)} />;
    }

    if (activeSection === 'trainings') {
      return <TrainingSection trainings={trainingList} role={role} onUpdateTrainings={setTrainingList} />;
    }

    if (activeSection === 'classes') {
      return <Classes classes={classes} role={role} onExportClass={exportClassCSV} onExportAll={exportAllCSV} />;
    }

    if (activeSection === 'departments') {
      return <SectionPage title="Departments" subtitle={role === 'admin' ? 'Manage departmental structure and academic teams.' : 'View department information and assigned staff or students.'} items={departments} role={role} actionLabel="Manage departments" />;
    }

    if (activeSection === 'reports') {
      return <SectionPage title="Reports" subtitle={role === 'admin' ? 'Review campus-wide reports and operational insights.' : 'View your personal attendance and training reports only.'} items={reports} role={role} actionLabel="Generate report" allowManage={role === 'admin'} />;
    }

    const summaryStats = overviewStats.map((stat) => {
      if (stat.title === 'Updates') {
        return { ...stat, value: updatesList.length.toString(), detail: `${updatesList.length} announcements live` };
      }
      if (stat.title === 'Training') {
        return { ...stat, value: trainingList.length.toString(), detail: `${trainingList.length} sessions planned` };
      }
      return stat;
    });

    return (
      <div className="dashboard">
        <section className="hero-card">
          <div>
            <p className="eyebrow">Mathhias Tribe Hyderabad Region</p>
            <div className="faith-badges">
              <span>✝️ Faith First</span>
              <span>📖 Scripture</span>
              <span>🌿 Grace & Peace</span>
            </div>
            <h1>{role === 'admin' ? 'Faith-filled ministry operations, beautifully organized.' : 'Welcome back. Your church family summary is ready.'}</h1>
            <p>{role === 'admin' ? 'Admins manage worship schedules, updates, members, and ministry plans while leaders and members stay connected in grace and unity.' : 'You can review worship updates, church schedules, ministry groups, and member information with a peaceful, faith-centered view.'}</p>
            <div className="verse-block">
              <span className="verse-icon">📜</span>
              <p>“Be strong and courageous. Do not be afraid; for the Lord your God will be with you wherever you go.”</p>
              <strong>Joshua 1:9</strong>
            </div>
            <div className="hero-actions">
              <button onClick={() => setActiveSection('attendance')}>{role === 'admin' ? 'Open attendance' : 'View attendance'}</button>
              <button className="secondary" onClick={() => setActiveSection('updates')}>{role === 'admin' ? 'View updates' : 'See updates'}</button>
            </div>
          </div>
          <div className="hero-panel">
            <div className="verse-sticker">✨ Daily Blessing</div>
            <h3>{role === 'admin' ? 'Ministry control center' : 'Church family view'}</h3>
            <ul>
              <li>{role === 'admin' ? 'Manage ministry-wide data' : 'Access your personal church summary'}</li>
              <li>{role === 'admin' ? 'Publish faith updates for everyone' : 'Read announcements from leadership'}</li>
              <li>{role === 'admin' ? 'Track worship schedules and member care' : 'Review your groups and spiritual updates'}</li>
            </ul>
          </div>
        </section>

        <section className="stats-grid">
          {summaryStats.map((stat) => (
            <article className="stat-card" key={stat.title}>
              <h4>{stat.title}</h4>
              <strong>{stat.value}</strong>
              <p>{stat.detail}</p>
            </article>
          ))}
        </section>

        <section className="section-grid">
          <SectionPage title="Recent Updates" subtitle="The latest campus announcements for all users." items={updatesList.slice(0, 2)} role={role} actionLabel="Publish update" />
          <SectionPage title="Worship Service" subtitle="Zoom link, live timings, and weekly replay schedule." items={worshipServices} role={role} actionLabel="Open worship" allowManage={false} />
          <SectionPage title="Upcoming Meetings" subtitle="Important sessions and review meetings for the week." items={meetings} role={role} actionLabel="Schedule meeting" />
          <TrainingSection trainings={trainingList} role={role} onUpdateTrainings={setTrainingList} />
          <SectionPage title="Departments" subtitle="Track academic departments and their current activity." items={departments.slice(0, 2)} role={role} actionLabel="Manage departments" />
        </section>
      </div>
    );
  };

  return (
    <div className="app-shell">
      <Sidebar activeSection={activeSection} onSelect={setActiveSection} role={role} />
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-title">
            <p className="eyebrow">Mathhias Hyderabad · Light of Zion</p>
            <h2>
              {role === 'admin' ? 'Welcome to the Mathhias Tribe Ministry Dashboard' : 'Welcome to your church family portal'}
              <span className="title-sticker">☀️</span>
            </h2>
          </div>
          <div className="role-switch" role="tablist" aria-label="User role switch">
            <button className={role === 'admin' ? 'active' : ''} onClick={() => setRole('admin')}>Admin</button>
            <button className={role === 'user' ? 'active' : ''} onClick={() => setRole('user')}>User</button>
          </div>
        </header>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
