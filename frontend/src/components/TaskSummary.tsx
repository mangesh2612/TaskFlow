type TaskSummaryProps = {
    totalTasks: number
    completedTasks: number
    remainingTasks: number
}

function TaskSummary({
    totalTasks,
    completedTasks,
    remainingTasks,
}: TaskSummaryProps) {
    return(
        <section className="summary">
            <article className="summary-card">
                <p>Total Tasks</p>
                <h2>{totalTasks}</h2>
            </article>
            <article className="summary-card">
                <p>Remaining</p>
                <h2>{remainingTasks}</h2>
            </article>
            <article className="summary-card">
                <p>Completed</p>
                <h2>{completedTasks}</h2>
            </article>
        </section>
    )
}

export default TaskSummary