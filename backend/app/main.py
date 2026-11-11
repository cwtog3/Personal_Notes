from fastapi import FastAPI, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Note
from app.schemas import NoteResponse
from uuid import UUID

app = FastAPI()

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
    return db.get(Note, note_id)