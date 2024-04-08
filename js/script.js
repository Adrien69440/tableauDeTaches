// Récupérer les données depuis le localStorage lors du chargement de la page
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
console.log(tasks);
// Fonction pour charger les tâches depuis le localStorage
function loadTasks() {
    const tasksJSON = localStorage.getItem('tasks');
    return tasksJSON ? JSON.parse(tasksJSON) : [];
}

// Fonction pour enregistrer les tâches dans le localStorage
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Fonction pour ajouter une tâche
function addTask() {
    const time = document.getElementById("timeInput").value;
    const task = document.getElementById("taskInput").value;
    const responsible = document.getElementById("responsibleInput").value;
    const status = document.getElementById("statusInput").value;
    const id = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;

    const newTask = { id, time, task, responsible, status };
    tasks.push(newTask);
    
    saveTasks(tasks);
    displayTasks();
}

// Fonction pour charger et afficher les tâches
function displayTasks() {
    tasks = loadTasks(); // Charger les tâches depuis le localStorage

    const tableBody = document.getElementById("taskTableBody");
    tableBody.innerHTML = ''; // Effacer le contenu existant du tableau

    tasks.forEach(task => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${task.time}</td>
            <td>${task.task}</td>
            <td>${task.responsible}</td>
            <td>${task.status}</td>
            // <td><button onclick="editTask(${task.id})">Éditer</button></td>
            <td><button onclick="deleteTask(${task.id})">Supprimer</button></td>
        `;
        tableBody.appendChild(row);
    });
}

// Appeler displayTasks lors du chargement initial de la page
displayTasks();


function displayTasks() {
    const tableBody = document.getElementById("taskTableBody");

    // Efface les lignes existantes du tableau
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    // Ajoute ou met à jour les lignes de tâches dans le tableau
    tasks.forEach(task => {
        const row = document.createElement("tr");

        const properties = ['time', 'task', 'responsible', 'status'];
        properties.forEach(prop => {
            const cell = document.createElement("td");

            // Créer un champ d'entrée régulier pour les autres colonnes
            if (prop !== 'time' && prop !== 'status') {
                const input = document.createElement("input");
                input.value = task[prop];
                input.disabled = true;
                cell.appendChild(input);
            } else if (prop === 'time') {
                // Pour la colonne 'time', créer un champ de date avec Flatpickr
                const input = document.createElement("input");
                input.value = task[prop];
                input.disabled = true;
                cell.appendChild(input);
                
                // Configurer Flatpickr pour cette cellule
                flatpickr(input, {
                    enableTime: true,
                    dateFormat: "Y-m-d H:i",
                    disableMobile: true
                  
                });
            } else {
                // Pour la colonne 'status', créer un menu déroulant
                const select = document.createElement("select");

                // Définir les options de statut avec les couleurs correspondantes
                const statusOptions = [
                    { text: 'À faire', value: 'à faire', color: 'red' },
                    { text: 'En cours', value: 'en cours', color: 'yellow' },
                    { text: 'Fait', value: 'fait', color: 'green' }
                ];
                statusOptions.forEach(option => {
                    const optionElement = document.createElement("option");
                    optionElement.textContent = option.text;
                    optionElement.value = option.value;
                    optionElement.style.backgroundColor = option.color;
                    select.appendChild(optionElement);
                });

                // Définir la valeur initiale du menu déroulant
                select.value = task[prop];

                // Ajouter un gestionnaire d'événements pour mettre à jour la couleur de fond de la cellule
                select.addEventListener('change', () => {
                    cell.style.backgroundColor = select.options[select.selectedIndex].style.backgroundColor;
                    task[prop] = select.value;
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                });

                cell.appendChild(select);
            }

            row.appendChild(cell);
        });

        

        const deleteButtonCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener('click', () => {
            tasks = tasks.filter(t => t.id !== task.id);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            displayTasks();
        });
        deleteButtonCell.appendChild(deleteButton);

        // row.appendChild(editButtonCell);
        row.appendChild(deleteButtonCell);

        tableBody.appendChild(row);
    });
}


function addTask() {
    const time = document.getElementById("timeInput").value;
    const task = document.getElementById("taskInput").value;
    const responsible = document.getElementById("responsibleInput").value;
    const status = document.getElementById("statusInput").value;
    const id = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;

    tasks.push({ id, time, task, responsible, status, done: false });
    
    // Enregistrer les données mises à jour dans le localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    displayTasks();
}



function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    
    // Enregistrer les données mises à jour dans le localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    displayTasks();
}

displayTasks();

