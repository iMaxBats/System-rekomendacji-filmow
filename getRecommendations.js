function getRecommendations() {
    const userId = document.getElementById("userId").value;

    // Wys�anie ��dania do backendu (zak�adamy, �e backend udost�pnia API REST pod adresem /recommendations)
    fetch(`/recommendations?userId=${userId}`)
        .then(response => response.json())
        .then(data => {
            const movieList = document.getElementById("movieList");
            movieList.innerHTML = ''; // Wyczy�� poprzednie rekomendacje

            data.forEach(movieTitle => {
                const listItem = document.createElement("li");
                listItem.textContent = movieTitle;
                movieList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('B��d podczas pobierania rekomendacji:', error);
            alert('Wyst�pi� b��d. Spr�buj ponownie p�niej.');
        });
}