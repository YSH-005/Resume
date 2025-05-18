// src/components/chat/ChatSidebar.jsx
export default function ChatSidebar() {
  return (
    <div className="w-1/3 bg-gray-100 p-4 border-r">
      <h2 className="text-lg font-semibold mb-4">Contacts</h2>
      {/* Map users later */}
      <div className="p-2 bg-white rounded shadow mb-2 cursor-pointer">Mentor A</div>
      <div className="p-2 bg-white rounded shadow mb-2 cursor-pointer">Mentor B</div>
    </div>
  );
}
