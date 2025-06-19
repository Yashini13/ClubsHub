import React, { useState, useEffect } from 'react';

const ActivityPage = () => {
  const [activities, setActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/competitions/my-activity', {
          credentials: 'include',
        });
        const result = await response.json();

        // Ensure the data is an array
        const dataArray = Array.isArray(result)
          ? result
          : result.activities || result.activity
          ? [result.activities || result.activity]
          : [];

        setActivities(dataArray);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const filteredActivities = activities.filter((activity) =>
    activity.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div>Loading activities...</div>;
  }

  return (
    <div>
      <h1>Campus Activities</h1>
      <input
        type="text"
        placeholder="Search activities..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {filteredActivities.length > 0 ? (
        <ul>
          {filteredActivities.map((activity) => (
            <li key={activity._id}>{activity.name}</li>
          ))}
        </ul>
      ) : (
        <p>No activities found.</p>
      )}
    </div>
  );
};

export default ActivityPage;
