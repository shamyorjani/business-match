import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ThankYou = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState(
    location.state?.meetings || []
  );
  const [selectedExhibitors, setSelectedExhibitors] = useState(
    location.state?.selectedExhibitors || []
  );

  const handleBack = () => {
    // Pass back both meetings and selected exhibitors to preserve data
    navigate('/business/schedule', {
      state: {
        meetings: meetings,
        selectedExhibitors: selectedExhibitors
      }
    });
  };

  return (
    <div className="form-container">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#40033f] to-[#9c0c40] px-14 py-8">
        <h1 className="text-2xl font-bold text-white">Thank You</h1>
        <p className="mt-1 text-sm text-white">
          Your meeting schedule has been confirmed
        </p>
      </div>

      {/* Content */}
      <div className="py-6 px-14 white">
        <h2 className="text-xl font-semibold">Meeting Schedule Summary</h2>

        <div className="mt-6 overflow-hidden border border-gray-300 rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Day</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Time</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Exhibitor</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Booth</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {meetings.map((meeting, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">Day {meeting.day}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{meeting.date} ({meeting.dayOfWeek})</td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{meeting.time}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{meeting.exhibitor}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{meeting.boothNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8">
          <p className="text-sm text-gray-600">
            Your meeting schedule has been sent to your registered email. You can also download the schedule by clicking the button below.
          </p>

          <div className="flex justify-between mt-8">
            <button
              className="px-8 py-2 btn-secondary"
              onClick={handleBack}
            >
              Back to Schedule
            </button>

            <button className="px-8 py-2 bg-[#40033f] text-white rounded-md">
              Download Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
