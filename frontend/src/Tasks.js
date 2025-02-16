import { Component } from "react";
import {
    addTask,
    getTasks,
    updateTask,
    deleteTask,
} from "./services/taskServices";

class Tasks extends Component {
    state = { tasks: [], currentTask: "" };

    async componentDidMount() {
        try {
            const { data } = await getTasks();
            this.setState({ tasks: Array.isArray(data) ? data : [] });
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    }

    handleChange = ({ currentTarget: input }) => {
        this.setState({ currentTask: input.value });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const originalTasks = this.state.tasks;

        try {
            const { data } = await addTask({ task: this.state.currentTask });
            const tasks = [...originalTasks, data];
            this.setState({ tasks, currentTask: "" });
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    handleUpdate = async (taskId) => {
        const originalTasks = this.state.tasks;

        try {
            // Find the task by ID
            const updatedTasks = originalTasks.map((task) =>
                task._id === taskId ? { ...task, completed: !task.completed } : task
            );

            this.setState({ tasks: updatedTasks });
            await updateTask(taskId, { completed: !originalTasks.find(task => task._id === taskId).completed });
        } catch (error) {
            this.setState({ tasks: originalTasks });
            console.error("Error updating task:", error);
        }
    };

    handleDelete = async (taskId) => {
        const originalTasks = this.state.tasks;

        try {
            await deleteTask(taskId);
            const tasks = originalTasks.filter((task) => task._id !== taskId);
            this.setState({ tasks });
        } catch (error) {
            this.setState({ tasks: originalTasks });
            console.error("Error deleting task:", error);
        }
    };

    render() {
        const { tasks, currentTask } = this.state;

        return (
            <div>
                <h2>To-Do List</h2>
                <form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        value={currentTask}
                        onChange={this.handleChange}
                        placeholder="Enter new task"
                        required
                    />
                    <button type="submit">Add Task</button>
                </form>

                <ul>
                    {tasks.length > 0 ? (
                        tasks.map((task) => (
                            <li key={task._id}>
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => this.handleUpdate(task._id)}
                                />
                                <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>
                                    {task.task}
                                </span>
                                <button onClick={() => this.handleDelete(task._id)}>Delete</button>
                            </li>
                        ))
                    ) : (
                        <p>No tasks available</p>
                    )}
                </ul>
            </div>
        );
    }
}

export default Tasks;
