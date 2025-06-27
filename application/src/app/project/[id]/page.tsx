"use client";
import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// ダミータスクデータ（WBS表形式）
const dummyTasks = [
    { id: "1", code: "1", phase: "要件定義", title: "要件定義全体", startDate: "2023/01/01", endDate: "2023/01/10", assignee: "teamA ○○", progress: 100, parentId: null },
    { id: "2", code: "1.1", phase: "要件定義", title: "ヒアリング", startDate: "2023/01/02", endDate: "2023/01/03", assignee: "teamA ○○", progress: 100, parentId: "1" },
    { id: "3", code: "1.1.1", phase: "要件定義", title: "顧客インタビュー", startDate: "2023/01/02", endDate: "2023/01/02", assignee: "teamA ○○", progress: 100, parentId: "2" },
    { id: "4", code: "1.1.2", phase: "要件定義", title: "社内ヒアリング", startDate: "2023/01/03", endDate: "2023/01/03", assignee: "teamA ○○", progress: 100, parentId: "2" },
    { id: "5", code: "1.2", phase: "要件定義", title: "要件定義書作成", startDate: "2023/01/04", endDate: "2023/01/10", assignee: "teamA ○○", progress: 100, parentId: "1" },
    { id: "6", code: "2", phase: "設計", title: "設計全体", startDate: "2023/01/11", endDate: "2023/01/20", assignee: "teamB ××", progress: 100, parentId: null },
    { id: "7", code: "2.1", phase: "設計", title: "画面設計", startDate: "2023/01/12", endDate: "2023/01/15", assignee: "teamB ××", progress: 100, parentId: "6" },
    { id: "8", code: "2.1.1", phase: "設計", title: "ワイヤーフレーム作成", startDate: "2023/01/12", endDate: "2023/01/13", assignee: "teamB ××", progress: 100, parentId: "7" },
    { id: "9", code: "2.1.2", phase: "設計", title: "レイアウト検討", startDate: "2023/01/14", endDate: "2023/01/15", assignee: "teamB ××", progress: 100, parentId: "7" },
    { id: "10", code: "2.2", phase: "設計", title: "API設計", startDate: "2023/01/16", endDate: "2023/01/20", assignee: "teamB ××", progress: 100, parentId: "6" },
    { id: "11", code: "3", phase: "開発", title: "開発全体", startDate: "2023/01/21", endDate: "2023/02/10", assignee: "teamC △△", progress: 80, parentId: null },
    { id: "12", code: "3.1", phase: "開発", title: "バックエンド開発", startDate: "2023/01/22", endDate: "2023/01/31", assignee: "teamC △△", progress: 80, parentId: "11" },
    { id: "13", code: "3.1.1", phase: "開発", title: "API実装", startDate: "2023/01/22", endDate: "2023/01/26", assignee: "teamC △△", progress: 80, parentId: "12" },
    { id: "14", code: "3.1.2", phase: "開発", title: "DB設計・実装", startDate: "2023/01/27", endDate: "2023/01/31", assignee: "teamC △△", progress: 50, parentId: "12" },
    { id: "15", code: "3.2", phase: "開発", title: "フロントエンド開発", startDate: "2023/02/01", endDate: "2023/02/10", assignee: "teamC △△", progress: 40, parentId: "11" },
    { id: "16", code: "3.2.1", phase: "開発", title: "画面コンポーネント実装", startDate: "2023/02/01", endDate: "2023/02/05", assignee: "teamC △△", progress: 60, parentId: "15" },
    { id: "17", code: "3.2.2", phase: "開発", title: "状態管理実装", startDate: "2023/02/06", endDate: "2023/02/08", assignee: "teamC △△", progress: 30, parentId: "15" },
    { id: "18", code: "3.2.3", phase: "開発", title: "UI調整", startDate: "2023/02/09", endDate: "2023/02/10", assignee: "teamC △△", progress: 10, parentId: "15" },
    { id: "19", code: "4", phase: "テスト", title: "テスト全体", startDate: "2023/02/11", endDate: "2023/02/20", assignee: "teamD ◇◇", progress: 0, parentId: null },
    { id: "20", code: "4.1", phase: "テスト", title: "単体テスト", startDate: "2023/02/12", endDate: "2023/02/15", assignee: "teamD ◇◇", progress: 0, parentId: "19" },
    { id: "21", code: "4.1.1", phase: "テスト", title: "APIテスト", startDate: "2023/02/12", endDate: "2023/02/13", assignee: "teamD ◇◇", progress: 0, parentId: "20" },
    { id: "22", code: "4.1.2", phase: "テスト", title: "画面テスト", startDate: "2023/02/14", endDate: "2023/02/15", assignee: "teamD ◇◇", progress: 0, parentId: "20" },
    { id: "23", code: "4.2", phase: "テスト", title: "結合テスト", startDate: "2023/02/16", endDate: "2023/02/20", assignee: "teamD ◇◇", progress: 0, parentId: "19" },
    { id: "24", code: "4.2.1", phase: "テスト", title: "シナリオテスト", startDate: "2023/02/16", endDate: "2023/02/18", assignee: "teamD ◇◇", progress: 0, parentId: "23" },
    { id: "25", code: "4.2.2", phase: "テスト", title: "バグ修正", startDate: "2023/02/19", endDate: "2023/02/20", assignee: "teamD ◇◇", progress: 0, parentId: "23" },
    { id: "26", code: "5", phase: "公開", title: "リリース準備", startDate: "2023/02/21", endDate: "2023/02/25", assignee: "teamE ■■", progress: 0, parentId: null },
    { id: "27", code: "5.1", phase: "公開", title: "ドキュメント整備", startDate: "2023/02/21", endDate: "2023/02/23", assignee: "teamE ■■", progress: 0, parentId: "26" },
    { id: "28", code: "5.2", phase: "公開", title: "サイト公開", startDate: "2023/02/24", endDate: "2023/02/25", assignee: "teamE ■■", progress: 0, parentId: "26" },
];

