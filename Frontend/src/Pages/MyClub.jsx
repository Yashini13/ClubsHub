import { useState, useEffect, useContext } from "react";
import { Users, User, Activity, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { AuthContext } from "../AuthContext.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyClub = () => {
  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const getUserClubs = async () => {
    setIsLoading(true);
    try {
      // Use the same API approach as your Clubs.jsx component
      const response = await fetch('http://localhost:3000/api/club/user/my-clubs', {
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setClubs(data.data || []);
      } else {
        toast.error(data.message || "Failed to load your clubs");
      }
    } catch (error) {
      console.error("Error fetching user clubs:", error);
      toast.error("Failed to load your clubs. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserClubs();
  }, []);

  const handleClubClick = (clubId) => {
    navigate(`/club/${clubId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 animate-pulse">Loading your clubs...</p>
        </div>
      </div>
    );
  }

  // Render empty state
  if (!clubs || clubs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center p-6">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm max-w-md">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-blue-500" />
          <h2 className="text-2xl font-bold mb-4">No Clubs Found</h2>
          <p className="text-gray-600 mb-6">
            You're not a member of any clubs yet. Explore clubs and join ones that interest you!
          </p>
          <button
            onClick={() => navigate('/clubs')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors"
          >
            Explore Clubs
          </button>
        </div>
      </div>
    );
  }

  // Render clubs
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            My Clubs
          </h1>
          <p className="text-gray-600 mb-8 text-center max-w-2xl text-lg">
            Communities you're a part of on campus
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clubs.map((club, index) => (
            <div
              key={index}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
              onClick={() => handleClubClick(club._id)}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={`http://localhost:3000/${club.clubLogo?.replace(/\\/g, '/')}`}
                  alt={`${club.name} banner`}
                  className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = '/assets/default-club-logo.png';
                    e.target.onerror = null;
                  }}
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

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-5 w-5 text-blue-600" />
                      <div className="flex flex-col">
                        <span className="text-gray-400">Club Admin</span>
                        <span className="font-medium text-gray-700">
                          {club.clubLeadId?.name || "No lead assigned"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-5 w-5 text-purple-600" />
                      <div className="flex flex-col">
                        <span className="text-gray-400">Faculty Coordinator</span>
                        <span className="font-medium text-gray-700">
                          {club.facultyCoordinater?.name || "Not assigned"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* User role badge */}
                  <div className="mt-2">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                      {(() => {
                        // Determine user role in this club
                        if (club.clubLeadId?._id === user?._id) {
                          return "Club Admin";
                        }
                        if (club.facultyCoordinater?._id === user?._id) {
                          return "Faculty Coordinator";
                        }
                        const memberInfo = club.clubMembers?.find(member => 
                          member.student?._id === user?._id
                        );
                        return memberInfo?.role || "Member";
                      })()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyClub;