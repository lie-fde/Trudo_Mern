import adminApi from "../api/adminApi.js"


export const fetchUsersList = () => adminApi.get("/admin/users")

export const blockUser = (id) => adminApi.patch(`/admin/users/block/${id}`)

export const unblockUser = (id) => adminApi.patch(`/admin/users/unblock/${id}`)

export const getUserDetails = (id) => adminApi.get(`/admin/users/${id}`)

export const deleteUser =(id) => adminApi.patch(`/admin/users/delete/${id}`)

export const blockCampaign =(id) => adminApi.patch(`/admin/campaign/block/${id}`)

export const unblockCampaign =(id)=> adminApi.patch(`/admin/campaign/unblock/${id}`)

export const deleteCampaign = (id) => adminApi.patch(`/admin/campaign/delete/${id}`)

