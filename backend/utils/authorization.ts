export function isUserManagedByManager(user: any, managerId: number): boolean {
    return user.managerid == managerId;
}


export function isLoggedInUser(user: any, currentUserId: number): boolean {
    return user.id == currentUserId;
}