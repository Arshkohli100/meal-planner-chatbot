import { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';

// Main App Component with Authentication
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          !isAuthenticated ? (
            <LoginPage setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
          ) : (
            <Navigate to="/" replace />
          )
        } />
        <Route path="/signup" element={
          !isAuthenticated ? (
            <SignupPage setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
          ) : (
            <Navigate to="/" replace />
          )
        } />
        <Route path="/" element={
          isAuthenticated ? (
            <MealPlannerApp user={user} setIsAuthenticated={setIsAuthenticated} />
          ) : (
            <Navigate to="/login" replace />
          )
        } />
      </Routes>
    </Router>
  );
}

// Login Page Component
function LoginPage({ setIsAuthenticated, setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Simulate login API call
    try {
      // In a real application, this would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      setIsAuthenticated(true);
      setUser({ name: email.split('@')[0], email });
      navigate('/');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // In a real application, this would initiate Google OAuth flow
    setLoading(true);
    setTimeout(() => {
      setIsAuthenticated(true);
      setUser({ name: 'Google User', email: 'user@gmail.com' });
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-green-50 text-gray-800 font-sans flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-2">
            <span className="text-4xl mr-2">🥗</span>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">NutriChef</h1>
          </div>
          <p className="text-gray-600">Sign in to your account</p>
        </div>
        
        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-sm text-green-600 hover:underline">Forgot password?</a>
              </div>
              <input
                type="password"
                id="password"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg hover:from-green-600 hover:to-blue-600 transition font-medium"
              disabled={loading}
            >
              {loading ? (
                <div className="flex justify-center items-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
          
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <div className="mx-4 text-gray-500 text-sm">or</div>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>
          
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Sign in with Google
          </button>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-green-600 hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Signup Page Component
function SignupPage({ setIsAuthenticated, setUser }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    // Simulate signup API call
    try {
      // In a real application, this would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful signup
      setIsAuthenticated(true);
      setUser({ name, email });
      navigate('/');
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    // In a real application, this would initiate Google OAuth flow
    setLoading(true);
    setTimeout(() => {
      setIsAuthenticated(true);
      setUser({ name: 'Google User', email: 'user@gmail.com' });
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-green-50 text-gray-800 font-sans flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-2">
            <span className="text-4xl mr-2">🥗</span>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">NutriChef</h1>
          </div>
          <p className="text-gray-600">Create your account</p>
        </div>
        
        {/* Signup Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                id="name"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="signup-email" className="block mb-1 text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="signup-email"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="signup-password" className="block mb-1 text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="signup-password"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="block mb-1 text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg hover:from-green-600 hover:to-blue-600 transition font-medium"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex justify-center items-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating account...
                  </div>
                ) : (
                  'Create account'
                )}
              </button>
            </div>
          </form>
          
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <div className="mx-4 text-gray-500 text-sm">or</div>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>
          
          <button
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Sign up with Google
          </button>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-green-600 hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// The original Meal Planner App with added user profile
function MealPlannerApp({ user, setIsAuthenticated }) {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setResponse('🍳 Planning your meal...');

    try {
      const result = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAU9p1ezm7aAE3EJwd6MWLawYyHZfJM8Yo`,
        {
          contents: [
            {
              parts: [
                {
                  text: `You are a professional nutritionist. Provide meal plans with categories like Breakfast, Lunch, Dinner and Snacks. For each meal include ingredients (3-5) and simple preparation steps (under 100 characters). Format each category clearly. User request: ${message}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 250
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 5000
        }
      );

      const reply = result.data.candidates?.[0]?.content?.parts?.[0]?.text;
      const newResponse = reply || "🤷 Couldn't generate a meal plan. Try rephrasing.";
      setResponse(newResponse);
      
      // Add to history
      setHistory(prev => [...prev, {
        request: message,
        response: newResponse
      }]);
      
      // Clear input
      setMessage('');
    } catch (err) {
      setResponse(`⚠️ Error: ${err.response?.data?.error?.message || err.message}`);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Parse and format the response (same as original)
  const parseResponse = (text) => {
    // Handle loading state
    if (text === '🍳 Planning your meal...' || text.includes('Error')) {
      return <div className="text-gray-600">{text}</div>;
    }
    
    const mealTypes = [
      { key: 'breakfast', icon: '🍳', title: 'Breakfast', color: 'from-yellow-500 to-orange-400' },
      { key: 'lunch', icon: '🥗', title: 'Lunch', color: 'from-green-500 to-teal-400' },
      { key: 'dinner', icon: '🍽️', title: 'Dinner', color: 'from-blue-500 to-indigo-400' },
      { key: 'snack', icon: '🍌', title: 'Snack', color: 'from-purple-500 to-pink-400' }
    ];
    
    // Find meal sections in the text
    const meals = [];
    
    mealTypes.forEach(mealType => {
      const regex = new RegExp(`\\*\\*${mealType.title}:\\*\\*(.+?)(?=\\*\\*\\w+:\\*\\*|$)`, 'is');
      const match = text.match(regex);
      
      if (match) {
        // Extract content and separate ingredients and steps if possible
        let content = match[1].trim();
        let ingredients = [];
        let steps = '';
        
        // Try to extract ingredients list
        const ingredientsMatch = content.match(/([^\.]+)/);
        if (ingredientsMatch) {
          ingredients = ingredientsMatch[1].split(',').map(item => item.trim());
          content = content.replace(ingredientsMatch[1], '').trim();
          if (content.startsWith(',')) content = content.substring(1).trim();
          if (content.startsWith('.')) content = content.substring(1).trim();
          steps = content;
        }
        
        meals.push({
          type: mealType.title,
          icon: mealType.icon,
          color: mealType.color,
          ingredients,
          steps
        });
      }
    });
    
    // If parsing didn't work well, fallback to simple formatting
    if (meals.length === 0) {
      // Basic formatting with strong tags for headings
      const formattedText = text
        .replace(/\*\*(.*?):\*\*/g, '<strong class="text-lg text-green-600">$1:</strong>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      return <div dangerouslySetInnerHTML={{ __html: formattedText }} />;
    }
    
    // Render structured meal cards
    return (
      <div className="space-y-6">
        {meals.map((meal, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className={`bg-gradient-to-r ${meal.color} p-4 text-white flex items-center`}>
              <span className="text-2xl mr-2">{meal.icon}</span>
              <h3 className="text-xl font-bold">{meal.type}</h3>
            </div>
            <div className="p-4">
              {meal.ingredients.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">Ingredients:</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {meal.ingredients.map((ingredient, i) => (
                      <li key={i} className="flex items-center">
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {meal.steps && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Preparation:</h4>
                  <p className="text-gray-600">{meal.steps}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-green-50 text-gray-800 font-sans">
      <div className="container mx-auto p-4 md:p-6">
        <header className="flex justify-between items-center mb-8 mt-4">
          <div className="flex items-center">
            <span className="text-4xl mr-2">🥗</span>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">NutriChef</h1>
          </div>
          
          {/* User Profile */}
          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white font-medium">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="hidden md:block">{user?.name || 'User'}</span>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-medium text-gray-800">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</a>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Settings</a>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Sign out
                </button> 
              </div>
            )}
          </div>
        </header>
        
        <main className="space-y-6 w-full">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full">
            <div className="flex flex-col md:flex-row gap-3 w-full">
              <input
                type="text"
                className="flex-1 w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-lg"
                placeholder="E.g. 'Quick high-protein breakfast' or 'Vegetarian dinner for two'"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !loading && handleSend()}
                disabled={loading}
              />
              <button
                onClick={handleSend}
                className="w-full md:w-auto bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-lg hover:from-green-600 hover:to-blue-600 transition disabled:opacity-50 font-medium flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Cooking...
                  </>
                ) : (
                  <>Suggest Meal</>
                )}
              </button>
            </div>
          </div>
          
          {response && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 transform transition-all w-full">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white text-xl mr-3">
                  👨‍🍳
                </div>
                <h2 className="text-xl font-semibold">Your Personal Chef Says:</h2>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
                {parseResponse(response)}
              </div>
            </div>
          )}
          
          {history.length > 0 && (
            <div className="mt-8 w-full">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Previous Meal Ideas</h3>
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2 w-full">
                {history.map((item, index) => (
                  <details key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 w-full">
                    <summary className="py-3 px-4 cursor-pointer font-medium text-gray-700 hover:text-green-600 transition">
                      {item.request.length > 50 ? item.request.substring(0, 50) + '...' : item.request}
                    </summary>
                    <div className="px-4 pb-4">
                      {parseResponse(item.response)}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}
        </main>
        
        <footer className="mt-12 text-center w-full">
          <div className="p-4 bg-white rounded-lg shadow-sm inline-block">
            <p className="text-gray-500">Powered by Google's Gemini AI</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;