import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient'; // your supabase client
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Textarea } from '../components/textarea';
import { Badge } from '../components/Badge';
/*import { Avatar, AvatarFallback, AvatarImage } from '../components/Avatar';*/

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    school: '',
    major: '',
    year: '',
    location: '',
    classesTaken: [],
    strength: [],
    areasOfDevelopment: [],
    /*avatar: ''*/
  });

  const [newClass, setNewClass] = useState('');
  const [newStrength, setNewStrength] = useState('');
  const [newArea, setNewArea] = useState('');

  // Fetch user profile on load
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setProfile(prev => ({ ...prev, email: user.email }));

      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') console.error(error); // ignore not found
      if (data) {
        setProfile({
          name: data.name || '',
          email: user.email,
          bio: data.bio || '',
          school: data.school || '',
          major: data.major || '',
          year: data.year || '',
          location: data.location || '',
          classesTaken: data.classesTaken || [],
          strengths: data.areasOfStrength || [],
          areasOfDevelopment: data.areasOfDevelopment || [],
          /*avatar: data.avatar || '' --- IGNORE ---*/
        });
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const saveProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const updates = {
      id: user.id,
      name: profile.name,
      bio: profile.bio,
      school: profile.school,
      major: profile.major,
      year: profile.year,
      location: profile.location,
      classesTaken: profile.classesTaken,
      areasOfStrength: profile.strengths,
      areasOfDevelopment: profile.areasOfDevelopment,
      /*avatar: profile.avatar*/
    };

    const { error } = await supabase
      .from('profile')
      .upsert(updates);

    if (error) console.error(error);
    setIsEditing(false);
  };

  const addItem = (key, value, setValue) => {
    if (!value.trim()) return;
    setProfile({ ...profile, [key]: [...profile[key], value.trim()] });
    setValue('');
  };

  const removeItem = (key, index) => {
    setProfile({ ...profile, [key]: profile[key].filter((_, i) => i !== index) });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-teal-50 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Profile Card */}
        <Card className="shadow-lg border-stone-200">
          <CardContent className="flex flex-col sm:flex-row items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {/*<Avatar className="w-20 h-20">
                {profile.avatar ? <AvatarImage src={profile.avatar} alt={profile.name} /> : <AvatarFallback className="bg-teal-200 text-teal-800 text-2xl font-bold">{profile.name?.charAt(0)}</AvatarFallback>}
              </Avatar>*/}
              <div className="flex-1 min-w-0">
                <Input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  disabled={!isEditing}
                  className="text-gray-900 font-semibold text-lg w-full"
                  placeholder="Your name"
                />
                <Input
                  value={profile.email}
                  disabled
                  className="mt-1 text-gray-600 w-full"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.year && <Badge className="bg-teal-100 text-teal-800">{profile.year}</Badge>}
                  {profile.major && <Badge className="bg-cyan-100 text-cyan-800">{profile.major}</Badge>}
                  {profile.school && <Badge className="bg-purple-100 text-purple-800">{profile.school}</Badge>}
                  {profile.location && <Badge className="bg-stone-100 text-stone-800">{profile.location}</Badge>}
                </div>
              </div>
            </div>

            <Button
              onClick={() => {
                if (isEditing) saveProfile();
                else setIsEditing(true);
              }}
              className={isEditing ? "border-gray-300" : "bg-gradient-to-r from-teal-500 to-cyan-500 text-white"}
            >
              {isEditing ? "Save Profile" : "Edit Profile"}
            </Button>
          </CardContent>
        </Card>

        {/* Bio */}
        <Card className="shadow-lg border-stone-200">
          <CardHeader>
            <CardTitle>✍️ About Me</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={profile.bio}
                onChange={e => setProfile({ ...profile, bio: e.target.value })}
                rows={4}
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="p-3 border border-stone-200 rounded-lg bg-stone-50 text-gray-800">
                {profile.bio || "Add a bio to let others know about you."}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Tags */}
        {['classesTaken', 'strengths', 'areasOfDevelopment'].map((key) => (
          <Card key={key} className="shadow-lg border-stone-200">
            <CardHeader>
              <CardTitle>
                {key === 'classesTaken' ? '📖 Classes Taken' :
                 key === 'strengths' ? '💪 Strengths' :
                 '🎯 Areas of Development'}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {profile[key].map((item, i) => (
                <Badge
                  key={i}
                  className={`flex items-center gap-1 ${
                    key === 'classesTaken' ? 'bg-blue-50 text-blue-700' :
                    key === 'strengths' ? 'bg-emerald-50 text-emerald-700' :
                    'bg-amber-50 text-amber-700'
                  }`}
                >
                  {item}
                  {isEditing && <button onClick={() => removeItem(key, i)}>×</button>}
                </Badge>
              ))}

              {isEditing && (
                <div className="flex gap-2 mt-2 w-full">
                  <Input
                    value={key === 'classesTaken' ? newClass : key === 'strengths' ? newStrength : newArea}
                    onChange={e => key === 'classesTaken' ? setNewClass(e.target.value)
                      : key === 'strengths' ? setNewStrength(e.target.value)
                      : setNewArea(e.target.value)}
                    placeholder={key === 'classesTaken' ? 'Add a class...' :
                                 key === 'strengths' ? 'Add a strength...' :
                                 'Add an area...'}
                    onKeyDown={e => {
                      if (e.key !== "Enter") return;
                      key === 'classesTaken' ? addItem(key, newClass, setNewClass)
                        : key === 'strengths' ? addItem(key, newStrength, setNewStrength)
                        : addItem(key, newArea, setNewArea);
                    }}
                  />
                  <Button onClick={() => {
                    key === 'classesTaken' ? addItem(key, newClass, setNewClass)
                      : key === 'strengths' ? addItem(key, newStrength, setNewStrength)
                      : addItem(key, newArea, setNewArea);
                  }}>
                    Add
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}