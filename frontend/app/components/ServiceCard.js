function ServiceCard({ title, icon }) {
    return (
      <div className="flex justify-between  items-center border rounded p-4">
        <p className="text-gray-700">{title}</p>
        <div className="text-2xl">{icon}</div>
      </div>
    );
  }