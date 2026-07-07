import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Video,
  BookOpen,
  MessageSquare,
  Send,
  Star,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { getTutor } from "../api/tutorApi";
import { createSession } from "../api/sessionApi";

const DURATIONS = [
  { value: 30, label: "30 minutes" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
];

const BookSession = () => {
  const { tutorId } = useParams();
  const navigate = useNavigate();

  const [tutor, setTutor] = useState(null);
  const [loadingTutor, setLoadingTutor] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    subject: "",
    topic: "",
    message: "",
    scheduledDate: "",
    scheduledTime: "",
    duration: 60,
    mode: "physical",
    location: "",
  });

  // Load tutor
  useEffect(() => {
    const load = async () => {
      try {
        const result = await getTutor(tutorId);
        setTutor(result.data);
      } catch (err) {
        setError(err.response?.data?.message || "Tutor not found");
      } finally {
        setLoadingTutor(false);
      }
    };
    load();
  }, [tutorId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !form.subject ||
      !form.topic ||
      !form.scheduledDate ||
      !form.scheduledTime
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    try {
      await createSession({
        tutorId,
        subject: form.subject,
        topic: form.topic,
        message: form.message,
        scheduledDate: form.scheduledDate,
        scheduledTime: form.scheduledTime,
        duration: Number(form.duration),
        mode: form.mode,
        location: form.location,
      });
      toast.success("Session request sent!");
      navigate("/student/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to book session");
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate estimated cost
  const estimatedCost = tutor?.sessionRate
    ? Math.round((tutor.sessionRate * Number(form.duration)) / 60)
    : 0;

  // Today's date for min date
  const today = new Date().toISOString().split("T")[0];

  // Loading state
  if (loadingTutor) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-surface-50 flex items-center justify-center">
          <div className="text-surface-500">Loading tutor...</div>
        </div>
      </>
    );
  }

  // Error state
  if (error || !tutor) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-surface-900 mb-2">
              Tutor not found
            </h2>
            <p className="text-surface-500 mb-6">
              {error || "The tutor you're trying to book doesn't exist."}
            </p>
            <button
              onClick={() => navigate("/tutors")}
              className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700"
            >
              Back to Tutors
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-surface-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-surface-600 hover:text-primary-600 mb-6 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Tutor info card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-surface-100 p-6 sticky top-8">
                <div className="text-center mb-4">
                  {tutor.profileImage ? (
                    <img
                      src={tutor.profileImage}
                      alt={tutor.name}
                      className="w-20 h-20 rounded-full object-cover mx-auto ring-4 ring-primary-100 mb-3"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto ring-4 ring-primary-100 mb-3">
                      <span className="text-white text-xl font-bold">
                        {tutor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                    </div>
                  )}
                  <h3 className="font-bold text-surface-900">{tutor.name}</h3>
                  <p className="text-sm text-surface-500">{tutor.department}</p>
                  <p className="text-xs text-surface-400 mt-1">{tutor.level}</p>

                  {tutor.averageRating > 0 && (
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <Star
                        size={14}
                        className="fill-yellow-400 text-yellow-400"
                      />
                      <span className="text-sm font-semibold text-surface-700">
                        {tutor.averageRating.toFixed(1)}
                      </span>
                      <span className="text-xs text-surface-400">
                        ({tutor.totalReviews})
                      </span>
                    </div>
                  )}
                </div>

                {/* Rate */}
                <div className="pt-4 border-t border-surface-100 mb-4">
                  <p className="text-xs text-surface-400 mb-1">Session Rate</p>
                  <p className="text-2xl font-bold text-surface-900">
                    ₦{tutor.sessionRate?.toLocaleString() || 0}
                    <span className="text-sm text-surface-400 font-normal">
                      /hour
                    </span>
                  </p>
                </div>

                {/* Subjects */}
                {tutor.subjects?.length > 0 && (
                  <div className="pt-4 border-t border-surface-100 mb-4">
                    <p className="text-xs text-surface-400 mb-2">Teaches</p>
                    <div className="flex flex-wrap gap-1.5">
                      {tutor.subjects.map((s, i) => (
                        <span
                          key={i}
                          className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Availability */}
                {tutor.availability?.length > 0 && (
                  <div className="pt-4 border-t border-surface-100">
                    <p className="text-xs text-surface-400 mb-2">Availability</p>
                    <div className="space-y-1">
                      {tutor.availability.map((slot, i) => (
                        <div
                          key={i}
                          className="text-xs text-surface-700 flex justify-between"
                        >
                          <span className="font-medium">{slot.day}</span>
                          <span>
                            {slot.startTime} – {slot.endTime}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Booking Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-surface-100 p-6 sm:p-8">
                <h1 className="text-2xl font-bold text-surface-900 mb-2">
                  Book a Session
                </h1>
                <p className="text-sm text-surface-500 mb-6">
                  Fill in the details below to send a booking request
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-surface-200 rounded-xl text-sm text-surface-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select a subject</option>
                      {tutor.subjects?.map((s, i) => (
                        <option key={i} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    {tutor.subjects?.length === 0 && (
                      <p className="text-xs text-red-500 mt-1">
                        This tutor hasn't added any subjects yet
                      </p>
                    )}
                  </div>

                  {/* Topic */}
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Topic *
                    </label>
                    <input
                      type="text"
                      name="topic"
                      value={form.topic}
                      onChange={handleChange}
                      required
                      maxLength={150}
                      placeholder="e.g. Loops in JavaScript"
                      className="w-full px-4 py-2.5 border border-surface-200 rounded-xl text-sm text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  {/* Date + Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Date *
                      </label>
                      <div className="relative">
                        <Calendar
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none"
                        />
                        <input
                          type="date"
                          name="scheduledDate"
                          value={form.scheduledDate}
                          onChange={handleChange}
                          min={today}
                          required
                          className="w-full pl-10 pr-4 py-2.5 border border-surface-200 rounded-xl text-sm text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Time *
                      </label>
                      <div className="relative">
                        <Clock
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none"
                        />
                        <input
                          type="time"
                          name="scheduledTime"
                          value={form.scheduledTime}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-4 py-2.5 border border-surface-200 rounded-xl text-sm text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Duration
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {DURATIONS.map((d) => (
                        <button
                          key={d.value}
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({ ...prev, duration: d.value }))
                          }
                          className={`py-2 px-3 rounded-xl text-sm font-medium border transition-colors ${
                            Number(form.duration) === d.value
                              ? "bg-primary-600 text-white border-primary-600"
                              : "bg-white text-surface-700 border-surface-200 hover:border-primary-300"
                          }`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mode */}
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Session Mode
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({ ...prev, mode: "physical" }))
                        }
                        className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium border transition-colors ${
                          form.mode === "physical"
                            ? "bg-primary-600 text-white border-primary-600"
                            : "bg-white text-surface-700 border-surface-200 hover:border-primary-300"
                        }`}
                      >
                        <MapPin size={14} />
                        Physical
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({ ...prev, mode: "online" }))
                        }
                        className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium border transition-colors ${
                          form.mode === "online"
                            ? "bg-primary-600 text-white border-primary-600"
                            : "bg-white text-surface-700 border-surface-200 hover:border-primary-300"
                        }`}
                      >
                        <Video size={14} />
                        Online
                      </button>
                    </div>
                  </div>

                  {/* Location (only for physical) */}
                  {form.mode === "physical" && (
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Preferred Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        maxLength={200}
                        placeholder="e.g. School library, Room 204"
                        className="w-full px-4 py-2.5 border border-surface-200 rounded-xl text-sm text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  )}

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Message to Tutor (optional)
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={3}
                      maxLength={500}
                      placeholder="Anything specific you'd like the tutor to prepare?"
                      className="w-full px-4 py-2.5 border border-surface-200 rounded-xl text-sm text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    />
                    <p className="text-xs text-surface-400 mt-1 text-right">
                      {form.message.length}/500
                    </p>
                  </div>

                  {/* Cost summary */}
                  {estimatedCost > 0 && (
                    <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-primary-700 mb-0.5">
                            Estimated Cost
                          </p>
                          <p className="text-xl font-bold text-primary-900">
                            ₦{estimatedCost.toLocaleString()}
                          </p>
                        </div>
                        <p className="text-xs text-primary-600 text-right">
                          {form.duration} min × ₦
                          {tutor.sessionRate.toLocaleString()}/hr
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submitting || tutor.subjects?.length === 0}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send size={16} />
                    {submitting ? "Sending Request..." : "Send Booking Request"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookSession;