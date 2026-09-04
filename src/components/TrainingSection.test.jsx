import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import TrainingSection from './TrainingSection';

const initialTrainings = [
  {
    id: 't1',
    title: 'Bible Study',
    time: '7:00 PM',
    scheduleType: 'Once',
    scheduleDetails: 'Friday, 12 July',
    detail: 'Join the weekly Bible study',
  },
];

function Wrapper() {
  const [trainings, setTrainings] = useState(initialTrainings);
  return <TrainingSection trainings={trainings} role="admin" onUpdateTrainings={setTrainings} />;
}

test('allows an admin to add, edit, and remove trainings', async () => {
  const user = userEvent;
  render(<Wrapper />);

  expect(screen.getByText('Bible Study')).toBeInTheDocument();

  await user.type(screen.getByLabelText(/training name/i), 'Prayer Meetup');
  await user.type(screen.getByLabelText(/timings/i), '6:30 PM');
  await user.selectOptions(screen.getByLabelText(/date rule/i), 'Daily');
  await user.type(screen.getByLabelText(/date details/i), 'Every morning');
  await user.click(screen.getByRole('button', { name: /add training/i }));

  expect(screen.getByText('Prayer Meetup')).toBeInTheDocument();

  const prayerRow = screen.getByText('Prayer Meetup').closest('tr');
  await user.click(within(prayerRow).getByRole('button', { name: /edit/i }));

  await user.clear(screen.getByLabelText(/training name/i));
  await user.type(screen.getByLabelText(/training name/i), 'Prayer Meetup Updated');
  await user.click(screen.getByRole('button', { name: /save training/i }));

  expect(screen.getByText('Prayer Meetup Updated')).toBeInTheDocument();

  const updatedRow = screen.getByText('Prayer Meetup Updated').closest('tr');
  await user.click(within(updatedRow).getByRole('button', { name: /remove/i }));

  expect(screen.queryByText('Prayer Meetup Updated')).not.toBeInTheDocument();
});
