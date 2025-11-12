export const successResponse = (message = "OK", data = null) => ({
    success: true,
    message,
    data,
});

export const errorResponse = (message) => ({
    success: false,
    message,
});
