from django.db import connection

def sidebar_data(request):
    id_persona = request.session.get('idPersona')
    if not id_persona:
        return {}

    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT nombre FROM [usuarios].[Persona] WHERE idPersona = %s",
            [id_persona]
        )
        row = cursor.fetchone()
        nombre_usuario = row[0] if row else '?'

    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT idArtista FROM [musica].[Artista] WHERE idPersona = %s",
            [id_persona]
        )
        row = cursor.fetchone()
        es_artista = row is not None
        mi_artista_id = row[0] if row else None

    # Obtener idUsuario
    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT idUsuario FROM [usuarios].[Usuario] WHERE idPersona = %s",
            [id_persona]
        )
        row = cursor.fetchone()
        id_usuario = row[0] if row else None

    # Playlists del usuario
    playlists = []
    if id_usuario:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT idPlaylist, nombrePlaylist
                FROM [usuarios].[Playlist]
                WHERE Usuario_idUsuario = %s
                ORDER BY nombrePlaylist
            """, [id_usuario])
            playlists = [
                {'id': r[0], 'nombre': r[1]}
                for r in cursor.fetchall()
            ]

    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT c.idCancion, c.nombre, c.[duración],
                   p.nombre + ' ' + p.apellido AS artista
            FROM [musica].[Cancion] c
            INNER JOIN [musica].[Lanzamiento] l ON l.idLanzamiento = c.Lanzamiento_idLanzamiento
            INNER JOIN [musica].[Artista] a ON a.idArtista = l.idArtista
            INNER JOIN [usuarios].[Persona] p ON p.idPersona = a.idPersona
            ORDER BY c.reproducciones DESC
        """)
        sidebar_canciones = [
            {
                'id': r[0],
                'titulo': r[1],
                'duracion': f"{r[2] // 60}:{r[2] % 60:02d}" if r[2] else '0:00',
                'artista': r[3],
            }
            for r in cursor.fetchall()
        ]

    return {
        'nombre_usuario': nombre_usuario,
        'sidebar_canciones': sidebar_canciones,
        'es_artista': es_artista,
        'mi_artista_id': mi_artista_id,
        'id_usuario': id_usuario,
        'sidebar_playlists': playlists,
    }