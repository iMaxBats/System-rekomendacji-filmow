// App.js
import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import Footer from './components/Footer';
import FilterForm from './components/FilterForm';
import RandomMovies from './components/RandomMovies';
import PreferenceBubbles from './components/PreferenceBubbles'; // Новый компонент для выбора предпочтений

function App() {
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [isLoginFormVisible, setIsLoginFormVisible] = useState(false);
    const [isRegistrationFormVisible, setIsRegistrationFormVisible] = useState(false);
    const [showRandomMovies, setShowRandomMovies] = useState(false);
    const [showFilters, setShowFilters] = useState(true); // Отображаем фильтры по умолчанию
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [showPreferences, setShowPreferences] = useState(false); // Для отображения пузырьков после регистрации
    const [currentPage, setCurrentPage] = useState(1);
    const [randomMoviesShown, setRandomMoviesShown] = useState([]); // Список показанных случайных фильмов
    const [userPreferences, setUserPreferences] = useState([]); // Предпочтения пользователя

    // Данные фильмов, которые можно фильтровать
    const moviesData = [
        { name: 'Movie 1', genre: 'Action', director: 'Director 1', description: 'An exciting action movie about...' },
        { name: 'Movie 2', genre: 'Drama', director: 'Director 2', description: 'A dramatic story about...' },
        { name: 'Movie 3', genre: 'Comedy', director: 'Director 3', description: 'A light-hearted comedy to enjoy...' },
        { name: 'Movie 4', genre: 'Horror', director: 'Director 4', description: 'A scary horror movie that will thrill...' },
        { name: 'Movie 5', genre: 'Sci-Fi', director: 'Director 5', description: 'A sci-fi adventure through space...' },
        { name: 'Movie 6', genre: 'Romance', director: 'Director 6', description: 'A beautiful romance story that touches your heart...' },
        { name: 'Movie 7', genre: 'Fantasy', director: 'Director 7', description: 'A magical adventure with dragons and sorcery...' },
        { name: 'Movie 8', genre: 'Thriller', director: 'Director 8', description: 'A suspenseful thriller that keeps you on the edge...' },
        { name: 'Movie 9', genre: 'Animation', director: 'Director 9', description: 'An animated story full of fun and laughter...' },
        { name: 'Movie 10', genre: 'Action', director: 'Director 10', description: 'Another action-packed movie with great stunts...' },
        { name: 'Movie 11', genre: 'Drama', director: 'Director 11', description: 'A moving drama about family and relationships...' },
        { name: 'Movie 12', genre: 'Comedy', director: 'Director 12', description: 'A comedy movie that makes you laugh out loud...' },
        { name: 'Movie 13', genre: 'Horror', director: 'Director 13', description: 'A ghostly horror story that will send shivers...' },
        { name: 'Movie 14', genre: 'Sci-Fi', director: 'Director 14', description: 'Exploring the unknown universe with stunning visuals...' },
        { name: 'Movie 15', genre: 'Romance', director: 'Director 15', description: 'A love story that transcends boundaries...' },
        { name: 'Movie 16', genre: 'Fantasy', director: 'Director 16', description: 'A journey to a world of fantasy and wonder...' },
        { name: 'Movie 17', genre: 'Thriller', director: 'Director 17', description: 'A thrilling chase that will leave you breathless...' },
        { name: 'Movie 18', genre: 'Animation', director: 'Director 18', description: 'A fun animated film for the entire family...' },
        { name: 'Movie 19', genre: 'Action', director: 'Director 19', description: 'An action movie with non-stop excitement...' },
        { name: 'Movie 20', genre: 'Drama', director: 'Director 20', description: 'A drama that touches on the struggles of life...' },
        { name: 'Movie 21', genre: 'Comedy', director: 'Director 21', description: 'A hilarious comedy with unforgettable characters...' },
        { name: 'Movie 22', genre: 'Horror', director: 'Director 22', description: 'A bone-chilling horror film that terrifies...' },
        { name: 'Movie 23', genre: 'Sci-Fi', director: 'Director 23', description: 'A sci-fi tale of discovery and danger...' },
        { name: 'Movie 24', genre: 'Romance', director: 'Director 24', description: 'A romance that blossoms in the unlikeliest of places...' },
    ];

    // Функция переключения темы
    const toggleTheme = () => {
        setIsDarkTheme(prevTheme => !prevTheme);
    };

    // Функция для отображения формы входа
    const handleLoginClick = () => {
        setIsLoginFormVisible(true);
        setIsRegistrationFormVisible(false);
        setShowPreferences(false);
    };

    // Функция для отображения формы регистрации
    const handleRegisterClick = () => {
        setIsRegistrationFormVisible(true);
        setIsLoginFormVisible(false);
        setShowPreferences(false);
    };

    // Функции для закрытия форм
    const handleCloseLoginForm = () => {
        setIsLoginFormVisible(false);
    };

    const handleCloseRegistrationForm = () => {
        setIsRegistrationFormVisible(false);
    };

    // Обработчик для успешной регистрации
    const handleSuccessfulRegistration = () => {
        setIsRegistrationFormVisible(false);
        setShowPreferences(true); // Показать окно с пузырьками
    };

    // Обработчик для предпочтений пользователя
    const handlePreferencesSubmit = (preferences) => {
        setUserPreferences(preferences);
        setShowPreferences(false);
        setShowFilters(true); // Показать фильтры после выбора предпочтений
        setShowRandomMovies(false); // Скрыть случайные фильмы после выбора предпочтений
    };

    // Функция для обработки изменений фильтра
    const handleFilterChange = (filters) => {
        const filtered = moviesData.filter(movie => {
            const matchesGenre = !filters.genres || movie.genre.toLowerCase().includes(filters.genres.toLowerCase());
            const matchesKeywords = !filters.keywords || filters.keywords.split(' ').every(kw => movie.description.toLowerCase().includes(kw.toLowerCase()));
            const matchesDirector = !filters.director || movie.director.toLowerCase().includes(filters.director.toLowerCase());

            return matchesGenre && matchesKeywords && matchesDirector;
        });

        setFilteredMovies(filtered);
        setCurrentPage(1); // Сбросить на первую страницу при фильтрации
    };

    // Функция для перемешивания фильмов и отображения первых 6 уникальных фильмов
    const handleShowRandomMovies = () => {
        const availableMovies = moviesData.filter(movie => !randomMoviesShown.includes(movie));
        const shuffledMovies = shuffleMovies(availableMovies);
        const selectedMovies = shuffledMovies.slice(0, 6);

        setFilteredMovies(selectedMovies);
        setRandomMoviesShown(prevShown => [...prevShown, ...selectedMovies]);
        setShowRandomMovies(true);
    };

    // Функция для перемешивания фильмов
    const shuffleMovies = (movies) => {
        return movies
            .map(movie => ({ movie, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ movie }) => movie);
    };

    // Пагинация: Получение фильмов для текущей страницы
    const MOVIES_PER_PAGE = 6;
    const startIndex = (currentPage - 1) * MOVIES_PER_PAGE;
    const currentMovies = filteredMovies.length ? filteredMovies.slice(startIndex, startIndex + MOVIES_PER_PAGE) : moviesData.slice(startIndex, startIndex + MOVIES_PER_PAGE);
    const totalPages = Math.ceil((filteredMovies.length ? filteredMovies.length : moviesData.length) / MOVIES_PER_PAGE);

    return (
        <div className={`app ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
            <Header
                onLoginClick={handleLoginClick}
                isDarkTheme={isDarkTheme}
                toggleTheme={toggleTheme}
            />

            {isLoginFormVisible && (
                <LoginForm onClose={handleCloseLoginForm} onRegisterClick={handleRegisterClick} />
            )}

            {isRegistrationFormVisible && (
                <RegistrationForm
                    onClose={handleCloseRegistrationForm}
                    isDarkTheme={isDarkTheme}
                    onSuccessfulRegister={handleSuccessfulRegistration}
                />
            )}

            {showPreferences && (
                <PreferenceBubbles onPreferencesSubmit={handlePreferencesSubmit} /> /* Передаем обработчик для сохранения предпочтений */
            )}

            {!showPreferences && (
                <main className="content">
                    <h1>Welcome to Movie Recommendation Service</h1>
                    <p>Here you can explore movie recommendations and find your next favorite film!</p>

                    <div className="random-movies-container">
                        <button className="nav-button random-button" onClick={handleShowRandomMovies}>
                            {showRandomMovies ? 'Show More Random Movies' : 'Show Random Movies'}
                        </button>
                    </div>

                    {showFilters && (
                        <div className="filter-toggle-container">
                            <button className="nav-button filter-toggle-button" onClick={() => setShowFilters(!showFilters)}>
                                {showFilters ? 'Hide Filters' : 'Show Filters'}
                            </button>
                        </div>
                    )}

                    {showFilters && (
                        <div className="filter-form-container">
                            <FilterForm onFilterChange={handleFilterChange} />
                        </div>
                    )}

                    {showRandomMovies && (
                        <>
                            <h2 className="movies-header">Movies</h2>
                            <div className="movies-container">
                                <RandomMovies movies={filteredMovies} />
                            </div>
                        </>
                    )}

                    {!showRandomMovies && (
                        <>
                            <h2 className="movies-header">Movies</h2>
                            <div className="movies-container">
                                <RandomMovies movies={currentMovies} />
                            </div>
                            <div className="pagination-container">
                                <button className="nav-button" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                                    Previous
                                </button>
                                <span> Page {currentPage} of {totalPages} </span>
                                <button className="nav-button" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                                    Next
                                </button>
                            </div>
                        </>
                    )}

                    {userPreferences.length > 0 && (
                        <div className="user-preferences">
                            <h3>Your Preferences:</h3>
                            <ul>
                                {userPreferences.map((preference, index) => (
                                    <li key={index}>{preference}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </main>
            )}

            <Footer />
        </div>
    );
}

export default App;
