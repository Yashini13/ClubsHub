import { useState, useEffect, useContext } from "react";
import {
  ArrowRight,
  Search,
  Activity,
  Sparkles,
  AlertCircle,
  User
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import api from "../api.js";
import { AuthContext } from "../AuthContext.jsx";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar.jsx";

const ActivityPage = () => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [joinRequestStatus, setJoinRequestStatus] = useState({});
  const [buttonStates, setButtonStates] = useState({});

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const getAllActivities = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/competitions/:id', {
      credentials: 'include'
    });
        if (!response.ok) {
    const errorText = await response.text(); // for debugging
    throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

      const data = await response.json();
        setActivities(data.competitions || []);
    } catch (error) {
      toast.error("Failed to load activities. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const getUserIdfromMail = async (email) => {
    try {
      const response = await api.get("/auth/get-user-details");
      return response.data?.user._id || null;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  };

  useEffect(() => {
    getAllActivities();
  }, []);

  const filteredActivities = activities.filter((activity) =>
    activity.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleActivityClick = (activityId) => {
    navigate(`/activity/${activityId}`);
  };

  const getJoinButtonState = (activityId) => {
    return (
      buttonStates[activityId] || {
        text: "Join Activity",
        disabled: false,
        className: "bg-blue-600 hover:bg-blue-700",
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 animate-pulse">Fetching exciting activities...</p>
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
              Campus Activities
            </h1>
          </div>
          <p className="text-gray-600 mb-12 text-center max-w-2xl text-lg">
            Explore exciting campus events, meet new people, and engage in amazing activities
          </p>
          <div className="relative w-full max-w-2xl group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search activities by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-5 rounded-2xl border-2 border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-lg bg-white/70 backdrop-blur-sm"
            />
          </div>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="text-center text-gray-500 py-16 bg-white/50 backdrop-blur-sm rounded-2xl">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-xl">No activities found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredActivities.map((activity, index) => (
              <div
                key={index}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleActivityClick(activity._id)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={`http://localhost:3000/${activity.activityBanner.replace(/\\/g, '/')}`}
                    alt={`${activity.name} banner`}
                    className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-90"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h2 className="text-2xl font-bold text-white mb-3">{activity.name}</h2>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center text-white/90 backdrop-blur-sm bg-black/20 px-3 py-1 rounded-full">
                        <Activity className="h-4 w-4 mr-2" />
                        <span className="text-sm">{activity.participants?.length || 0} participants</span>
                      </div>
                      {activity.isActive && (
                        <span className="px-3 py-1 rounded-full bg-green-500/30 backdrop-blur-sm text-green-400 text-sm font-medium">
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <p className="text-gray-600 mb-8 line-clamp-3 text-lg">
                    {activity.description}
                  </p>

                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-5 w-5 text-blue-600" />
                        <div className="flex flex-col">
                          <span className="text-gray-400">Activity Organizer</span>
                          <span className="font-medium text-gray-700">
                            {activity.organizer?.name || "No organizer assigned"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <AlertCircle className="h-5 w-5 text-purple-600" />
                        <div className="flex flex-col">
                          <span className="text-gray-400">Faculty Advisor</span>
                          <span className="font-medium text-gray-700">
                            {activity.facultyAdvisor?.name || "Not assigned"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      className={`w-full py-3 text-white rounded-2xl ${getJoinButtonState(activity._id).className}`}
                      disabled={getJoinButtonState(activity._id).disabled}
                    >
                      {getJoinButtonState(activity._id).text}
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

export default ActivityPage;
