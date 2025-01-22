import { ChatProvider } from './context/ChatContext';
import ChatContainer from './containers/ChatContainer';
import ChatWrapper from './components/chat/ChatWrapper';
import React from 'react';
import ChatDemo from './ChatDemo';

function App() {
  return (
    <div className="h-screen">
      <ChatDemo />;
      <ChatWrapper />;
    </div>
  );
}

const App = () => {
  return (
    <ChatProvider>
      <ChatContainer />
    </ChatProvider>
  );
};

export default App;