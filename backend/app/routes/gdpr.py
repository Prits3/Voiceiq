from fastapi import APIRouter

router = APIRouter()

@router.get('/privacy')
def privacy():
    return {'privacy': 'ok'}
