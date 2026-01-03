
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
            console.log('Today not found in contributions, using last index');
            todayIndex = contributions.length - 1;
        }
        console.log('Today Index:', todayIndex);
        console.log('Today Data:', contributions[todayIndex]);

        let streak = 0;
        let currentStreakActive = true;

        if (contributions[todayIndex].count > 0) {
            streak++;
        } else {
            const yesterdayIndex = todayIndex - 1;
            console.log('Yesterday Data:', contributions[yesterdayIndex]);
            if (yesterdayIndex >= 0 && contributions[yesterdayIndex].count === 0) {
                currentStreakActive = false;
            }
        }

        if (currentStreakActive) {
            let i = todayIndex - 1;
            while (i >= 0) {
                if (contributions[i].count > 0) {
                    streak++;
                } else {
                    break;
                }
                i--;
            }
        }

        console.log('Calculated Streak:', streak);

        // Calculate Last Year (Rolling 365 Days)
        const last365 = contributions.slice(-365);
        const lastYearContribs = last365.reduce((acc, curr) => acc + curr.count, 0);
        console.log('Last Year (Rolling 365) Contributions:', lastYearContribs);


    } catch (e) {
        console.error('Error:', e);
    }
}

debugGitHubStats('OminduD');
