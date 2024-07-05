document.querySelector('#team-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const team = document.querySelector('#team').value;
    const response = await fetch('/team', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ team }),
    });
    const data = await response.json();
    const resultDiv = document.querySelector('#team-result');
    if (data.error) {
        resultDiv.textContent = data.error;
    } else {
        resultDiv.innerHTML = `
            <p>Team: ${data.team.name}</p>
            <p>Founded: ${data.team.founded}</p>
            <p>Country: ${data.team.country}</p>
            <p>Stadium: ${data.venue.name}</p>
        `;
    }
});

