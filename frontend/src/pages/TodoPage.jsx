import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FiPlus, FiTrash2, FiCheckCircle, FiCircle, FiCalendar, FiClock } from 'react-icons/fi';
import './TodoPage.css';

const TodoPage = () => {
    const { user } = useContext(AuthContext);
    const { showToast } = useToast();
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState('');
    const [priority, setPriority] = useState('medium');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/todos', config);
            setTodos(data);
        } catch (error) {
            showToast('Error fetching todos', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAddTodo = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post('/api/todos', { text, priority }, config);
            setTodos([data, ...todos]);
            setText('');
            showToast('Task added!');
        } catch (error) {
            showToast('Error adding task', 'error');
        }
    };

    const toggleTodo = async (id, isCompleted) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.put(`/api/todos/${id}`, { isCompleted: !isCompleted }, config);
            setTodos(todos.map(t => t._id === id ? data : t));
            
            if (!isCompleted) {
                // Log study activity when task is completed
                const date = new Date().toISOString().split('T')[0];
                await axios.post('/api/study/log', { date, task: data.text }, config);
            }
        } catch (error) {
            showToast('Error updating task', 'error');
        }
    };

    const deleteTodo = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`/api/todos/${id}`, config);
            setTodos(todos.filter(t => t._id !== id));
            showToast('Task deleted');
        } catch (error) {
            showToast('Error deleting task', 'error');
        }
    };

    if (loading) return <div className="loading-spinner">Organizing your tasks...</div>;

    return (
        <div className="todo-page animate-fade-in">
            <header className="todo-header">
                <h1>Task Master</h1>
                <p>Personalize your learning path with custom objectives</p>
            </header>

            <section className="todo-input-section glass">
                <form onSubmit={handleAddTodo} className="todo-form">
                    <input 
                        type="text" 
                        placeholder="What's your next goal?" 
                        value={text} 
                        onChange={(e) => setText(e.target.value)}
                        className="todo-input"
                    />
                    <select 
                        value={priority} 
                        onChange={(e) => setPriority(e.target.value)}
                        className="priority-select"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    <button type="submit" className="btn-add">
                        <FiPlus /> Add Task
                    </button>
                </form>
            </section>

            <div className="todo-list">
                {todos.length === 0 ? (
                    <div className="empty-state glass">
                        <FiCheckCircle size={48} />
                        <p>All caught up! Time to add some new goals.</p>
                    </div>
                ) : (
                    todos.map(todo => (
                        <div key={todo._id} className={`todo-item glass ${todo.isCompleted ? 'completed' : ''}`}>
                            <div className="todo-content" onClick={() => toggleTodo(todo._id, todo.isCompleted)}>
                                {todo.isCompleted ? <FiCheckCircle className="check-icon" /> : <FiCircle className="circle-icon" />}
                                <div className="todo-info">
                                    <span className="todo-text">{todo.text}</span>
                                    <div className="todo-meta">
                                        <span className={`priority-tag ${todo.priority}`}>{todo.priority}</span>
                                        <span className="todo-date"><FiClock /> {new Date(todo.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <button className="btn-delete" onClick={() => deleteTodo(todo._id)}>
                                <FiTrash2 />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TodoPage;
