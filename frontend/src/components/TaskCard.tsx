import { useState } from 'react'
import { Task } from '@/utils/data-tasks'
import { Card } from '@/components/ui/card'
import { Textarea } from "@/components/ui/textarea"

const TaskCard = ({ task, updateTask }: {
    task: Task
    updateTask: (task: Task) => void
}) => {
    const [isEditingTitle, setIsEditingTitle] = useState(false)

    return (
        <>
            <div
                draggable
                onDragStart={(e) => {
                    e.dataTransfer.setData("id", task.id)
                }}
                className="rounded-lg m-5 bg-gray-50 w-[calc(100%_-_40px)]"
            >
                <Card className="p-2 m-0 min-h-[100px]">
                    {isEditingTitle ? (
                        <div className='cursor-pointer'>
                            <Textarea
                                autoFocus
                                className="w-full min-h-[82px]"
                                onBlur={() => setIsEditingTitle(false)}
                                value={task.title}
                                onChange={(e) => updateTask({ ...task, title: e.target.value })}
                                onKeyDown={(e) => {
                                    e.key === "Enter" ? setIsEditingTitle(false) : "";
                                }}
                            ></Textarea>
                        </div>
                    ) : (
                        <div className='cursor-pointer min-h-[80px]'
                            onDoubleClick={() => setIsEditingTitle(true)}
                        >
                            <p className="leading-7">
                                {task.title}
                            </p>
                        </div>
                    )}
                </Card>
            </div>
        </>
    )
}

export default TaskCard