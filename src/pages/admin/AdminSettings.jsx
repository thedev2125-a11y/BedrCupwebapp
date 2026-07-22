import { useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { TextField } from '../../components/admin/FormFields';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useData } from '../../hooks/useData';
import { useToast } from '../../hooks/useToast';

export default function AdminSettings() {
  const { settings, updateSettings, resetToDefaults } = useData();
  const { success } = useToast();
  const [form, setForm] = useState(settings);
  const [resetOpen, setResetOpen] = useState(false);

  useEffect(() => setForm(settings), [settings]);

  function handleSubmit(e) {
    e.preventDefault();
    updateSettings(form);
    success('Settings saved.');
  }

  return (
    <div>
      <AdminPageHeader title="Settings" subtitle="Tournament-wide details shown across the public site." />

      <Card hover={false} className="p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField label="Tournament Name" value={form.tournamentName} onChange={(e) => setForm({ ...form, tournamentName: e.target.value })} />
          <TextField label="Tagline" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
          <TextField label="Organizer" value={form.organizer || ''} onChange={(e) => setForm({ ...form, organizer: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <TextField label="Start Date" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            <TextField label="End Date" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          </div>
          <TextField label="Venue" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <TextField label="Contact Email" type="email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
            <TextField label="Contact Phone" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />
          </div>
          <Button type="submit">Save Settings</Button>
        </form>
      </Card>

      <Card hover={false} className="p-6 max-w-2xl mt-6 border-red-200 dark:border-red-500/20">
        <h3 className="font-display text-lg text-ink dark:text-chalk-50 mb-1.5">Reset to Sample Data</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Wipes every admin change in this browser and restores the original demo dataset. This cannot be undone.
        </p>
        <Button
          variant="outline"
          icon={RotateCcw}
          onClick={() => setResetOpen(true)}
          className="!text-red-600 !border-red-300 dark:!text-red-400 dark:!border-red-500/40"
        >
          Reset All Data
        </Button>
      </Card>

      <ConfirmDialog
        isOpen={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={() => {
          resetToDefaults();
          success('Data reset to sample defaults.');
          setResetOpen(false);
        }}
        title="Reset all tournament data?"
        message="This permanently deletes every team, player, match, news article, photo, and sponsor edit made in this browser."
        confirmLabel="Reset Everything"
      />
    </div>
  );
}
