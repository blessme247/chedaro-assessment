import { Suspense } from 'react';
import { Login } from './(login)/login';

export default function SignInPage() {
  return (
    <Suspense>
      <Login mode="signin" />
    </Suspense>
  );
}
