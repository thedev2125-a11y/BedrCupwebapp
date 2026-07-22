import { useContext } from 'react';
import { TournamentContext } from '../context/TournamentContext';

export function useTournament() {
  const ctx = useContext(TournamentContext);
  if (!ctx) throw new Error('useTournament must be used within a TournamentProvider');
  return ctx;
}
