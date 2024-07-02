type Props = {
  label?: string;
  styles?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>; 
  [x:string]: any; // for all button HTML Props
};

const Input = ({ label = "", styles, onChange, ...rest }: Props) => {
  return (
    <>
      <label className="font-bold font-cormorant text-xl text-gray-600 pb-1 block">
        {label}
      </label>
      <input
        className={`border border-gray-300 rounded-none p-2 mt-1 mb-5 text-md w-full text-gray-700 font-light outline-gray-300 placeholder:text-gray-400 ${styles}`}
        onChange={onChange}
        {...rest}
      />
    </>
  );
};

export default Input;
