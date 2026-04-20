const MaterialIcon = ({ name, className = "" }) => (
    <span
        className={`material-symbols-outlined ${className}`}
        style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
    >
        {name}
    </span>
);

export default MaterialIcon;
