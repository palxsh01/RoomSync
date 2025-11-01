import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User, Phone, Mail, Edit, Trash2 } from "lucide-react";

const UserInfo = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [about, setAbout] = useState("");
  const [preferences, setPreferences] = useState<Record<string, string> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved data
    const savedName = localStorage.getItem('user_name') || "";
    const savedEmail = localStorage.getItem('user_email') || "";
    const savedPhone = localStorage.getItem('user_phone') || "";
    const savedAbout = localStorage.getItem('user_about') || "";
    const savedPreferences = localStorage.getItem('roommate_preferences');
    
    setName(savedName);
    setEmail(savedEmail);
    setPhone(savedPhone);
    setAbout(savedAbout);
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
    
    // Check if profile is already saved
    setIsEditing(!(savedName && savedEmail && savedPhone));
  }, []);

  const handleSave = () => {
    localStorage.setItem('user_name', name);
    localStorage.setItem('user_email', email);
    localStorage.setItem('user_phone', phone);
    localStorage.setItem('user_about', about);
    
    setIsEditing(false);
    toast({
      title: "Profile saved!",
      description: "Your information has been updated successfully.",
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleClearPreferences = () => {
    localStorage.removeItem('roommate_preferences');
    toast({
      title: "Preferences cleared!",
      description: "Your roommate preferences have been reset.",
    });
    navigate('/');
  };

  const questionLabels: Record<string, string> = {
    cleanliness: "Cleanliness Habits",
    sleep_schedule: "Sleep Schedule",
    noise_tolerance: "Noise Tolerance",
    guests: "Guest Frequency",
    lifestyle: "Lifestyle",
    study_work: "Study/Work Time",
    ac_preference: "AC Preference",
    roommate_count: "Number of Roommates"
  };

  return (
    <div className="flex flex-col min-h-screen bg-[image:var(--gradient-hero)]">
      <Header />
      <main className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-4xl space-y-6 my-6">
          <Card className="backdrop-blur-md bg-card/80 border-2 shadow-[var(--shadow-xl)]">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-2">
                <User className="h-8 w-8 text-primary" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="bg-background/50"
                  disabled={!isEditing}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-background/50"
                  disabled={!isEditing}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="bg-background/50"
                  disabled={!isEditing}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="about">About Me</Label>
                <textarea
                  id="about"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Tell us a bit about yourself..."
                  className="w-full min-h-[100px] rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!isEditing}
                />
              </div>
              
              {isEditing ? (
                <Button onClick={handleSave} className="w-full mt-4">
                  Save Profile
                </Button>
              ) : (
                <Button onClick={handleEdit} className="w-full mt-4" variant="outline">
                  Edit Profile
                </Button>
              )}
            </CardContent>
          </Card>

          {preferences && (
            <Card className="backdrop-blur-md bg-card/80 border-2 shadow-[var(--shadow-xl)]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Your Roommate Preferences</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/?edit=true')}
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Preferences
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={handleClearPreferences}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Clear Preferences
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(preferences).map(([key, value]) => (
                    <div key={key} className="p-4 bg-secondary/50 rounded-lg">
                      <h3 className="font-semibold text-foreground mb-1">
                        {questionLabels[key] || key}
                      </h3>
                      <p className="text-muted-foreground">{value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserInfo;
