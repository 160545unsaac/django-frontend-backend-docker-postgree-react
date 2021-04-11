from webapp.viewsets import UsuarioViewset
from rest_framework import routers

router = routers.DefaultRouter()
router.register('usuario',UsuarioViewset)