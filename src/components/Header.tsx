import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Github, Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

interface HeaderProps {
  username?: string | null;
  showNav?: boolean;
}

export const Header = ({ username, showNav = false }: HeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    } else {
      navigate("/auth");
    }
  };

  const navItems = [
    { label: "Push", path: "/dashboard", dataTutorial: "new-repo" },
    { label: "Repositories", path: "/repositories" },
    { label: "Pull Requests", path: "/pull-requests" },
    { label: "Sync", path: "/sync" },
  ];

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Github className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            RepoPush
          </h1>
        </div>
        
        {showNav && username && (
          <>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4" data-tutorial="navigation">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  onClick={() => navigate(item.path)}
                  data-tutorial={item.dataTutorial}
                >
                  {item.label}
                </Button>
              ))}
              <Button
                variant="outline"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </nav>

            {/* Mobile Navigation */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <nav className="flex flex-col gap-2 mt-8">
                  {navItems.map((item) => (
                    <Button
                      key={item.path}
                      variant="ghost"
                      className="justify-start w-full text-base h-12"
                      onClick={() => {
                        navigate(item.path);
                        setMobileMenuOpen(false);
                      }}
                      data-tutorial={item.dataTutorial}
                    >
                      {item.label}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    className="justify-start w-full text-base h-12 mt-4"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </>
        )}
      </div>
    </header>
  );
};
