interface ChatDisplayProps {
  threadData: any;
}

const ChatDisplay: React.FC<ChatDisplayProps> = ({ threadData }) => {
  return threadData ? (
    <div className="divide-y divide-gray-200">
      {threadData.map((message: any) => (
        <div className="py-5 flex space-x-3" key={message.id}>
          <img className="w-10 h-10 rounded-md" src={message.sender.avatar} />
          <p className="text-md text-gray-700">{message.text}</p>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center py-4 text-sm text-gray-500">Ask your first question!</div>
  )
}

export default ChatDisplay;