import { redirect } from 'next/navigation';

export default function UserLegacyPage() {
  redirect('/admin/users');
}
