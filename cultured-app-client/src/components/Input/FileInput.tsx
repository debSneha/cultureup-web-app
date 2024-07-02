import React from "react";

type Props = {
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    [x:string]: any;
}   

const FileInput = React.forwardRef((props:Props, ref:React.Ref<HTMLInputElement>) => {
    return <input ref={ref} {...props} />
});

export default FileInput;