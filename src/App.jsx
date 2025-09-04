import { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';

// Main App Component with Authentication
 

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
