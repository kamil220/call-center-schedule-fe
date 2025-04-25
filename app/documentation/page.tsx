'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, Menu, FileText, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DocumentationContent } from '../../components/documentation-content';

export default function DocumentationPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [headings, setHeadings] = useState<Array<{id: string, text: string, level: number, icon?: string}>>([]);
  const [mainHeadings, setMainHeadings] = useState<Array<{id: string, text: string, level: number, icon?: string}>>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeSectionId, setActiveSectionId] = useState<string>("");


  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentRef.current) {
        const headingElements = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const extractedHeadings = Array.from(headingElements).map(heading => {
          // Find the icon span element (it's always the first child if present)
          const iconSpan = heading.querySelector('.inline-block.align-middle');
          const icon = iconSpan?.textContent || undefined;
          
          // Get the text content excluding the icon
          const text = heading.textContent?.replace(icon || '', '').trim() || '';
          
          return {
            id: heading.id || text.toLowerCase().replace(/\s+/g, '-'),
            text: text,
            icon: icon,
            level: parseInt(heading.tagName.substring(1), 10)
          };
        });
        
        setHeadings(extractedHeadings);
        
        const mainHeadingsOnly = extractedHeadings.filter(h => h.level <= 2);
        setMainHeadings(mainHeadingsOnly);
        
        if (mainHeadingsOnly.length > 0) {
          setActiveSectionId(mainHeadingsOnly[0].id);
        }
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!contentRef.current || mainHeadings.length === 0) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const headingId = entry.target.id;
            if (mainHeadings.some(h => h.id === headingId)) {
              setActiveSectionId(headingId);
            }
          }
        });
      },
      { 
        rootMargin: "-100px 0px -70% 0px",
        threshold: 0.1
      }
    );

    const headingElements = contentRef.current.querySelectorAll('h1, h2');
    headingElements.forEach((el) => observer.observe(el));

    return () => {
      headingElements.forEach((el) => observer.unobserve(el));
    };
  }, [mainHeadings]);
  
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (mainHeadings.some(h => h.id === id)) {
        setActiveSectionId(id);
      }
    }
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const activeMainHeading = mainHeadings.find(h => h.id === activeSectionId);
  const activeSection = activeMainHeading ? (activeMainHeading.icon ? `${activeMainHeading.icon} ${activeMainHeading.text}` : activeMainHeading.text) : "Documentation";

  return (
    <div className="flex min-h-screen">
      <aside 
        className={cn(
          "fixed inset-y-0 z-30 flex flex-col border-r bg-background transition-all duration-300 ease-in-out",
          isSidebarOpen ? "w-72" : "w-16"
        )}
      >
        <div className="flex h-14 items-center border-b px-4">
          <Button 
            variant="ghost" 
            className="p-0 h-8 w-8 mr-2"
            onClick={toggleSidebar}
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", !isSidebarOpen && "rotate-180")} />
          </Button>
          {isSidebarOpen && <h2 className="font-semibold">Documentation</h2>}
        </div>
        
        <ScrollArea className="flex-1 px-4 py-4 max-h-[calc(100vh-3.5rem)]">
          <nav className="flex flex-col space-y-1">
            {headings.map((heading, index) => {
              const isActiveMainHeading = heading.id === activeSectionId;
              const isUnderActiveSection = heading.level > 2 && 
                index > 0 && 
                mainHeadings.findIndex(h => h.id === activeSectionId) !== -1 && 
                mainHeadings.findIndex(h => h.id === headings[index-1].id) !== -1;
              
              return (
                <button
                  key={index}
                  onClick={() => scrollToHeading(heading.id)}
                  className={cn(
                    "flex items-center py-1 hover:text-primary transition-colors text-left rounded-md",
                    (isActiveMainHeading || isUnderActiveSection) ? "bg-accent/50 text-primary font-medium" : "",
                    heading.level === 1 ? "font-bold" : "",
                    isSidebarOpen ? (
                      heading.level === 2 ? "pl-4" : 
                      heading.level === 3 ? "pl-8" : 
                      heading.level === 4 ? "pl-12" : 
                      heading.level >= 5 ? "pl-16" : ""
                    ) : "justify-center"
                  )}
                >
                  {!isSidebarOpen ? (
                    heading.icon ? (
                      <span className="w-4 flex justify-center">{heading.icon}</span>
                    ) : (
                      heading.level === 1 ? 
                        <BookOpen className="h-4 w-4" /> : 
                        <FileText className="h-4 w-4" />
                    )
                  ) : (
                    <>
                      {heading.icon ? (
                        <span className="w-4 flex justify-center mr-2">{heading.icon}</span>
                      ) : (
                        heading.level === 1 ? 
                          <BookOpen className="h-4 w-4 mr-2" /> : 
                          <FileText className="h-4 w-4 mr-2" />
                      )}
                      <span className="text-sm truncate">{heading.text}</span>
                    </>
                  )}
                </button>
              );
            })}
          </nav>
        </ScrollArea>
      </aside>
      
      <div className={cn(
        "flex-1 overflow-auto relative", 
        isSidebarOpen ? "md:ml-72" : "md:ml-16"
      )}>
        <header className={cn(
          "fixed right-0 left-0 top-0 z-20 flex h-14 items-center gap-4 border-b bg-background px-4 md:px-6 transition-all duration-300 ease-in-out",
          isSidebarOpen ? "md:left-72" : "md:left-16"
        )}>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="text-foreground font-medium">{activeSection}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/" className="hidden sm:flex">
              <Button variant="outline">Back to Login</Button>
            </Link>
          </div>
        </header>
        
        <main className="flex-1 mt-6 px-4 py-6 md:px-6 lg:px-8">
          <div ref={contentRef} className="prose prose-slate max-w-4xl mx-auto">
            <DocumentationContent />
          </div>
        </main>
      </div>
    </div>
  );
} 