// 階層レベルを計算する関数
function getLevel(task: typeof dummyTasks[number], tasks: typeof dummyTasks): number {
    let level = 0;
    let current = task;
    while (current.parentId) {
        current = tasks.find((t) => t.id === current.parentId)!;
        if (!current) break;
        level++;
    }
    return level;
}

// 階層構造のツリーを構築する関数
function buildTaskTree(tasks: typeof dummyTasks) {
    const taskMap: { [id: string]: any } = {};
    const roots: any[] = [];
    tasks.forEach((task) => {
        taskMap[task.id] = { ...task, children: [] };
    });
    tasks.forEach((task) => {
        if (task.parentId && taskMap[task.parentId]) {
            taskMap[task.parentId].children.push(taskMap[task.id]);
        } else {
            roots.push(taskMap[task.id]);
        }
    });
    return roots;
}

function DraggableTaskRow({ task, level, onDragHandle, activeId, onIndent, onOutdent }: { task: any; level: number; onDragHandle: (id: string, parentId: string | null) => void; activeId: string | null; onIndent: (id: string) => void; onOutdent: (id: string) => void; }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
    return (
        <div
            ref={setNodeRef}
            style={{
                marginLeft: level * 24,
                transform: CSS.Transform.toString(transform),
                transition,
                opacity: isDragging ? 0.5 : 1,
                zIndex: isDragging ? 50 : undefined,
                position: 'relative',
            }}
            className={`flex items-center border-b text-xs hover:bg-gray-50 bg-white ${isDragging ? 'ring-2 ring-blue-400' : ''}`}
            onPointerDown={(e) => e.stopPropagation()} // ドラッグハンドル以外でのドラッグ開始を防止
        >
            <div className="w-3 cursor-grab mr-1" style={{ minWidth: 12 }} {...attributes} {...listeners}>::</div>
            <div className="w-20 py-2 px-2 text-gray-700">{task.code}</div>
            <div className="w-28 py-2 px-2 text-gray-700">{task.phase}</div>
            <div className="flex-1 py-2 px-2 text-rose-700 font-medium">{task.title}</div>
            <div className="w-24 py-2 px-2">{task.startDate}</div>
            <div className="w-24 py-2 px-2">{task.endDate}</div>
            <div className="w-28 py-2 px-2">{task.assignee}</div>
            <div className="w-32 py-2 px-2">
                <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded">
                        <div
                            className="h-2 bg-blue-500 rounded"
                            style={{ width: `${task.progress}%` }}
                        ></div>
                    </div>
                    <span className="text-xs text-gray-600">{task.progress}%</span>
                </div>
            </div>
            <div className="flex items-center gap-1 px-2 flex-shrink-0">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onOutdent(task.id);
                    }}
                    className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded"
                    title="アウトデント"
                >
                    &lt;
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onIndent(task.id);
                    }}
                    className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded"
                    title="インデント"
                >
                    &gt;
                </button>
            </div>
        </div>
    );
}

