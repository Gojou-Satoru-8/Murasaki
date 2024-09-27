import Sidebar from "./Sidebar";
const MainContent = ({ title, children }) => {
  // console.log(sidebarItems);

  return (
    // <main className="w-[95%] sm:w-[4/5] mx-auto  py-8 shadow-lg">
    <main className="my-4  grid grid-cols-[25%_auto] grid-rows-1 w-full h-[85vh]">
      <Sidebar className={"basis-[30%] rounded-r-2xl shadow-xl bg-white"} />
      <div className="basis-auto mx-4 p-8 rounded-2xl shadow-lg bg-white overflow-scroll">
        {title && <h1 className="text-4xl text-center">{title}</h1>}
        {children}
      </div>
    </main>
  );
};

export default MainContent;
