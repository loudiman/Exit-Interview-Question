// Reference to existing HTML elements in the main container
const respondentList = document.getElementById('respondent-list');
const responseContainer = document.getElementById('response-container');

// Respondents section creation
function populateRespondentsSection() {
    const respondents = [
        { id: '1234567', name: 'Marven Luis', surveys: ['Sample Title 1', 'Sample Title 2', 'Sample Title 4'] },
        { id: '1234567', name: 'Lou Morados', surveys: ['Sample Title 3'] },
        { id: '1234567', name: 'Lenar Domingo', surveys: ['Sample Title 1', 'Sample Title 7'] },
        { id: '1234567', name: 'Gebreyl Rabang', surveys: ['Sample Title 2'] },
    ];

    respondents.forEach(respondent => {
        const row = document.createElement('div');
        row.classList.add('table-row');

        // ID Number cell
        const idCell = document.createElement('span');
        idCell.textContent = respondent.id;
        row.appendChild(idCell);

        // Name cell
        const nameCell = document.createElement('span');
        nameCell.textContent = respondent.name;
        row.appendChild(nameCell);

        // Dropdown cell
        const dropdown = document.createElement('select');
        dropdown.classList.add('dropdown');
        respondent.surveys.forEach(survey => {
            const option = document.createElement('option');
            option.textContent = survey;
            dropdown.appendChild(option);
        });
        row.appendChild(dropdown);

        respondentList.appendChild(row);
    });
}

// Response analytics section creation
function populateResponseAnalytics() {
    const surveys = [
        {
            title: 'Sample Title',
            progress: '60/70',
            description: 'survey description',
            respondents: [
                { id: '1234567', name: 'Gebreyl Rabang', status: 'Responded' },
                { id: '1234567', name: 'Lou Morados', status: 'Pending' }
            ]
        },
        {
            title: 'Sample Title',
            progress: '60/70',
            description: 'survey description',
            respondents: [
                { id: '1234567', name: 'Gebreyl Rabang', status: 'Responded' },
                { id: '1234567', name: 'Lou Morados', status: 'Pending' }
            ]
        }
    ];

    surveys.forEach(survey => {
        const card = document.createElement('div');
        card.classList.add('response-card');

        // Header with title and progress
        const header = document.createElement('h3');
        header.textContent = `${survey.title}`;
        const progressSpan = document.createElement('span');
        progressSpan.textContent = survey.progress;
        header.appendChild(progressSpan);
        card.appendChild(header);

        // Description
        const description = document.createElement('p');
        description.textContent = survey.description;
        card.appendChild(description);

        // Table for respondents
        const table = document.createElement('table');
        table.classList.add('respondents-table');

        // Table header
        const headerRow = document.createElement('tr');
        ['ID Number', 'Name', 'Status'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Table rows with respondent data
        survey.respondents.forEach(respondent => {
            const row = document.createElement('tr');

            const idCell = document.createElement('td');
            idCell.textContent = respondent.id;
            row.appendChild(idCell);

            const nameCell = document.createElement('td');
            nameCell.textContent = respondent.name;
            row.appendChild(nameCell);

            const statusCell = document.createElement('td');
            statusCell.textContent = respondent.status;
            row.appendChild(statusCell);

            table.appendChild(row);
        });

        card.appendChild(table);
        responseContainer.appendChild(card);
    });
}

// Initialize the UI by populating sections
createSidebar();
populateRespondentsSection();
populateResponseAnalytics();
