import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Zap, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { SAMPLE_USERS } from "@/data/sampleUsers";
import { calculateCompatibility, UserPreferences } from "@/utils/compatibility";

interface DisplayMatch {
  id: number;
  name: string;
  compatibility: number;
  matchingPreferences: string[];
  bio: string;
  breakdown: {
    cleanliness: number;
    sleep_schedule: number;
    noise_tolerance: number;
    guests: number;
    lifestyle: number;
    study_work: number;
    ac_preference: number;
  };
}

const Matches = () => {
  const navigate = useNavigate();
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);

  // Load user preferences from localStorage
  useEffect(() => {
    const loadPreferences = () => {
      const saved = localStorage.getItem('roommate_preferences');
      if (saved) {
        try {
          const prefs = JSON.parse(saved) as UserPreferences;
          setUserPreferences(prefs);
        } catch (error) {
          console.error('Failed to parse preferences:', error);
        }
      }
    };

    loadPreferences();

    // Listen for storage changes (e.g., when questionnaire is completed)
    const handleStorageChange = () => {
      loadPreferences();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically for same-tab updates
    const interval = setInterval(() => {
      loadPreferences();
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Calculate matches against sample users
  const displayMatches = useMemo(() => {
    if (!userPreferences) {
      return [];
    }

    const matches: DisplayMatch[] = SAMPLE_USERS.map((sampleUser) => {
      const compatibility = calculateCompatibility(userPreferences, sampleUser.preferences);
      
      // Extract top matching preferences from breakdown
      const preferences = Object.entries(compatibility.breakdown)
        .sort(([, a], [, b]) => b - a) // Sort by score descending
        .slice(0, 3) // Get top 3
        .map(([key, value]) => {
          // Format the key to readable text
          const labels: Record<string, string> = {
            cleanliness: 'Cleanliness',
            sleep_schedule: 'Sleep Schedule',
            noise_tolerance: 'Noise Tolerance',
            guests: 'Guests',
            lifestyle: 'Lifestyle',
            study_work: 'Study/Work',
            ac_preference: 'AC Preference',
          };
          return `${labels[key] || key}: ${value}%`;
        });

      return {
        id: sampleUser.id,
        name: sampleUser.name,
        compatibility: compatibility.percentage,
        matchingPreferences: preferences.length > 0 
          ? preferences 
          : ['Compatibility calculated'],
        bio: sampleUser.bio,
        breakdown: compatibility.breakdown,
      };
    });

    // Sort by compatibility (highest first)
    return matches.sort((a, b) => b.compatibility - a.compatibility);
  }, [userPreferences]);

  const hasPreferences = !!userPreferences;

  return (
    <div className="w-full min-h-full animate-fade-in" style={{ backgroundColor: '#002323' }}>
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-primary flex items-center justify-center">
              <Zap className="h-8 w-8 sm:h-10 sm:w-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-2 sm:mb-4">Your Top Matches</h1>
          <p className="text-base sm:text-lg text-muted-foreground px-4">
            Based on your preferences, here are your compatibility scores with sample users
          </p>
        </div>

      {/* No Preferences State */}
      {!hasPreferences && (
        <div className="flex flex-col items-center justify-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-semibold text-foreground mb-2">Complete Questionnaire First</p>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Please complete the questionnaire to see your compatibility matches with sample users.
          </p>
        </div>
      )}

      {/* Matches Grid */}
      {hasPreferences && displayMatches.length > 0 && (
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 pb-4">
          {displayMatches.map((match) => (
          <Card 
            key={match.id} 
            className="backdrop-blur-md bg-card/80 border-2 shadow-[var(--shadow-xl)] hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
          >
            <CardHeader>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{match.name}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-6 w-6 fill-primary text-primary" />
                  <span className="text-3xl font-bold text-primary">{match.compatibility}%</span>
                  <span className="text-sm text-muted-foreground">Match</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{match.bio}</p>
              
              <div>
                <h4 className="text-sm font-semibold mb-2 text-foreground">Top Compatibility Factors:</h4>
                <div className="flex flex-wrap gap-2">
                  {match.matchingPreferences.map((pref, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {pref}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Button 
                className="w-full" 
                variant="default"
                onClick={() => {
                  const sampleUser = SAMPLE_USERS.find(u => u.id === match.id);
                  navigate(`/match/${match.id}`, { 
                    state: { 
                      match: {
                        id: match.id,
                        name: match.name,
                        compatibility: match.compatibility,
                        matchingPreferences: match.matchingPreferences,
                        bio: match.bio,
                        breakdown: match.breakdown,
                        sampleUserPreferences: sampleUser?.preferences,
                        userPreferences: userPreferences,
                      }
                    } 
                  });
                }}
              >
                View Profile
              </Button>
            </CardContent>
          </Card>
        ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default Matches;
