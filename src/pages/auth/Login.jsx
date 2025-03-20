import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  // Form state
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  
  // Error and loading states
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Hooks
  const { login } = useAuth();
  const navigate = useNavigate();
  const aboutUsRef = useRef(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!credentials.username || !credentials.password) {
        setError('Please enter both username and password');
        setIsLoading(false);
        return;
      }

      const user = await login(credentials);

      switch (user.role) {
        case 'FARMER':
          navigate('/farmer/dashboard');
          break;
        case 'BUYER':
          navigate('/buyer/dashboard');
          break;
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  // Scroll to About Us section
  const scrollToAboutUs = () => {
    aboutUsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-green-600 p-4 shadow-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-white text-2xl font-bold">SmartAgri</Link>
          <div className="space-x-4">
            <Link to="/" className="text-white hover:text-green-200">Home</Link>
            <button 
              onClick={scrollToAboutUs}
              className="text-white hover:text-green-200 bg-transparent border-none cursor-pointer"
            >
              About Us
            </button>
            <Link to="/login" className="text-white hover:text-green-200">Login</Link>
            <Link to="/register" className="text-white hover:text-green-200">Register</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div 
        className="flex items-center justify-center bg-cover bg-center bg-no-repeat relative flex-grow"
        style={{
          backgroundImage: "url('/images/barley.jpg')"
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        
        <div className="max-w-md w-full space-y-8 relative z-10 bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-xl mx-4 my-16">
          <div>
            <h1 className="mt-2 text-center text-4xl font-extrabold text-green-600">
              SmartAgri
            </h1>
            <h2 className="mt-2 text-center text-2xl font-bold text-gray-900">
              Sign in to your account
            </h2>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                  value={credentials.username}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-green-600 hover:text-green-500">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
          
          <div className="text-center">
            <p className="mt-2 text-sm text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="font-medium text-green-600 hover:text-green-500"
              >
                Register now
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <div ref={aboutUsRef} className="max-w-5xl mx-auto px-6 py-16 bg-white rounded-lg shadow-lg">
  <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center drop-shadow-sm">About Us</h2>
  <p className="text-gray-700 text-lg leading-relaxed text-center">
    Welcome to <span className="font-semibold text-green-700">SmartAgri</span>, Sri Lanka’s pioneering Smart Rice Agriculture System, designed to transform the nation’s rice production landscape through cutting-edge technology and sustainable practices. Rooted in the heart of Sri Lanka’s agricultural heritage—once celebrated as the "Granary of the East"—we empower over 1.8 million rice farming families by addressing the critical challenges of unpredictable weather, inefficient resource management, and market disparities.
  </p>
  <p className="text-gray-700 text-lg leading-relaxed text-center mt-4">
    Our mission is to bridge tradition with innovation, creating a resilient and efficient agricultural ecosystem that ensures food security and enhances livelihoods. Leveraging advanced AI-driven weather prediction with over 90% accuracy, blockchain-based resource tracking, and a transparent digital marketplace, SmartAgri delivers actionable insights and streamlined operations for farmers, buyers, and administrators alike. From the fertile plains of Anuradhapura to the terraced fields of Kandy, our platform optimizes rice production across Sri Lanka’s diverse agro-ecological zones, reducing crop losses, minimizing resource wastage by an estimated 90%, and fostering fair trade.
  </p>
  <p className="text-gray-700 text-lg leading-relaxed text-center mt-4">
    Developed through a collaborative effort with farmers, agricultural experts, and policymakers, SmartAgri integrates a robust technology stack—Spring Boot, React.js, and Python-powered machine learning—to provide real-time weather forecasts, secure fertilizer allocation, and direct farmer-to-buyer connections. Recognized for its reliability (93% testing pass rate) and user-friendly design, our system is more than a tool—it’s a movement toward modernizing Sri Lanka’s agricultural backbone. At SmartAgri, we are committed to sustainability, transparency, and empowerment. Whether you’re a farmer planning your next harvest, a buyer sourcing quality rice, or an administrator shaping agricultural policy, we’re here to support you every step of the way. Together, let’s cultivate a future where technology nurtures tradition, ensuring prosperity for generations to come.
  </p>
</div>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">SmartAgri</h3>
            <p className="text-sm">
              Empowering agriculture through technology and innovation.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-green-200">Home</Link></li>
              <li><button onClick={scrollToAboutUs} className="hover:text-green-200 bg-transparent border-none cursor-pointer">About Us</button></li>
              <li><Link to="/contact" className="hover:text-green-200">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-green-200">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-sm">Email: support@smartagri.com</p>
            <p className="text-sm">Phone: +94 (555) 123-4567</p>
            <p className="text-sm">Address: Department of Agriculture, P.O.Box. 1, Peradeniya, Sri Lanka</p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-green-700 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} SmartAgri. All rights reserved.
          </p>
          <p className="text-xs mt-2">
            Designed with 🌾 by the SmartAgri Team
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Login;