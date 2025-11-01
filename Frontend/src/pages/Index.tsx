import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Questionnaire from "@/components/Questionnaire";
import Matches from "@/components/Matches";
import { Button } from "@/components/ui/button";
import { Users, CheckCircle, Sparkles } from "lucide-react";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [hasCompletedQuestionnaire, setHasCompletedQuestionnaire] = useState(false);

  useEffect(() => {
    const answers = localStorage.getItem('roommate_preferences');
    setHasCompletedQuestionnaire(!!answers);
    
    // Check if we should open questionnaire for editing
    if (searchParams.get('edit') === 'true') {
      setShowQuestionnaire(true);
      // Remove the query param after reading it
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const handleGetStarted = () => {
    setShowQuestionnaire(true);
  };

  const handleQuestionnaireComplete = () => {
    setShowQuestionnaire(false);
    setHasCompletedQuestionnaire(true);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[image:var(--gradient-hero)]">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-6 overflow-y-auto">
        {showQuestionnaire ? (
          <Questionnaire onComplete={handleQuestionnaireComplete} />
        ) : hasCompletedQuestionnaire ? (
          <Matches />
        ) : (
          <div className="text-center max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-primary flex items-center justify-center shadow-[var(--shadow-xl)]">
                  <Users className="h-12 w-12 text-primary-foreground" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
              Welcome to{" "}
              <span className="text-primary">RoomSync</span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-muted-foreground max-w-3xl mx-auto font-medium">
              The Best Place to Find Your Future Roommate!
            </p>

            <div className="flex flex-col md:flex-row gap-6 justify-center items-center mt-12">
              <div className="flex items-center gap-3 text-foreground">
                <CheckCircle className="h-6 w-6 text-primary" />
                <span className="text-lg">Smart Matching</span>
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <CheckCircle className="h-6 w-6 text-primary" />
                <span className="text-lg">Perfect Compatibility</span>
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <CheckCircle className="h-6 w-6 text-primary" />
                <span className="text-lg">Easy Process</span>
              </div>
            </div>

            <div className="mt-12">
              <Button
                variant="hero"
                size="lg"
                onClick={handleGetStarted}
                className="text-lg px-12 py-6 h-auto"
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
