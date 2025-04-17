const axios = require('axios');

// GitHub repository details
const GITHUB_REPO = 'https://api.github.com/repos/premcoolOO7/blackboxai-1744864618478/contents';
const tools = [];

// Function to fetch tools metadata from GitHub
async function fetchToolsMetadata() {
    try {
        const response = await axios.get(GITHUB_REPO);
        const items = response.data;

        items.forEach(item => {
            if (item.type === 'file') {
                tools.push({
                    name: item.name,
                    path: item.path,
                    download_url: item.download_url,
                    size: item.size,
                    last_modified: item.last_modified
                });
            }
        });

        console.log('Fetched Tools Metadata:', tools);
    } catch (error) {
        console.error('Error fetching tools metadata:', error.message);
        console.error('Please check the GitHub API endpoint and your network connection.');
    }
}

// Execute the function
fetchToolsMetadata();
