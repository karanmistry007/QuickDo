import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Textarea } from "@/components/ui/textarea"
import { useAllCategories, useAllQuickDoData } from '@/types/Common'
import QuickDoDrawer from './quickdo-drawer'

const QuickDoCard = (props: {
    task: useAllQuickDoData;
    updateTask: (task: useAllQuickDoData) => void;
    allCategories: useAllCategories[];
    handleDeleteTodo: (data: string) => void;
}) => {
    const [isEditingDescription, setIsEditingDescription] = useState<boolean>(false);
    const [description, setDescription] = useState<string>(props.task.description || "");

    useEffect(() => {
        if (props.task.description) {
            setDescription(props.task.description);
        }
    }, [props.task.description])

    return (
        <>
            <div
                draggable
                onDragStart={(e) => {
                    e.dataTransfer.setData("name", props.task.name || "")
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
                                    e.key === "Enter" && props.updateTask({ ...props.task, description: description });
                                }}
                            ></Textarea>
                        </div>
                    ) : (
                        <div className='cursor-pointer min-h-[80px] relative'
                            onDoubleClick={() => setIsEditingDescription(true)}
                        >
                            <p className="leading-7">
                                {props.task.description}
                            </p>

                            {/* MORE */}
                            <div className="more absolute right-0 -bottom-2.5 h-fit">
                                <QuickDoDrawer
                                    todoData={props.task}
                                    allCategories={props.allCategories}
                                    handleSaveToDo={props.updateTask}
                                    handleDeleteTodo={props.handleDeleteTodo}
                                />
                            </div>
                            {/* END MORE */}
                        </div>
                    )}
                </Card>
            </div>
        </>
    )
}

export default QuickDoCard