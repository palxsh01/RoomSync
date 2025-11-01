import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="w-full border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">R</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">RoomSync</h1>
        </div>
        
        <nav className="flex items-center gap-4">
          <Button
            variant={location.pathname === "/" ? "default" : "ghost"}
            onClick={() => navigate("/")}
          >
            Home
          </Button>
          <Button
            variant={location.pathname === "/user-info" ? "default" : "ghost"}
            onClick={() => navigate("/user-info")}
          >
            User Info
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
