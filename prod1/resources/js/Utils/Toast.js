// Wrapper to maintain compatibility with existing code using Toast.fire
// but redirecting to our new React-based Toast system

const Toast = {
    fire: ({ icon, title, text }) => {
        if (window.toast) {
            // Map SweetAlert icons to our toast types
            const typeMap = {
                success: 'success',
                error: 'error',
                warning: 'warning',
                info: 'info',
                question: 'info'
            };

            const type = typeMap[icon] || 'info';

            // Call the global toast function
            window.toast.show(type, title, text);
        } else {
            console.warn('Toast system not initialized yet');
        }
    }
};

export default Toast;
