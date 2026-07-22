import { useMemo, useState } from 'react';
import { ArrowLeft, Trash2, Plus, Goal, Square } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import DataTable from '../../components/admin/DataTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { SelectField, TextField } from '../../components/admin/FormFields';
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

export default function AdminResults() {
  const { fixtures, fixturesDisplay, players, teams } = useData();
  const [selectedId, setSelectedId] = useState(null);
  const [clearTarget, setClearTarget] = useState(null);
  const { success } = useToast();
  const { clearResult } = useData();

  const selected = fixtures.find((f) => f.id === selectedId);
  const selectedDisplay = fixturesDisplay.find((f) => f.id === selectedId);

  const rows = [...fixturesDisplay].sort((a, b) => (a.rawDate < b.rawDate ? 1 : -1));

  if (selected && selectedDisplay) {
    return (
      <ResultEditor
        fixture={selected}
        display={selectedDisplay}
        players={players}
        teams={teams}
        onBack={() => setSelectedId(null)}
      />
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Results"
        subtitle="Select a match to enter its score, goal scorers, cards, and Man of the Match."
      />

      <DataTable
        columns={[
          { key: 'round', label: 'Round' },
          { key: 'matchup', label: 'Matchup', render: (f) => `${f.homeTeam.name} vs ${f.awayTeam.name}` },
          { key: 'date', label: 'Date' },
          {
            key: 'score',
            label: 'Score',
            render: (f) => (f.status === 'upcoming' ? '—' : `${f.homeScore ?? '-'} : ${f.awayScore ?? '-'}`),
          },
          { key: 'status', label: 'Status', render: (f) => <Badge tone={STATUS_TONE[f.status]}>{f.status}</Badge> },
        ]}
        rows={rows}
        onEdit={(row) => setSelectedId(row.id)}
        emptyMessage="No matches yet — add fixtures on the Matches page first."
      />

      <ConfirmDialog
        isOpen={!!clearTarget}
        onClose={() => setClearTarget(null)}
        onConfirm={() => {
          clearResult(clearTarget.id);
          success('Result cleared — match reset to upcoming.');
          setClearTarget(null);
        }}
        title="Clear this result?"
        message="This resets the match to Upcoming and removes its score, goal scorers, cards, and Man of the Match."
        confirmLabel="Clear Result"
      />
    </div>
  );
}

function ResultEditor({ fixture, display, players, teams, onBack }) {
  const { updateScore, addGoal, removeGoal, addCard, removeCard, setMotm, clearResult } = useData();
  const { success, error: toastError } = useToast();

  const [homeScore, setHomeScore] = useState(fixture.homeScore ?? '');
  const [awayScore, setAwayScore] = useState(fixture.awayScore ?? '');
  const [status, setStatus] = useState(fixture.status);
  const [goalPlayerId, setGoalPlayerId] = useState('');
  const [cardPlayerId, setCardPlayerId] = useState('');
  const [cardType, setCardType] = useState('yellow');
  const [clearOpen, setClearOpen] = useState(false);

  const homeTeam = teams.find((t) => t.id === fixture.homeTeamId);
  const awayTeam = teams.find((t) => t.id === fixture.awayTeamId);
  const squadOptions = useMemo(
    () =>
      players
        .filter((p) => p.teamId === fixture.homeTeamId || p.teamId === fixture.awayTeamId)
        .map((p) => ({ value: p.id, label: `${p.name} (${p.teamId === fixture.homeTeamId ? homeTeam?.name : awayTeam?.name})` })),
    [players, fixture, homeTeam, awayTeam]
  );
  const playerById = useMemo(() => new Map(players.map((p) => [p.id, p])), [players]);

  function handleScoreSave(e) {
    e.preventDefault();
    updateScore(fixture.id, { homeScore, awayScore, status });
    success('Score saved.');
  }

  function handleAddGoal(e) {
    e.preventDefault();
    if (!goalPlayerId) return;
    const player = playerById.get(goalPlayerId);
    try {
      addGoal(fixture.id, { playerId: goalPlayerId, teamId: player.teamId });
      setGoalPlayerId('');
      success('Goal added.');
    } catch (err) {
      toastError(err.message);
    }
  }

  function handleAddCard(e) {
    e.preventDefault();
    if (!cardPlayerId) return;
    const player = playerById.get(cardPlayerId);
    try {
      addCard(fixture.id, { playerId: cardPlayerId, teamId: player.teamId, cardType });
      setCardPlayerId('');
      success('Card added.');
    } catch (err) {
      toastError(err.message);
    }
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-4 transition-colors"
      >
        <ArrowLeft size={15} /> Back to Results
      </button>

      <AdminPageHeader
        title={`${display.homeTeam.name} vs ${display.awayTeam.name}`}
        subtitle={`${display.round} · ${display.date} · ${display.time}`}
        action={
          <Button
            variant="outline"
            className="!text-red-600 !border-red-300 dark:!text-red-400 dark:!border-red-500/40"
            onClick={() => setClearOpen(true)}
          >
            Clear Result
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score & status */}
        <Card hover={false} className="p-6">
          <h3 className="font-display text-lg text-ink dark:text-chalk-50 mb-4">Score &amp; Status</h3>
          <form onSubmit={handleScoreSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <TextField label={homeTeam?.name || 'Home'} type="number" min="0" value={homeScore} onChange={(e) => setHomeScore(e.target.value)} />
              <TextField label={awayTeam?.name || 'Away'} type="number" min="0" value={awayScore} onChange={(e) => setAwayScore(e.target.value)} />
            </div>
            <SelectField label="Match Status" options={STATUS_OPTIONS} value={status} onChange={(e) => setStatus(e.target.value)} />
            <Button type="submit" className="w-full justify-center">
              Save Score
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-black/[0.06] dark:border-white/[0.08]">
            <SelectField
              label="Man of the Match"
              placeholder="None selected"
              options={squadOptions}
              value={fixture.motmPlayerId || ''}
              onChange={(e) => setMotm(fixture.id, e.target.value || null)}
            />
          </div>
        </Card>

        {/* Goal scorers */}
        <Card hover={false} className="p-6">
          <h3 className="font-display text-lg text-ink dark:text-chalk-50 mb-4 flex items-center gap-2">
            <Goal size={18} className="text-emerald-600 dark:text-emerald-400" /> Goal Scorers
          </h3>
          <form onSubmit={handleAddGoal} className="flex gap-2 mb-4">
            <div className="flex-1">
              <SelectField placeholder="Select scorer" options={squadOptions} value={goalPlayerId} onChange={(e) => setGoalPlayerId(e.target.value)} />
            </div>
            <Button type="submit" icon={Plus} className="shrink-0 h-[42px]">
              Add
            </Button>
          </form>
          <div className="space-y-2">
            {fixture.goals.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">No goals recorded yet.</p>}
            {fixture.goals.map((g) => {
              const player = playerById.get(g.playerId);
              return (
                <div key={g.id} className="flex items-center justify-between gap-2 rounded-lg bg-black/[0.03] dark:bg-white/[0.04] px-3 py-2">
                  <span className="text-sm text-ink dark:text-chalk-50">{player?.name || 'Unknown player'}</span>
                  <button onClick={() => removeGoal(fixture.id, g.id)} className="text-slate-400 hover:text-red-600 dark:hover:text-red-400">
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Cards */}
        <Card hover={false} className="p-6 lg:col-span-2">
          <h3 className="font-display text-lg text-ink dark:text-chalk-50 mb-4 flex items-center gap-2">
            <Square size={16} className="text-gold-500" /> Yellow &amp; Red Cards
          </h3>
          <form onSubmit={handleAddCard} className="grid grid-cols-1 sm:grid-cols-[1fr_140px_auto] gap-2 mb-4">
            <SelectField placeholder="Select player" options={squadOptions} value={cardPlayerId} onChange={(e) => setCardPlayerId(e.target.value)} />
            <SelectField
              options={[
                { value: 'yellow', label: 'Yellow Card' },
                { value: 'red', label: 'Red Card' },
              ]}
              value={cardType}
              onChange={(e) => setCardType(e.target.value)}
            />
            <Button type="submit" icon={Plus} className="shrink-0 h-[42px]">
              Add
            </Button>
          </form>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {fixture.cards.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">No cards recorded yet.</p>}
            {fixture.cards.map((c) => {
              const player = playerById.get(c.playerId);
              return (
                <div key={c.id} className="flex items-center justify-between gap-2 rounded-lg bg-black/[0.03] dark:bg-white/[0.04] px-3 py-2">
                  <span className="flex items-center gap-2 text-sm text-ink dark:text-chalk-50">
                    <Square size={11} className={c.cardType === 'red' ? 'text-red-500' : 'text-gold-500'} fill="currentColor" />
                    {player?.name || 'Unknown player'}
                  </span>
                  <button onClick={() => removeCard(fixture.id, c.id)} className="text-slate-400 hover:text-red-600 dark:hover:text-red-400">
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <ConfirmDialog
        isOpen={clearOpen}
        onClose={() => setClearOpen(false)}
        onConfirm={() => {
          clearResult(fixture.id);
          success('Result cleared.');
          setClearOpen(false);
          onBack();
        }}
        title="Clear this result?"
        message="This resets the match to Upcoming and removes its score, goal scorers, cards, and Man of the Match."
        confirmLabel="Clear Result"
      />
    </div>
  );
}
