"use client"; // Important for Next.js so we can use state, localStorage, etc.
import React, { useState, useEffect } from "react";
import {
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  Home,
  Info,
  Plus,
  Settings,
  User,
} from "lucide-react";

// Reusable Card
const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={`rounded-lg ${className}`}>{children}</div>;
};

const CardContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

// Type for a habit
type Habit = {
  id: string;                // Unique ID
  name: string;             // e.g. "Drink Water"
  streak: number;           // e.g. 5
  completedToday: boolean;  // e.g. false
  lastCompleted: string;    // e.g. "2025-02-19" (YYYY-MM-DD)
  frequency: string[];      // e.g. ["M","T","W","Th","F"]
  reminderTime: string;     // e.g. "07:30"
};

export default function HabitTracker() {
  // State to track the current screen
  const [currentScreen, setCurrentScreen] = useState<
    "home" | "calendar" | "add" | "history" | "profile"
  >("home");

  // All habits
  const [habits, setHabits] = useState<Habit[]>([]);

  // For the "Add Habit" screen form
  const [newHabitName, setNewHabitName] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [reminderTime, setReminderTime] = useState("");

  // On initial load, load from localStorage
  useEffect(() => {
    const savedHabits = localStorage.getItem("habits");
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, []);

  // Whenever habits change, save to localStorage
  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  // Check if a new day has started to reset completedToday
  useEffect(() => {
    // We'll assume the "current day" is just the local date string
    const today = new Date().toISOString().split("T")[0]; // e.g. "2025-02-21"
    // If the habit's lastCompleted is older than today (and completedToday == true),
    // we might want to reset completedToday to false.
    const updatedHabits = habits.map((habit) => {
      // If habit was completed for a previous day, reset completedToday
      if (habit.completedToday && habit.lastCompleted !== today) {
        return {
          ...habit,
          completedToday: false,
        };
      }
      return habit;
    });
    setHabits(updatedHabits);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to toggle a habit’s completion
  const toggleHabitCompletion = (id: string) => {
    const today = new Date().toISOString().split("T")[0];
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id === id) {
          // If it's not completed yet today, mark completed and update streak
          if (!habit.completedToday) {
            let newStreak = habit.streak;
            // If the lastCompleted day is yesterday, increment streak; if it's older, reset
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterStr = yesterday.toISOString().split("T")[0];

            if (habit.lastCompleted === yesterStr) {
              newStreak += 1;
            } else if (habit.lastCompleted !== today) {
              // If the lastCompleted day isn't yesterday or today, reset streak to 1
              newStreak = 1;
            }
            return {
              ...habit,
              completedToday: true,
              lastCompleted: today,
              streak: newStreak,
            };
          } else {
            // If it’s already completed today, we can un-check it
            // (Or you can decide not to allow un-checking for the day.)
            return {
              ...habit,
              completedToday: false,
              // Keep streak as is, keep lastCompleted as is
            };
          }
        }
        return habit;
      })
    );
  };

  // Handle new habit creation
  const handleCreateHabit = () => {
    if (!newHabitName.trim()) return;
    const today = new Date().toISOString().split("T")[0];
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name: newHabitName,
      streak: 0,
      completedToday: false,
      lastCompleted: "",
      frequency: selectedDays,
      reminderTime,
    };
    setHabits([...habits, newHabit]);
    // Clear the form
    setNewHabitName("");
    setSelectedDays([]);
    setReminderTime("");
    // Go back to Home screen (optional)
    setCurrentScreen("home");
  };

  // Helper to handle day selection in the form
  const toggleDaySelection = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  // Count how many are completed today
  const completedCount = habits.filter((h) => h.completedToday).length;

  // Bottom nav icons
  const bottomNav = (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
      <div className="flex justify-around">
        <Home
          className={`w-6 h-6 ${
            currentScreen === "home" ? "text-blue-500" : "text-gray-400"
          } cursor-pointer`}
          onClick={() => setCurrentScreen("home")}
        />
        <Calendar
          className={`w-6 h-6 ${
            currentScreen === "calendar" ? "text-blue-500" : "text-gray-400"
          } cursor-pointer`}
          onClick={() => setCurrentScreen("calendar")}
        />
        <Plus
          className={`w-6 h-6 ${
            currentScreen === "add" ? "text-blue-500" : "text-gray-400"
          } cursor-pointer`}
          onClick={() => setCurrentScreen("add")}
        />
        <Clock
          className={`w-6 h-6 ${
            currentScreen === "history" ? "text-blue-500" : "text-gray-400"
          } cursor-pointer`}
          onClick={() => setCurrentScreen("history")}
        />
        <User
          className={`w-6 h-6 ${
            currentScreen === "profile" ? "text-blue-500" : "text-gray-400"
          } cursor-pointer`}
          onClick={() => setCurrentScreen("profile")}
        />
      </div>
    </div>
  );

  // --------- Screens --------- //

  // Home Screen
  const HomeScreen = () => {
    const today = new Date();
    const dateStr = today.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });

    return (
      <div className="relative w-[320px] h-[580px] bg-white rounded-3xl shadow-lg p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Welcome back!</h2>
            <p className="text-gray-500">{dateStr}</p>
          </div>
          <Bell className="w-6 h-6 text-gray-600" />
        </div>

        {/* Card with today's progress */}
        <Card className="bg-blue-50">
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Today's Progress</p>
                <p className="text-2xl font-bold">
                  {completedCount}/{habits.length}
                </p>
              </div>
              <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center">
                <p className="text-white text-xl font-bold">
                  {habits.length === 0
                    ? "0%"
                    : `${Math.round((completedCount / habits.length) * 100)}%`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* List of habits */}
        <div className="space-y-4 pb-16">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium">{habit.name}</p>
                <p className="text-sm text-gray-500">
                  🔥 {habit.streak} day streak
                </p>
              </div>
              <CheckCircle2
                onClick={() => toggleHabitCompletion(habit.id)}
                className={`w-6 h-6 cursor-pointer ${
                  habit.completedToday ? "text-green-500" : "text-gray-300"
                }`}
              />
            </div>
          ))}
        </div>
        {bottomNav}
      </div>
    );
  };

  // Add Habit Screen
  const AddHabitScreen = () => {
    const daysOfWeek = ["M", "T", "W", "Th", "F", "Sa", "Su"];

    return (
      <div className="relative w-[320px] h-[580px] bg-white rounded-3xl shadow-lg p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Add New Habit</h2>
          <Settings className="w-6 h-6 text-gray-600" />
        </div>

        <div className="space-y-4 pb-16">
          {/* Habit Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Habit Name</label>
            <input
              type="text"
              placeholder="Enter habit name"
              className="w-full p-2 border rounded-lg"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
            />
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Frequency</label>
            <div className="flex gap-2 flex-wrap">
              {daysOfWeek.map((day) => (
                <button
                  key={day}
                  type="button"
                  className={`w-10 h-10 rounded-full border flex items-center justify-center ${
                    selectedDays.includes(day)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100"
                  }`}
                  onClick={() => toggleDaySelection(day)}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Reminder Time */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Reminder Time</label>
            <input
              type="time"
              className="w-full p-2 border rounded-lg"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
            />
          </div>

          <button
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium"
            onClick={handleCreateHabit}
          >
            Create Habit
          </button>
        </div>

        {bottomNav}
      </div>
    );
  };

  // Credits Screen (Profile)
  const ProfileScreen = () => {
    return (
      <div className="relative w-[320px] h-[580px] bg-white rounded-3xl shadow-lg p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">About</h2>
          <Info className="w-6 h-6 text-gray-600" />
        </div>

        <div className="space-y-6 text-center pt-8 pb-16">
          <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>

          <div>
            <h3 className="text-2xl font-bold">HabitTracker</h3>
            <p className="text-gray-500">Version 1.0.0</p>
          </div>

          <div className="space-y-2">
            <p className="font-medium">Developed by</p>
            <p>**Your Name**</p>
            <p className="text-gray-500">CIS290 - Mobile Application Development</p>
            <p className="text-gray-500">Post University</p>
          </div>

          <div className="space-y-2 pt-4">
            <p className="font-medium">Special Thanks</p>
            <p className="text-gray-500">Professor Traudt</p>
            <p className="text-gray-500">Department of Arts & Sciences</p>
          </div>
        </div>

        {bottomNav}
      </div>
    );
  };

  // Placeholder Calendar Screen
  const CalendarScreen = () => (
    <div className="relative w-[320px] h-[580px] bg-white rounded-3xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Calendar View</h2>
      <p className="text-gray-500">Coming Soon!</p>
      {bottomNav}
    </div>
  );

  // Placeholder History Screen
  const HistoryScreen = () => (
    <div className="relative w-[320px] h-[580px] bg-white rounded-3xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">History / Stats</h2>
      <p className="text-gray-500">Coming Soon!</p>
      {bottomNav}
    </div>
  );

  // Render the correct screen
  let content;
  switch (currentScreen) {
    case "home":
      content = <HomeScreen />;
      break;
    case "calendar":
      content = <CalendarScreen />;
      break;
    case "add":
      content = <AddHabitScreen />;
      break;
    case "history":
      content = <HistoryScreen />;
      break;
    case "profile":
      content = <ProfileScreen />;
      break;
    default:
      content = <HomeScreen />;
      break;
  }

  return (
    <div className="flex flex-wrap gap-8 p-8 justify-center bg-gray-100 min-h-screen">
      {content}
    </div>
  );
}
