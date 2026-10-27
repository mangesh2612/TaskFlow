import type { TaskFilter } from '../types/task';

type TaskToolbarProps = {
    searchText: string;
    statusFilter: TaskFilter;
    onSearchChange: (text: string) => void;
    onStatusFilterChange: (filter: TaskFilter) => void;
}

function TaskToolbar({
    searchText,
    statusFilter,
    onSearchChange,
    onStatusFilterChange,
}: TaskToolbarProps) {
    const filters: TaskFilter[] = ['All', 'Completed', 'Pending'];

    return (
        <div className="task-toolbar">
            <div className="search-box">
                <span aria-hidden="true">⌕</span>
                <input
                    type="search"
                    aria-label="Search tasks"
                    placeholder="Search tasks by title or description"
                    value={searchText}
                    onChange={(event) => onSearchChange(event.target.value)}
                />
            </div>
            <div className="filter-buttons" aria-label="Filter Tasks">
                {filters.map((filter) => (
                    <button
                        key={filter}
                        type="button"
                        className={`filter-button ${
                            statusFilter === filter ? 'active' : ''}`}
                        aria-pressed={statusFilter === filter}
                        onClick={() => onStatusFilterChange(filter)}> {filter}</button>
                )
            )}
            </div>
        </div>
    )
}

export default TaskToolbar