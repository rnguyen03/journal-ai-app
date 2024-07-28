'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import SearchField from 'components/search'
import NoteList from 'components/note-list'
import NoteListSkeleton from 'components/note-list-skeleton'
import { fetchNotes } from '../app/actions' 


type Note = {
  id: string
  created_by: string
  title: string
  body: string
  updated_at: number
}

export default function Sidebar({
  children,
  initialNotes
}: {
  children: React.ReactNode
  initialNotes: Note[]
}) {
  return (
    <>
      <input type="checkbox" className="sidebar-toggle" id="sidebar-toggle" />
      <section className="col sidebar">
        <Link href={'/'} className="link--unstyled">
          <section className="sidebar-header">
            <img
              className="logo"
              src="/Mindmate.png"
              width="22px"
              height="20px"
              alt=""
              role="presentation"
            />
            <strong>Mind Mate</strong>
          </section>
        </Link>
        <section className="sidebar-menu" role="menubar">
          <SearchField />
          {children}
        </section>
        <nav>
          <Notes initialNotes={initialNotes} />
        </nav>
      </section>
    </>
  )
}

function Notes({ initialNotes }: { initialNotes: Note[] }) {
  const searchParams = useSearchParams()
  const search = searchParams.get('q')

  return (
    <Suspense fallback={<NoteListSkeleton />}>
      <NoteList notes={initialNotes} searchText={search} />
    </Suspense>
  )
}
