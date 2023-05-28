let tasks = []; // Array to store generated tasks
let currentTaskIndex = -1; // Index of the currently displayed task

// Asynchronous function to fetch data from an API
async function getData() {
    const url = "https://www.boredapi.com/api/activity"; // URL of the API endpoint
    try {
        let getResponse = await fetch(url); // Send a GET request to the specified URL and wait for the response
        if (!getResponse.ok) {
            throw new Error("Network error"); // If the response is not successful, throw a network error
        } else {
            return getResponse.json(); // If the response is successful, parse the response body as JSON and return it
        }
    } catch (error) {
        throw new Error(error);// If an error occurs during the fetch or parsing, rethrow the error
    }
}

// Function to generate a new task
async function generateTask() {
    const response = await getData(); // Wait for the data to be fetched using the getData() function
    tasks.push(response); // Add the generated task to the tasks array
    showTask(); // Display the generated task
}

// Function to display the current task
function showTask() {
    const taskContainer = document.getElementById('taskContainer'); // Get the task container element by its ID
    taskContainer.innerHTML = ''; // Clear the task container by emptying its HTML contents

    // Check if no tasks are generated
    if (tasks.length === 0) {
        taskContainer.innerHTML = 'No tasks generated.'; // Display a message when no tasks are generated
        return;
    }

    // Ensure the current task index is within the valid range
    if (currentTaskIndex < 0) {
        currentTaskIndex = 0;
    } else if (currentTaskIndex >= tasks.length) {
        currentTaskIndex = tasks.length - 1;
    }

    const task = tasks[currentTaskIndex]; // Get the current task from the tasks array

    // Create text nodes for the task details
    const activityText = document.createTextNode('Activity: ' + task.activity);
    const typeText = document.createTextNode('Type: ' + task.type);

    // Create a button to mark the task as complete
    const markCompleteButton = document.createElement('button');
    markCompleteButton.textContent = 'Mark Complete';
    markCompleteButton.onclick = markComplete;

    // Append the task details and button to the task container
    taskContainer.appendChild(activityText);
    taskContainer.appendChild(document.createElement('br'));
    taskContainer.appendChild(typeText);
    taskContainer.appendChild(document.createElement('br'));
    taskContainer.appendChild(markCompleteButton);

    // Add task indicator circles to track the number of tasks
    const taskIndicatorDiv = document.createElement('div');
    taskIndicatorDiv.className = 'task-indicators';

    // Create a task indicator for each task
    for (let i = 0; i < tasks.length; i++) {
        const taskIndicator = document.createElement('span');
        taskIndicator.className = 'task-indicator';

        // Highlight the current task indicator
        if (i === currentTaskIndex) {
            taskIndicator.classList.add('active');
        }
        taskIndicatorDiv.appendChild(taskIndicator);
    }

    // Append the task indicators to the task container
    taskContainer.appendChild(taskIndicatorDiv);

    // Update the navigation buttons based on the current task
    updateNavigationButtons();
}

// Function to mark the current task as complete
function markComplete() {
    tasks.splice(currentTaskIndex, 1); // Remove the current task from the tasks array
    if (currentTaskIndex >= tasks.length) {
        currentTaskIndex = tasks.length - 1; // Adjust the current task index if necessary
    }
    showTask(); // Display the updated task list
}

// Function to move to the previous task
function prevTask() {
    // Check if there is a previous task
    if (currentTaskIndex > 0) {
        currentTaskIndex--; // Decrement the current task index
        showTask(); // Display the previous task
    }
}

// Function to move to the next task
function nextTask() {
    // Check if there is a next task
    if (currentTaskIndex < tasks.length - 1) {
        currentTaskIndex++; // Increment the current task index
        showTask(); // Display the next task
    }
}

// Function to update the navigation buttons based on the current task
function updateNavigationButtons() {
    const prevButton = document.getElementById('prevButton'); // Get the previous button element by its ID
    const nextButton = document.getElementById('nextButton'); // Get the next button element by its ID
    prevButton.disabled = currentTaskIndex <= 0; // Disable the previous button if on the first task
    nextButton.disabled = currentTaskIndex >= tasks.length - 1; // Disable the next button if on the last task
}

