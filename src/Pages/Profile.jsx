import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { CirclesWithBar } from "react-loader-spinner";
import profileService from "../AppWrite/Profile";
import { LogoutBtn } from "../Component";
import { setNotification } from "../store/notification";
import user from '../assets/user.png'

const Profile = () => {
  const { userData, status } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { slug } = useParams();
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

  const isOwnProfile = !slug || (userData?.userData?.$id === slug);

  useEffect(() => {
    if (!status && !slug) {
      navigate("/login");
      return;
    }
    getProfile();
    profileImagePreview();
    setTimeout(() => setLoading(false), 1000);
  }, [status, navigate, slug]);

  const getProfile = async () => {
    try {
      const userId = slug || userData?.userData?.$id;
      const response = await profileService.getProfile(userId);
      const profile = response.documents[0];
      setProfileData(profile);
      if (isOwnProfile) {
        setFormData({
          profileName: profile.profileName || "",
          bio: profile.bio || "",
          Country: profile.Country || "",
          email: profile.email || "",
          profilePictureUrl: profile.profilePictureUrl || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
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
      const userId = slug || userData?.userData?.$id;
      const response = profileService.getFilePreview(userId);
      setPreviewUrl(response);
    } catch (error) {
      console.log("Error fetching image preview", error);
    }
  };

  const handleSave = async () => {
    const id = userData.userData.$id;
    try {
      const response = await profileService.updateProflie(id, { ...formData });
      setProfileData(response);
      dispatch(setNotification("✅ Profile Updated Successfully!"));
    } catch (error) {
      console.log("Error saving profile:", error);
    } finally {
      setIsEditing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
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
    <div className="flex-1 min-h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-40 h-40 relative">
                <img
                  className="w-full h-full rounded-full object-cover border-4 border-yellow-400"
                  src={previewUrl || user}
                  alt="User Profile"
                />
                {isEditing && isOwnProfile && (
                  <input
                    type="file"
                    accept="image/jpeg, image/png, image/webp"
                    onChange={handleImageChange}
                    className="absolute bottom-0 left-0 w-full opacity-0 cursor-pointer"
                  />
                )}
              </div>

              <div className="flex-1">
                {isEditing && isOwnProfile ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="profileName"
                      value={formData.profileName}
                      onChange={handleInputChange}
                      placeholder="Enter name"
                      className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Enter bio"
                      className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      rows="3"
                    />
                    <input
                      type="text"
                      name="Country"
                      value={formData.Country}
                      onChange={handleInputChange}
                      placeholder="Enter country"
                      className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold dark:text-white">
                      {profileData?.profileName || "User"}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">{profileData?.email}</p>
                    <div className="space-y-2">
                      <p className="text-gray-700 dark:text-gray-200">
                        <span className="font-semibold">Bio:</span> {profileData?.bio || "No bio available"}
                      </p>
                      <p className="text-gray-700 dark:text-gray-200">
                        <span className="font-semibold">Country:</span> {profileData?.Country || "Country not specified"}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap gap-4">
                  {isEditing && isOwnProfile ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    isOwnProfile && (
                      <div className="flex gap-4">
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-6 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors"
                        >
                          Edit Profile
                        </button>
                        <LogoutBtn />
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
