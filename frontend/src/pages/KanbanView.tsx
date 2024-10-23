import { useEffect, useState } from 'react'
import TaskCard from '../components/TaskCard'
import { Status, statuses, Task } from '../utils/data-tasks'
import axios from 'axios';
import { useActualAllTodoData } from '@/types/Common';
import { toast } from 'sonner'


const KanbanView = () => {


    // TODO WILL REPLACE WITH THE SOCKET
    //? UPDATE STATE
    const [refreshState, setRefreshState] = useState<boolean>(true);
    const handleRefreshState = (state: boolean) => {
        setRefreshState(state);
    };
    const BASE_URL = import.meta.env.VITE_BASE_URL || window.location.origin;
    const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN || null;
    // const [initialLoading, setInitialLoading] = useState<boolean>(true);
    //? CATEGORY API DATA
    // const [getAllCategories, setGetAllCategories] = useState<useGetAllCategories[]>([]);

    //? ALL TODO API DATA
    const [allTodoData, setAllTodoData] = useState<useActualAllTodoData[]>([]);



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
            status: "Completed",
            priority: "low",
            points: 1
        },
        {
            title: "This is name of the task 1",
            id: "3",
            status: "Completed",
            priority: "low",
            points: 1
        },
        {
            title: "This is name of the task 1",
            id: "4",
            status: "Completed",
            priority: "low",
            points: 1
        },
    ])
    const columns = statuses.map((status) => {
        const tasksInColumn = allTodoData.filter((task) => task.status === status)
        return {
            status,
            tasks: tasksInColumn
        }
    })

    //? TODO LIST API
    useEffect(() => {

        //? FETCH TODO LIST API MAIN DATA LOADER API FUNCTION
        const fetchAPI = async () => {
            try {
                const response = await axios.get(
                    `${BASE_URL}/api/method/quickdo.api.get_quickdo_with_categories?doctype=QuickDo&fields=["*"]`,
                    {
                        headers: {
                            Authorization: AUTH_TOKEN,
                        },
                    }
                );

                //? IF THE API RETURNS DATA MAP THE DATA IN DESIRED FORMAT
                if (response.data.message) {
                    const finalData: useActualAllTodoData[] = [];
                    response.data.message.map(
                        (todo: useActualAllTodoData) => {

                            //? UPDATE THE FINAL DATA
                            finalData.push(todo);

                            //? REFRESH STATE
                            handleRefreshState(false);
                        }
                    );

                    //? SET THE FINAL DATA TO STATE
                    setAllTodoData(finalData);

                    // //? SET INITIAL LOADING
                    // setInitialLoading(false);
                }
            } catch (error) {
                console.log(error);
            }
        };

        //? CALL THE FETCH API FUNCTION
        if (refreshState) {
            fetchAPI();
        }
    }, [refreshState]);



    //? FETCH SAVE TODO API FUNCTION
    const saveQuickDo = async (task: Task) => {

        // ? MAP DATA
        task['doctype'] = "QuickDo"

        try {
            const response = await axios.post(
                `${BASE_URL}/api/method/frappe.desk.form.save.savedocs`,
                {
                    doc: JSON.stringify(task),
                    action: "Save",
                },
                {
                    headers: {
                        Authorization: AUTH_TOKEN,
                    },
                }
            );

            //? REFRESH THE STATE
            if (response.status === 200) {
                handleRefreshState(true);
                toast.success('The QuickDo has been updated!')
            }
        } catch (error) {
            console.log(error);
            toast.error('There was a problem while updating QuickDo!')
        }
    };



    const updateTask = (task: any) => {
        // fetch(`http://localhost:3000/tasks/${task.id}`, {
        //     method: 'PUT',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(task)
        // })
        const updatedTasks = tasks.map((t) => {
            return t.name === task.name ? task : t
        })
        setTasks(updatedTasks);

        //? FETCH POST API CALL
        saveQuickDo(task);



    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: Status) => {
        e.preventDefault()
        setCurrentlyHoveringOver(null)
        const name = e.dataTransfer.getData("name")
        const task = allTodoData.find((task) => task.name === name)
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
                <div className="flex divide-x p-10">
                    {columns.map((column, index) => (
                        <div
                            key={index}
                            className='w-full'
                            onDrop={(e) => handleDrop(e, column.status)}
                            onDragOver={(e) => e.preventDefault()}
                            onDragEnter={() => handleDragEnter(column.status)}
                        >
                            <div className="flex justify-between text-3xl p-2 border-b">
                                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                                    {column.status}
                                </h3>
                                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                                    {column.tasks.length}
                                </h3>
                            </div>
                            <div className={`w-full h-full ${currentlyHoveringOver === column.status ? 'bg-gray-200' : ''}`}>
                                {column.tasks.length !== 0 ?
                                    column.tasks.map((task, index) => (
                                        <div key={index}>
                                            <TaskCard
                                                task={task}
                                                updateTask={updateTask}
                                            />
                                        </div>
                                    ))
                                    : (
                                        <div className='w-full h-full flex justify-center items-center'>
                                            <p>
                                                No QuickDos
                                            </p>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default KanbanView