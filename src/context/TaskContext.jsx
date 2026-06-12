import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Fetch tasks when authenticated
  const fetchTasks = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [isAuthenticated]);

  const addTask = async (taskData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/tasks', taskData);
      setTasks(prev => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id, updatedFields) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/tasks/${id}`, updatedFields);
      setTasks(prev => prev.map(t => t.id === id ? response.data : t));
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskStatus = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    let nextStatus = 'todo';
    if (task.status === 'todo') nextStatus = 'in-progress';
    else if (task.status === 'in-progress') nextStatus = 'completed';
    else nextStatus = 'todo';

    return await updateTask(id, { status: nextStatus });
  };

  // Derived filtered tasks array
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const value = {
    tasks,
    filteredTasks,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
