interface ChatDisplayProps {
  threadData: any;
}

const ChatDisplay: React.FC<ChatDisplayProps> = ({ threadData }) => {
  return threadData ? (
    <div className="overflow-scroll divide-y divide-gray-200">
      {threadData.map((message: any) => (
        <div className="flex py-5 space-x-3" key={message.id}>
          <img className="w-10 h-10 rounded-md" src={message.sender.avatar} />
          <p className="text-gray-700 text-md">{message.text}</p>
        </div>
      ))}
    </div>
  ) : (
    <div className="py-4 text-sm text-center text-gray-500">Ask your first question!</div>
  )
}

export default ChatDisplay;