from dataclasses import field

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Note
from app.schemas import NoteResponse, NoteCreate, NoteUpdate
from uuid import UUID
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=["http://127.0.0.1:5500"], allow_methods=["GET", "POST", "PATCH", "DELETE"], allow_headers = ["Content-Type"], allow_credentials = False)

@app.get("/")
async def root():
    return {"message": "ура победа"}

@app.get("/api/notes", response_model=list[NoteResponse])
def get_notes(db: Session = Depends(get_db)):       #FastAPI получает сессию через зависимость get_db
    stmt = select(Note)
    result = db.execute(stmt)
    notes = result.scalars().all()
    print(len(notes))
    return notes

@app.get("/api/notes/{note_id}", response_model=NoteResponse)
def get_note(note_id: UUID, db: Session = Depends(get_db)):
    note = db.get(Note, note_id)
    if note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@app.post("/api/notes", response_model=NoteResponse, status_code=201)
def create_note(data: NoteCreate, db: Session = Depends(get_db)):
    note = Note(question = data.question, content = data.content)
    db.add(note)
    db.commit()
    db.refresh(note)
    return note

@app.patch("/api/notes/{note_id}", response_model=NoteResponse)
def edit_note(note_id:UUID, data: NoteUpdate, db: Session = Depends(get_db)):
    note = db.get(Note, note_id)
    if note is None:
        raise  HTTPException(status_code=404, detail="Note not found")
    changes = data.model_dump(exclude_unset=True)
    for field, value in changes.items():
        setattr(note, field, value)
    db.commit()
    db.refresh(note)
    return note

@app.delete("/api/notes/{note_id}", status_code=204)
def delete_note(note_id: UUID, db: Session = Depends(get_db)):
    note = db.get(Note, note_id)
    if note is None:
        raise HTTPException(status_code=404)
    db.delete(note)
    db.commit()