import api from "../api/api.js"


export const fetchUsersList = () => api.get("/admin/users")

export const blockUser = (id) => api.patch(`/admin/users/block/${id}`)

export const unblockUser = (id) => api.patch(`/admin/users/unblock/${id}`)

export const getUserDetails = (id) => api.get(`/admin/users/${id}`)

export const deleteUser =(id) => api.patch(`/admin/users/delete/${id}`)


