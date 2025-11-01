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
    <div className={`flex flex-col ${hasCompletedQuestionnaire ? 'min-h-screen' : 'h-screen overflow-hidden'} ${hasCompletedQuestionnaire ? '' : 'bg-[image:var(--gradient-hero)]'}`}>
      <Header />
      
      <main className={`flex-1 ${hasCompletedQuestionnaire ? 'overflow-y-auto' : 'flex items-center justify-center overflow-y-auto'} ${hasCompletedQuestionnaire ? '' : 'px-6'}`}>
        {showQuestionnaire ? (
          <div className="w-full py-6">
            <Questionnaire onComplete={handleQuestionnaireComplete} />
          </div>
        ) : hasCompletedQuestionnaire ? (
          <Matches />
        ) : (
          <div className="text-center max-w-4xl mx-auto space-y-4 animate-fade-in px-6 py-4">
            <div className="flex justify-center mb-3">
              <div className="relative">
                <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center shadow-[var(--shadow-xl)]">
                  <Users className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                </div>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Welcome to{" "}
              <span className="text-primary">RoomSync</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              The Best Place to Find Your Future Roommate!
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-6">
              <div className="flex items-center gap-2 text-foreground">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-base">Smart Matching</span>
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-base">Perfect Compatibility</span>
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-base">Easy Process</span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                variant="hero"
                size="default"
                onClick={handleGetStarted}
                className="text-base px-8 py-3"
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
