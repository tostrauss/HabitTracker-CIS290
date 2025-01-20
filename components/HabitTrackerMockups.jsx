import React from 'react';
import { Bell, Calendar, CheckCircle2, Clock, Home, Info, Plus, Settings, User } from 'lucide-react';

// Simplified Card components since we won't have access to shadcn/ui
const Card = ({ children, className }) => (
  <div className={`rounded-lg ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
);

const HabitTrackerMockups = () => {
  // Mock data
  const habits = [
    { name: "Morning Meditation", streak: 12, completed: true },
    { name: "Read 30 mins", streak: 5, completed: false },
    { name: "Exercise", streak: 8, completed: false },
    { name: "Drink Water", streak: 15, completed: true }
  ];

  const screens = [
    {
      title: "Home Screen",
      content: (
        <div className="w-[320px] h-[580px] bg-white rounded-3xl shadow-lg p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Welcome back!</h2>
              <p className="text-gray-500">Monday, Jan 19</p>
            </div>
            <Bell className="w-6 h-6 text-gray-600" />
          </div>
          
          <Card className="bg-blue-50">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Today's Progress</p>
                  <p className="text-2xl font-bold">2/4</p>
                </div>
                <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center">
                  <p className="text-white text-xl font-bold">50%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {habits.map((habit, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{habit.name}</p>
                  <p className="text-sm text-gray-500">🔥 {habit.streak} day streak</p>
                </div>
                <CheckCircle2 className={`w-6 h-6 ${habit.completed ? 'text-green-500' : 'text-gray-300'}`} />
              </div>
            ))}
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
            <div className="flex justify-around">
              <Home className="w-6 h-6 text-blue-500" />
              <Calendar className="w-6 h-6 text-gray-400" />
              <Plus className="w-6 h-6 text-gray-400" />
              <Clock className="w-6 h-6 text-gray-400" />
              <User className="w-6 h-6 text-gray-400" />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Main App Screen",
      content: (
        <div className="w-[320px] h-[580px] bg-white rounded-3xl shadow-lg p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Add New Habit</h2>
            <Settings className="w-6 h-6 text-gray-600" />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Habit Name</label>
              <input 
                type="text" 
                placeholder="Enter habit name"
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Frequency</label>
              <div className="flex gap-2">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                  <button key={i} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Reminder Time</label>
              <input 
                type="time" 
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium">
              Create Habit
            </button>
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
            <div className="flex justify-around">
              <Home className="w-6 h-6 text-gray-400" />
              <Calendar className="w-6 h-6 text-gray-400" />
              <Plus className="w-6 h-6 text-blue-500" />
              <Clock className="w-6 h-6 text-gray-400" />
              <User className="w-6 h-6 text-gray-400" />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Credits Screen",
      content: (
        <div className="w-[320px] h-[580px] bg-white rounded-3xl shadow-lg p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">About</h2>
            <Info className="w-6 h-6 text-gray-600" />
          </div>

          <div className="space-y-6 text-center pt-8">
            <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold">HabitTracker</h3>
              <p className="text-gray-500">Version 1.0.0</p>
            </div>

            <div className="space-y-2">
              <p className="font-medium">Developed by</p>
              <p>Tobias Strauss</p>
              <p className="text-gray-500">CIS290 - Mobile Application Development</p>
              <p className="text-gray-500">Post University</p>
            </div>

            <div className="space-y-2 pt-4">
              <p className="font-medium">Special Thanks</p>
              <p className="text-gray-500">Professor Traudt</p>
              <p className="text-gray-500">Department of Arts & Sciences</p>
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
            <div className="flex justify-around">
              <Home className="w-6 h-6 text-gray-400" />
              <Calendar className="w-6 h-6 text-gray-400" />
              <Plus className="w-6 h-6 text-gray-400" />
              <Clock className="w-6 h-6 text-gray-400" />
              <User className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-wrap gap-8 p-8 justify-center bg-gray-100">
      {screens.map((screen, i) => (
        <div key={i} className="space-y-4">
          <h3 className="text-xl font-bold text-center">{screen.title}</h3>
          {screen.content}
        </div>
      ))}
    </div>
  );
};

export default HabitTrackerMockups;