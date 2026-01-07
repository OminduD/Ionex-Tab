
async function debugGitHubStats(username) {
    console.log(`Debugging stats for: ${username}`);
    try {
        // 1. Fetch User Profile
        const profileResponse = await fetch(`https://api.github.com/users/${username}`);
        const profileData = await profileResponse.json();
        console.log('Profile Data Public Repos:', profileData.public_repos);

        // 2. Fetch Contributions
        const contribResponse = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`);
        const contribData = await contribResponse.json();

        const currentYear = new Date().getFullYear();
        console.log('Current Year:', currentYear);
        const totalContributions = contribData.total[currentYear] || 0;
        console.log('Total Contributions (Year):', totalContributions);

        // Calculate Streak
        const contributions = contribData.contributions;
        const today = new Date().toISOString().split('T')[0];
        console.log('Today:', today);

        let todayIndex = contributions.findIndex((c) => c.date === today);
        if (todayIndex === -1) {
            console.log('Today not found in contributions, finding last date <= today');
            todayIndex = contributions.length - 1;
            for (let i = contributions.length - 1; i >= 0; i--) {
                if (contributions[i].date <= today) {
                    todayIndex = i;
                    break;
                }
            }
        }
        console.log('Today Index:', todayIndex);
        console.log('Today Data:', contributions[todayIndex]);

        // Calculate Streak - count consecutive days with contributions ending at today or yesterday
        let streak = 0;
        
        // Start from today and work backwards
        let startIdx = todayIndex;
        
        // If today has no contributions, check if we should start from yesterday
        if (contributions[todayIndex]?.count === 0 && todayIndex > 0) {
            console.log('Today has 0 contributions, starting from yesterday');
            startIdx = todayIndex - 1;
        }
        
        console.log('Starting streak count from index:', startIdx, 'Date:', contributions[startIdx]?.date);
        
        // Count consecutive days with contributions going backwards
        for (let i = startIdx; i >= 0; i--) {
            if (contributions[i].count > 0) {
                streak++;
            } else {
                // Found a day with no contributions, streak ends
                break;
            }
        }

        console.log('Calculated Streak:', streak);

        // Calculate Last Year (Rolling 365 Days) - only count days up to and including today
        const pastContributions = contributions.filter((c) => c.date <= today);
        const last365 = pastContributions.slice(-365);
        const lastYearContribs = last365.reduce((acc, curr) => acc + curr.count, 0);
        console.log('Last Year (Rolling 365) Contributions:', lastYearContribs);


    } catch (e) {
        console.error('Error:', e);
    }
}

debugGitHubStats('OminduD');
