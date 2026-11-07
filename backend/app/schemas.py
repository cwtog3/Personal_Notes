from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, Field

# задача класса - проверять данные, приходящие от пользователя
class NoteCreate(BaseModel):        # BaseModel для автоматической валидации данных
    question: str = Field(min_length = 1)
    content: str = Field(min_length = 1, max_length = 5000)
    
# задача класса - проверять данные, возвращающиеся от сервера
class NoteResponse(BaseModel):
    id: UUID
    question: str
    content: str
    created_at: datetime
    model_config = {"from_attributes": True}
    
class TagResponse(BaseModel):
    id: UUID
    name: str
    model_config = {"from_attributes": True}