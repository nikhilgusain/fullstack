import axios from 'axios';

// Create a real Axios instance that points to our conceptual API
const api = axios.create({
  baseURL: 'https://api.taskflow.com/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach the JWT token from localStorage to authorization headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log for educational purposes
    console.log(`[Axios Outgoing Request] Header Interceptor attached token:`, token ? 'Bearer [Token]' : 'None');
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle simulated globally (e.g., handling 401 Unauthorized)
api.interceptors.response.use(
  (response) => {
    console.log(`[Axios Incoming Response] Success status: ${response.status}`);
    return response;
  },
  (error) => {
    console.error(`[Axios Response Error] Interceptor caught:`, error.message);
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized! Redirecting to login or clearing session.');
    }
    return Promise.reject(error);
  }
);

// Helper: Generate a fake base64-encoded JWT token
const generateFakeJWT = (user) => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiration
  };

  // Convert objects to base64 strings
  const stringifyAndB64 = (obj) => {
    const jsonStr = JSON.stringify(obj);
    return btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (match, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    }));
  };

  const encodedHeader = stringifyAndB64(header);
  const encodedPayload = stringifyAndB64(payload);
  const fakeSignature = 's4w9_d8H2nKj91s0pQ_mockSignature';

  return `${encodedHeader}.${encodedPayload}.${fakeSignature}`;
};

// Seed initial static data if localStorage is empty
const seedDatabase = () => {
  if (!localStorage.getItem('tasks_db')) {
    const initialTasks = [
      { id: '1', title: 'Implement Auth Router Guards', description: 'Configure protected routes and JWT validator redirects in frontend routing dashboard.', status: 'in-progress', priority: 'high', category: 'Security', createdAt: new Date(Date.now() - 36000000).toISOString() },
      { id: '2', title: 'Design Glassmorphic UI layout', description: 'Create a beautiful aesthetic workspace with slate background, subtle gradients, and rounded responsive cards.', status: 'completed', priority: 'medium', category: 'Design', createdAt: new Date(Date.now() - 72000000).toISOString() },
      { id: '3', title: 'Establish Axios interceptors', description: 'Hook token readers into Axios headers conceptually to prepare application for backend API connection.', status: 'todo', priority: 'high', category: 'API', createdAt: new Date().toISOString() },
      { id: '4', title: 'Refactor state in Context Provider', description: 'Lift tasks list and filter variables to global react state providers to clean up prop drilling.', status: 'todo', priority: 'low', category: 'Refactor', createdAt: new Date().toISOString() }
    ];
    localStorage.setItem('tasks_db', JSON.stringify(initialTasks));
  }
  
  if (!localStorage.getItem('users_db')) {
    const users = [
      { id: 'u1', email: 'admin@taskflow.com', password: 'admin123', name: 'Alex Rivers', role: 'Project Manager', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
      { id: 'u2', email: 'developer@taskflow.com', password: 'dev123', name: 'Sarah Chen', role: 'Frontend Engineer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' }
    ];
    localStorage.setItem('users_db', JSON.stringify(users));
  }
};

seedDatabase();

// Define Axios Mock Adapter
// This intercepts requests made by the Axios instance and returns mocked data,
// simulating network delay, status codes, and HTTP methods.
api.defaults.adapter = async (config) => {
  // Simulate network delay of 500ms
  await new Promise((resolve) => setTimeout(resolve, 500));

  const url = config.url.replace(config.baseURL, '').split('?')[0];
  const method = config.method.toLowerCase();
  
  // Inspect authorization header for protected endpoints
  const authHeader = config.headers.Authorization || config.headers.authorization;
  const token = authHeader ? authHeader.split(' ')[1] : null;

  // Function to verify mock token
  const verifyToken = () => {
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      // Decode base64
      const decodedPayload = JSON.parse(decodeURIComponent(atob(parts[1]).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')));
      
      // Check expiration
      if (decodedPayload.exp < Date.now() / 1000) {
        return null;
      }
      return decodedPayload;
    } catch (e) {
      return null;
    }
  };

  // 1. Auth Endpoint: LOGIN
  if (url === '/auth/login' && method === 'post') {
    const { email, password } = JSON.parse(config.data);
    const users = JSON.parse(localStorage.getItem('users_db'));
    const matchedUser = users.find(u => u.email === email && u.password === password);

    if (matchedUser) {
      const fakeToken = generateFakeJWT(matchedUser);
      return {
        data: {
          user: {
            id: matchedUser.id,
            email: matchedUser.email,
            name: matchedUser.name,
            role: matchedUser.role,
            avatar: matchedUser.avatar
          },
          token: fakeToken
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    } else {
      return Promise.reject({
        response: {
          data: { message: 'Invalid email or password credentials.' },
          status: 401,
          statusText: 'Unauthorized',
          headers: {},
          config
        }
      });
    }
  }

  // ALL OTHER ENDPOINTS ARE SECURED - VERIFY TOKEN
  const userPayload = verifyToken();
  if (!userPayload) {
    return Promise.reject({
      response: {
        data: { message: 'Authentication required. JWT token is invalid or expired.' },
        status: 401,
        statusText: 'Unauthorized',
        headers: {},
        config
      }
    });
  }

  // 2. Tasks Endpoint: GET TASKS
  if (url === '/tasks' && method === 'get') {
    const tasks = JSON.parse(localStorage.getItem('tasks_db') || '[]');
    return {
      data: tasks,
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    };
  }

  // 3. Tasks Endpoint: CREATE TASK
  if (url === '/tasks' && method === 'post') {
    const newTask = JSON.parse(config.data);
    newTask.id = Date.now().toString();
    newTask.createdAt = new Date().toISOString();

    const tasks = JSON.parse(localStorage.getItem('tasks_db') || '[]');
    tasks.unshift(newTask);
    localStorage.setItem('tasks_db', JSON.stringify(tasks));

    return {
      data: newTask,
      status: 201,
      statusText: 'Created',
      headers: {},
      config,
    };
  }

  // 4. Tasks Endpoint: UPDATE TASK
  if (url.startsWith('/tasks/') && method === 'put') {
    const taskId = url.split('/').pop();
    const updatedFields = JSON.parse(config.data);

    const tasks = JSON.parse(localStorage.getItem('tasks_db') || '[]');
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex !== -1) {
      tasks[taskIndex] = { ...tasks[taskIndex], ...updatedFields };
      localStorage.setItem('tasks_db', JSON.stringify(tasks));

      return {
        data: tasks[taskIndex],
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    } else {
      return Promise.reject({
        response: {
          data: { message: 'Task not found.' },
          status: 404,
          statusText: 'Not Found',
          headers: {},
          config
        }
      });
    }
  }

  // 5. Tasks Endpoint: DELETE TASK
  if (url.startsWith('/tasks/') && method === 'delete') {
    const taskId = url.split('/').pop();
    const tasks = JSON.parse(localStorage.getItem('tasks_db') || '[]');
    const filteredTasks = tasks.filter(t => t.id !== taskId);

    if (tasks.length !== filteredTasks.length) {
      localStorage.setItem('tasks_db', JSON.stringify(filteredTasks));
      return {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    } else {
      return Promise.reject({
        response: {
          data: { message: 'Task not found.' },
          status: 404,
          statusText: 'Not Found',
          headers: {},
          config
        }
      });
    }
  }

  // Route not matched
  return Promise.reject({
    response: {
      data: { message: 'Resource not found.' },
      status: 404,
      statusText: 'Not Found',
      headers: {},
      config
    }
  });
};

export default api;
