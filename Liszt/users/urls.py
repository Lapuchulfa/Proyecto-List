from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("Register/", views.Register_view, name="Register"),
    path("RegisterArtist", views.RegisterArtist, name="RegisterArtist"),
    path("Login", views.LoginView, name="Login"),
    path("home", views.HomeView, name="home"),
    path("perfil/", views.PerfilView, name="perfil"),
    path("perfil/actualizar/", views.PerfilUpdateView, name="perfil_update"),
    path("perfil/eliminar/", views.EliminarCuentaView, name="perfil_eliminar"),
]
