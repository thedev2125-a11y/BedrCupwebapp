import { createContext, useState } from 'react';

export const TournamentContext = createContext(null);

/**
 * Holds cross-page tournament UI state: search terms and active filters
 * used by the Teams, Players, Fixtures and News pages.
 *
 * NOTE: the actual tournament data (teams, players, fixtures, results, etc.)
 * is loaded from the JSON files in src/data/ once they're built in a later
 * step. This context only tracks interactive UI state, not the dataset itself.
 */
export function TournamentProvider({ children }) {
  const [teamSearch, setTeamSearch] = useState('');
  const [playerSearch, setPlayerSearch] = useState('');
  const [fixtureFilter, setFixtureFilter] = useState('all'); // all | upcoming | live | completed
  const [newsFilter, setNewsFilter] = useState('all');

  const value = {
    teamSearch,
    setTeamSearch,
    playerSearch,
    setPlayerSearch,
    fixtureFilter,
    setFixtureFilter,
    newsFilter,
    setNewsFilter,
  };

  return (
    <TournamentContext.Provider value={value}>
      {children}
    </TournamentContext.Provider>
  );
}
