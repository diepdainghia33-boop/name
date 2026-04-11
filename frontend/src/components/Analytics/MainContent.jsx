import Chart from "./Chart";
import RightPanel from "./RightPanel";

export default function MainContent() {
    return (
        <div className="grid grid-cols-12 gap-6">
            <Chart />
            <RightPanel />
        </div>
    );
}