'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SpotifyApi } from '@/lib/spotify';
import { ArtistTab } from '@/components/tabs/ArtistTab';
import { PlaylistTab } from '@/components/tabs/PlaylistTab';
import { GenresTab } from '@/components/tabs/GenresTab';
import { ProfileTab } from '@/components/tabs/ProfileTab';

type TabType = 'artists' | 'playlists' | 'genres' | 'profile';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('artists');
  const [spotifyApi, setSpotifyApi] = useState<SpotifyApi | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }

    if (session.accessToken) {
      setSpotifyApi(new SpotifyApi(session.accessToken));
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-spotify-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!session || !spotifyApi) {
    return null;
  }

  const tabs = [
    { id: 'artists' as TabType, label: 'Artists', icon: '🎤' },
    { id: 'playlists' as TabType, label: 'Playlists', icon: '🎵' },
    { id: 'genres' as TabType, label: 'Genres', icon: '🎶' },
    { id: 'profile' as TabType, label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="min-h-screen bg-spotify-black">
      {/* Header */}
      <header className="bg-spotify-black border-b border-gray-800 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Spotify Dashboard</h1>
          <button
            onClick={() => signOut()}
            className="bg-spotify-green hover:bg-green-600 text-white px-4 py-2 rounded-full transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-gray-900 px-6 py-4">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-spotify-green text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="p-6">
        {activeTab === 'artists' && <ArtistTab spotifyApi={spotifyApi} />}
        {activeTab === 'playlists' && <PlaylistTab spotifyApi={spotifyApi} />}
        {activeTab === 'genres' && <GenresTab spotifyApi={spotifyApi} />}
        {activeTab === 'profile' && <ProfileTab spotifyApi={spotifyApi} />}
      </main>
    </div>
  );
}
