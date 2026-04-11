export default function BlueprintCard({ title, onClick }) {
    return (
        <div
            onClick={onClick}
            className="relative rounded-3xl overflow-hidden h-[180px] cursor-pointer group"
        >
            <img
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995"
                className="absolute w-full h-full object-cover opacity-60 group-hover:scale-105 transition"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent" />

            <div className="absolute bottom-0 p-5">
                <h3 className="text-lg font-bold">{title}</h3>
            </div>
        </div>
    );
}