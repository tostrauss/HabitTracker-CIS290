"use client";
import React, { useState, useEffect, useRef } from "react";
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
  id: string;
  name: string;
  streak: number;
  completedToday: boolean;
  lastCompleted: string;
  frequency: string[];
  reminderTime: string;
};

export default function HabitTracker() {
  // State to track the current screen
  const [currentScreen, setCurrentScreen] = useState<
    "home" | "calendar" | "add" | "history" | "profile"
  >("home");

  // All habits
  const [habits, setHabits] = useState<Habit[]>([]);

  // "Add Habit" 
  const [newHabitName, setNewHabitName] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [reminderTime, setReminderTime] = useState("");

  // Load habits from localStorage on initial load
  useEffect(() => {
    const savedHabits = localStorage.getItem("habits");
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, []);

  // Save habits to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  // Reset completedToday if a new day has started
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const updatedHabits = habits.map((habit) => {
      if (habit.completedToday && habit.lastCompleted !== today) {
        return { ...habit, completedToday: false };
      }
      return habit;
    });
    setHabits(updatedHabits);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to toggle a habit's completion
  const toggleHabitCompletion = (id: string) => {
    const today = new Date().toISOString().split("T")[0];
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id === id) {
          if (!habit.completedToday) {
            let newStreak = habit.streak;
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterStr = yesterday.toISOString().split("T")[0];

            if (habit.lastCompleted === yesterStr) {
              newStreak += 1;
            } else if (habit.lastCompleted !== today) {
              newStreak = 1;
            }
            return {
              ...habit,
              completedToday: true,
              lastCompleted: today,
              streak: newStreak,
            };
          } else {
            // Un-check the habit if it's already completed today
            return {
              ...habit,
              completedToday: false,
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
    // Clear 
    setNewHabitName("");
    setSelectedDays([]);
    setReminderTime("");
    // Go back to Home screen
    setCurrentScreen("home");
  };

  // Helper 
  const toggleDaySelection = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  // Count how many habits are completed today
  const completedCount = habits.filter((h) => h.completedToday).length;

  // Bottom navigation bar 
  const bottomNav = (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="flex justify-around">
        <Home
          className={`w-6 h-6 ${currentScreen === "home" ? "text-blue-500" : "text-gray-400"} cursor-pointer`}
          onClick={() => setCurrentScreen("home")}
        />
        <Calendar
          className={`w-6 h-6 ${currentScreen === "calendar" ? "text-blue-500" : "text-gray-400"} cursor-pointer`}
          onClick={() => setCurrentScreen("calendar")}
        />
        <Plus
          className={`w-6 h-6 ${currentScreen === "add" ? "text-blue-500" : "text-gray-400"} cursor-pointer`}
          onClick={() => setCurrentScreen("add")}
        />
        <Clock
          className={`w-6 h-6 ${currentScreen === "history" ? "text-blue-500" : "text-gray-400"} cursor-pointer`}
          onClick={() => setCurrentScreen("history")}
        />
        <User
          className={`w-6 h-6 ${currentScreen === "profile" ? "text-blue-500" : "text-gray-400"} cursor-pointer`}
          onClick={() => setCurrentScreen("profile")}
        />
      </div>
    </div>
  );

  // --- CalendarView Component ---
  const CalendarView = ({ habits }: { habits: Habit[] }) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); 

    // Determine the first and last day of the month
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay(); 

    // calendar cells 
    const calendarCells = [];
    for (let i = 0; i < startDay; i++) {
      calendarCells.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      calendarCells.push(new Date(currentYear, currentMonth, day));
    }

    // Mapping from JS getDay()
    const dayMapping: { [key: number]: string } = {
      0: "Su",
      1: "M",
      2: "T",
      3: "W",
      4: "Th",
      5: "F",
      6: "Sa",
    };

    return (
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 text-center mb-4">
          {today.toLocaleString("default", { month: "long" })} {currentYear}
        </h2>
        <div className="grid grid-cols-7 gap-2">
          {/* Weekday headers */}
          {["Su", "M", "T", "W", "Th", "F", "Sa"].map((wd) => (
            <div key={wd} className="text-center font-medium text-gray-700 dark:text-gray-300">
              {wd}
            </div>
          ))}
          {calendarCells.map((cell, index) => {
            if (!cell) {
              return <div key={index} />;
            }
            const dayNumber = cell.getDate();
            const dateStr = cell.toISOString().split("T")[0];
            const dayOfWeek = dayMapping[cell.getDay()];
            // Get habits scheduled for this day based on frequency
            const scheduledHabits = habits.filter((habit) =>
              habit.frequency.includes(dayOfWeek)
            );
            return (
              <div
                key={index}
                className="border border-gray-300 dark:border-gray-600 rounded p-1 min-h-[60px]"
              >
                <div className="text-sm font-bold">{dayNumber}</div>
                <div className="mt-1 space-y-1">
                  {scheduledHabits.map((habit) => (
                    <div key={habit.id} className="text-xs truncate flex items-center">
                      <span
                        className={`w-2 h-2 rounded-full mr-1 ${
                          habit.lastCompleted === dateStr ? "bg-green-500" : "bg-gray-400"
                        }`}
                      ></span>
                      <span className="text-gray-700 dark:text-gray-200">{habit.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // --- Screens --- //

  // Home Screen
  const HomeScreen = () => {
    const today = new Date();
    const dateStr = today.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });

    return (
      <div className="relative w-[320px] h-[580px] bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Welcome back!</h2>
            <p className="text-gray-500">{dateStr}</p>
          </div>
          <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </div>

        {/* Card with today's progress */}
        <Card className="bg-blue-50 dark:bg-blue-900">
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Today's Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {completedCount}/{habits.length}
                </p>
              </div>
              <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center">
                <p className="text-white text-xl font-bold">
                  {habits.length === 0 ? "0%" : `${Math.round((completedCount / habits.length) * 100)}%`}
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
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{habit.name}</p>
                <p className="text-sm text-gray-500">🔥 {habit.streak} day streak</p>
              </div>
              <CheckCircle2
                onClick={() => toggleHabitCompletion(habit.id)}
                className={`w-6 h-6 cursor-pointer ${habit.completedToday ? "text-green-500" : "text-gray-300"}`}
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
    // Use a ref 
    const habitInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      habitInputRef.current?.focus();
    }, []);

    return (
      <div className="relative w-[320px] h-[580px] bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Add New Habit</h2>
          <Settings className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </div>

        <div className="space-y-4 pb-16">
          {/* Habit Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Habit Name</label>
            <input
              ref={habitInputRef}
              type="text"
              placeholder="Enter habit name"
              autoFocus
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
            />
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Frequency</label>
            <div className="flex gap-2 flex-wrap">
              {daysOfWeek.map((day) => (
                <button
                  key={day}
                  type="button"
                  className={`w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center ${
                    selectedDays.includes(day)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-100"
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
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Reminder Time</label>
            <input
              type="time"
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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

  // Profile 
  const ProfileScreen = () => {
    return (
      <div className="relative w-[320px] h-[580px] bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">About</h2>
          <Info className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </div>

        <div className="space-y-6 text-center pt-8 pb-16">
          <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">HabitTracker</h3>
            <p className="text-gray-500">Version 1.0.0</p>
          </div>

          <div className="space-y-2">
            <p className="font-medium text-gray-900 dark:text-gray-100">Developed by</p>
            <p className="text-gray-500">Your Name</p>
            <p className="text-gray-500">CIS290 - Mobile Application Development</p>
            <p className="text-gray-500">Post University</p>
          </div>

          <div className="space-y-2 pt-4">
            <p className="font-medium text-gray-900 dark:text-gray-100">Special Thanks</p>
            <p className="text-gray-500">Professor Traudt</p>
            <p className="text-gray-500">Department of Arts &amp; Sciences</p>
          </div>
        </div>

        {bottomNav}
      </div>
    );
  };

  // calendar view
  const CalendarScreen = () => (
    <div className="relative w-[320px] h-[580px] bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 overflow-auto">
      <CalendarView habits={habits} />
      {bottomNav}
    </div>
  );

  //placeholder for now
  const HistoryScreen = () => (
    <div className="relative w-[320px] h-[580px] bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">History / Stats</h2>
      <p className="text-gray-500">Coming Soon!</p>
      {bottomNav}
    </div>
  );

  // Render the current screen
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
    <div className="flex flex-wrap gap-8 p-8 justify-center bg-gray-100 dark:bg-gray-900 min-h-screen">
      {content}
    </div>
  );
}
