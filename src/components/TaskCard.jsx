import React from 'react';
import { Edit2, Trash2, Calendar, CheckSquare, Clock, AlertTriangle } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, onToggleStatus }) => {
  
  // Priority color maps
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <span className="badge badge-red">High</span>;
      case 'medium':
        return <span className="badge badge-orange">Medium</span>;
      case 'low':
        return <span className="badge badge-blue">Low</span>;
      default:
        return null;
    }
  };

  // Format date readable
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`glass-card task-card animate-fade-in`}>
      <div>
        <div className="task-card-header">
          <span className="task-card-category">{task.category || 'General'}</span>
          {getPriorityBadge(task.priority)}
        </div>
        <h4 className="task-card-title">{task.title}</h4>
        <p className="task-card-desc">{task.description}</p>
      </div>

      <div className="task-card-footer">
        {/* Toggle Status Button */}
        <button 
          className={`task-status-btn ${task.status}`}
          onClick={() => onToggleStatus(task.id)}
          title="Click to advance task status"
        >
          {task.status === 'completed' && <CheckSquare size={14} />}
          {task.status === 'in-progress' && <Clock size={14} />}
          {task.status === 'todo' && <AlertTriangle size={14} />}
          <span style={{ textTransform: 'capitalize' }}>
            {task.status === 'in-progress' ? 'In Progress' : task.status}
          </span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="project-date" style={{ color: 'var(--color-text-muted)' }}>
            <Calendar size={12} />
            <span>{formatDate(task.createdAt)}</span>
          </span>

          <div className="task-actions">
            <button 
              className="task-action-btn"
              onClick={() => onEdit(task)}
              title="Edit Task"
            >
              <Edit2 size={14} />
            </button>
            <button 
              className="task-action-btn btn-delete"
              onClick={() => onDelete(task.id)}
              title="Delete Task"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
