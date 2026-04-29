const FONT_SIZE_CLASSES = [
    "font-size-small",
    "font-size-medium",
    "font-size-large",
    "font-size-xlarge",
];

const VALID_FONT_SIZES = new Set(["small", "medium", "large", "xlarge"]);

function getUserIdentifier(user) {
    if (!user) return null;

    const raw = user.id ?? user.email ?? user.name;
    if (raw === null || raw === undefined) return null;

    return String(raw).trim().toLowerCase();
}

export function getFontSizeStorageKey(user) {
    const identifier = getUserIdentifier(user);
    return identifier ? `chatid_font_size:${identifier}` : null;
}

export function applyFontSize(size) {
    const html = document.documentElement;
    html.classList.remove(...FONT_SIZE_CLASSES);

    if (VALID_FONT_SIZES.has(size)) {
        html.classList.add(`font-size-${size}`);
    }
}

export function loadStoredFontSize(user) {
    const key = getFontSizeStorageKey(user);
    if (!key) return null;

    const value = localStorage.getItem(key);
    return VALID_FONT_SIZES.has(value) ? value : null;
}

export function saveStoredFontSize(user, size) {
    const key = getFontSizeStorageKey(user);
    if (!key || !VALID_FONT_SIZES.has(size)) return;

    localStorage.setItem(key, size);
}

