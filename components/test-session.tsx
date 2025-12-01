'use client';

import { useSession } from 'next-auth/react';

export default function TestSession() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading session...</div>;
  }

  if (status === 'unauthenticated') {
    return <div>Not logged in</div>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Session Debug Info</h2>

      <div className="space-y-2 bg-black p-4 rounded">
        <p>
          <strong>Status:</strong> {status}
        </p>
        <p>
          <strong>User ID:</strong> {session?.user?.id || '❌ NOT FOUND'}
        </p>
        <p>
          <strong>Email:</strong> {session?.user?.email || '❌ NOT FOUND'}
        </p>
        <p>
          <strong>Name:</strong> {session?.user?.name || '❌ NOT FOUND'}
        </p>
        <p>
          <strong>Role:</strong> {session?.user?.role || '❌ NOT FOUND'}
        </p>
        <p>
          <strong>Role ID:</strong> {session?.user?.role || '❌ NOT FOUND'}
        </p>
      </div>

      <div className="mt-4">
        <h3 className="font-bold mb-2">Full Session Object:</h3>
        <pre className="bg-black text-green-400 p-4 rounded overflow-auto text-xs">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </div>
  );
}
