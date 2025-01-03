


import { useState, useEffect, useContext } from "react";
import { Users, User, ArrowRight, Search, Activity, Sparkles, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import api from '../api.js';
import { AuthContext } from "../AuthContext.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [joinRequestStatus, setJoinRequestStatus] = useState({});
  const [buttonStates, setButtonStates] = useState({});

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const getAllClubs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/club', {
        credentials: 'include'
      });
      const data = await response.json();
      setClubs(data);
    } catch (error) {
      console.error("Error fetching clubs:", error);
      toast.error("Failed to load clubs. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const getUserIdfromMail = async (email) => {
    try {
      const response = await api.get('/auth/get-user-details');
      return response.data?.user._id || null;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  };

  useEffect(() => {
    getAllClubs();
  }, []);

  useEffect(() => {
    const updateButtonStates = async () => {
      if (!user || !clubs.length) return;

      const userId = await getUserIdfromMail(user?.email);
      const states = {};

      for (const club of clubs) {
        const status = joinRequestStatus[club._id];
        
        if (status === 'pending') {
          states[club._id] = {
            text: 'Sending Request...',
            disabled: true,
            className: 'bg-gray-400'
          };
        } else if (status === 'success') {
          states[club._id] = {
            text: 'Request Sent',
            disabled: true,
            className: 'bg-green-500'
          };
        } else if (club.clubMembers?.some(member => member._id === userId)) {
          states[club._id] = {
            text: 'Member',
            disabled: true,
            className: 'bg-green-500'
          };
        } else {
          states[club._id] = {
            text: 'Join Club',
            disabled: false,
            className: 'bg-blue-600 hover:bg-blue-700'
          };
        }
      }

      setButtonStates(states);
    };

    updateButtonStates();
  }, [clubs, user, joinRequestStatus]);

  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClubClick = (clubId) => {
    navigate(`/club/${clubId}`);
  };

  const getJoinButtonState = (clubId) => {
    return buttonStates[clubId] || {
      text: 'Join Club',
      disabled: false,
      className: 'bg-blue-600 hover:bg-blue-700'
    };
  };

  const handleJoinLogic = async (clubId, event) => {
    event.stopPropagation();
    
    if (!user) {
      navigate('/login');
      return;
    }

    const club = clubs.find(c => c._id === clubId);
    const userId = await getUserIdfromMail(user.email);

    if (club.clubMembers?.some(member => member._id === userId)) {
      toast.info("You are already a member of this club!");
      return;
    }

    try {
      setJoinRequestStatus(prev => ({
        ...prev,
        [clubId]: 'pending'
      }));

      const response = await api.post(`/club/${clubId}/join-request`, {
        userId
      });

      if (response.data.success) {
        setJoinRequestStatus(prev => ({
          ...prev,
          [clubId]: 'success'
        }));
        toast.success("Join request sent successfully!");
      }
    } catch (error) {
      console.error('Error sending join request:', error);
      if (error.response?.status === 409) {
        setJoinRequestStatus(prev => ({
          ...prev,
          [clubId]: 'error'
        }));
        toast.warning("You have already sent a join request to this club.");
      } else {
        const errorMessage = error.response?.data?.message || 'Failed to send join request';
        setJoinRequestStatus(prev => ({
          ...prev,
          [clubId]: 'error'
        }));
        toast.error(errorMessage);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 animate-pulse">Discovering amazing clubs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center mb-16">
          <div className="flex items-center gap-3 mb-4 relative">
            <Sparkles className="w-8 h-8 text-blue-600 animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Campus Clubs
            </h1>
          </div>
          <p className="text-gray-600 mb-12 text-center max-w-2xl text-lg">
            Discover extraordinary communities, forge lasting friendships, and make your campus journey unforgettable
          </p>
          <div className="relative w-full max-w-2xl group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search clubs by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-5 rounded-2xl border-2 border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-lg bg-white/70 backdrop-blur-sm"
            />
          </div>
        </div>

        {filteredClubs.length === 0 ? (
          <div className="text-center text-gray-500 py-16 bg-white/50 backdrop-blur-sm rounded-2xl">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-xl">No clubs found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredClubs.map((club, index) => (
              <div
                key={index}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleClubClick(club._id)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={`http://localhost:3000/${club.clubLogo.replace(/\\/g, '/')}`}
                    alt={`${club.name} banner`}
                    className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-90"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h2 className="text-2xl font-bold text-white mb-3">{club.name}</h2>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center text-white/90 backdrop-blur-sm bg-black/20 px-3 py-1 rounded-full">
                        <Users className="h-4 w-4 mr-2" />
                        <span className="text-sm">{club.clubMembers?.length || 0} members</span>
                      </div>
                      {club.isActive && (
                        <span className="px-3 py-1 rounded-full bg-green-500/30 backdrop-blur-sm text-green-400 text-sm font-medium">
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <p className="text-gray-600 mb-8 line-clamp-3 text-lg">
                    {club.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="h-5 w-5" />
                      <div className="flex flex-col">
                        <span className="text-gray-400">Club Admin</span>
                        <span className="font-medium text-gray-700">
                          {club.clubLeadId?.name || "No lead assigned"}
                        </span>
                      </div>
                    </div>
                    
                    <button 
                      className={`flex items-center px-6 py-3 text-white rounded-xl transition-all duration-300 transform hover:scale-105 group relative overflow-hidden ${getJoinButtonState(club._id).className}`}
                      onClick={(e) => handleJoinLogic(club._id, e)}
                      disabled={getJoinButtonState(club._id).disabled}
                    >
                      <span className="relative z-10">{getJoinButtonState(club._id).text}</span>
                      <ArrowRight className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform relative z-10" />
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Clubs;