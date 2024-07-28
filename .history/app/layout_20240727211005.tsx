import './style.css'

import React from 'react'
import Sidebar from 'components/sidebar'
import AuthButton from 'components/auth-button'
import ParentComponent from 'components/login'
import { fetchNotes } from '../app/actions' 

type Note = {
  id: string
  created_by: string
  title: string
  body: string
  updated_at: number
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  
  const notes = await fetchNotes();

  let notesArray: Note[] = notes
    ? (Object.values(notes) as Note[]).sort(
        (a, b) => Number(a.id) - Number(b.id)
      )
    : []

  return (
    <html lang="en">
      <body>
        <div className="container">
          <div className="banner">
            <a
              href="https://nextjs.org/docs/app/building-your-application/rendering/server-components"
              target="_blank"
            >
              Learn more →
            </a>
          </div>
          <ParentComponent />
          <div className="main">
            <Sidebar initialNotes={notesArray}>
              <AuthButton noteId={null}>Add</AuthButton>
            </Sidebar>
            <section className="col note-viewer">{children}</section>
          </div>
        </div>
      </body>
    </html>
  )
}