function TaskTree({ nodes, level, onDragHandle, activeId, onIndent, onOutdent }: { nodes: any[]; level: number; onDragHandle: (id: string, parentId: string | null) => void; activeId: string | null; onIndent: (id: string) => void; onOutdent: (id: string) => void; }) {
    return (
        <>
            {nodes.map((task) => (
                <div key={task.id} className="relative">
                    {/* 罫線（親がいる場合のみ） */}
                    {level > 0 && (
                        <div
                            className="absolute left-0 top-0 h-full flex"
                            style={{ width: `${level * 24}px` }}
                        >
                            <div
                                className="h-full border-l-2 border-gray-300"
                                style={{ marginLeft: `${(level - 1) * 24 + 11}px`, minHeight: '100%' }}
                            ></div>
                            <div
                                className="border-t-2 border-gray-300"
                                style={{ width: '24px', height: '0', marginTop: '20px', marginLeft: `${-12}px` }}
                            ></div>
                        </div>
                    )}
                    <DraggableTaskRow task={task} level={level} onDragHandle={onDragHandle} activeId={activeId} onIndent={onIndent} onOutdent={onOutdent} />
                    {task.children && task.children.length > 0 && (
                        <TaskTree nodes={task.children} level={level + 1} onDragHandle={onDragHandle} activeId={activeId} onIndent={onIndent} onOutdent={onOutdent} />
                    )}
                </div>
            ))}
        </>
    );
}

