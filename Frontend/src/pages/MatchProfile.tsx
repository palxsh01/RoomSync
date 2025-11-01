import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, ArrowLeft, Star } from "lucide-react";

const MatchProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const match = location.state?.match;

  if (!match) {
    navigate('/');
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[image:var(--gradient-hero)]">
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
                  <Badge className="bg-primary text-primary-foreground flex items-center gap-1 w-fit mt-2">
                    <Star className="h-3 w-3 fill-current" />
                    {match.compatibility}% Match
                  </Badge>
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
              <h3 className="text-lg font-semibold mb-3 text-foreground">Roommate Preferences</h3>
              <div className="space-y-3">
                {match.matchingPreferences.map((pref: string, idx: number) => (
                  <div key={idx} className="p-4 bg-secondary/50 rounded-lg">
                    <p className="text-foreground">{pref}</p>
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
