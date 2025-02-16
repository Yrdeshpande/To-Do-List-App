import React, { Component } from "react";
import { Paper, TextField, Checkbox, Button } from "@mui/material";
import { addTask, getTasks, updateTask, deleteTask } from "./services/taskServices"; // Ensure correct paths
import "./App.css";

class App extends Component {
    state = {
        tasks: [], // Initialize tasks as an empty array
        currentTask: "", // Track the current input value
    };

    // Fetch tasks on component mount
    async componentDidMount() {
        try {
            const { data } = await getTasks();
            if (Array.isArray(data)) {
                this.setState({ tasks: data });
            } else {
                console.error("Invalid tasks data format:", data);
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    }

    // Handle input change
    handleChange = (e) => {
        this.setState({ currentTask: e.target.value });
    };

    // Add a new task
    handleSubmit = async (e) => {
        e.preventDefault();
        const { currentTask, tasks } = this.state;

        try {
            const { data: newTask } = await addTask({ task: currentTask });
            this.setState({ tasks: [...tasks, newTask], currentTask: "" });
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    // Toggle task completion
    handleUpdate = async (taskId) => {
        const { tasks } = this.state;
        const originalTasks = [...tasks];

        try {
            const updatedTasks = tasks.map((task) =>
                task._id === taskId
                    ? { ...task, completed: !task.completed }
                    : task
            );
            this.setState({ tasks: updatedTasks });

            const taskToUpdate = updatedTasks.find((task) => task._id === taskId);
            await updateTask(taskId, { completed: taskToUpdate.completed });
        } catch (error) {
            console.error("Error updating task:", error);
            this.setState({ tasks: originalTasks }); // Revert changes on error
        }
    };

    // Delete a task
    handleDelete = async (taskId) => {
        const { tasks } = this.state;
        const originalTasks = [...tasks];

        try {
            const updatedTasks = tasks.filter((task) => task._id !== taskId);
            this.setState({ tasks: updatedTasks });
            await deleteTask(taskId);
        } catch (error) {
            console.error("Error deleting task:", error);
            this.setState({ tasks: originalTasks }); // Revert changes on error
        }
    };

    render() {
        const { tasks, currentTask } = this.state;

        return (
            <div className="app">
                <header className="app-header">
                    <h1>My To-Do List</h1>
                </header>
                <div className="main-content">
                    <Paper elevation={3} className="todo-container">
                        {/* Form to add a task */}
                        <form onSubmit={this.handleSubmit} className="task-form">
                            <TextField
                                variant="outlined"
                                size="small"
                                className="task-input"
                                value={currentTask}
                                onChange={this.handleChange}
                                placeholder="Add New TO-DO"
                                required
                            />
                            <Button
                                className="add-task-btn"
                                color="primary"
                                variant="outlined"
                                type="submit"
                            >
                                Add Task
                            </Button>
                        </form>

                        {/* Display task list */}
                        <div className="tasks-list">
                            {Array.isArray(tasks) && tasks.length > 0 ? (
                                tasks.map((task, index) => (
                                    <Paper
                                        key={task._id || index}
                                        className="task-item"
                                    >
                                        <Checkbox
                                            checked={task.completed}
                                            onClick={() => this.handleUpdate(task._id)}
                                            color="primary"
                                        />
                                        <div
                                            className={
                                                task.completed
                                                    ? "task-text completed"
                                                    : "task-text"
                                            }
                                        >
                                            {task.task}
                                        </div>
                                        <Button
                                            onClick={() => this.handleDelete(task._id)}
                                            color="secondary"
                                            className="delete-task-btn"
                                        >
                                            Delete
                                        </Button>
                                    </Paper>
                                ))
                            ) : (
                                <div className="no-tasks">No tasks available</div>
                            )}
                        </div>
                    </Paper>
                </div>
            </div>
        );
    }
}

export default App;
