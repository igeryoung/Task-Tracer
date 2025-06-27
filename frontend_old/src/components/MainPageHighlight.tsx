export function MainPageHighlight() {
    return (
<div className="hidden md:block">
    <div className="flex items-center space-x-4 my-8">
        <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-[var(--clr-primary)] flex items-center justify-center">
                <i className="fas fa-tasks"></i>
            </div>
            <div className="ml-4">
                <h3 className="font-semibold">Organized Tasks</h3>
                <p className="text-slate-400">Categorize and prioritize effortlessly</p>
            </div>
        </div>
    </div>

    <div className="flex items-center space-x-4 my-8">
        <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-[var(--clr-secondary)] flex items-center justify-center">
                <i className="fas fa-chart-line"></i>
            </div>
            <div className="ml-4">
                <h3 className="font-semibold">Progress Tracking</h3>
                <p className="text-slate-400">Visualize your accomplishments</p>
            </div>
        </div>
    </div>

    <div className="flex items-center space-x-4 my-8">
        <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                <i className="fas fa-user-friends"></i>
            </div>
            <div className="ml-4">
                <h3 className="font-semibold">Team Collaboration</h3>
                <p className="text-slate-400">Work together seamlessly</p>
            </div>
        </div>
    </div>
</div>)}