class GDPRService:
    def erase_user(self, user_id: int):
        return {'status': 'erased', 'user_id': user_id}
