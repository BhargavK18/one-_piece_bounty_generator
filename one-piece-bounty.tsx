import { useState } from 'react';
import { GithubIcon, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const GitHubBountyCalculator = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const characters = [
    { name: "Gol D. Roger", bounty: "5,564,800,000", minScore: 500, image: "/api/placeholder/100/100" },
    { name: "Edward Newgate (Whitebeard)", bounty: "5,046,000,000", minScore: 490, image: "/api/placeholder/100/100" },
    { name: "Monkey D. Dragon", bounty: "4,000,000,000", minScore: 470, image: "/api/placeholder/100/100" },
    { name: "Kaido", bounty: "4,611,100,000", minScore: 390, image: "/api/placeholder/100/100" },
    { name: "Charlotte Linlin (Big Mom)", bounty: "4,388,000,000", minScore: 370, image: "/api/placeholder/100/100" },
    { name: "Monkey D. Luffy", bounty: "3,000,000,000", minScore: 400, image: "/api/placeholder/100/100" },
    { name: "Marshall D. Teach", bounty: "2,247,600,000", minScore: 380, image: "/api/placeholder/100/100" },
    { name: "Trafalgar Law", bounty: "3,000,000,000", minScore: 350, image: "/api/placeholder/100/100" },
    { name: "Roronoa Zoro", bounty: "1,111,000,000", minScore: 340, image: "/api/placeholder/100/100" },
    { name: "Sanji", bounty: "1,032,000,000", minScore: 330, image: "/api/placeholder/100/100" },
    { name: "Usopp", bounty: "200,000,000", minScore: 160, image: "/api/placeholder/100/100" },
    { name: "Buggy", bounty: "3,189,000,000", minScore: 130, image: "/api/placeholder/100/100" }
  ];

  const calculateScore = (userData, repos) => {
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    return (
      (userData.public_repos * 10) +
      (userData.followers * 5) +
      (totalStars * 10)
    );
  };

  const fetchGitHubData = async () => {
    if (!username.trim()) {
      setError('Please enter a GitHub username');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`/api/github-stats?username=${encodeURIComponent(username)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch GitHub data');
      }

      const { userData, repos } = await response.json();

      // Calculate score and find matching character
      const score = calculateScore(userData, repos);
      const matchedCharacter = characters.find(char => score >= char.minScore) || characters[characters.length - 1];

      setResult({
        character: matchedCharacter,
        score,
        stats: {
          repos: userData.public_repos,
          followers: userData.followers,
          stars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)
        }
      });
    } catch (error) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4">
      <Card className="max-w-2xl mx-auto bg-slate-800 border-amber-400">
        <CardHeader>
          <CardTitle className="text-4xl text-center text-amber-400 font-pirata">
            One Piece GitHub Bounty Calculator
          </CardTitle>
          <p className="text-center text-amber-300 mt-2">
            Discover your GitHub bounty in the world of One Piece!
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <GithubIcon className="h-5 w-5 text-amber-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-slate-700 border-amber-400 text-white focus:ring-2 focus:ring-amber-400"
                placeholder="Enter GitHub username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchGitHubData()}
              />
            </div>

            <button
              className="w-full bg-amber-400 text-black py-2 rounded-lg font-bold hover:bg-amber-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={fetchGitHubData}
              disabled={loading || !username.trim()}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  <span>Calculating Bounty...</span>
                </div>
              ) : (
                'Calculate Bounty'
              )}
            </button>

            {error && (
              <div className="text-red-400 text-center p-4 bg-red-900/20 rounded-lg">
                {error}
              </div>
            )}

            {result && (
              <div className="space-y-4 text-center animate-fadeIn">
                <img
                  src={result.character.image}
                  alt={result.character.name}
                  className="mx-auto rounded-full w-24 h-24"
                />
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-amber-400">
                    {result.character.name}
                  </h3>
                  <p className="text-3xl font-bold text-amber-300">
                    ₿{result.character.bounty}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="bg-slate-700 p-3 rounded-lg">
                    <div className="text-amber-400 font-bold">Repositories</div>
                    <div className="text-xl">{result.stats.repos}</div>
                  </div>
                  <div className="bg-slate-700 p-3 rounded-lg">
                    <div className="text-amber-400 font-bold">Followers</div>
                    <div className="text-xl">{result.stats.followers}</div>
                  </div>
                  <div className="bg-slate-700 p-3 rounded-lg">
                    <div className="text-amber-400 font-bold">Total Stars</div>
                    <div className="text-xl">{result.stats.stars}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GitHubBountyCalculator;
