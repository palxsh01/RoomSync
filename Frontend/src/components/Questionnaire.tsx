import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSyncUser } from "@/hooks/useUser";

interface Question {
  id: string;
  question: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: "cleanliness",
    question: "How would you describe your cleanliness habits?",
    options: ["Very tidy", "Moderately clean", "Relaxed about mess", "Prefer organized chaos"],
  },
  {
    id: "sleep_schedule",
    question: "What's your typical sleep schedule?",
    options: ["Early bird (before 10 PM)", "Night owl (after midnight)", "Flexible", "Irregular schedule"],
  },
  {
    id: "noise_tolerance",
    question: "How do you feel about noise levels?",
    options: ["Prefer quiet environment", "Moderate noise is fine", "Don't mind louder spaces", "Music/TV lover"],
  },
  {
    id: "guests",
    question: "How often do you have guests over?",
    options: ["Rarely", "Occasionally (1-2 times/month)", "Frequently (weekly)", "Very often"],
  },
  {
    id: "lifestyle",
    question: "What best describes your lifestyle?",
    options: ["Homebody", "Social butterfly", "Balanced", "Always out"],
  },
  {
    id: "study_work",
    question: "When do you typically study or work from home?",
    options: ["Morning person", "Afternoon", "Evening", "Night shifts"],
  },
  {
    id: "ac_preference",
    question: "What's your AC/temperature preference?",
    options: ["Cool", "Moderate", "Warm", "No preference"],
  },
  {
    id: "roommate_count",
    question: "How many roommates are you looking for?",
    options: ["1 roommate", "2 roommates", "3 roommates", "4+ roommates"],
  },
];

interface QuestionnaireProps {
  onComplete: () => void;
}

const Questionnaire = ({ onComplete }: QuestionnaireProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();
  const syncUser = useSyncUser();

  // Load existing answers from localStorage if available
  useEffect(() => {
    const savedAnswers = localStorage.getItem('roommate_preferences');
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
  }, []);

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: value });
  };

  const handleNext = async () => {
    const currentAnswer = answers[questions[currentQuestion].id];
    if (!currentAnswer) {
      toast({
        title: "Please select an option",
        description: "You must select an answer before proceeding.",
        variant: "destructive",
      });
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Ensure we have the latest answers before saving
      const finalAnswers = { ...answers, [questions[currentQuestion].id]: currentAnswer };
      localStorage.setItem('roommate_preferences', JSON.stringify(finalAnswers));
      localStorage.setItem('preferences_last_updated', Date.now().toString());
      
      // Sync with backend
      setIsSyncing(true);
      try {
        await syncUser.mutateAsync();
        toast({
          title: "Preferences saved!",
          description: "Your roommate preferences have been synced with the backend.",
        });
      } catch (error) {
        toast({
          title: "Preferences saved locally",
          description: error instanceof Error 
            ? `Backend sync failed: ${error.message}` 
            : "Your preferences are saved but couldn't sync with backend.",
          variant: "default",
        });
      } finally {
        setIsSyncing(false);
      }
      
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto px-6 animate-fade-in">
      <Card className="p-8 shadow-[var(--shadow-xl)] border-2 backdrop-blur-md bg-card/80">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            {questions[currentQuestion].question}
          </h2>

          <RadioGroup
            value={answers[questions[currentQuestion].id] || ""}
            onValueChange={handleAnswer}
            className="space-y-3"
          >
            {questions[currentQuestion].options.map((option, index) => (
              <div key={index} className="flex items-center space-x-3">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label
                  htmlFor={`option-${index}`}
                  className="flex-1 p-4 rounded-lg border-2 border-input hover:border-primary cursor-pointer transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">{option}</span>
                    {answers[questions[currentQuestion].id] === option && (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="min-w-24"
          >
            Previous
          </Button>
          <Button 
            onClick={handleNext} 
            className="min-w-24"
            disabled={isSyncing}
          >
            {isSyncing 
              ? "Saving..." 
              : currentQuestion === questions.length - 1 
                ? "Finish" 
                : "Next"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Questionnaire;
