
import React from 'react'
import {Controller} from "react-hook-form"
import {Editor} from "@tinymce/tinymce-react"


function RTE({
    name, control, label, defaultValue = ""
}) {
  return (
    <div className='w-full'>
        {
            label && <label className='inline-block mb-1 pl-1'> {label}</label>
        }
        <Controller
        name={name || "content"}
        control={control}
        render={({field: {onChange}}) => (
            <Editor
             apiKey='mifp8drbbmla1o91vamxw0owzf6y9syvagm20lb7tcjs4nst'
            initialValue={defaultValue}
            init={{
                branding: false,
                height: 500,
                menubar: true,
                plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "code",
                    "help",
                    "wordcount",
                    "anchor",
                ],
                toolbar:
                "undo redo | blocks | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
                content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
            onEditorChange={onChange}
            />
        )}
        />
    </div>
  )
}

export default RTE