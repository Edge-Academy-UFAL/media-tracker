export default function Tab({ children, color, active }) {
  return (
    <div
      className={`flex my-2 py-2 px-5 flex-1 justify-center hover:${color} ${
        active && color
      } transition-colors rounded-xl cursor-pointer`}
    >
      {children}
    </div>
  );
}
