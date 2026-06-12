import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { Plus, Search, FilterX, HelpCircle } from 'lucide-react';

const Tasks = () => {
  const {
    filteredTasks,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus
  } = useTasks();

  // Modal open states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleOpenAddModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        // Editing existing task
        await updateTask(editingTask.id, taskData);
        console.log(`[Tasks Page] Axios PUT resolved for task ID: ${editingTask.id}`);
      } else {
        // Creating new task
        await addTask(taskData);
        console.log(`[Tasks Page] Axios POST resolved for new task.`);
      }
      handleCloseModal();
    } catch (err) {
      console.error('[Tasks Page] Saving task failed:', err.message);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
  };

  return (
    <div className="animate-fade-in">
      <div className="tasks-toolbar">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Sprint Tasks</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            Manage, filter, and modify items in the simulated workspace DB.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          <Plus size={16} />
          <span>Add Task</span>
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="glass-card tasks-toolbar" style={{ padding: '1rem', marginBottom: '2rem' }}>
        <div className="filters-wrapper">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={16} />
            <input 
              type="text" 
              className="form-input search-input" 
              placeholder="Search title, description..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <select 
              className="filter-select" 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <select 
              className="filter-select" 
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {(searchQuery || statusFilter !== 'all' || priorityFilter !== 'all') && (
            <button 
              className="btn btn-secondary" 
              onClick={handleClearFilters}
              style={{ padding: '0.5rem 0.8rem', display: 'flex', gap: '0.25rem' }}
            >
              <FilterX size={14} />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <HelpCircle size={12} />
          <span>Click status badge to cycle state</span>
        </div>
      </div>

      {error && (
        <div className="login-error-alert animate-fade-in" style={{ marginBottom: '1.5rem' }}>
          <span>{error}</span>
        </div>
      )}

      {/* Tasks Listing Grid */}
      {loading && filteredTasks.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 0', gap: '1rem' }}>
          <div className="spinner" style={{ color: 'var(--color-primary)', width: '32px', height: '32px' }}></div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Simulating Axios API latency...</p>
        </div>
      ) : filteredTasks.length > 0 ? (
        <div className="tasks-grid">
          {filteredTasks.map(task => (
            <TaskCard 
              key={task.id}
              task={task}
              onEdit={handleOpenEditModal}
              onDelete={deleteTask}
              onToggleStatus={toggleTaskStatus}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          <p style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.25rem' }}>No Tasks Found</p>
          <p style={{ fontSize: '0.8125rem' }}>Try clearing filters or add a new task item above.</p>
        </div>
      )}

      {/* Task Modal Overlay Form */}
      <TaskModal 
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        task={editingTask}
      />
    </div>
  );
};

export default Tasks;
