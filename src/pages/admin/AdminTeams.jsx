import { useState } from 'react';
import { Plus } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import DataTable from '../../components/admin/DataTable';
import FormModal from '../../components/admin/FormModal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { TextField, SelectField } from '../../components/admin/FormFields';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useData } from '../../hooks/useData';
import { useToast } from '../../hooks/useToast';

const GROUP_OPTIONS = [
  { value: 'A', label: 'Group A' },
  { value: 'B', label: 'Group B' },
];

const EMPTY_FORM = { name: '', group: 'A', coach: '', logoInitials: '', venueNote: '' };

export default function AdminTeams() {
  const { teamsWithStats, addTeam, updateTeam, deleteTeam } = useData();
  const { success, error: toastError } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(team) {
    setEditingId(team.id);
    setForm({ name: team.name, group: team.group, coach: team.coach || '', logoInitials: team.logoInitials || '', venueNote: team.venueNote || '' });
    setErrors({});
    setModalOpen(true);
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Team name is required.';
    if (!form.group) e.group = 'Choose a group.';
    return e;
  }

  function handleSubmit() {
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;
    setIsSaving(true);
    try {
      if (editingId) {
        updateTeam(editingId, form);
        success('Team updated.');
      } else {
        addTeam(form);
        success('Team added.');
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
      deleteTeam(deleteTarget.id);
      success(`${deleteTarget.name} removed.`);
    } catch (err) {
      toastError(err.message);
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Teams"
        subtitle="Manage the ten teams competing in the tournament."
        action={
          <Button icon={Plus} onClick={openAdd}>
            Add Team
          </Button>
        }
      />

      <DataTable
        columns={[
          { key: 'name', label: 'Team' },
          { key: 'group', label: 'Group', render: (t) => <Badge tone="emerald">Group {t.group}</Badge> },
          { key: 'coach', label: 'Coach' },
          { key: 'played', label: 'P' },
          { key: 'points', label: 'Pts' },
        ]}
        rows={teamsWithStats}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        emptyMessage="No teams yet — add the first one."
      />

      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        isSaving={isSaving}
        title={editingId ? 'Edit Team' : 'Add Team'}
      >
        <TextField
          label="Team Name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors.name}
        />
        <SelectField
          label="Group"
          required
          options={GROUP_OPTIONS}
          value={form.group}
          onChange={(e) => setForm({ ...form, group: e.target.value })}
          error={errors.group}
        />
        <TextField label="Coach" value={form.coach} onChange={(e) => setForm({ ...form, coach: e.target.value })} />
        <TextField
          label="Logo Initials"
          hint="Shown in the circular badge used across the site (e.g. TH)."
          maxLength={3}
          value={form.logoInitials}
          onChange={(e) => setForm({ ...form, logoInitials: e.target.value.toUpperCase() })}
        />
        <TextField label="Home Venue Note" value={form.venueNote} onChange={(e) => setForm({ ...form, venueNote: e.target.value })} />
      </FormModal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete this team?"
        message={`This also removes ${deleteTarget?.name || 'this team'}'s players and any fixtures involving them. This can't be undone.`}
      />
    </div>
  );
}
