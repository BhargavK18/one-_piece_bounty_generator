async function calculateBounty() {
    const username = document.getElementById('github-username').value.trim();
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    const resultDiv = document.getElementById('result');

    if (!username) {
        errorDiv.textContent = 'Please enter a GitHub username!';
        errorDiv.style.display = 'block';
        return;
    }

    loadingDiv.style.display = 'block';
    errorDiv.style.display = 'none';
    resultDiv.style.display = 'none';

    try {
        // Fetch GitHub user data with token
        const userResponse = await fetch(`https://api.github.com/users/${username}`, {
            headers: {
                Authorization: `token YOUR_PERSONAL_ACCESS_TOKEN` // Replace with your token
            }
        });

        if (!userResponse.ok) {
            const errorDetails = await userResponse.json();
            throw new Error(`User not found: ${errorDetails.message}`);
        }

        const userData = await userResponse.json();

        // Fetch repositories
        const reposResponse = await fetch(userData.repos_url, {
            headers: {
                Authorization: `token YOUR_PERSONAL_ACCESS_TOKEN` // Replace with your token
            }
        });

        if (!reposResponse.ok) throw new Error('Could not fetch repositories');
        const repos = await reposResponse.json();

        // Calculate score
        let totalStars = 0;
        repos.forEach(repo => {
            totalStars += repo.stargazers_count;
        });

        const score = (
            (userData.public_repos * 10) +
            (userData.followers * 5) +
            (totalStars * 10)
        );

        // Character matching logic
        const characters = [
            { name: "Gol D. Roger", bounty: "5,000,000,000", minScore: 500 },
            { name: "Edward Newgate (Whitebeard)", bounty: "4,600,000,000", minScore: 490 },
            { name: "Silvers Rayleigh", bounty: "2,500,000,000", minScore: 480 },
            { name: "Monkey D. Dragon", bounty: "4,000,000,000", minScore: 470 },
            { name: "Shanks", bounty: "4,000,000,000", minScore: 460 },
            { name: "Monkey D. Luffy", bounty: "1,500,000,000", minScore: 400 },
            { name: "Kaido", bounty: "4,600,000,000", minScore: 390 },
            { name: "Marshall D. Teach (Blackbeard)", bounty: "2,247,600,000", minScore: 380 },
            { name: "Big Mom", bounty: "4,388,000,000", minScore: 370 },
            { name: "Dracule Mihawk", bounty: "1,000,000,000", minScore: 360 },
            { name: "Trafalgar D. Water Law", bounty: "1,500,000,000", minScore: 400 },
            { name: "Eustass Kid", bounty: "1,000,000,000", minScore: 390 },
            { name: "Crocodile", bounty: "100,000,000", minScore: 380 },
            { name: "Yamato", bounty: "1,000,000,000", minScore: 370 },
            { name: "Sabo", bounty: "602,000,000", minScore: 360 },
            { name: "Donquixote Doflamingo", bounty: "340,000,000", minScore: 350 },
            { name: "Roronoa Zoro", bounty: "60,000,000", minScore: 340 },
            { name: "Sanji", bounty: "330,000,000", minScore: 330 },
            { name: "Marco", bounty: "1,000,000,000", minScore: 320 },
            { name: "Boa Hancock", bounty: "80,000,000", minScore: 310 },
            { name: "Ben Beckman", bounty: "100,000,000", minScore: 300 },
            { name: "Jinbe", bounty: "500,000,000", minScore: 290 },
            { name: "Katakuri", bounty: "1,057,000,000", minScore: 280 },
            { name: "Brook", bounty: "383,000,000", minScore: 270 },
            { name: "X Drake", bounty: "222,222,222", minScore: 260 },
            { name: "King", bounty: "1,390,000,000", minScore: 250 },
            { name: "Yamato", bounty: "1,000,000,000", minScore: 240 },
            { name: "Jewelry Bonney", bounty: "200,000,000", minScore: 230 },
            { name: "Franky", bounty: "94,000,000", minScore: 220 },
            { name: "Nico Robin", bounty: "130,000,000", minScore: 210 },
            { name: "Nami", bounty: "66,000,000", minScore: 200 },
            { name: "Tony Tony Chopper", bounty: "100", minScore: 190 },
            { name: "Coby", bounty: "150,000,000", minScore: 180 },
            { name: "Bepo", bounty: "100", minScore: 170 },
            { name: "Usopp", bounty: "200,000,000", minScore: 160 },
            { name: "Gaimon", bounty: "100", minScore: 150 },
            { name: "Trebol", bounty: "100", minScore: 140 },
            { name: "Buggy", bounty: "15,000,000", minScore: 130 }
        ];

        const matchedCharacter = characters.find(char => score >= char.minScore) || characters[characters.length - 1];

        // Update result display
        resultDiv.querySelector('.character-name').textContent = matchedCharacter.name;
        resultDiv.querySelector('.bounty-amount').textContent = `₿${matchedCharacter.bounty}`;
        resultDiv.querySelector('.score').textContent = score;
        resultDiv.querySelector('.repos').textContent = userData.public_repos;
        resultDiv.querySelector('.followers').textContent = userData.followers;
        resultDiv.querySelector('.stars').textContent = totalStars;

        resultDiv.style.display = 'block';

    } catch (error) {
        errorDiv.textContent = `Error: ${error.message}`;
        errorDiv.style.display = 'block';
    } finally {
        loadingDiv.style.display = 'none';
    }
}
