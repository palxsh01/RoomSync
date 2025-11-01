import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Heart, Star } from "lucide-react";
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
    <div className="w-full max-w-6xl mx-auto px-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center">
            <Heart className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Your Top Matches</h1>
        <p className="text-lg text-muted-foreground">
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayMatches.map((match) => (
          <Card 
            key={match.id} 
            className="backdrop-blur-md bg-card/80 border-2 shadow-[var(--shadow-xl)] hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{match.name}</CardTitle>
                </div>
                <Badge className="bg-primary text-primary-foreground flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  {match.compatibility}%
                </Badge>
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
                onClick={() => navigate(`/match/${match.id}`, { 
                  state: { 
                    match: {
                      id: match.id,
                      name: match.name,
                      compatibility: match.compatibility,
                      matchingPreferences: match.matchingPreferences,
                      bio: match.bio,
                    }
                  } 
                })}
              >
                View Profile
              </Button>
            </CardContent>
          </Card>
        ))}
        </div>
      )}
    </div>
  );
};

export default Matches;
