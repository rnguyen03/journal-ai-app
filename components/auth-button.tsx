"use client";
import Link from 'next/link'
import { cookies } from 'next/headers'
import { getUser, userCookieKey } from 'libs/session'
import { useEffect, useState } from 'react';


export default function AuthButton({
  children,
  noteId
}: {
  children: React.ReactNode
  noteId: string | null
}) {
  const [user, setUser] = useState(null);

  const isDraft = noteId == null;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = () => {
    window.location.href = '/auth';
  };

  if (user) {
    return (
      // Use hard link
      <a href={`/note/edit/${noteId || ''}`} className="link--unstyled">
        <button
          className={[
            'edit-button',
            isDraft ? 'edit-button--solid' : 'edit-button--outline'
          ].join(' ')}
          role="menuitem"
        >
          {children}
        </button>
      </a>
    )
  }

  return (
      <button
        className={[
          'edit-button',
          isDraft ? 'edit-button--solid' : 'edit-button--outline'
        ].join(' ')}
        role="menuitem"
        onClick={handleLogin}
      >
        Login to Add
      </button>
  )
}
