import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CirclesWithBar } from "react-loader-spinner";
import appwriteService from "../AppWrite/config";

const Profile = () => {
    const { userData, status } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadedFileId, setUploadedFileId] = useState(null); // State to hold uploaded file ID

    useEffect(() => {
        if (!status) {
            navigate("/login");
        } else {
            setTimeout(() => {
                setLoading(false); // Set loading to false after 1 second
            }, 1000);
        }
    }, [status, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[80vh]">
                <CirclesWithBar
                    height="100"
                    width="100"
                    color="#3498db"
                    ariaLabel="circles-with-bar-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                />
            </div>
        );
    }

    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const validTypes = ["image/jpeg", "image/png", "image/webp"];
            if (!validTypes.includes(file.type)) {
                alert("Please upload a JPEG, PNG, or WebP image.");
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                // 2MB limit
                alert("File size should not exceed 2MB.");
                return;
            }
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file)); // Set preview URL immediately
        }
    };

    const handleUpload = async () => {
        if (!selectedImage) return;

        setUploading(true);
        
        try {
            // Upload the file and get the response
            const response = await appwriteService.uploadFile(selectedImage);
            console.log("Image uploaded successfully:", response);

            setUploadedFileId(response.$id); // Save the uploaded file ID
        } catch (error) {
            console.error("Error uploading image:", error);
        } finally {
            setUploading(false);
            setSelectedImage(null); // Clear the selected image after upload
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[70vh]">
            <div className="max-w-md w-full bg-gray-100/80 shadow-lg rounded-lg overflow-hidden p-6">
                <div className="text-center">
                    <img
                        className="w-40 h-40 rounded-full mx-auto mb-4 border-4 border-blue-500 object-cover object-center"
                        src={uploadedFileId ? appwriteService.getFilePreview(uploadedFileId) : "https://via.placeholder.com/150"} // Use preview URL or placeholder
                        alt="User Profile"
                    />
                    <h2 className="text-2xl font-semibold text-gray-800">
                        {userData.userData?.name || "User"}
                    </h2>
                    <p className="text-gray-500">{userData.userData?.email}</p>
                </div>
                <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-700">
                        Profile Information
                    </h3>
                </div>

                {/* Image Upload Section */}
                <div className="mt-6">
                    <input
                        type="file"
                        accept="image/jpeg, image/png, image/webp"
                        onChange={handleImageChange}
                        className="mb-4"
                    />
                    <button
                        onClick={handleUpload}
                        className={`px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300 
                            {uploading ? 'opacity-20 cursor-not-allowed' : ''}`}
                        disabled={uploading}
                        
                    >
                        {uploading ? "Uploading..." : "Upload Image"}
                    </button>
                </div>

                <div className="mt-6 flex justify-center pt-5">
                    <button
                        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
                        onClick={() => navigate("/edit-profile")}
                    >
                        Edit Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
