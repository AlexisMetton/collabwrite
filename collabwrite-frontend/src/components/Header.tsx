import { Link } from "react-router-dom"
import { LogIn, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/logo_collabwrite.png" 
            alt="CollabWrite Logo" 
            className="h-12 w-auto"
          />
        </Link>
        
        <nav className="hidden md:flex items-center gap-4">
          {/*<Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Accueil
          </Link>*/}
        </nav>
        
        <div className="flex items-center gap-2">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="gap-2">
              <LogIn className="h-4 w-4" />
              Connexion
            </Button>
          </Link>
          <Link to="/register">
            <Button size="sm" className="gap-2">
              <UserPlus className="h-4 w-4" />
              Inscription
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
