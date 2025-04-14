'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/40 px-4">
      <div className="flex flex-col items-center justify-center max-w-md text-center space-y-6">
        <ShieldAlert className="h-24 w-24 text-destructive" />
        
        <h1 className="text-4xl font-bold tracking-tighter">Access Forbidden</h1>
        
        <p className="text-muted-foreground">
          You don&apos;t have the necessary permissions to access this resource. If you believe this is an error, please contact your administrator.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => router.back()}
          >
            Go Back
          </Button>
          
          <Button 
            variant="default" 
            className="flex-1"
            asChild
          >
            <Link href="/dashboard">
              Go to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 