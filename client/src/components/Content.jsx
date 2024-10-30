const Content = ({ title, children }) => {
  return (
    <div className="mx-4 p-8 rounded-xl shadow-lg bg-white overflow-scroll">
      {title && <h1 className="text-4xl text-center">{title}</h1>}
      {children}
    </div>
  );
};

export default Content;
