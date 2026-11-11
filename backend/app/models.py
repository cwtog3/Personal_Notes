from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
from sqlalchemy import Text, Uuid, text, DateTime, Table, Column, ForeignKey
from uuid import UUID
from datetime import datetime

# SQLAlchemy-модель, описывает, как заметка хранится в базе данных
class Note(Base):
    __tablename__ = "notes"
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, server_default=text("gen_random_uuid()"))
    question: Mapped[str] = mapped_column(Text, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=text("now()"))
    tags: Mapped[list["Tag"]] = relationship(secondary="note_tags", back_populates="notes")
    
class Tag(Base):
    __tablename__ = "tags"
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, server_default=text("gen_random_uuid()"))
    name: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
    notes: Mapped[list["Note"]] = relationship(secondary="note_tags", back_populates="tags")
    
note_tags = Table("note_tags", Base.metadata,
                  Column("note_id", Uuid, ForeignKey("notes.id", ondelete="CASCADE"), primary_key=True),
                  Column("tag_id", Uuid, ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True))
