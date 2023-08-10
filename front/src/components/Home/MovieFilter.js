import FilterButton from "./FilterButton";
import { FaClock, FaEye, FaCircleCheck, FaCircleXmark } from "react-icons/fa6";

export default function MovieFilter() {
  return (
    <div className="flex bg-primary-700 rounded-xl text-lg flex-1 gap-2 px-2">
      <FilterButton hover="hover:bg-[#BBB755]" color="bg-[#BBB755]">
        <FaClock size={24} className="mr-3 mt-0.5" />
        Plan to watch
      </FilterButton>
      <FilterButton hover="hover:bg-secondary-700" color="bg-secondary-700" active>
        <FaEye size={24} className="mr-3 mt-0.5" />
        Watching
      </FilterButton>
      <FilterButton hover="hover:bg-[#609F6E]" color="bg-[#609F6E]">
        <FaCircleCheck size={24} className="mr-3 mt-0.5" />
        Completed
      </FilterButton>
      <FilterButton hover="hover:bg-[#9F6060]" color="bg-[#9F6060]">
        <FaCircleXmark size={24} className="mr-3 mt-0.5" />
        Dropped
      </FilterButton>
    </div>
  );
}
