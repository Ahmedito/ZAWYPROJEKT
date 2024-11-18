document.addEventListener('DOMContentLoaded', function() {
    let countdown = 600; // 10 minut w sekundach
    const timerDisplay = document.getElementById('countdown');
    const message = document.getElementById('message');
    const items = document.querySelectorAll('.item');
    const categories = document.querySelectorAll('.category');
    const itemContainer = document.querySelector('.items');
    const progressBar = document.getElementById('progressBar'); // Dodanie paska postępu
    let placedItems = 0; // Licznik poprawnie umieszczonych elementów
    const totalItems = items.length; // Całkowita liczba elementów

    // Funkcja do formatowania czasu jako MM:SS
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    // Wyświetlenie początkowego czasu
    timerDisplay.textContent = formatTime(countdown);
    progressBar.value = 0; // Inicjalizacja paska postępu

    // Uruchom odliczanie
    const timer = setInterval(() => {
        countdown--;
        timerDisplay.textContent = formatTime(countdown);
        progressBar.value = 600 - countdown; // Aktualizacja paska postępu
        
        if (countdown <= 0) {
            clearInterval(timer);
            message.textContent = 'Czas się skończył!';
            message.classList.remove('hidden');
        }
    }, 1000);

    // Obsługa przeciągania i upuszczania
    items.forEach(item => {
        item.addEventListener('dragstart', dragStart);
    });

    categories.forEach(category => {
        category.addEventListener('dragover', dragOver);
        category.addEventListener('drop', dropItem);
    });

    function dragStart(event) {
        event.dataTransfer.setData('category', event.target.dataset.category);
        event.dataTransfer.setData('item-id', event.target.id);
    }

    function dragOver(event) {
        event.preventDefault();
    }

    function dropItem(event) {
        event.preventDefault();
        const itemCategory = event.dataTransfer.getData('category');
        const itemId = event.dataTransfer.getData('item-id');
        const item = document.getElementById(itemId);

        if (event.currentTarget.dataset.category === itemCategory) {
            event.currentTarget.appendChild(item); // Poprawne dopasowanie
            placedItems++;

            // Sprawdzenie, czy wszystkie elementy zostały poprawnie umieszczone
            if (placedItems === totalItems) {
                clearInterval(timer); // Zatrzymanie timera
                message.textContent = 'Koniec gry!';
                message.classList.remove('hidden');
            }
        } else {
            item.classList.add('incorrect'); // Błędne dopasowanie, kolorujemy na czerwono
            countdown = Math.max(0, countdown - 20); // Skrócenie czasu o 20 sekund
            timerDisplay.textContent = formatTime(countdown);
            progressBar.value = 600 - countdown; // Aktualizacja paska postępu

            setTimeout(() => {
                item.classList.remove('incorrect');
                itemContainer.appendChild(item); // Przeniesienie z powrotem na listę
            }, 1000); // Powrót po sekundzie
        }
    }
});
