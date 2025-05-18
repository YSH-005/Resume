// src/components/chat/ChatWindow.jsx
export default function ChatWindow() {
  return (
    <div className="w-2/3 flex flex-col">
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="mb-2 bg-blue-100 p-2 rounded w-max">Hello mentor!</div>
        <div className="mb-2 bg-green-100 p-2 rounded w-max self-end">Hi mentee!</div>
      </div>
      <form className="flex p-4 border-t">
        <input type="text" placeholder="Type a message..." className="flex-1 border p-2 rounded" />
        <button type="submit" className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">Send</button>
      </form>
    </div>
  );
}
