import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { Card, CardContent, CardHeader } from "../components/Card";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export default function TutorProfilePage() {
  const { id } = useParams(); // tutor id
  const navigate = useNavigate();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutor = async () => {
      const { data } = await supabase
        .from("profile")
        .select("*")
        .eq("id", id)
        .single();

      setTutor(data);
      setLoading(false);
    };

    fetchTutor();
  }, [id]);

  if (loading) {
    return <div className="p-6">Loading profile…</div>;
  }

  if (!tutor) {
    return <div className="p-6">Profile not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-teal-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <Card className="shadow-lg border-2 border-teal-300">
        <CardHeader className="text-center space-y-4 pb-4">
          <div className="flex justify-center">
            <ImageWithFallback
              src={tutor.avatar_url || "/default-avatar.png"}
              alt={tutor.name}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-teal-200"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {tutor.name}
            </h1>
            <p className="text-gray-600">
              {tutor.year} • {tutor.major}
            </p>
          </div>

          <div className="flex justify-center flex-wrap gap-2">
            <Badge>{tutor.studySessions || 0} sessions</Badge>
            <Badge>⭐ {tutor.rating || 0}</Badge>
            {tutor.online && (
              <Badge className="bg-emerald-500 text-white">Online</Badge>
            )}
          </div>
        </CardHeader>

          <CardContent>
            <p className="text-gray-700">{tutor.bio}</p>
          </CardContent>
        </Card>

        {/* Skills */}
        <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-2 border-teal-300 shadow-sm hover:shadow-md transition">
          <CardContent className="h-full flex flex-col justify-center pt-6">
            <h3 className="font-semibold mb-4 text-emerald-700 flex items-center gap-2">
              💪 Can help with
            </h3>
            <div className="flex flex-wrap gap-2">
              {tutor.areasOfStrength?.map((s, i) => (
                <Badge
                  key={i}
                  className="bg-emerald-50 text-emerald-700 border border-emerald-200"
                >
                  {s}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-teal-300 shadow-sm hover:shadow-md transition">
          <CardContent className="h-full flex flex-col justify-center pt-6">
            <h3 className="font-semibold mb-4 text-emerald-700 flex items-center gap-2">
              🎯 Wants help with
            </h3>
            <div className="flex flex-wrap gap-2">
              {tutor.areasOfDevelopment?.map((n, i) => (
                <Badge
                  key={i}
                  className="bg-emerald-50 text-emerald-700 border border-emerald-200"
                >
                  {n}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

        {/* Actions */}
        <div className="flex gap-4 pt-2">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex-1 border-2 border-teal-300 text-teal-600"
          >
            ← Back
          </Button>

          <Button
            onClick={() => navigate("/messages")}
            className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md"
          >
            Connect
          </Button>
        </div>
      </div>
    </div>
  );
}