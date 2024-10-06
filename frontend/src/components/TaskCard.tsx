import { useEffect, useState } from 'react'
import { Task } from '@/utils/data-tasks'
import { Card } from '@/components/ui/card'
import { Textarea } from "@/components/ui/textarea"

const TaskCard = ({ task, updateTask }: {
    task: Task
    updateTask: (task: Task) => void
}) => {
    const [isEditingDescription, setIsEditingDescription] = useState<boolean>(false);
    const [description, setDescription] = useState<string>(task.description);

    useEffect(() => {
        setDescription(task.description);
    }, [task.description])


    return (
        <>
            <div
                draggable
                onDragStart={(e) => {
                    e.dataTransfer.setData("name", task.name)
                }}
                className="rounded-lg m-5 bg-gray-50 w-[calc(100%_-_40px)]"
            >
                <Card className="p-2 m-0 min-h-[100px]">
                    {isEditingDescription ? (
                        <div className='cursor-pointer'>
                            <Textarea
                                autoFocus
                                className="w-full min-h-[82px]"
                                onBlur={() => setIsEditingDescription(false)}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                onKeyDown={(e) => {
                                    e.key === "Enter" && setIsEditingDescription(false);
                                    e.key === "Enter" && updateTask({ ...task, description: description });
                                }}
                            ></Textarea>
                        </div>
                    ) : (
                        <div className='cursor-pointer min-h-[80px]'
                            onDoubleClick={() => setIsEditingDescription(true)}
                        >
                            <p className="leading-7">
                                {task.description}
                            </p>
                        </div>
                    )}
                </Card>
            </div>
        </>
    )
}

export default TaskCard