export default function ProjectTaskPage() {
    const router = useRouter();
    const params = useParams();
    const [tasks, setTasks] = useState(dummyTasks);
    const [activeId, setActiveId] = useState<string | null>(null);
    const hasGantt = tasks.some((t) => t.startDate && t.endDate);
    const tree = buildTaskTree(tasks);

    const sensors = useSensors(useSensor(PointerSensor));

    // ドラッグ終了時の処理（親子関係の変更対応）
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        console.log("Drag ended: Active ID", active.id, "Over ID", over?.id);
        setActiveId(null);
        if (!over || active.id === over.id) return;

        setTasks((prevTasks) => {
            const activeTask = prevTasks.find((t) => t.id === active.id);
            const overTask = prevTasks.find((t) => t.id === over.id);

            if (!activeTask || !overTask) {
                return prevTasks;
            }

            // 同じ親を持つタスク間でのみ並び替えを許可
            if (activeTask.parentId !== overTask.parentId) {
                console.log("Cannot move between different parent levels. Active Parent:", activeTask.parentId, "Over Parent:", overTask.parentId);
                return prevTasks;
            }

            // Find the indices of active and over tasks in the *flat* prevTasks array
            const oldIndex = prevTasks.findIndex((item) => item.id === active.id);
            const newIndex = prevTasks.findIndex((item) => item.id === over.id);

            console.log("Old Index:", oldIndex, "New Index:", newIndex);

            if (oldIndex === -1 || newIndex === -1) {
                return prevTasks; // Should not happen
            }

            // Use arrayMove on the entire flat list
            return arrayMove(prevTasks, oldIndex, newIndex);
        });
    };

    const handleIndent = (taskId: string) => {
        setTasks((prevTasks) => {
            const taskToIndentIndex = prevTasks.findIndex((t) => t.id === taskId);
            if (taskToIndentIndex === -1) return prevTasks;

            const taskToIndent = prevTasks[taskToIndentIndex];

            // 同じ親を持つタスクの中から、インデント対象の直前のタスクを見つける
            const siblings = prevTasks.filter(t => t.parentId === taskToIndent.parentId);
            const taskToIndentInSiblingsIndex = siblings.findIndex(t => t.id === taskId);
            const prevTask = siblings[taskToIndentInSiblingsIndex - 1];

            console.log("handleIndent: Task to indent:", taskToIndent);
            console.log("handleIndent: Previous task (sibling):", prevTask);

            // 直前のタスクが存在し、かつ直前のタスクが自分自身でない場合
            if (prevTask && prevTask.id !== taskToIndent.id) {
                // 無限ループ防止: 自分自身や子孫を親にしない
                const isDescendant = (childId: string, potentialAncestorId: string | null, tasks: typeof dummyTasks): boolean => {
                    if (!potentialAncestorId) return false;
                    let current = tasks.find(t => t.id === childId);
                    while (current && current.parentId) {
                        if (current.parentId === potentialAncestorId) {
                            return true;
                        }
                        current = tasks.find(t => t.id === current.parentId);
                    }
                    return false;
                };

                if (isDescendant(taskToIndent.id, prevTask.id, prevTasks)) {
                    console.log("handleIndent: Cannot indent: would create a circular dependency.");
                    return prevTasks;
                }

                // 新しい配列を作成し、対象のタスクの parentId を更新
                const updatedTasks = prevTasks.map((task) =>
                    task.id === taskId ? { ...task, parentId: prevTask.id } : task
                );
                console.log("handleIndent: New parentId for task", taskId, ":", prevTask.id);
                return updatedTasks;
            }
            console.log("handleIndent: Cannot indent: No previous task or same task.");
            return prevTasks;
        });
    };

    const handleOutdent = (taskId: string) => {
        setTasks((prevTasks) => {
            const taskToOutdent = prevTasks.find((t) => t.id === taskId);
            console.log("Task to outdent (before):", taskToOutdent);
            if (!taskToOutdent || !taskToOutdent.parentId) {
                console.log("Cannot outdent: No task found or no parentId.");
                return prevTasks; // ルートタスクはアウトデントできない
            }

            const parentTask = prevTasks.find((t) => t.id === taskToOutdent.parentId);
            console.log("Parent task:", parentTask);
            if (parentTask) {
                console.log("Parent's parentId:", parentTask.parentId);
                // 新しい配列を作成し、対象のタスクの parentId を更新
                const updatedTasks = prevTasks.map((task) =>
                    task.id === taskId ? { ...task, parentId: parentTask.parentId } : task
                );
                console.log("Task to outdent (after):", updatedTasks.find(t => t.id === taskId));
                return updatedTasks;
            }
            return prevTasks;
        });
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <div className="w-[800px] bg-white border-r p-4 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => router.back()} className="text-blue-600 hover:underline">← 戻る</button>
                    <button className="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600">＋課題の追加</button>
                </div>
                <div className="flex font-bold bg-gray-100 border-b text-xs">
                    <div className="w-3" />
                    <div className="w-20 py-2 px-2">コード</div>
                    <div className="w-28 py-2 px-2">フェーズ</div>
                    <div className="flex-1 py-2 px-2">マイルストーン・タスク</div>
                    <div className="w-24 py-2 px-2">着手予定</div>
                    <div className="w-24 py-2 px-2">完了予定</div>
                    <div className="w-28 py-2 px-2">担当者</div>
                    <div className="w-32 py-2 px-2">進捗</div>
                </div>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    onDragStart={(e: any) => {
                        console.log("Drag started:", e.active.id);
                        setActiveId(e.active.id as string);
                    }}
                >
                    <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                        <TaskTree nodes={tree} level={0} onDragHandle={() => { }} activeId={activeId} onIndent={handleIndent} onOutdent={handleOutdent} />
                    </SortableContext>
                </DndContext>
            </div>
            <div className="flex-1 p-4 overflow-x-auto">
                {hasGantt ? (
                    <div className="h-full flex items-center justify-center text-gray-400 border-2 border-dashed rounded bg-white min-h-[300px]">
                        ガントチャート（ここに日付範囲でバーを描画予定）
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 border-2 border-dashed rounded bg-white min-h-[300px]">
                        日付が入力されるとガントチャートが表示されます
                    </div>
                )}
            </div>
        </div>
    );
} 