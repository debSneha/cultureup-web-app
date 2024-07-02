type Props = {
    label: string;
    styles?: string;
    onChange?: React.ChangeEventHandler<HTMLTextAreaElement>
    [x:string]: any;
}

const TextareaInput = ({ label,styles,onChange, ...rest }: Props) => {
    return (
        <>
      <label className="font-bold font-cormorant text-xl text-gray-600 pb-1 block">
        {label}
      </label>
      <textarea
            className={`border rounded-none p-2 mt-1 mb-5 text-md w-full text-gray-700 font-light outline-gray-300 placeholder:text-gray-300 ${styles}`}
            onChange={onChange}
            {...rest}
        />
    </>
    );
}

export default TextareaInput;
