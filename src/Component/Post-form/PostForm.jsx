import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form"
import Button from "../Button"
import Input from "../Input"
import RTE from "../RTE"
import Select from "../Select"
import appwriteService from "../../AppWrite/config"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.slug || "",
            content: post?.content || "",
            postStatus: post?.status || "Active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const [postStatus, setPostStatus] = useState(post?.status || "Active");


    const submit = async (data) => {
        try {
            if (!userData.userData.$id) {
                console.error("User ID is missing. Cannot proceed.");
                alert("User data is missing. Please log in again.");
                return;
            }
            let file = null;
            if (data.image && data.image.length > 0) {
                file = await appwriteService.uploadFile(data.image[0]);
            }
            if (post) {
                if (file && post.featuredImage) {
                    await appwriteService.deleteFile(post.featuredImage);
                }

                const updatedPost = await appwriteService.updatePost(post.$id, {
                    ...data,
                    featuredImage: file ? file.$id : post.featuredImage,
                    userId: userData.$id,
                    postStatus: data.status,
                });
                if (updatedPost) {
                    setPostStatus(data.status); // Update local status
                    navigate(`/post/${updatedPost.slug}`, { state: { successMessage: "Post updated successfully!" } });
                }
            } else {
                if (file) {
                    data.featuredImage = file.$id;
                }
                const newPost = await appwriteService.createPost({
                    ...data,
                    userId: userData.userData.$id,
                });
                if (newPost) {
                    navigate(`/post/${newPost.slug}`, { state: { successMessage: "Post created successfully!" } });
                }
            }
        } catch (error) {
            console.error("Error submitting post:", error);
            alert("There was an error submitting your post. Please try again.");
        }
    };


    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="md:flex md:flex-wrap w-full dark:text-white">
            <div className="md:w-2/3 px-2">
                <Input
                    label={<span className="font-semibold text-lg text-[14px]">Title :</span>}
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label={<span className="font-semibold text-lg text-[14px]">Slug :</span>}
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label={<span className="font-semibold text-lg text-[14px]">Content :</span>} name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="md:w-1/3 px-2">
                <Input
                    label={<span className="font-semibold text-lg text-[14px]">Featured Image :</span>}
                    type="file"
                    className="mb-4 dark:text-white"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["Active", "Inactive"]}
                    label={<span className="font-semibold text-lg text-[14px]">Status :</span>}
                    className="mb-4"
                    {...register("status", { required: true })}
                    defaultValue={post ? post.postStatus :postStatus} // Bind to local state
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : "bg-blue-500"} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}
