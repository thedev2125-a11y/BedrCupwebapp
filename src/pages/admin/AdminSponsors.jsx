import { useState } from 'react';
import { Plus } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import DataTable from '../../components/admin/DataTable';
import FormModal from '../../components/admin/FormModal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { TextField, TextareaField, SelectField } from '../../components/admin/FormFields';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useData } from '../../hooks/useData';
import { useToast } from '../../hooks/useToast';

const TIER_OPTIONS = [
  { value: 'gold', label: 'Gold' },
  { value: 'silver', label: 'Silver' },
  { value: 'bronze', label: 'Bronze' },
];
const TIER_TONE = { gold: 'gold', silver: 'neutral', bronze: 'neutral' };
const EMPTY_FORM = { name: '', tier: 'gold', logoInitials: '', description: '' };

export default function AdminSponsors() {
  const { sponsors, addSponsor, updateSponsor, deleteSponsor } = useData();
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

  function openEdit(sponsor) {
    setEditingId(sponsor.id);
    setForm({ name: sponsor.name, tier: sponsor.tier, logoInitials: sponsor.logoInitials || '', description: sponsor.description || '' });
    setErrors({});
    setModalOpen(true);
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Sponsor name is required.';
    return e;
  }

  function handleSubmit() {
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;
    setIsSaving(true);
    try {
      if (editingId) {
        updateSponsor(editingId, form);
        success('Sponsor updated.');
      } else {
        addSponsor(form);
        success('Sponsor added.');
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
      deleteSponsor(deleteTarget.id);
      success('Sponsor removed.');
    } catch (err) {
      toastError(err.message);
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Sponsors"
        subtitle="Manage sponsors shown on the public Sponsors page."
        action={
          <Button icon={Plus} onClick={openAdd}>
            Add Sponsor
          </Button>
        }
      />

      <DataTable
        columns={[
          { key: 'name', label: 'Sponsor' },
          { key: 'tier', label: 'Tier', render: (s) => <Badge tone={TIER_TONE[s.tier]}>{s.tier}</Badge> },
          { key: 'description', label: 'Description' },
        ]}
        rows={sponsors}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        emptyMessage="No sponsors yet."
      />

      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        isSaving={isSaving}
        title={editingId ? 'Edit Sponsor' : 'Add Sponsor'}
      >
        <TextField label="Sponsor Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
        <SelectField label="Tier" options={TIER_OPTIONS} value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value })} />
        <TextField
          label="Logo Initials"
          maxLength={3}
          value={form.logoInitials}
          onChange={(e) => setForm({ ...form, logoInitials: e.target.value.toUpperCase() })}
        />
        <TextareaField label="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </FormModal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete this sponsor?"
        message="This sponsor will be permanently removed from the Sponsors page."
      />
    </div>
  );
}
