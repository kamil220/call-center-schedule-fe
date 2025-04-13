import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/login');

  // This part will not be reached because redirect() throws an error
  // return null;
}
