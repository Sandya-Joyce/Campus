export const overviewStats = [
  { title: 'Attendance', value: '94%', detail: 'Present today' },
  { title: 'Updates', value: '12', detail: 'New announcements' },
  { title: 'Meetings', value: '6', detail: 'Scheduled this week' },
  { title: 'Training', value: '3', detail: 'Upcoming sessions' },
];

export const updates = [
  { title: 'Exam timetable published', detail: 'Semester exams for all departments will begin next Monday.', badge: 'Exams', category: 'Exams' },
  { title: 'Annual cultural fest', detail: 'The campus fest kicks off this Thursday with live performances.', badge: 'Events', category: 'Events' },
  { title: 'Library access extended', detail: 'Students can access the library till 9 PM during finals.', badge: 'General', category: 'General' },
  { title: 'Campus maintenance', detail: 'Water supply will be paused for 30 minutes on Friday morning.', badge: 'Notice', category: 'General' },
];

export const meetings = [
  { id: 'meet-1', title: 'Faculty review', detail: '10:00 AM · Conference Hall · Agenda: Performance review', badge: 'Today' },
  { id: 'meet-2', title: 'Department heads', detail: '2:30 PM · Board Room · Agenda: Semester planning', badge: 'Tomorrow' },
];

export const trainings = [
  { id: 'train-1', title: 'AI workshop', detail: '3:00 PM · Computer Lab · Trainer: Dr. Rao', badge: 'Live', actionLabel: 'Join' },
  { id: 'train-2', title: 'Soft skills bootcamp', detail: '11:00 AM · Seminar Room · Trainer: Ms. Nisha', badge: 'Scheduled', actionLabel: 'Join' },
];

export const worshipServices = [
  {
    id: 'worship-1',
    title: 'Sunday Worship',
    detail: 'Live at 12:00 PM · Replay at 8:00 PM · Zoom: https://zoom.us/j/1234567890',
    badge: 'Weekly',
  },
  {
    id: 'worship-2',
    title: 'Monday Worship',
    detail: 'Live at 6:00 AM · Replay at 8:00 PM · Zoom: https://zoom.us/j/1234567890',
    badge: 'Weekly',
  },
  {
    id: 'worship-3',
    title: 'Wednesday Worship',
    detail: 'Live at 8:00 PM · Zoom: https://zoom.us/j/1234567890',
    badge: 'Live only',
  },
  {
    id: 'worship-4',
    title: 'Thursday Worship',
    detail: 'Live at 6:00 AM · Replay at 8:00 PM · Zoom: https://zoom.us/j/1234567890',
    badge: 'Weekly',
  },
];

export const initialClasses = [
  { id: 'class-1', title: 'Engineering', detail: 'Machine Learning · 9:00 AM · Room 204', badge: 'Active', teams: [
      { id: 'c1-t1', name: 'Team Alpha', students: [ { id: 's1', name: 'Alice', email: 'alice@campus.edu', roll: 'ENG001' }, { id: 's2', name: 'Bob', email: 'bob@campus.edu', roll: 'ENG002' } ] },
      { id: 'c1-t2', name: 'Team Beta', students: [ { id: 's3', name: 'Carlos', email: 'carlos@campus.edu', roll: 'ENG003' }, { id: 's4', name: 'Diana', email: 'diana@campus.edu', roll: 'ENG004' } ] },
    ] },
  { id: 'class-2', title: 'Business', detail: 'Marketing Strategy · 1:00 PM · Room 110', badge: 'Upcoming', teams: [
      { id: 'c2-t1', name: 'Team North', students: [ { id: 's5', name: 'Eve', email: 'eve@campus.edu', roll: 'BUS001' }, { id: 's6', name: 'Frank', email: 'frank@campus.edu', roll: 'BUS002' } ] },
    ] },
];

export const departments = [
  { title: 'Computer Science', detail: '12 faculty members · 320 students' },
  { title: 'Mechanical', detail: '8 faculty members · 180 students' },
  { title: 'Commerce', detail: '6 faculty members · 140 students' },
];

export const reports = [
  { title: 'Attendance report', detail: 'Your attendance is 86.4% this semester' },
  { title: 'Training completion', detail: 'You completed 2 of 3 assigned sessions' },
  { title: 'Upcoming classes', detail: '3 classes remain this week' },
];

export const initialTeams = [
  {
    id: 'team-1',
    name: 'Team 1',
    teamLeader: 'Martha Johnson',
    cells: [
      {
        id: 'cell-1-1',
        name: 'Cell 1',
        cellLeader: 'Daniel Green',
        members: [
          { id: 'm1', name: 'John Doe', cellGroup: 'Cell 1', address: '123 Main St', attendance: 85 },
          { id: 'm2', name: 'Jane Smith', cellGroup: 'Cell 1', address: '456 Oak Ave', attendance: 92 },
        ],
      },
      {
        id: 'cell-1-2',
        name: 'Cell 2',
        cellLeader: 'Grace Moore',
        members: [
          { id: 'm3', name: 'Mike Johnson', cellGroup: 'Cell 2', address: '789 Pine Rd', attendance: 78 },
          { id: 'm4', name: 'Sarah Lee', cellGroup: 'Cell 2', address: '321 Elm St', attendance: 88 },
        ],
      },
      {
        id: 'cell-1-3',
        name: 'Cell 3',
        cellLeader: 'Liam Scott',
        members: [
          { id: 'm5', name: 'Alex Brown', cellGroup: 'Cell 3', address: '654 Maple Dr', attendance: 90 },
        ],
      },
    ],
  },
  {
    id: 'team-2',
    name: 'Team 2',
    teamLeader: 'Sarah Wilson',
    cells: [
      {
        id: 'cell-2-1',
        name: 'Cell 1',
        cellLeader: 'Noah Kim',
        members: [
          { id: 'm6', name: 'Emily Davis', cellGroup: 'Cell 1', address: '987 Cedar Ln', attendance: 95 },
          { id: 'm7', name: 'David Wilson', cellGroup: 'Cell 1', address: '741 Birch Ct', attendance: 80 },
        ],
      },
      {
        id: 'cell-2-2',
        name: 'Cell 2',
        cellLeader: 'Ava Patel',
        members: [
          { id: 'm8', name: 'Lisa Anderson', cellGroup: 'Cell 2', address: '852 Spruce Way', attendance: 87 },
        ],
      },
    ],
  },
];
