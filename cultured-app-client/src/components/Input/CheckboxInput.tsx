type Props = {
  label:string
}

const CheckboxInput = ({label}: Props) => {
  return ( 
    <div className="flex items-center text-gray-300 font-cormorant">
      <input type="checkbox" className="w-4 h-4 bg-gray-100 border-gray-300 rounded accent-umeed-tangerine-500"/>
      <label className="ml-2 text-gray-600">{label}</label>
    </div>
   );
}
 
export default CheckboxInput;