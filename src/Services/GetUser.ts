export const getUserFromLocalStorage = (): string => {
    const user = localStorage.getItem("currentUser");
    if (user !== null) {
        return user
    }
    else {
        return ""
    }
}