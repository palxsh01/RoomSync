import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, ArrowLeft, Star } from "lucide-react";
import { UserPreferences } from "@/utils/compatibility";

interface PreferenceBreakdown {
  cleanliness: number;
  sleep_schedule: number;
  noise_tolerance: number;
  guests: number;
  lifestyle: number;
  study_work: number;
  ac_preference: number;
}

const MatchProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const match = location.state?.match;
  const sampleUserPreferences = match?.sampleUserPreferences as UserPreferences | undefined;
  const breakdown = match?.breakdown as PreferenceBreakdown | undefined;

  if (!match || !sampleUserPreferences || !breakdown) {
    navigate('/');
    return null;
  }

  // Preference labels mapping
  const preferenceLabels: Record<string, string> = {
    cleanliness: "Cleanliness Habits",
    sleep_schedule: "Sleep Schedule",
    noise_tolerance: "Noise Tolerance",
    guests: "Guest Frequency",
    lifestyle: "Lifestyle",
    study_work: "Study/Work Time",
    ac_preference: "AC Preference",
    roommate_count: "Number of Roommates",
  };

  // Sort preferences by compatibility score (highest first)
  const sortedPreferences = Object.entries(breakdown)
    .map(([key, score]) => ({
      key,
      label: preferenceLabels[key] || key,
      score,
      value: sampleUserPreferences[key as keyof UserPreferences],
    }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#002323' }}>
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <Card className="w-full max-w-3xl backdrop-blur-md bg-card/80 border-2 shadow-[var(--shadow-xl)]">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-3xl">{match.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Star className="h-6 w-6 fill-primary text-primary" />
                    <span className="text-3xl font-bold text-primary">{match.compatibility}%</span>
                    <span className="text-sm text-muted-foreground">Match</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {match.bio && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">About</h3>
                <p className="text-muted-foreground">{match.bio}</p>
              </div>
            )}
            
            <div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">Preferences (Sorted by Compatibility)</h3>
              <div className="space-y-3">
                {sortedPreferences.map((pref, idx) => (
                  <div key={idx} className="p-4 bg-secondary/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-foreground mb-1">{pref.label}</p>
                        <p className="text-muted-foreground">
                          {pref.value}
                          <span className="ml-2 text-primary font-medium">
                            ({pref.score}%)
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Button 
              onClick={() => navigate('/')} 
              className="w-full flex items-center justify-center gap-2"
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Matches
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MatchProfile;
