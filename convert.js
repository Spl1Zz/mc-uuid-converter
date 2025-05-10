const fs = require('fs');
const path = require('path');
const inputFile = path.join(__dirname, 'list.txt');
const outputFile = path.join(__dirname, 'converted.txt');

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchUUID(name) {
    const url = `https://api.mojang.com/users/profiles/minecraft/${name}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    return data.id;
}


async function convertNamesToUUIDs() {
    const content = fs.readFileSync(inputFile, 'utf-8');
    const names = content.split('\n').map(n => n.trim()).filter(Boolean);
    const results = [];

    for (const name of names) {
        console.log(`Fetching UUID for: ${name}`);
        try {
            const uuid = await fetchUUID(name);
            if (uuid) {
                results.push(`${name}: ${uuid}`);
            } else {
                results.push(`${name}: Not found`);
            }
        } catch (error) {
            results.push(`${name}: Error`);
        }

        // Wait 1 second to avoid rate limiting
        await delay(1000);
    }

    fs.writeFileSync(outputFile, results.join('\n'), 'utf-8');
    console.log('Done. Results written to converted.txt.');
}

convertNamesToUUIDs();
