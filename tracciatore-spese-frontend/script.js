// URL per le categorie e le spese
const categoriesUrl = 'http://localhost:8080/categories';
const expensesUrl = 'http://localhost:8080/expenses';

// Funzione per recuperare e visualizzare le categorie nel campo select
function loadCategories() {
    fetch(categoriesUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Dati ricevuti:', data); // Stampa i dati ricevuti nella console
            const categorySelect = document.getElementById('category');
            categorySelect.innerHTML = '';  // Resetta le opzioni precedenti

            if (Array.isArray(data)) {
                data.forEach(category => {
                    console.log('Categoria:', category); // Stampa ogni categoria nella console
                    const option = document.createElement('option');
                    option.value = category.id;  // Usa l'id della categoria come valore
                    option.textContent = category.categoryType;  // Mostra il tipo di categoria
                    categorySelect.appendChild(option);
                });
            } else {
                console.error('Data is not an array:', data);
            }
        })
        .catch(error => {
            console.error('Errore nel recupero delle categorie:', error);
        });
}

// Funzione per ottenere tutte le spese dal backend e visualizzarle
function getExpenses() {
    fetch(expensesUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Spese ricevute:', data); // Stampa le spese ricevute nella console
            const expenseList = document.getElementById('expenseList');
            expenseList.innerHTML = '';  // Svuota la lista prima di aggiornare

            if (Array.isArray(data)) {
                data.forEach(expense => {
                    console.log('Spesa:', expense); // Stampa ogni spesa nella console
                    const li = document.createElement('li');
                    li.textContent = `${expense.movement} - €${expense.cash} (${expense.category.categoryType}) - ${new Date(expense.date).toLocaleDateString()}`;
                    expenseList.appendChild(li);
                });
            } else {
                console.error('Data is not an array:', data);
            }
        })
        .catch(error => {
            console.error('Errore nel recupero delle spese:', error);
        });
}

// Funzione per aggiungere una nuova spesa
function addExpense(event) {
    event.preventDefault();  // Evita il comportamento predefinito del form

    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const categoryId = parseInt(document.getElementById('category').value);
    const date = document.getElementById('date').value;

    const expense = {
        movement: description,
        date: date,
        cash: amount,
        category_id: categoryId
    };

    fetch(expensesUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(expense)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Spesa aggiunta con successo:', data);
        getExpenses();  // Aggiorna la lista delle spese
        document.getElementById('expenseForm').reset();  // Resetta il form
    })
    .catch(error => {
        console.error('Errore nell\'aggiunta della spesa:', error);
    });
}

// Configura il listener per l'invio del form
document.getElementById('expenseForm').addEventListener('submit', addExpense);

// Carica le categorie e le spese quando la pagina viene caricata
window.onload = function() {
    loadCategories();  // Carica le categorie
    getExpenses();     // Carica le spese
};
