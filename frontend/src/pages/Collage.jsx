import React, { useState } from "react";
import { ThumbsUp, Send, Trophy, Medal, Award, Lightbulb, TrendingUp, MessageSquare, Star, MapPin } from "lucide-react";

export default function FeedbackSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [newSuggestion, setNewSuggestion] = useState("");

  // Mock suggestions data with likes
  const [suggestions, setSuggestions] = useState([
    {
      id: 1,
      author: "Priya Sharma",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
      text: "Add offline maps for remote areas with poor connectivity. Would be a game-changer for trekking!",
      likes: 247,
      hasLiked: false,
      category: "Feature Request"
    },
    {
      id: 2,
      author: "Rahul Verma",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      text: "Integration with local transport apps like Ola/Uber for seamless booking from the itinerary.",
      likes: 189,
      hasLiked: false,
      category: "Integration"
    },
    {
      id: 3,
      author: "Ananya Patel",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      text: "AR mode to point camera at monuments and get instant historical info overlay!",
      likes: 156,
      hasLiked: false,
      category: "Innovation"
    },
    {
      id: 4,
      author: "Vikram Singh",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      text: "Add a budget tracker that syncs with expenses in real-time during trips.",
      likes: 98,
      hasLiked: false,
      category: "Feature Request"
    },
    {
      id: 5,
      author: "Meera Kapoor",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
      text: "Community photo sharing for each destination with location tags.",
      likes: 72,
      hasLiked: false,
      category: "Community"
    }
  ]);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Travel Blogger",
      avatar: "https://ik.imagekit.io/zd04b5mivn/Screenshot%202025-10-24%20145138.png?updatedAt=1761297709970",
      content: "This platform completely transformed how I plan my travels. The AI recommendations are spot-on and saved me hours of research!",
      rating: 5,
      location: "New York, USA"
    },
    {
      name: "Marcus Chen",
      role: "Digital Nomad",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      content: "I've discovered hidden gems I never would have found otherwise. The personalized suggestions are incredibly accurate.",
      rating: 5,
      location: "Singapore"
    },
    {
      name: "Elena Rodriguez",
      role: "Adventure Seeker",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      content: "The best travel companion I could ask for. From budget planning to local experiences, everything is perfectly curated.",
      rating: 5,
      location: "Barcelona, Spain"
    }
  ];

  // Sort suggestions by likes to get top 3
  const sortedSuggestions = [...suggestions].sort((a, b) => b.likes - a.likes);
  const topThree = sortedSuggestions.slice(0, 3);
  const otherSuggestions = sortedSuggestions.slice(3);

  const handleLike = (id) => {
    setSuggestions(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          likes: s.hasLiked ? s.likes - 1 : s.likes + 1,
          hasLiked: !s.hasLiked
        };
      }
      return s;
    }));
  };

  const handleSubmit = () => {
    if (!newSuggestion.trim()) return;
    const newId = Math.max(...suggestions.map(s => s.id)) + 1;
    setSuggestions(prev => [...prev, {
      id: newId,
      author: "You",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=You",
      text: newSuggestion,
      likes: 0,
      hasLiked: false,
      category: "New Idea"
    }]);
    setNewSuggestion("");
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  // Podium card component - Fixed hover scaling
  const PodiumCard = ({ suggestion, rank, isCenter }) => {
    const rankStyles = {
      1: { bg: "bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500", label: "🥇" },
      2: { bg: "bg-gradient-to-br from-gray-300 via-slate-200 to-gray-400", label: "🥈" },
      3: { bg: "bg-gradient-to-br from-amber-600 via-orange-500 to-amber-700", label: "🥉" }
    };

    const style = rankStyles[rank];

    return (
      <div
        className={`relative transition-transform duration-300 ease-out ${isCenter ? 'z-20' : 'z-10'}`}
        style={{ transform: isCenter ? 'scale(1.05)' : 'scale(0.95)' }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = isCenter ? 'scale(1.05)' : 'scale(0.95)'}
      >
        {/* Rank Badge */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30">
          <span className="text-4xl drop-shadow-lg">{style.label}</span>
        </div>

        <div className={`${style.bg} rounded-2xl p-6 shadow-2xl ${isCenter ? 'mt-0' : 'mt-8'}`}>
          {/* Author */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src={suggestion.avatar}
              alt={suggestion.author}
              className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover"
            />
            <div>
              <div className={`font-bold ${rank === 1 ? 'text-amber-900' : rank === 2 ? 'text-gray-700' : 'text-white'}`}>
                {suggestion.author}
              </div>
              <div className={`text-sm ${rank === 1 ? 'text-amber-700' : rank === 2 ? 'text-gray-500' : 'text-amber-200'}`}>
                {suggestion.category}
              </div>
            </div>
          </div>

          {/* Suggestion Text */}
          <p className={`text-sm leading-relaxed mb-4 ${rank === 1 ? 'text-amber-900' : rank === 2 ? 'text-gray-700' : 'text-white'}`}>
            "{suggestion.text}"
          </p>

          {/* Like Button */}
          <button
            onClick={() => handleLike(suggestion.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${suggestion.hasLiked
              ? 'bg-white/90 text-amber-600'
              : rank === 1 ? 'bg-amber-900/20 text-amber-900 hover:bg-amber-900/30'
                : rank === 2 ? 'bg-gray-600/20 text-gray-700 hover:bg-gray-600/30'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
          >
            <ThumbsUp className={`w-4 h-4 ${suggestion.hasLiked ? 'fill-current' : ''}`} />
            <span className="font-bold">{suggestion.likes}</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Share Thoughts Section */}
      <section className="bg-gradient-to-br from-white via-gray-50 to-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Lightbulb className="w-4 h-4" />
              Community Ideas
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Share Your Thoughts & Ideas
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Help us improve! Vote for your favorite suggestions or share your own ideas to make this platform even better
            </p>
          </div>

          {/* Podium - Top 3 Suggestions */}
          <div className="mb-16">
            <div className="flex items-center justify-center gap-2 mb-8">
              <TrendingUp className="w-5 h-5 text-amber-600" />
              <h3 className="text-2xl font-bold text-gray-800">Top Suggestions</h3>
            </div>

            {/* Podium Layout: 2nd - 1st - 3rd */}
            <div className="flex items-end justify-center gap-4 md:gap-6 max-w-4xl mx-auto px-4">
              {/* 2nd Place - Silver (Left) */}
              {topThree[1] && (
                <div className="flex-1 max-w-[300px]">
                  <PodiumCard suggestion={topThree[1]} rank={2} isCenter={false} />
                </div>
              )}

              {/* 1st Place - Gold (Center, Elevated) */}
              {topThree[0] && (
                <div className="flex-1 max-w-[320px] -mt-8">
                  <PodiumCard suggestion={topThree[0]} rank={1} isCenter={true} />
                </div>
              )}

              {/* 3rd Place - Bronze (Right) */}
              {topThree[2] && (
                <div className="flex-1 max-w-[300px]">
                  <PodiumCard suggestion={topThree[2]} rank={3} isCenter={false} />
                </div>
              )}
            </div>
          </div>

          {/* Submit New Suggestion */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 md:p-8 shadow-lg max-w-3xl mx-auto mb-12">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-amber-600" />
              <h4 className="text-lg font-bold text-gray-800">Share Your Idea</h4>
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                value={newSuggestion}
                onChange={(e) => setNewSuggestion(e.target.value)}
                placeholder="What feature would you love to see?"
                className="flex-1 px-4 py-3 rounded-xl border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              />
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit
              </button>
            </div>
          </div>

          {/* Other Suggestions List */}
          {otherSuggestions.length > 0 && (
            <div className="max-w-3xl mx-auto">
              <h4 className="text-lg font-bold text-gray-700 mb-4">More Ideas from the Community</h4>
              <div className="space-y-3">
                {otherSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="bg-white rounded-xl p-4 shadow-md border border-gray-100 flex items-start gap-4 hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={suggestion.avatar}
                      alt={suggestion.author}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-800">{suggestion.author}</span>
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{suggestion.category}</span>
                      </div>
                      <p className="text-gray-600 text-sm">{suggestion.text}</p>
                    </div>
                    <button
                      onClick={() => handleLike(suggestion.id)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all ${suggestion.hasLiked
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-gray-100 text-gray-500 hover:bg-amber-50 hover:text-amber-600'
                        }`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${suggestion.hasLiked ? 'fill-current' : ''}`} />
                      <span className="font-medium text-sm">{suggestion.likes}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="my-16 flex items-center justify-center gap-4">
            <div className="h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent flex-1 max-w-xs" />
            <span className="text-amber-500 text-2xl">✦</span>
            <div className="h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent flex-1 max-w-xs" />
          </div>

          {/* Testimonials Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Star className="w-4 h-4 fill-current" />
              Traveler Stories
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Travelers Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real experiences from adventurers who explored India with us
            </p>
          </div>

          {/* Testimonials - Podium Style Cards */}
          <div className="flex items-end justify-center gap-4 md:gap-6 max-w-5xl mx-auto px-4 mb-8">
            {testimonials.map((testimonial, index) => {
              const isCenter = index === 1;
              const rankLabels = ["✨", "⭐", "💫"];
              const bgColors = [
                "bg-gradient-to-br from-orange-100 to-amber-100 border-orange-200",
                "bg-gradient-to-br from-amber-200 to-yellow-200 border-amber-300",
                "bg-gradient-to-br from-orange-100 to-amber-100 border-orange-200"
              ];

              return (
                <div
                  key={index}
                  className={`flex-1 max-w-[320px] transition-transform duration-300 ease-out cursor-pointer ${isCenter ? 'z-20' : 'z-10'}`}
                  style={{ transform: isCenter ? 'scale(1.05)' : 'scale(0.92)' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = isCenter ? 'scale(1.05)' : 'scale(0.92)'}
                  onClick={() => setActiveTestimonial(index)}
                >
                  <div className={`${bgColors[index]} rounded-2xl p-6 shadow-xl border-2 ${isCenter ? 'mt-0' : 'mt-6'}`}>
                    {/* Badge */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="text-2xl">{rankLabels[index]}</span>
                    </div>

                    {/* Avatar & Rating */}
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                      />
                      <div>
                        <div className="font-bold text-gray-800">{testimonial.name}</div>
                        <div className="text-sm text-amber-600">{testimonial.role}</div>
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="flex gap-0.5 mb-3">
                      {renderStars(testimonial.rating)}
                    </div>

                    {/* Quote */}
                    <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                      "{testimonial.content}"
                    </p>

                    {/* Location */}
                    <div className="mt-3 text-xs text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {testimonial.location}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Start Your Journey?
              </h3>
              <p className="text-gray-600 mb-6">
                Join our community and let AI help you discover your next amazing destination
              </p>
              <button className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Get Started Today
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
