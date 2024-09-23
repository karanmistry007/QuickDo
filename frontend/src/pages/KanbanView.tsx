import { useEffect, useState } from 'react'
import TaskCard from '../components/TaskCard'
import { Status, statuses, Task } from '../utils/data-tasks'

function KanbanView() {
    const [tasks, setTasks] = useState<Task[]>([
        {
            title: "This is name of the task 1",
            id: "1",
            status: "Open",
            priority: "low",
            points: 1
        },
        {
            title: "This is name of the task 1",
            id: "2",
            status: "Closed",
            priority: "low",
            points: 1
        },
        {
            title: "This is name of the task 1",
            id: "3",
            status: "Closed",
            priority: "low",
            points: 1
        },
        {
            title: "This is name of the task 1",
            id: "4",
            status: "Cancelled",
            priority: "low",
            points: 1
        },
    ])
    const columns = statuses.map((status) => {
        const tasksInColumn = tasks.filter((task) => task.status === status)
        return {
            status,
            tasks: tasksInColumn
        }
    })

    // useEffect(() => {
    //     fetch('http://localhost:3000/tasks').then((res) => res.json()).then((data) => {
    //         setTasks(data)
    //     })
    // }, [])

    const updateTask = (task: Task) => {
        // fetch(`http://localhost:3000/tasks/${task.id}`, {
        //     method: 'PUT',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(task)
        // })
        const updatedTasks = tasks.map((t) => {
            return t.id === task.id ? task : t
        })
        setTasks(updatedTasks)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: Status) => {
        e.preventDefault()
        setCurrentlyHoveringOver(null)
        const id = e.dataTransfer.getData("id")
        const task = tasks.find((task) => task.id === id)
        if (task) {
            updateTask({ ...task, status })
        }
    }

    const [currentlyHoveringOver, setCurrentlyHoveringOver] = useState<Status | null>(null)
    const handleDragEnter = (status: Status) => {
        setCurrentlyHoveringOver(status)
    }

    return (
        <>
            {/* DASHBOARD CONTAINER  */}
            <div className="dashboard-container  sm:ml-[60px] w-full sm:w-[calc(100dvw_-_60px)] h-auto mt-[calc(72px_+_55px)] sm:mt-0 sm:h-[calc(100dvh_-_80px)] overflow-y-scroll">

                <div className="flex divide-x p-5">
                    {columns.map((column) => (
                        <div
                            onDrop={(e) => handleDrop(e, column.status)}
                            onDragOver={(e) => e.preventDefault()}
                            onDragEnter={() => handleDragEnter(column.status)}
                        >
                            <div className="flex justify-between text-3xl p-2 font-bold text-gray-500">
                                <h2 className="capitalize">{column.status}</h2>
                                {column.tasks.reduce((total, task) => total + (task?.points || 0), 0)}
                            </div>
                            <div className={`h-full ${currentlyHoveringOver === column.status ? 'bg-gray-200' : ''}`}>
                                {column.tasks.map((task) => (
                                    <TaskCard
                                        task={task}
                                        updateTask={updateTask}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

            </div>

        </>

    )
}

export default KanbanView