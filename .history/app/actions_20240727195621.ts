'use server'

// import { kv } from '@vercel/kv'
import { getUser, userCookieKey } from 'libs/session'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function saveNote(
  noteId: string | null,
  title: string,
  body: string
) {
  const user = {
    userName: 'Pooja'
  }
  const note = {
    noteId,
    title,
    body,
    summary: null,
    date: Date.now()
  }
  try {
    const resp = await fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user, note })
    })
    if (resp.ok) {
      console.log('Note saved')
    } else {
      console.log('Error saving note')
    }
  } catch (error) {
    console.log('Error saving note')
  }

  // await kv.hset('notes', { [noteId]: JSON.stringify(payload) })

  revalidatePath('/')
  redirect(`/note/${noteId}`)
}

export async function deleteNote(noteId: string) {
  revalidatePath('/')
  redirect('/')
}
