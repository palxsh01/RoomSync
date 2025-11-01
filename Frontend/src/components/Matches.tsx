import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Heart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Matches = () => {
  const navigate = useNavigate();
  // Mock matches data - in real app, this would come from backend matching algorithm
  const matches = [
    {
      id: 1,
      name: "Utkersh Sharma",
      compatibility: 95,
      matchingPreferences: ["Very tidy", "Early bird", "Prefer quiet environment"],
      bio: "Computer Science major, loves reading and hiking"
    },
    {
      id: 2,
      name: "Rishita Khetan",
      compatibility: 88,
      matchingPreferences: ["Moderately clean", "Flexible", "Moderate noise is fine"],
      bio: "Business student, enjoys cooking and playing guitar"
    },
    {
      id: 3,
      name: "Tanishka Saxena",
      compatibility: 82,
      matchingPreferences: ["Very tidy", "Night owl", "Prefer quiet environment"],
      bio: "Engineering student, passionate about sports and technology"
    }
  ];

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
          Based on your preferences, here are your best roommate matches
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {matches.map((match) => (
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
                <h4 className="text-sm font-semibold mb-2 text-foreground">Matching Preferences:</h4>
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
                onClick={() => navigate(`/match/${match.id}`, { state: { match } })}
              >
                View Profile
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Matches;
