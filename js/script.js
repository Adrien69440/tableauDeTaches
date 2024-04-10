
// Récupérer les données depuis le localStorage lors du chargement de la page
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
console.log(tasks);

// Fonction pour charger et afficher les tâches
function displayTasks() {
    const tableBody = document.getElementById("taskTableBody");
// Filtrer les tâches en fonction du statut sélectionné
const filteredTasks = tasks.filter(task => {
    const filterStatus = document.getElementById("filterStatus").value;
    return filterStatus === "all" || task.status === filterStatus;
  });
    // Effacer le contenu existant du tableau
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    // Ajouter ou mettre à jour les lignes de tâches dans le tableau
    filteredTasks.forEach(task => {
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
                    const selectedOption = select.options[select.selectedIndex];
                    cell.style.backgroundColor = selectedOption.style.backgroundColor;
                    task[prop] = select.value;
                    task[prop + 'Color'] = selectedOption.style.backgroundColor; // Ajouter la couleur de fond à l'objet de tâche
                    localStorage.setItem('tasks', JSON.stringify(tasks)); // Enregistrer les tâches mises à jour dans le localStorage
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

        row.appendChild(deleteButtonCell);

        tableBody.appendChild(row);
    });
}

// // Fonction pour ajouter une tâche après la sélection de la date
function addTaskAfterDateSelection() {
    const time = document.getElementById("timeInput").value;
    const task = document.getElementById("taskInput").value;
    const responsible = document.getElementById("responsibleInput").value;
    const status = document.getElementById("statusInput").value;
    const id = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;

    // Créer une nouvelle tâche avec les valeurs saisies
    const newTask = { id, time, task, responsible, status };

    // Ajouter la nouvelle tâche à la liste des tâches
    tasks.push(newTask);
    
    // Enregistrer les données mises à jour dans le localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    // Afficher les tâches mises à jour
    displayTasks();
}

// // Écouter le clic sur le bouton Ajouter et appeler la fonction pour ajouter la tâche


document.querySelector('.btnAdd').addEventListener('click', addTaskAfterDateSelection);



const sortBySelect = document.getElementById("sortBy");
sortBySelect.addEventListener("change", function() {
  sortTasks(sortBySelect.value);
});

function sortTasks(sortBy) {
    tasks.sort(function(a, b) {
      if (sortBy === "date") {
        return new Date(a.time) - new Date(b.time);
      } else if (sortBy === "status") {
        return a.status.localeCompare(b.status);
      } else if (sortBy === "task") {
        return a.task.localeCompare(b.task);
      }
    });
    displayTasks();
  }
  let taskss = JSON.parse(localStorage.getItem('tasks')) || [];
sortTasks("date"); // Trier initialement par date

const filterStatusSelect = document.getElementById("filterStatus");
filterStatusSelect.addEventListener("change", function() {
  displayTasks();
});
function showNotification(message, type = "info") {
  // Créer un élément de notification
  const notification = document.createElement("div");
  notification.className = `notification is-${type}`;
  notification.innerHTML = `
    <button class="delete"></button>
    ${message}
  `;

  // Ajouter l'élément de notification au conteneur de notifications
  const notificationsContainer = document.getElementById("notifications");
  notificationsContainer.appendChild(notification);

  // Supprimer la notification après 5 secondes
  setTimeout(() => {
    notification.remove();
  }, 5000);

  // Ajouter un gestionnaire d'événements pour supprimer la notification lorsque l'utilisateur clique sur le bouton de suppression
  const deleteButton = notification.querySelector(".delete");
  deleteButton.addEventListener("click", () => {
    notification.remove();
  });
}

function checkTasks() {
  const currentTime = new Date();
  const currentDay = currentTime.getDate();
  const currentMonth = currentTime.getMonth() + 1; // Les mois sont indexés à partir de 0
  const currentYear = currentTime.getFullYear();

  let upcomingTasks = [];
  let lateTasks = [];

  // Vérifier chaque tâche
  tasks.forEach(task => {
    const taskTime = new Date(task.time);
    const taskDay = taskTime.getDate();
    const taskMonth = taskTime.getMonth() + 1;
    const taskYear = taskTime.getFullYear();

    if (taskYear > currentYear || (taskYear === currentYear && taskMonth > currentMonth) || (taskYear === currentYear && taskMonth === currentMonth && taskDay > currentDay)) {
      upcomingTasks.push(task);
    } else if (taskYear < currentYear || (taskYear === currentYear && taskMonth < currentMonth) || (taskYear === currentYear && taskMonth === currentMonth && taskDay < currentDay)) {
      lateTasks.push(task);
    }
  });

  // Afficher une notification pour les tâches à venir
  if (upcomingTasks.length > 0) {
    let message = "Tâches à venir :<br>";
    upcomingTasks.forEach(task => {
      message += `- ${task.task} (${task.time})<br>`;
    });
    showNotification(message);
  }

  // Afficher une notification pour les tâches en retard
  if (lateTasks.length > 0) {
    let message = "Tâches en retard :<br>";
    lateTasks.forEach(task => {
      message += `- ${task.task} (${task.time})<br>`;
    });
    showNotification(message, "danger");
  }
}

// function checkTasks() {
//   const today = new Date();
//   const currentMonth = today.getMonth();
//   const currentDay = today.getDate();

//   // Vérifier chaque tâche
//   tasks.forEach(task => {
//     const dueDate = new Date(task.time);
//     const dueMonth = dueDate.getMonth();
//     const dueDay = dueDate.getDate();

//     // Vérifier si la tâche est due aujourd'hui
//     if (dueMonth === currentMonth && dueDay === currentDay) {
//       showNotification(`La tâche "${task.task}" est due aujourd'hui.`, "info");
//     }

//     // Vérifier si la tâche est due dans les 7 prochains jours
//     if (dueMonth === currentMonth && dueDay - currentDay <= 7) {
//       showNotification(`La tâche "${task.task}" est due dans les 7 prochains jours.`, "warning");
//     }
//   });
// }

// Vérifier les tâches toutes les 5 minutes
setInterval(checkTasks, 1 * 60* 1000);