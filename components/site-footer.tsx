/* Ignore deprecated due is a demo app */
import { Github, Linkedin } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t">
      <div className="container flex flex-col items-center gap-4 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <a
            href="https://www.linkedin.com/in/kamil-lazarz/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href="https://github.com/kamil220"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Github className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
} 