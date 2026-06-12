import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight,
  FolderKanban,
  User,
  ShieldCheck
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { tasks, toggleTaskStatus } = useTasks();
  const { user } = useAuth();

  // Calculate stats based on real context tasks
  const totalTasks = tasks.length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const completionPercentage = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filter top 3 pending high priority tasks for quick view
  const urgentTasks = tasks
    .filter(t => t.status !== 'completed' && t.priority === 'high')
    .slice(0, 3);

  // Static list of project metrics
  const projectsSummary = [
    { name: 'Security Audit & IAM', category: 'Security', progress: 85, color: '#EF4444' },
    { name: 'V3 Design System Refactor', category: 'Design', progress: 60, color: '#8B5CF6' },
    { name: 'External Client API Interceptor', category: 'API', progress: 30, color: '#3B82F6' }
  ];

  // Simulated activity feed logs
  const activityLogs = [
    { id: 1, text: 'Admin initialized dashboard databases.', type: 'auth', time: '10 mins ago' },
    { id: 2, text: `User authenticated via JWT Claims validation.`, type: 'auth', time: '20 mins ago' },
    { id: 3, text: 'Completed task: Design Glassmorphic UI layout.', type: 'task', time: '1 hour ago' },
    { id: 4, text: 'Shifted task: Implement Auth Router Guards to In Progress.', type: 'task', time: '2 hours ago' }
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          Welcome back, <span className="text-gradient">{user?.name}</span>
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          Here is what is happening across your projects today.
        </p>
      </div>

      {/* Grid of Stat Cards */}
      <div className="stats-grid">
        <StatCard 
          icon={FileText} 
          title="Total Tasks" 
          value={totalTasks} 
          colorClass="purple"
          label="Tracked in simulated database"
        />
        <StatCard 
          icon={Clock} 
          title="In Progress" 
          value={inProgressTasks} 
          colorClass="blue"
          label="Active development tasks"
        />
        <StatCard 
          icon={CheckCircle2} 
          title="Completed" 
          value={completedTasks} 
          colorClass="green"
          label="Sprint items completed"
        />
        <StatCard 
          icon={TrendingUp} 
          title="Task Completion Rate" 
          value={`${completionPercentage}%`} 
          colorClass="orange"
          label="Sprint velocity progress"
        />
      </div>

      <div className="dashboard-grid">
        {/* Main tasks list and project progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Urgent tasks list */}
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem' }}>High Priority Actions</h3>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                onClick={() => navigate('/tasks')}
              >
                <span>View All Tasks</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {urgentTasks.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {urgentTasks.map(task => (
                  <div 
                    key={task.id} 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      background: 'var(--bg-tertiary)',
                      borderRadius: '10px',
                      border: '1px solid var(--card-border)'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="badge badge-red" style={{ fontSize: '0.65rem' }}>High Priority</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>{task.category}</span>
                      </div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '0.25rem' }}>{task.title}</h4>
                    </div>

                    <button 
                      className={`task-status-btn ${task.status}`}
                      onClick={() => toggleTaskStatus(task.id)}
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem' }}
                    >
                      <Clock size={12} />
                      <span style={{ textTransform: 'capitalize' }}>{task.status}</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                No high priority items pending. Good work!
              </div>
            )}
          </div>

          {/* Project tracking dashboard */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>Active Projects Progress</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {projectsSummary.map((project, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', marginBottom: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>{project.category}</span>
                      <span style={{ fontWeight: 600 }}>{project.name}</span>
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--color-text-secondary)' }}>{project.progress}%</span>
                  </div>
                  <div className="project-progress-bar" style={{ margin: 0 }}>
                    <div 
                      className="project-progress-fill" 
                      style={{ width: `${project.progress}%`, background: `linear-gradient(90deg, ${project.color}, var(--color-secondary))` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar panels: Activity logs, Token summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* JWT Status Card */}
          <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05))', border: '1px solid rgba(59, 130, 246, 0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <ShieldCheck size={20} className="text-gradient" />
              <h3 style={{ fontSize: '1rem' }}>JWT Auth Status</h3>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
              Your session is verified at the UI-level using a simulated JSON Web Token. The signature claims are verified on every view change.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.75rem', background: 'rgba(5, 7, 10, 0.4)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
              <div><span style={{ color: 'var(--color-text-muted)' }}>Role claim:</span> <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{user?.role}</span></div>
              <div><span style={{ color: 'var(--color-text-muted)' }}>Subject UID:</span> <code>{user?.id}</code></div>
              <div><span style={{ color: 'var(--color-text-muted)' }}>Issuer:</span> <code>https://api.taskflow.com</code></div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="glass-card" style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>System Log (Session)</h3>
            <ul className="activity-list">
              {activityLogs.map(log => (
                <li key={log.id} className="activity-item">
                  <div className={`activity-marker ${log.type === 'auth' ? 'auth' : 'completed'}`} />
                  <div className="activity-details">
                    <span className="activity-text">{log.text}</span>
                    <div className="activity-time">{log.time}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
