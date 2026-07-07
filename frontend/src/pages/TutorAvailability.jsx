import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Clock, Save, ArrowLeft, Plus, X } from "lucide-react";
import { getMyProfile, updateAvailability } from "../api/profileApi";
import MainLayout from "../layouts/MainLayout";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Default slot template
const DEFAULT_SLOT = { startTime: "09:00", endTime: "17:00" };

const TutorAvailability = () => {
  const navigate = useNavigate();

  // Map of day -> array of time slots
  const [availability, setAvailability] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load current availability
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMyProfile();
        const existingSlots = response.data.availability || [];

        // Convert array to grouped object: { Monday: [{startTime, endTime}], ... }
        const grouped = {};
        existingSlots.forEach((slot) => {
          if (!grouped[slot.day]) grouped[slot.day] = [];
          grouped[slot.day].push({
            startTime: slot.startTime,
            endTime: slot.endTime,
          });
        });

        setAvailability(grouped);
      } catch (error) {
        toast.error("Failed to load availability");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Toggle a day (add/remove)
  const toggleDay = (day) => {
    setAvailability((prev) => {
      if (prev[day]) {
        // Remove day
        const updated = { ...prev };
        delete updated[day];
        return updated;
      } else {
        // Add day with default slot
        return { ...prev, [day]: [{ ...DEFAULT_SLOT }] };
      }
    });
  };

  // Add a new time slot for a day
  const addSlot = (day) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: [...prev[day], { ...DEFAULT_SLOT }],
    }));
  };

  // Remove a time slot
  const removeSlot = (day, slotIndex) => {
    setAvailability((prev) => {
      const updatedSlots = prev[day].filter((_, i) => i !== slotIndex);
      if (updatedSlots.length === 0) {
        // Remove day if no slots left
        const updated = { ...prev };
        delete updated[day];
        return updated;
      }
      return { ...prev, [day]: updatedSlots };
    });
  };

  // Update a specific slot field
  const updateSlot = (day, slotIndex, field, value) => {
    setAvailability((prev) => {
      const updatedSlots = prev[day].map((slot, i) =>
        i === slotIndex ? { ...slot, [field]: value } : slot
      );
      return { ...prev, [day]: updatedSlots };
    });
  };

  // Convert grouped object back to flat array for API
  const buildAvailabilityArray = () => {
    const result = [];
    DAYS_OF_WEEK.forEach((day) => {
      if (availability[day]) {
        availability[day].forEach((slot) => {
          result.push({ day, startTime: slot.startTime, endTime: slot.endTime });
        });
      }
    });
    return result;
  };

  // Validate all slots
  const validateSlots = () => {
    for (const day of Object.keys(availability)) {
      for (const slot of availability[day]) {
        if (!slot.startTime || !slot.endTime) {
          toast.error(`Please set times for ${day}`);
          return false;
        }
        if (slot.startTime >= slot.endTime) {
          toast.error(`Start time must be before end time on ${day}`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateSlots()) return;

    const availabilityArray = buildAvailabilityArray();

    setIsSaving(true);
    try {
      await updateAvailability(availabilityArray);
      toast.success("Availability updated successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update availability"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const selectedDays = Object.keys(availability);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            <p className="text-surface-500">Loading your schedule...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/tutor/dashboard")}
            className="flex items-center gap-2 text-surface-500 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-surface-900">
            Set Availability
          </h1>
          <p className="text-surface-500 mt-1">
            Let students know when you're available for sessions.
          </p>
        </div>

        <div className="space-y-6">
          {/* Day Toggles */}
          <div className="bg-white rounded-2xl shadow-sm border border-surface-100 p-6">
            <h2 className="text-lg font-semibold text-surface-800 mb-4">
              Select Your Available Days
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DAYS_OF_WEEK.map((day) => {
                const isSelected = !!availability[day];
                return (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 border-2 ${
                      isSelected
                        ? "bg-primary-600 text-white border-primary-600 shadow-sm"
                        : "bg-white text-surface-600 border-surface-200 hover:border-primary-300 hover:text-primary-600"
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots for Selected Days */}
          {DAYS_OF_WEEK.filter((d) => availability[d]).map((day) => (
            <div
              key={day}
              className="bg-white rounded-2xl shadow-sm border border-surface-100 p-6 animate-fade-in-up"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full" />
                  <h3 className="font-semibold text-surface-800">{day}</h3>
                </div>
                <button
                  onClick={() => addSlot(day)}
                  className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  <Plus size={16} />
                  Add slot
                </button>
              </div>

              <div className="space-y-3">
                {availability[day].map((slot, slotIndex) => (
                  <div
                    key={slotIndex}
                    className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl"
                  >
                    <Clock size={16} className="text-surface-400 flex-shrink-0" />

                    {/* Start Time */}
                    <div className="flex-1">
                      <label className="text-xs text-surface-500 mb-1 block">
                        Start
                      </label>
                      <input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) =>
                          updateSlot(day, slotIndex, "startTime", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg border border-surface-200 bg-white text-surface-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <span className="text-surface-400 text-sm mt-4">to</span>

                    {/* End Time */}
                    <div className="flex-1">
                      <label className="text-xs text-surface-500 mb-1 block">
                        End
                      </label>
                      <input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) =>
                          updateSlot(day, slotIndex, "endTime", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg border border-surface-200 bg-white text-surface-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    {/* Remove slot */}
                    <button
                      onClick={() => removeSlot(day, slotIndex)}
                      className="mt-4 text-surface-400 hover:text-danger transition-colors flex-shrink-0"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Empty state */}
          {selectedDays.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-dashed border-surface-200 p-12 text-center">
              <Clock size={40} className="text-surface-200 mx-auto mb-3" />
              <p className="text-surface-500 font-medium">No days selected yet</p>
              <p className="text-surface-400 text-sm mt-1">
                Click the day buttons above to set your available times
              </p>
            </div>
          )}

          {/* Summary */}
          {selectedDays.length > 0 && (
            <div className="bg-primary-50 rounded-2xl border border-primary-100 p-4">
              <p className="text-primary-700 text-sm font-medium">
                You are available on:{" "}
                {DAYS_OF_WEEK.filter((d) => availability[d]).join(", ")}
              </p>
              <p className="text-primary-500 text-xs mt-0.5">
                {buildAvailabilityArray().length} total time slot
                {buildAvailabilityArray().length !== 1 ? "s" : ""} configured
              </p>
            </div>
          )}

          {/* Save Button */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all duration-200 disabled:opacity-60 shadow-sm"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Availability
                </>
              )}
            </button>

            <button
              onClick={() => navigate("/tutor/dashboard")}
              className="px-6 py-3 border border-surface-200 text-surface-600 rounded-xl font-medium hover:bg-surface-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TutorAvailability;