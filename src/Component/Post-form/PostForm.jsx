import React, { useCallback } from "react";
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
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

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
      });
      if (updatedPost) {
        navigate(`/post/${updatedPost.$id}`);
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
        navigate(`/post/${newPost.$id}`);
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
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
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
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : "bg-blue-500"} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}