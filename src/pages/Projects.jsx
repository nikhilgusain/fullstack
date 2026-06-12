import React from 'react';
import { Calendar, User, FolderKanban, Info } from 'lucide-react';

const Projects = () => {
  // Static list of premium projects to show static navigation data
  const projects = [
    {
      id: 'p1',
      title: 'Security Audit & IAM Implementation',
      description: 'Strengthening application security, auditing authentication logs, and preparing protected router guards for OAuth integration.',
      category: 'Security',
      status: 'Active',
      statusColor: 'badge-blue',
      progress: 85,
      dueDate: 'June 18, 2026',
      members: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'
      ]
    },
    {
      id: 'p2',
      title: 'V3 Design System Refactor',
      description: 'Migrating legacy CSS variables into modern, responsive, slate-themed variables, integrating custom keyframe animations and styling classes.',
      category: 'Design',
      status: 'In Review',
      statusColor: 'badge-purple',
      progress: 60,
      dueDate: 'June 25, 2026',
      members: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'
      ]
    },
    {
      id: 'p3',
      title: 'External Client API Interceptor',
      description: 'Building conceptual Axios configurations and mock adapter instances to intercept server-bound payloads and cache response fields.',
      category: 'API Integration',
      status: 'Blocked',
      statusColor: 'badge-red',
      progress: 30,
      dueDate: 'July 2, 2026',
      members: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'
      ]
    },
    {
      id: 'p4',
      title: 'Global Store State Management',
      description: 'Lifting workspace list states into centralized React context providers, optimizing renders, and resolving nested prop drilling paths.',
      category: 'Refactor',
      status: 'Planning',
      statusColor: 'badge-orange',
      progress: 5,
      dueDate: 'July 15, 2026',
      members: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'
      ]
    }
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Active Projects</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          High-level tracking of active software development campaigns.
        </p>
      </div>

      <div className="glass-card" style={{ padding: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '2rem', borderLeft: '4px solid var(--color-primary)' }}>
        <Info size={18} style={{ color: 'var(--color-primary)' }} />
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
          <strong>Demo Sandbox note:</strong> Project metrics listed here represent static metadata mockups designed to illustrate dashboard composition and multi-component assembly.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="projects-grid">
        {projects.map(project => (
          <div key={project.id} className="glass-card project-card">
            <div className="project-meta">
              <span className="badge badge-blue">{project.category}</span>
              <span className={`badge ${project.statusColor}`}>{project.status}</span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>{project.title}</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem', lineHeight: 1.4 }}>
              {project.description}
            </p>

            <div className="project-progress-wrapper">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
                <span>Sprint Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="project-progress-bar">
                <div 
                  className="project-progress-fill" 
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            <div className="project-footer">
              <div className="team-avatars">
                {project.members.map((avatar, idx) => (
                  <img 
                    key={idx} 
                    src={avatar} 
                    alt={`Team Member ${idx + 1}`} 
                    className="team-avatar"
                  />
                ))}
              </div>

              <div className="project-date">
                <Calendar size={12} />
                <span>Due {project.dueDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
