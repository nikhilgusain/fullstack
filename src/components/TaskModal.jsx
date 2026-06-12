import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TaskModal = ({ isOpen, onClose, onSave, task = null }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('todo');
  const [category, setCategory] = useState('General');
  const [validationError, setValidationError] = useState('');

  // Update form values when task changes (i.e. switching between add and edit)
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || 'medium');
      setStatus(task.status || 'todo');
      setCategory(task.category || 'General');
    } else {
      // Clear form
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStatus('todo');
      setCategory('General');
    }
    setValidationError('');
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setValidationError('Task title is required.');
      return;
    }
    if (!category.trim()) {
      setValidationError('Task category is required.');
      return;
    }

    onSave({
      title,
      description,
      priority,
      status,
      category
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in">
        <div className="modal-header">
          <h3 className="modal-title">{task ? 'Edit Task' : 'Create Task'}</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {validationError && (
              <div className="login-error-alert" style={{ marginBottom: '1rem' }}>
                <span>{validationError}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Task Title</label>
              <input 
                type="text" 
                className="form-input" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Write JWT unit tests"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea 
                className="form-input" 
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details about the task goals or blockers..."
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select 
                  className="filter-select" 
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select 
                  className="filter-select" 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="todo">Todo</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Category</label>
              <input 
                type="text" 
                className="form-input" 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Design, Development, Devops"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
