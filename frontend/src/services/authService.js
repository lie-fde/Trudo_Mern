import api from "../api/api.js";


export const loginUser = (email , password) =>{
    return api.post("/auth/users/login",{
         userEmail : email,
         password
    })
};


export const googleSign = ()=> `${import.meta.env.VITE_API_URL}/auth/users/google`


export const signUp = (userName ,userEmail,mobileNumber,password) =>{
    return api.post("/auth/users/signup",{
       userName,
       userEmail,
       mobileNumber,
       password
    })
}

export const verifyOtp = (email,otp) => {
    return api.post("/auth/users/verify-otp",{
        email,otp
    })
}

export const resendOtp = (email) =>{
    return api.post("/auth/users/resend-otp",{
        email,
    })
}


export const resendOtpPassword = (email) =>{
    return api.post("/auth/users/resend-otp-password",{
        email,
    })
}


export const verifyOtpPassword = (email,otp) => {
    return api.post("/auth/users/verify-password-otp",{
        email,otp
    })
}

export const forgotPassword = (email) =>{
    return api.post("/auth/users/forgot-password",{
        email
    })
}


export const resetPassword = (email,newPassword) =>{
    return api.post("/auth/users/change-password",{
        email,newPassword
    })
}

export const adminLogin =(adminEmail,password) =>{
    return api.post("/auth/admin/login",{
        adminEmail,password
    })
}