import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CirclesWithBar } from "react-loader-spinner";
import profileService from "../AppWrite/Profile";
import { ToastContainer, toast, Zoom } from 'react-toastify'; // Importing ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Importing CSS
import { LogoutBtn } from "../Component";

const Profile = () => {
  const { userData, status } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    profileName: "",
    bio: "",
    Country: "",
    profilePictureUrl: "",
  });
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    // If the user is not logged in, redirect to the login page
    if (!status) {
      navigate("/login");
      return; // Early return to stop further execution
    }

    // Load profile data if logged in
    getProfile();
    profileImagePreview();
    setTimeout(() => setLoading(false), 1000);
  }, [status, navigate]); // Depend on status and navigate

  const getProfile = async () => {
    try {
      const response = await profileService.getProfile(userData.userData.$id);
      const profile = response.documents[0];
      setProfileData(profile);
      setFormData({
        profileName: profile.profileName || "",
        bio: profile.bio || "",
        Country: profile.Country || "",
        email: profile.email || "",
        profilePictureUrl: profile.profilePictureUrl || "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        alert("Please upload a JPEG, PNG, or WebP image.");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert("File size should not exceed 2MB.");
        return;
      }
      setPreviewUrl(URL.createObjectURL(file));
      await profileService.deleteFile(userData.userData.$id);
      await profileService.uploadFile(file, userData.userData.$id);
    }
  };

  const profileImagePreview = () => {
    try {
      const response = profileService.getFilePreview(userData.userData.$id);
      setPreviewUrl(response);
    } catch {
      console.log("Error");
    }
  };

  const handleSave = async () => {
    const id = userData.userData.$id;
    try {
      const response = await profileService.updateProflie(id, { ...formData });
      setProfileData(response);
      toast('✅ Profile Updated Successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Zoom,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsEditing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <CirclesWithBar
          height="100"
          width="100"
          color="#3498db"
          ariaLabel="circles-with-bar-loading"
          visible={true}
        />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <ToastContainer /> {/* Only add ToastContainer once in the root component */}
      <div className="max-w-md w-full bg-gray-100/80 shadow-lg rounded-lg overflow-hidden p-6">
        <div className="text-center">
          <img
            className="w-40 h-40 rounded-full mx-auto mb-4 border-4 border-blue-500 object-cover object-center"
            src={previewUrl || "https://via.placeholder.com/150"}
            alt="User Profile"
          />
          {isEditing ? (
            <div>
              <input
                type="file"
                accept="image/jpeg, image/png, image/webp"
                onChange={handleImageChange}
                className="mb-4"
              />
              <input
                type="text"
                name="profileName"
                value={formData.profileName}
                onChange={handleInputChange}
                placeholder="Enter name"
                className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-md"
              />
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Enter bio"
                className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                name="Country"
                value={formData.Country}
                onChange={handleInputChange}
                placeholder="Enter country"
                className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-md"
              />
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {profileData?.profileName || "User"}
              </h2>
              <p className="text-gray-500">{profileData?.email}</p>
              <div className="mt-4 text-center">
                <h3 className="text-lg font-medium text-gray-700">Profile Information</h3>
                <p className="text-gray-600 mt-2"><strong>Bio:</strong> {profileData?.bio || "No bio available"}</p>
                <p className="text-gray-600 mt-1"><strong>Country:</strong> {profileData?.Country || "Country not specified"}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center pt-5">
          {isEditing ? (
            <div>
              <button
                className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition duration-300 mr-2"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition duration-300"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 justify-center">
              <button
                className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
              <button
                className="bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition duration-300"
              >
                <LogoutBtn />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
