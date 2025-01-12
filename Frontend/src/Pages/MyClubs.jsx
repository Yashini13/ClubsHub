import { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Users, Trophy } from "lucide-react";

const MyClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useHistory();

  // Fetch clubs based on user authentication (from the backend)
  const getUserClubs = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get('http://localhost:3000/api/clubs', { withCredentials: true });
      setClubs(data.clubs);
      setError(null);
    } catch (error) {
      setError('Failed to load clubs. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserClubs();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="bg-red-100/80 backdrop-blur-sm border border-red-200 text-red-700 px-6 py-4 rounded-xl">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Clubs</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {clubs.length > 0 ? (
            clubs.map((club) => (
              <div key={club._id} className="group relative p-6 bg-white/80 backdrop-blur-sm rounded-3xl border border-blue-100 hover:bg-white transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity"></div>
                <div className="relative">
                  <div className="mb-6">
                    <img
                      src={`http://localhost:3000/${club.logo?.replace(/\\/g, '/')}`}
                      alt={`${club.name} Logo`}
                      className="h-40 w-40 rounded-2xl object-cover"
                    />
                    <h2 className="text-2xl font-bold text-gray-900 mt-4">{club.name}</h2>
                    <p className="text-gray-500 text-sm mt-2">{club.description}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl text-sm font-medium border border-blue-100">
                      <Users className="h-4 w-4 text-blue-600 mr-2" />
                      {club.members?.length || 0} Members
                    </span>
                    {club.isActive && (
                      <span className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl text-sm font-medium border border-green-100">
                        <Trophy className="h-4 w-4 text-green-600 mr-2" />
                        Active Club
                      </span>
                    )}
                  </div>

                  <button
                    className="mt-6 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:transform-none text-sm font-medium"
                    onClick={() => history.push(`/club/${club._id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">You are not affiliated with any clubs yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyClubs;
