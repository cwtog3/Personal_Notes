from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base
from sqlalchemy import Text, Uuid, text, DateTime
from uuid import UUID
from datetime import datetime

class Note(Base):
    __tablename__ = "notes"
    question: Mapped[str] = mapped_column(Text, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, server_default=text("gen_random_uuid()"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=text("now()"))