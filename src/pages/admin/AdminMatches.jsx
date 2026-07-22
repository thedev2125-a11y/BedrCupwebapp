import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import DataTable from '../../components/admin/DataTable';
import FormModal from '../../components/admin/FormModal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { TextField, SelectField } from '../../components/admin/FormFields';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { useData } from '../../hooks/useData';
import { useToast } from '../../hooks/useToast';

const STATUS_OPTIONS = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'live', label: 'Live' },
  { value: 'completed', label: 'Completed' },
];
const STATUS_TONE = { live: 'live', upcoming: 'upcoming', completed: 'completed' };

const EMPTY_FORM = {
  round: '',
  date: '',
  time: '3:00 PM',
  venue: 'Village Community Pitch',
  status: 'upcoming',
  homeTeamId: '',
  awayTeamId: '',
};

export default function AdminMatches() {
  const {
    teams,
    fixturesDisplay,
    addFixture,
    updateFixture,
    deleteFixture,
    byeAnnouncements,
    addByeAnnouncement,
    deleteByeAnnouncement,
  } = useData();
  const { success, error: toastError } = useToast();

  const teamOptions = teams.map((t) => ({ value: t.id, label: `${t.name} (Group ${t.group})` }));

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [byeForm, setByeForm] = useState({ round: '', teamId: '', note: '' });
  const [byeError, setByeError] = useState('');

  function openAdd() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, homeTeamId: teams[0]?.id || '', awayTeamId: teams[1]?.id || '' });
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(fixture) {
    setEditingId(fixture.id);
    setForm({
      round: fixture.round,
      date: fixture.rawDate,
      time: fixture.time,
      venue: fixture.venue,
      status: fixture.status,
      homeTeamId: fixture.homeTeam.id,
      awayTeamId: fixture.awayTeam.id,
    });
    setErrors({});
    setModalOpen(true);
  }

  function validate() {
    const e = {};
    if (!form.round.trim()) e.round = 'Round is required.';
    if (!form.date) e.date = 'Date is required.';
    if (!form.homeTeamId) e.homeTeamId = 'Select a home team.';
    if (!form.awayTeamId) e.awayTeamId = 'Select an away team.';
    if (form.homeTeamId && form.homeTeamId === form.awayTeamId) e.awayTeamId = 'Must differ from the home team.';
    return e;
  }

  function handleSubmit() {
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;
    setIsSaving(true);
    try {
      if (editingId) {
        updateFixture(editingId, form);
        success('Fixture updated.');
      } else {
        addFixture(form);
        success('Fixture added.');
      }
      setModalOpen(false);
    } catch (err) {
      toastError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  function handleDelete() {
    try {
      deleteFixture(deleteTarget.id);
      success('Fixture deleted.');
    } catch (err) {
      toastError(err.message);
    } finally {
      setDeleteTarget(null);
    }
  }

  function handleAddBye(e) {
    e.preventDefault();
    setByeError('');
    if (!byeForm.round.trim() || !byeForm.teamId) {
      setByeError('Round and team are both required.');
      return;
    }
    try {
      addByeAnnouncement(byeForm);
      setByeForm({ round: '', teamId: '', note: '' });
      success('Bye announcement added.');
    } catch (err) {
      toastError(err.message);
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Matches"
        subtitle="Create and manage fixtures. Enter scores and match-day details on the Results page."
        action={
          <Button icon={Plus} onClick={openAdd}>
            Add Fixture
          </Button>
        }
      />

      <DataTable
        columns={[
          { key: 'round', label: 'Round' },
          { key: 'matchup', label: 'Matchup', render: (f) => `${f.homeTeam.name} vs ${f.awayTeam.name}` },
          { key: 'date', label: 'Date' },
          { key: 'time', label: 'Time' },
          { key: 'status', label: 'Status', render: (f) => <Badge tone={STATUS_TONE[f.status]}>{f.status}</Badge> },
        ]}
        rows={fixturesDisplay}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        emptyMessage="No fixtures yet — add the first one."
      />

      <section className="mt-10">
        <h2 className="font-display text-lg tracking-wide text-ink dark:text-chalk-50 mb-3">Bye Team Announcements</h2>
        <Card hover={false} className="p-5 mb-4">
          <form onSubmit={handleAddBye} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end">
            <TextField
              label="Round"
              placeholder="Round 4"
              value={byeForm.round}
              onChange={(e) => setByeForm({ ...byeForm, round: e.target.value })}
            />
            <SelectField
              label="Team sitting out"
              placeholder="Select team"
              options={teamOptions}
              value={byeForm.teamId}
              onChange={(e) => setByeForm({ ...byeForm, teamId: e.target.value })}
            />
            <TextField label="Note (optional)" value={byeForm.note} onChange={(e) => setByeForm({ ...byeForm, note: e.target.value })} />
            <Button type="submit" className="h-[42px]">
              Add
            </Button>
          </form>
          {byeError && <p className="text-xs font-medium text-red-600 dark:text-red-400 mt-2">{byeError}</p>}
        </Card>

        {byeAnnouncements.length > 0 && (
          <div className="space-y-2">
            {byeAnnouncements.map((b) => {
              const team = teams.find((t) => t.id === b.teamId);
              return (
                <Card hover={false} key={b.id} className="p-4 flex items-center justify-between gap-3">
                  <div className="text-sm text-ink dark:text-chalk-50">
                    <span className="font-semibold">{b.round}</span> — {team?.name || 'Unknown team'} has a bye
                    {b.note && <span className="text-slate-500 dark:text-slate-400"> · {b.note}</span>}
                  </div>
                  <button
                    onClick={() => deleteByeAnnouncement(b.id)}
                    aria-label="Remove"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors shrink-0"
                  >
                    <Trash2 size={15} />
                  </button>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        isSaving={isSaving}
        title={editingId ? 'Edit Fixture' : 'Add Fixture'}
      >
        <TextField label="Round" required placeholder="Round 1" value={form.round} onChange={(e) => setForm({ ...form, round: e.target.value })} error={errors.round} />
        <div className="grid grid-cols-2 gap-3">
          <TextField label="Date" type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} error={errors.date} />
          <TextField label="Time" placeholder="3:00 PM" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
        </div>
        <TextField label="Venue" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} />
        <div className="grid grid-cols-2 gap-3">
          <SelectField
            label="Home Team"
            required
            options={teamOptions}
            placeholder="Select team"
            value={form.homeTeamId}
            onChange={(e) => setForm({ ...form, homeTeamId: e.target.value })}
            error={errors.homeTeamId}
          />
          <SelectField
            label="Away Team"
            required
            options={teamOptions}
            placeholder="Select team"
            value={form.awayTeamId}
            onChange={(e) => setForm({ ...form, awayTeamId: e.target.value })}
            error={errors.awayTeamId}
          />
        </div>
        <SelectField label="Status" options={STATUS_OPTIONS} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} />
      </FormModal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete this fixture?"
        message="Any recorded score, goals, and cards for this match will also be removed."
      />
    </div>
  );
}
