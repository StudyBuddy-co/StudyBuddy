import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient"; // ✅ ADD: supabase client
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useNavigate } from "react-router-dom";

export default function TutorConnectPage({ onNavigate, tutors }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [computedTutors, setComputedTutors] = useState([]);

  const goToProfile = () => {
    navigate("/profile"); // <-- navigate to profile page
  };

  const filterOptions = ["High Match (80%+)", "Online Now", "Most Experienced", "All Peer Tutors"];

  const handleConnect = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onNavigate("messages");
    }, 2000);
  };

    // -------------------------------
  // MATCHING ALGORITHM
  // -------------------------------
  const calculateMatchScore = (user, tutor) => {
  if (!user) return 0;

  const userStrengths = user.areasOfStrength || [];
  const userNeeds = user.areasOfDevelopment || [];

  const tutorStrengths = tutor.areasOfStrength || [];
  const tutorNeeds = tutor.areasOfDevelopment || [];

  // Tutor helps user
  const tutorHelpsUser = tutorStrengths.filter(s =>
    userNeeds.includes(s)
  ).length;

  // User helps tutor
  const userHelpsTutor = tutorNeeds.filter(n =>
    userStrengths.includes(n)
  ).length;

  // No mutual value → no match
  if (tutorHelpsUser === 0 && userHelpsTutor === 0) {
    return 0;
  }

  const tutorHelpScore =
    tutorHelpsUser / Math.max(userNeeds.length, 1);

  const userHelpScore =
    userHelpsTutor / Math.max(tutorNeeds.length, 1);

  // Weight helping YOU higher than helping THEM
  const weightedScore =
    tutorHelpScore * 0.65 +
    userHelpScore * 0.35;

  return Math.round(weightedScore * 100);
};

    // -------------------------------
  // FETCH DATA FROM SUPABASE
  // -------------------------------
  useEffect(() => {
    const fetchData = async () => {
      // Get logged-in user
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) return;

      // Fetch current user's profile
      const { data: profile } = await supabase
        .from("profile")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      setCurrentUser(profile);

      // Fetch other students
      const { data: students } = await supabase
        .from("profile")
        .select("*")
        .neq("id", user.id);

      // Compute match scores
      const scoredTutors = (students || []).map(tutor => ({
        ...tutor,
        matchScore: calculateMatchScore(profile, tutor)
      }));

      setComputedTutors(scoredTutors);
    };

    fetchData();
  }, []);

    // Use computed tutors if available (fallback to props)
  const tutorsWithScores = computedTutors.length > 0
    ? computedTutors
    : tutors;


  // Filter tutors based on search + selected filter
    let results = (tutorsWithScores || []).filter((tutor) => {
    const matchesSearch =
      (tutor.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutor.areasOfStrength?.some(s =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      tutor.areasOfDevelopment?.some(n =>
        n.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      tutor.major?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === "High Match (80%+)") {
      return tutor.matchScore >= 80;
    }

    if (selectedFilter === "Online Now") {
      return tutor.online;
    }

    return true;
    });

    // Exact matches always float to the top
    results.sort((a, b) =>
    (b.matchScore >= 90) - (a.matchScore >= 90)
    );

    // Sorting logic
    if (selectedFilter === "Most Experienced") {
    results.sort((a, b) => (b.studySessions || 0) - (a.studySessions || 0));
    } else {
    results.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    }

    const filteredTutors = results;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 to-teal-50">
        <Card className="w-96 p-8 text-center shadow-xl border-teal-200">
          <div className="space-y-6">
            <div className="text-6xl animate-bounce">🤝</div>
            <h2 className="text-2xl font-bold text-gray-800">Connecting with Peer Tutor</h2>
            <p className="text-gray-600">
              We're setting up your connection and preparing your study space...
            </p>
            <div className="w-full bg-teal-100 rounded-full h-2">
              <div className="bg-gradient-to-r from-teal-400 to-cyan-400 h-2 rounded-full animate-pulse w-3/4"></div>
            </div>
            <div className="text-sm text-gray-500">You'll be able to help each other learn! 🎓</div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-stone-50 to-teal-50">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            Find Your Peer Study Buddy 🤝
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with fellow students who have complementary skills – you help them, they help you!
          </p>
        </div>

        {/* Info Banner */}
        <Card className="shadow-lg border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="p-6 flex items-start space-x-4">
            <div className="text-3xl">✨</div>
            <div className="flex-1">
              <h3 className="font-semibold text-purple-900 mb-2">How Peer Matching Works</h3>
              <p className="text-purple-800 text-sm">
                {currentUser
                  ? `You're strong in ${currentUser.areasOfStrength?.join(", ")} and need help with ${currentUser.areasOfDevelopment?.join(", ")}. We'll match you with students who complement your skills for a mutually beneficial partnership!`
                  : "We'll match you with students who excel in your areas of need and need support in your areas of strength – creating a mutually beneficial learning partnership!"
                }
              </p>
            </div>
            <Button
              onClick={goToProfile}
              className="border border-purple-300 text-purple-600 hover:bg-purple-50"
              variant="outline"
            >
              Edit My Skills
            </Button>
          </CardContent>
        </Card>

        {/* Search & Filter */}
        <Card className="shadow-lg border-stone-200">
          <CardContent className="p-6 flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search by name, subject, or major..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-stone-300 focus:border-teal-500"
            />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="border rounded px-3 py-2 w-full md:w-56"
            >
              <option value="">Filter by...</option>
              {filterOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white">🔍 Search</Button>
          </CardContent>
        </Card>

        {/* Tutors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutors.length === 0 && (
            <Card className="shadow-lg border-stone-200 p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2">No peer tutors found</h3>
              <p className="text-gray-600">Try adjusting your search or clear filters.</p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedFilter("");
                }}
                className="mt-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
              >
                Clear Filters
              </Button>
            </Card>
          )}

          {filteredTutors.map((tutor) => (
            <Card key={tutor.id} className="relative border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              {tutor.matchScore >= 90 && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  🏆 Perfect Match
                </div>
              )}
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <ImageWithFallback src={tutor.avatar_url || "/default-avatar.png"} alt={tutor.name} className="w-16 h-16 rounded-full object-cover" />
                      {tutor.online && <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full"></div>}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800">{tutor.name}</h3>
                      <p className="text-sm text-gray-600">{tutor.year} • {tutor.major}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge
                            className={
                              tutor.matchScore >= 90
                                ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0"
                                : "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0"
                            }
                          >
                            {tutor.matchScore || 0}% Match
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            {tutor.matchScore >= 90
                              ? "Exact skill complement"
                              : tutor.matchScore >= 80
                              ? "Strong mutual support"
                              : tutor.matchScore >= 40
                              ? "Some overlap"
                              : "No overlap"}
                          </p>
                        {tutor.online && <span className="text-xs text-emerald-600">● Online</span>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">⭐</span>
                    {tutor.rating || 0}
                  </div>
                  <div>{tutor.studySessions || 0} sessions</div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700 bg-green-100 p-3 rounded-lg border border-teal-400">{tutor.bio}</p>

                <div>
                  <h4 className="text-sm font-semibold text-emerald-700 mb-2 flex items-center">
                    💪 Can help you with:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {tutor.areasOfStrength?.map((s, i) => (
                      <Badge key={i} className="text-xs border-emerald-300 text-emerald-700 bg-emerald-50">{s}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-amber-700 mb-2 flex items-center">
                    🎯 Needs help with:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {tutor.areasOfDevelopment?.map((n, i) => (
                      <Badge key={i} className="text-xs border-amber-300 text-amber-700 bg-amber-50">{n}</Badge>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2 pt-4 border-t border-stone-200">
                  <button onClick={() => navigate(`/profile/${tutor.id}`)} className="flex-1 border rounded-md border-teal-300 text-teal-600 hover:bg-teal-50">View Profile</button>
                  <Button
                    onClick={handleConnect}
                    className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                  >
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}