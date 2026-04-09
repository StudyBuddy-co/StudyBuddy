import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient'; // your supabase client
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Textarea } from '../components/textarea';
import { Badge } from '../components/Badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth'

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
    year_color: '',     // ← restore these
    major_color: '',
    school_color: '',
    location_color: '',
    classesTaken: [],
    strengths: [],
    areasOfDevelopment: [],
    avatar_url: ''
  });

  const [newClass, setNewClass] = useState('');
  const [newStrength, setNewStrength] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newTagText, setNewTagText] = useState('');
  const [newTagColor, setNewTagColor] = useState('bg-teal-500');
  const navigate = useNavigate();
  const { setUserProfile } = useAuth()

  const colorMap = {
  'bg-teal-500': 'bg-teal-500',
  'bg-cyan-500': 'bg-cyan-500',
  'bg-purple-500': 'bg-purple-500',
  'bg-stone-500': 'bg-stone-500',
};

const mainTags = [
  { key: 'year', defaultColor: 'bg-teal-500' },
  { key: 'major', defaultColor: 'bg-cyan-500' },
  { key: 'school', defaultColor: 'bg-purple-500' },
  { key: 'location', defaultColor: 'bg-stone-500' }
];

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
        .maybeSingle();

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
          year_color: data.year_color || '',      // ← restore these
          major_color: data.major_color || '',
          school_color: data.school_color || '',
          location_color: data.location_color || '',
          classesTaken: data.classesTaken || [],
          strengths: data.areasOfStrength || [],
          areasOfDevelopment: data.areasOfDevelopment || [],
          avatar_url: data.avatar_url || ''
        });
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

      const handleAvatarUpload = async (file) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error(uploadError);
        return;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const updatedProfile = { ...profile, avatar_url: data.publicUrl };
      setProfile(updatedProfile);
      window.dispatchEvent(new CustomEvent("profile-updated", { detail: updatedProfile }));
    };

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
      year_color: profile.year_color,         // ← restore these
      major_color: profile.major_color,
      school_color: profile.school_color,
      location_color: profile.location_color,
      classesTaken: profile.classesTaken,
      areasOfStrength: profile.strengths, // note the different key name in the database, strengths -> areasOfStrength
      areasOfDevelopment: profile.areasOfDevelopment,
      avatar_url: profile.avatar_url
    };

    const { error } = await supabase
      .from('profile')
      .upsert(updates);

    if (!error) {
    // Update global context immediately
    setUserProfile({
      id: user.id,
      name: profile.name,
      avatar_url: profile.avatar_url
    })

    // Optional: fire event for other listeners (like Header)
    window.dispatchEvent(new CustomEvent("profile-updated", { detail: { id: user.id, name: profile.name, avatar_url: profile.avatar_url }}))
  } else console.error(error);
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
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            My Profile 👤
          </h1>
          <p className="text-lg text-gray-600">
            Manage your account, skills, and learning resources
          </p>
        </div>
        {/* Profile Card */}
{/* Profile Card */}
<Card className="shadow-lg border-stone-200">
  <CardContent className="pt-6">
    <div className="flex items-center space-x-6">
      {/* Avatar with Upload */}
      <div className="flex flex-col items-center gap-2">
        <img
          src={
  profile.avatar_url ||
  `${import.meta.env.BASE_URL}default-avatar.svg`
}
          alt={profile.name}
          className="w-24 h-24 rounded-full object-cover border"
        />
        {isEditing && (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleAvatarUpload(e.target.files[0])}
            className="text-sm"
          />
        )}
      </div>

      {/* Name, Email, Tags */}
      <div className="flex-1 min-w-0">
        <Input
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          disabled={!isEditing}
          className="text-gray-900 font-semibold text-2xl w-full"
          placeholder="Your name"
        />
        <Input
          value={profile.email}
          disabled
          className="mt-1 text-gray-600 w-full"
        />

        {/* Tags: Year, Major, School, Location */}
        {/* Tags: Year, Major, School, Location */}
<div className="flex flex-wrap gap-2 mt-2">
  {mainTags.map(tag => {
    const value = profile[tag.key];
    return value ? (
      <Badge
        key={tag.key}
        className={`px-3 py-1 font-bold text-white ${
          colorMap[profile[`${tag.key}_color`]] || colorMap[tag.defaultColor]
        }`}
      >
        {value}
        {isEditing && (
          <button
            onClick={() => setProfile({ ...profile, [tag.key]: '', [`${tag.key}_color`]: '' })}
            className="ml-1 text-white font-bold"
          >
            ×
          </button>
        )}
      </Badge>
    ) : null;
  })}
</div>

{/* Add new tag input when editing */}
{isEditing && (
  <div className="flex gap-2 mt-2 flex-wrap">
    <Input
      value={newTagText}
      onChange={(e) => setNewTagText(e.target.value)}
      placeholder="Add a tag..."
      className="flex-1"
    />
    <select
      value={newTagColor}
      onChange={(e) => setNewTagColor(e.target.value)}
      className="border px-2 rounded"
    >
      <option value="bg-teal-500">Teal</option>
      <option value="bg-cyan-500">Cyan</option>
      <option value="bg-purple-500">Purple</option>
      <option value="bg-stone-500">Stone</option>
    </select>
    <Button
      onClick={() => {
        if (!newTagText.trim()) return;

        // Decide which main tag is empty first
        const emptyTag = mainTags.find(tag => !profile[tag.key]);
        if (emptyTag) {
          setProfile({
            ...profile,
            [emptyTag.key]: newTagText.trim(),
            [`${emptyTag.key}_color`]: newTagColor
          });
          setNewTagText('');
        }
      }}
    >
      Add
    </Button>
  </div>
)}
      </div>

      {/* Edit / Save Button */}
      <Button
        onClick={() => {
          if (isEditing) saveProfile();
          else setIsEditing(true);
        }}
        className={isEditing ? "border-gray-300" : "bg-gradient-to-r from-teal-500 to-cyan-500 text-white"}
      >
        {isEditing ? "Save Profile" : "Edit Profile"}
      </Button>
    </div>
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
        {profile.classesTaken.length > 0 &&
          profile.strengths.length > 0 &&
          profile.areasOfDevelopment.length > 0 && (
            <Card className="border-purple-200 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">🤝</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-purple-900 mb-2">Smart Peer Matching</h3>
                    <p className="text-purple-800 text-sm">
                      You'll be paired with peer tutors based on complementary skills. For example, if you're strong in <span className="font-semibold">{profile.strengths[0]}</span> and need help in <span className="font-semibold">{profile.areasOfDevelopment[0]}</span>, we'll match you with students who excel in {profile.areasOfDevelopment[0]} and need support in {profile.strengths[0]}.
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate('findtutors')}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  >
                    View Matches
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
      </div>
    </div>
  );
}