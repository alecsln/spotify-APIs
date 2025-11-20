'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { SpotifyArtist } from '@/types/spotify';

interface SpotifyDataContextType {
  topArtists: SpotifyArtist[];
  followedArtists: SpotifyArtist[];
  setTopArtists: (artists: SpotifyArtist[]) => void;
  setFollowedArtists: (artists: SpotifyArtist[]) => void;
  getAllGenres: () => string[];
  getArtistsByGenre: (genre: string) => SpotifyArtist[];
}

const SpotifyDataContext = createContext<SpotifyDataContextType | undefined>(undefined);

export function SpotifyDataProvider({ children }: { children: ReactNode }) {
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([]);
  const [followedArtists, setFollowedArtists] = useState<SpotifyArtist[]>([]);

  const getAllGenres = (): string[] => {
    const allArtists = [...topArtists, ...followedArtists];
    const genreSet = new Set<string>();
    
    allArtists.forEach(artist => {
      artist.genres.forEach(genre => {
        genreSet.add(genre);
      });
    });
    
    return Array.from(genreSet).sort();
  };

  const getArtistsByGenre = (genre: string): SpotifyArtist[] => {
    const allArtists = [...topArtists, ...followedArtists];
    return allArtists.filter(artist => 
      artist.genres.some(artistGenre => 
        artistGenre.toLowerCase().includes(genre.toLowerCase())
      )
    );
  };

  return (
    <SpotifyDataContext.Provider value={{
      topArtists,
      followedArtists,
      setTopArtists,
      setFollowedArtists,
      getAllGenres,
      getArtistsByGenre,
    }}>
      {children}
    </SpotifyDataContext.Provider>
  );
}

export function useSpotifyData() {
  const context = useContext(SpotifyDataContext);
  if (context === undefined) {
    throw new Error('useSpotifyData must be used within a SpotifyDataProvider');
  }
  return context;
}
