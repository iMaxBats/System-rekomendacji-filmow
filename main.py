import mysql.connector  # Biblioteka do połączenia z MySQL
import pandas as pd    # Biblioteka do obsługi DataFrame'ów
from sklearn.neighbors import NearestNeighbors  # Algorytm KNN

def connect_to_mysql():
    """
    Funkcja nawiązująca połączenie z lokalną bazą danych MySQL.
    """
    try:
        conn = mysql.connector.connect(
            host='localhost',
            user='root',
            password='',
            database='system_rekomendacji'
        )
        return conn
    except mysql.connector.Error as err:
        print(f"Błąd podczas łączenia z bazą danych: {err}")
        return None

def fetch_data_from_db(conn):
    """
    Funkcja pobierająca dane z tabel 'Filmy', 'Uzytkownicy' i 'Oceny' z bazy danych.
    """
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM Filmy")
    films = cursor.fetchall()

    cursor.execute("SELECT * FROM Uzytkownicy")
    users = cursor.fetchall()

    cursor.execute("SELECT * FROM Oceny")
    ratings = cursor.fetchall()

    return films, users, ratings

def generate_recommendations(user_id, ratings_matrix, knn_model, movies_df, k=5):
    """
    Funkcja generująca rekomendacje filmów dla danego użytkownika.
    """
    distances, indices = knn_model.kneighbors(ratings_matrix.loc[user_id].values.reshape(1, -1), n_neighbors=k)
    recommended_movie_ids = ratings_matrix.columns[indices.flatten()]

    for movie_id in recommended_movie_ids:
        print(movies_df.loc[movies_df['movieId'] == movie_id]['title'].values[0])

# Nawiązanie połączenia z bazą danych
conn = connect_to_mysql()

if conn:
    # Pobranie danych z bazy danych
    films, users, ratings = fetch_data_from_db(conn)

    # Zamknięcie połączenia z bazą danych
    conn.close()

    # Przekształcenie danych na DataFrame'y
    ratings_df = pd.DataFrame(ratings, columns=['id_oceny', 'userId', 'movieId', 'rating'])
    movies_df = pd.DataFrame(films, columns=['movieId', 'title', 'genre', 'releaseYear'])

    # Przygotowanie macierzy ocen
    ratings_matrix = ratings_df.pivot(index='userId', columns='movieId', values='rating').fillna(0)

    # Utworzenie i dopasowanie modelu KNN
    knn_model = NearestNeighbors(metric='cosine', algorithm='brute')
    knn_model.fit(ratings_matrix)

    # Extract unique genres and assign genreId
    genre_df = movies_df['genre'].str.split(', ', expand=True).stack().reset_index(level=1, drop=True).reset_index(name='genre')
    genre_df = genre_df.drop_duplicates().reset_index(drop=True)
    genre_df['genreId'] = genre_df.index + 1

    # Explode the 'genre' column in movies_df
    movies_with_genres = movies_df.merge(genre_df, on='genre')

    # Create movie-genre matrix
    movie_genre_matrix = movies_with_genres.pivot_table(
        index='movieId', columns='genreId', aggfunc='size', fill_value=0
    )

    # Convert values greater than 0 to 1
    movie_genre_matrix = (movie_genre_matrix > 0).astype(int)

    # Calculate movie similarity matrix
    movie_similarity_matrix = movie_genre_matrix.dot(movie_genre_matrix.T)

    # Oblicz średnią ocenę dla każdego filmu
    average_ratings_df = ratings_df.groupby('movieId')['rating'].mean().reset_index()
    average_ratings_df.fillna(0, inplace=True)

    # Ustaw 'movieId' jako indeks i przekształć na macierz z jedną kolumną dla każdej oceny filmu
    average_ratings_matrix = average_ratings_df.set_index('movieId').T.fillna(0)

    # Generowanie rekomendacji dla użytkownika o ID 1
    user_id = 1
    generate_recommendations(user_id, ratings_matrix, knn_model, movies_df)

    # Wyświetl macierz średnich ocen
    print("\nMacierz średnich ocen:")
    print(average_ratings_matrix)

else:
    print("Nie udało się połączyć z bazą danych. Sprawdź ustawienia połączenia.")
