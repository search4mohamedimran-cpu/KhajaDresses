import { useState, useEffect } from "react";
import { Star, Send, MessageSquare, Loader2 } from "lucide-react";
import { api } from "../../../lib/api";

interface Feedback {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export function Feedback() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 0,
    comment: "",
  });
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const data = await api.getFeedbacks();
      setFeedbacks(data);
    } catch (error) {
      console.error("Failed to fetch feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.rating === 0) {
      alert("Please select a rating");
      return;
    }
    
    setSubmitting(true);
    try {
      const result = await api.submitFeedback(formData);
      if (result.id) {
        setFeedbacks([result, ...feedbacks]);
        alert("Thank you for your feedback!");
        setFormData({
          name: "",
          email: "",
          rating: 0,
          comment: "",
        });
      }
    } catch (error) {
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const renderStars = (rating: number, interactive: boolean = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={interactive ? 32 : 20}
            className={`${
              star <= (interactive ? hoveredRating || formData.rating : rating)
                ? "fill-black stroke-black"
                : "stroke-black fill-white"
            } ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
            onClick={() => interactive && setFormData({ ...formData, rating: star })}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl mb-4">Customer Feedback</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We value your opinion. Share your experience with us and help us improve our services.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Feedback Form */}
          <div>
            <div className="border-2 border-black p-8 bg-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-black flex items-center justify-center">
                  <MessageSquare className="text-white" size={24} />
                </div>
                <h2 className="text-2xl">Submit Your Feedback</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block mb-2">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                    className="w-full border-2 border-black px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                    className="w-full border-2 border-black px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block mb-2">Rating *</label>
                  <div className="flex items-center gap-2">
                    {renderStars(formData.rating, true)}
                    {formData.rating > 0 && (
                      <span className="ml-2 text-gray-600">
                        ({formData.rating} star{formData.rating !== 1 ? "s" : ""})
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block mb-2">Your Feedback *</label>
                  <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    required
                    rows={6}
                    disabled={submitting}
                    className="w-full border-2 border-black px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black resize-none disabled:opacity-50"
                    placeholder="Tell us about your experience..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-black text-white py-4 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-600"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Send size={20} />
                  )}
                  {submitting ? "Submitting..." : "Submit Feedback"}
                </button>
              </form>
            </div>
          </div>

          {/* Recent Feedbacks */}
          <div>
            <h2 className="text-2xl mb-6">Recent Customer Reviews</h2>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-black" size={40} />
              </div>
            ) : (
              <div className="space-y-6">
                {feedbacks.length > 0 ? (
                  feedbacks.map((feedback) => (
                    <div
                      key={feedback.id}
                      className="border-2 border-black p-6 bg-white hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="mb-1">{feedback.name}</h3>
                          <p className="text-sm text-gray-600">{feedback.date}</p>
                        </div>
                        {renderStars(feedback.rating)}
                      </div>
                      <p className="text-gray-700">{feedback.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8 border-2 border-dashed border-gray-300">
                    No reviews yet. Be the first to leave one!
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Statistics Section */}
        <div className="mt-16 bg-black text-white p-12">
          <h2 className="text-3xl mb-8 text-center">Customer Satisfaction</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl mb-2">4.8</div>
              <div className="flex justify-center mb-2">
                {renderStars(5)}
              </div>
              <p className="text-gray-300">Average Rating</p>
            </div>
            <div>
              <div className="text-5xl mb-2">500+</div>
              <p className="text-gray-300">Happy Customers</p>
            </div>
            <div>
              <div className="text-5xl mb-2">98%</div>
              <p className="text-gray-300">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
