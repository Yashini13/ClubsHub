// frontend/src/components/HODDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const HODDashboard = () => {
  const [pastEvents, setPastEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/api/events", {
          withCredentials: true,
        });
        setPastEvents(data.pastEvents);
        setUpcomingEvents(data.upcomingEvents);
        setError(null);
      } catch (err) {
        setError("Failed to load events. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (isLoading) {
    return <div className="text-center mt-8">Loading events...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-8">{error}</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">HOD Dashboard</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingEvents.map((event) => (
              <div key={event._id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-bold">{event.name}</h3>
                <p className="text-gray-500">{event.description}</p>
                <p className="text-blue-500 font-medium">
                  {new Date(event.date).toLocaleString()}
                </p>
                <p className="text-gray-700">{event.location}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No upcoming events.</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Past Events</h2>
        {pastEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pastEvents.map((event) => (
              <div key={event._id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-bold">{event.name}</h3>
                <p className="text-gray-500">{event.description}</p>
                <p className="text-gray-500 font-medium">
                  {new Date(event.date).toLocaleString()}
                </p>
                <p className="text-gray-700">{event.location}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No past events.</p>
        )}
      </div>
    </div>
  );
};

export default HODDashboard;
