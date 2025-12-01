import AdminService from "../../services/AdminService.js";
import { getCampaignsAdmin , blockCampaignService ,unblockCampaignService,deleteCampaignService, updateCampaignService
 } from "../../services/campaignService.js";
import UserService from "../../services/UserService.js";

export const adminLogin = async (req, res) => {
  try {
    const { adminEmail, password } = req.body;

    const result = await AdminService.adminLogin(adminEmail, password);

    const { adminAccessToken, adminrefreshToken, admin } = result;

    res.cookie("adminrefreshToken", adminrefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login Successful",
      adminAccessToken,
      admin,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const fetchAllUsers = async (req, res) => {
  try {
    const users = await AdminService.getAllUsers();

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const fetchUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await AdminService.getUserById(id);

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const softDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await AdminService.softDeleteUser(id);

    return res.status(200).json({
      success: true,
      message: "User soft deleted successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const block = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await AdminService.blockUser(id);

    return res.status(200).json({
      success: true,
      message: "User blocked successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const unblock = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await AdminService.unblockUser(id);

    return res.status(200).json({
      success: true,
      message: "User unblocked successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const adminRefreshTokenController = async (req, res) => {
  try {
    const response = await AdminService.refreshAdminAccessToken(
      req.cookies.adminrefreshToken
    );

    return res.status(200).json(response);
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};

export const adminLogoutController = (req, res) => {
  res.clearCookie("adminrefreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });

  return res.status(200).json({ message: "Admin logged out successfully" });
};

export const getCampaignsAdminController = async (req, res, next) => {
  try {
    const campaigns = await getCampaignsAdmin();

    return res.status(200).json({
      success: true,
      campaigns,
    });
  } catch (error) {
    next(error); 
  }
};


export const blockCampaignController = async(req,res) =>{

  try {
    const { id } = req.params;
    const result = await blockCampaignService(id);

    return res.status(200).json({
      success: true,
      message: "Campaign blocked successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
  

}

export const unblockCampaignController = async(req,res) =>{

  try {
    const { id } = req.params;
    const result = await unblockCampaignService(id);

    return res.status(200).json({
      success: true,
      message: "Campaign Unblocked successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
  

}

export const deleteCampaignController = async(req,res) =>{

  try {
    const { id } = req.params;
    const result = await deleteCampaignService(id);

    return res.status(200).json({
      success: true,
      message: "Campaign deleted successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
  

}


export const updateCampaignController = async(req,res) =>{

 try {
      
     const {id} = req.params
     const result = await updateCampaignService(id,{...req.body, files: req.files,});
 
    
     return res.status(201).json({
       success: true,
       message: "Campaign updated successfully",
       data: result,
     });
   } catch (err) {
     console.error("Campaign Create Error:", err.message);
 
     return res.status(500).json({
       success: false,
       message: "Failed to update campaign",
       error: err.message,
     });
   }


}



