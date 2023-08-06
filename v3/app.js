const DEFAULT_UUI = 'f9f10f0c-00da-4652-bf7c-07aaffb644ee';

const urlParams = new URLSearchParams(window.location.search);
const urlQuery = urlParams.get("matchchoice");

const nameToUuiMap = {
    'mdpatrick': '60c9493e-8b9d-4a0c-b778-d72dbe6e224d',
    'mdval': '382eb015-629c-4c09-97e6-010d326ca1c3',
    'mdpierre': '19a63acb-dbfa-480e-b7f5-f4142ed22f71',
    'mdmariaflor': 'f9f10f0c-00da-4652-bf7c-07aaffb644ee',
    'mdquality': DEFAULT_UUI
};

const uui = nameToUuiMap[urlQuery] || DEFAULT_UUI;

let chatBody = document.getElementById('chatBody');
let dialogue = [];

document.getElementById('chatForm').addEventListener('submit', handleFormSubmit);

function updateChatBody() {
    chatBody.innerHTML = '';
    dialogue.forEach(message => {
        const messageElement = document.createElement('p');
        messageElement.classList.add(message.role);
        messageElement.textContent = message.content;
        chatBody.appendChild(messageElement);
    });
}

async function handleFormSubmit(event) {
    event.preventDefault();
    const userInput = document.getElementById('userInput').value;
    const payload = {
        originalDialogue: dialogue,
        question: userInput,
        dataset: uui 
    };
    const submitButton = document.getElementById('submitButton');
    submitButton.disabled = true;

    dialogue.push({
        role: 'user',
        content: userInput
    });

    try {
        const response = await fetch('https://api.tolky.to/api/prompt/promptPrep', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const data = await response.json();
            if (data.data.finalResponse.response) {
                dialogue.push({
                    role: 'system',
                    content: data.data.finalResponse.response
                });
            }
            updateChatBody();
            document.getElementById('userInput').value = '';
        } else {
            console.error(`Error: ${response.status}`);
        }
    } catch (error) {
        console.error(error);
    } finally {
        submitButton.disabled = false;
    }
}
