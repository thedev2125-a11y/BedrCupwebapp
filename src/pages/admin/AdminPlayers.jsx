import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import DataTable from '../../components/admin/DataTable';
import FormModal from '../../components/admin/FormModal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { TextField, SelectField } from '../../components/admin/FormFields';
import SearchBar from '../../components/common/SearchBar';
import Button from '../../components/common/Button';
import { useData } from '../../hooks/useData';
import { useToast } from '../../hooks/useToast';

const POSITION_OPTIONS = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'].map((p) => ({ value: p, label: p }));

const EMPTY_FORM = { name: '', teamId: '', position: 'Midfielder', jerseyNumber: '' };

export default function AdminPlayers() {
  const { teams, playersWithStats, addPlayer, updatePlayer, deletePlayer } = useData();
  const { success, error: toastError } = useToast();

  const teamOptions = teams.map((t) => ({ value: t.id, label: `${t.name} (Group ${t.group})` }));
  const teamNameById = useMemo(() => new Map(teams.map((t) => [t.id, t.name])), [teams]);

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = playersWithStats.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || (teamNameById.get(p.teamId) || '').toLowerCase().includes(search.toLowerCase())
  );

  function openAdd() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, teamId: teams[0]?.id || '' });
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(player) {
    setEditingId(player.id);
    setForm({ name: player.name, teamId: player.teamId, position: player.position, jerseyNumber: player.jerseyNumber || '' });
    setErrors({});
    setModalOpen(true);
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Player name is required.';
    if (!form.teamId) e.teamId = 'Assign the player to a team.';
    return e;
  }

  function handleSubmit() {
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;
    setIsSaving(true);
    try {
      if (editingId) {
        updatePlayer(editingId, form);
        success('Player updated.');
      } else {
        addPlayer(form);
        success('Player added.');
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
      deletePlayer(deleteTarget.id);
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
        title="Players"
        subtitle="Manage player rosters. Goals and cards are recorded per-match under Results."
        action={
          <Button icon={Plus} onClick={openAdd}>
            Add Player
          </Button>
        }
      />

      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search players or teams..." />
      </div>

      <DataTable
        columns={[
          { key: 'name', label: 'Player' },
          { key: 'team', label: 'Team' },
          { key: 'position', label: 'Position' },
          { key: 'jerseyNumber', label: '#' },
          { key: 'goals', label: 'Goals' },
        ]}
        rows={filtered}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        emptyMessage="No players found."
      />

      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        isSaving={isSaving}
        title={editingId ? 'Edit Player' : 'Add Player'}
      >
        <TextField
          label="Player Name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors.name}
        />
        <SelectField
          label="Team"
          required
          options={teamOptions}
          value={form.teamId}
          onChange={(e) => setForm({ ...form, teamId: e.target.value })}
          error={errors.teamId}
        />
        <SelectField
          label="Position"
          options={POSITION_OPTIONS}
          value={form.position}
          onChange={(e) => setForm({ ...form, position: e.target.value })}
        />
        <TextField
          label="Jersey Number"
          type="number"
          min="1"
          max="99"
          value={form.jerseyNumber}
          onChange={(e) => setForm({ ...form, jerseyNumber: e.target.value })}
        />
      </FormModal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete this player?"
        message={`${deleteTarget?.name || 'This player'} will also be removed from any recorded goals, cards, or Man of the Match awards.`}
      />
    </div>
  );
}
