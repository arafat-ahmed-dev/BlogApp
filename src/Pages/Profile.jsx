import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CirclesWithBar } from "react-loader-spinner";
import profileService from "../AppWrite/Profile";

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
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (!status) {
            navigate("/login");
        } else {
            fetchProfile();
        }
    }, [status, navigate]);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            if (!userData) return;
            const profile = await profileService.getProfile(userData.userData.$id);
            setProfileData(profile);
            setFormData({
                profileName: profile?.documents[0].profileName || "",
                bio: profile?.documents[0].bio || "",
                Country: profile?.documents[0].Country || "",
                profilePictureUrl: profile?.documents[0].imageprofileImage || "",
            });
            setPreviewUrl(profile?.documents[0].imageprofileImage || "");
        } catch (error) {
            console.log("Error fetching profile data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
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
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file)); // Show image preview
        }
    };

    const handleSave = async () => {
        try {
            let uploadedFileId = formData.profilePictureUrl;
            if (selectedImage) {
                const response = await profileService.uploadFile(selectedImage);
                uploadedFileId = response.$id;
            }

            const updatedData = {
                ...formData,
                imageprofileImage: uploadedFileId,
            };

            await profileService.updateProflie(userData.userData.$id, updatedData);
            setProfileData((prevData) => ({
                ...prevData,
                documents: [{ ...prevData.documents[0], ...updatedData }],
            }));
            setIsEditing(false);
        } catch (error) {
            console.log("Error updating profile:", error);
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
            <div className="max-w-md w-full bg-gray-100/80 shadow-lg rounded-lg overflow-hidden p-6">
                <div className="text-center">
                    <img
                        className="w-40 h-40 rounded-full mx-auto mb-4 border-4 border-blue-500 object-cover object-center"
                        src={previewUrl ? profileService.getFilePreview(previewUrl) : "https://via.placeholder.com/150"}
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
                                {profileData?.documents[0].profileName || "User"}
                            </h2>
                            <p className="text-gray-500">{profileData?.documents[0].email}</p>
                            <div className="mt-4 text-center">
                                <h3 className="text-lg font-medium text-gray-700">Profile Information</h3>
                                <p className="text-gray-600 mt-2"><strong>Bio:</strong> {profileData?.documents[0].bio || "No bio available"}</p>
                                <p className="text-gray-600 mt-1"><strong>Country:</strong> {profileData?.documents[0].Country || "Country not specified"}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-center pt-5">
                    {isEditing ? (
                        <>
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
                        </>
                    ) : (
                        <button
                            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
