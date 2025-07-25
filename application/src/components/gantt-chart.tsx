import React, { useEffect, useRef } from "react";
// @ts-ignore
import Gantt from "frappe-gantt";


/**
 * ガントチャートで使用するタスク型
 */
export type GanttTask = {
    id: string;
    name: string;
    start: string;
    end: string;
    progress: number;
    dependencies?: string;
};

/**
 * GanttChartコンポーネントのProps
 */
export type GanttChartProps = {
    tasks: GanttTask[];
    options?: Record<string, unknown>;
};

/**
 * frappe-ganttをラップしたガントチャートコンポーネント
 * @param {GanttChartProps} props - タスク配列とオプション
 * @returns {JSX.Element} ガントチャート
 */
const GanttChart: React.FC<GanttChartProps> = ({ tasks, options }) => {
    const ganttRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (ganttRef.current) {
            // eslint-disable-next-line no-new
            new Gantt(ganttRef.current, tasks, options || {});
        }
    }, [tasks, options]);
    return <div ref={ganttRef} />;
};

export default GanttChart; 