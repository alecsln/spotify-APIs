'use client';

import { useEffect, useState } from 'react';
import { SpotifyApi } from '@/lib/spotify';
import { SpotifyUser, SpotifyArtist, SpotifyTrack } from '@/types/spotify';
import Image from 'next/image';

interface ProfileTabProps {
  spotifyApi: SpotifyApi;
}

export function ProfileTab({ spotifyApi }: ProfileTabProps) {
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([]);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const [userResponse, artistsResponse] = await Promise.all([
          spotifyApi.getCurrentUser(),
          spotifyApi.getTopArtists(5),
          // Note: We'll need to add this method to SpotifyApi
          // spotifyApi.getTopTracks(5),
        ]);
        
        setUser(userResponse);
        setTopArtists(artistsResponse.items);
        // setTopTracks(tracksResponse.items);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [spotifyApi]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">Unable to load profile data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* User Profile */}
      <div className="bg-gray-900 rounded-lg p-6">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 relative rounded-full overflow-hidden">
            {user.images[0] ? (
              <Image
                src={user.images[0].url}
                alt={user.display_name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <span className="text-3xl">👤</span>
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-2">
              {user.display_name}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Email</p>
                <p className="text-white">{user.email}</p>
              </div>
              
              <div>
                <p className="text-gray-400">Followers</p>
                <p className="text-white">{user.followers.total.toLocaleString()}</p>
              </div>
              
              <div>
                <p className="text-gray-400">Country</p>
                <p className="text-white">{user.country}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Artists */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-4">Your Top Artists</h3>
        
        {topArtists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {topArtists.map((artist, index) => (
              <div
                key={artist.id}
                className="bg-gray-900 rounded-lg p-4 text-center hover:bg-gray-800 transition-colors"
              >
                <div className="w-16 h-16 relative mx-auto mb-3 rounded-full overflow-hidden">
                  {artist.images[0] ? (
                    <Image
                      src={artist.images[0].url}
                      alt={artist.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <span className="text-2xl">🎤</span>
                    </div>
                  )}
                </div>
                
                <div className="text-spotify-green font-bold text-lg mb-1">
                  #{index + 1}
                </div>
                
                <h4 className="text-white font-medium text-sm truncate">
                  {artist.name}
                </h4>
                
                <p className="text-gray-400 text-xs mt-1">
                  {artist.followers.total.toLocaleString()} followers
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-900 rounded-lg p-8 text-center">
            <p className="text-gray-400">
              No top artists data available. Listen to more music to see your favorites!
            </p>
          </div>
        )}
      </div>

      {/* Music Stats */}
      <div className="bg-gray-900 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Music Statistics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-spotify-green mb-2">
              {topArtists.length}
            </div>
            <p className="text-gray-400">Top Artists</p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-spotify-green mb-2">
              {user.followers.total}
            </div>
            <p className="text-gray-400">Followers</p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-spotify-green mb-2">
              {topArtists.reduce((acc, artist) => acc + artist.genres.length, 0)}
            </div>
            <p className="text-gray-400">Unique Genres</p>
          </div>
        </div>
      </div>
    </div>
  );
}
