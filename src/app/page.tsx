import { redirect } from 'next/navigation';

export default function Page() {
  redirect('/auth/login');
}
// force redeploy
