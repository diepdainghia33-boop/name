export function getApiErrorMessage(error, fallback = "Something went wrong. Please try again.") {
    const response = error?.response?.data;
    const message = response?.message;

    if (typeof message === "string" && message.trim()) {
        return message;
    }

    const errors = response?.errors;
    if (errors && typeof errors === "object") {
        const firstField = Object.keys(errors)[0];
        const firstError = firstField ? errors[firstField] : null;

        if (Array.isArray(firstError) && typeof firstError[0] === "string" && firstError[0].trim()) {
            return firstError[0];
        }

        if (typeof firstError === "string" && firstError.trim()) {
            return firstError;
        }
    }

    if (!error?.response) {
        return "Không thể kết nối tới máy chủ. Vui lòng thử lại.";
    }

    if (error.response.status === 422) {
        return "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.";
    }

    return fallback;
}
