'use server'

// import { kv } from '@vercel/kv'

import { getUser, userCookieKey } from 'libs/session'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

type Note = {
  Note_ID: string
  title: string
  body: string
  summary: string
  date: number
}

const crypto = require('crypto');

export async function saveNote(
  noteId: string | null,
  title: string,
  body: string,
) {
  const user ={
    email: "pooja@test.com"
  }
  if(!noteId){
    noteId = crypto.randomBytes(8).toString('hex');
  }
  const note = {
    Note_ID: noteId,
    title,
    body,
    summary: null,
    date: Date.now()

  }
  try{
    console.log("the note id is", noteId);
    const resp = await fetch('http://localhost:3000/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({user,note})
        })
      if(resp.ok){
        console.log('Note saved');


      } else{
        console.log('Error saving note')
      }
      
    } catch(error){
      console.log('Error saving note', error)
    }

  // await kv.hset('notes', { [noteId]: JSON.stringify(payload) })

  revalidatePath('/')
  redirect(`/note/${noteId}`)
}

export async function fetchNotes(){
  const user ={
    email: "pooja@test.com"
  }

  try{
    const resp = await fetch(`http://localhost:3000/api/notes?email=${user.email}`)
      if(resp.ok){
        const notes = await resp.json();
        if(notes.error){
          console.error(notes.error);
          return;
        }
        return notes.notes;

      } else{
        console.log('Error saving note')
      }
      
    } catch(error){
      console.log('Error saving note', error)
    }

  // await kv.hset('notes', { [noteId]: JSON.stringify(payload) })

}

export async function deleteNote(noteId: string) {
  const user ={
    email: "pooja@test.com"
  }
    try{
      const resp = await fetch(`http://localhost:3000/api/notes/${noteId}?
        email=${user.email}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({email: user.email, noteId})
          })
          if(resp.ok){
            console.log('Note deleted successfully')
            } else{
              console.log('Error deleting note')
              }
              } catch(error){
                console.log('Error deleting note', error)
                }
                
  revalidatePath('/')
  redirect('/')
}
