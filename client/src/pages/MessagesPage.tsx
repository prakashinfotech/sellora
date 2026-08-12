import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Send, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { getConversations, getThread, sendMessage } from '../services/messages.service';

interface MsgThread {
  otherUser: { id: number; name: string; avatar?: string };
  ad: { id: number; title: string; images: string[]; price: number };
  lastMessage: string;
  lastTime: string;
}

interface Message {
  id: number;
  body: string;
  senderId: number;
  createdAt: string;
  sender: { id: number; name: string };
}

export default function MessagesPage() {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [threads, setThreads] = useState<MsgThread[]>([]);
  const [activeThread, setActiveThread] = useState<MsgThread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    loadConversations();
  }, [user]);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const data = await getConversations();
      // Build thread list from sent + received
      const threadMap = new Map<string, MsgThread>();
      [...(data.sent || []), ...(data.received || [])].forEach((msg: any) => {
        const otherUser = msg.senderId === user!.id ? msg.receiver : msg.sender;
        const adId = msg.adId;
        const key = `${otherUser?.id}-${adId}`;
        if (!threadMap.has(key) && otherUser && msg.ad) {
          threadMap.set(key, {
            otherUser: { id: otherUser.id, name: otherUser.name, avatar: otherUser.avatar },
            ad: msg.ad,
            lastMessage: msg.body,
            lastTime: msg.createdAt,
          });
        }
      });
      setThreads(Array.from(threadMap.values()));
    } catch {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const openThread = async (thread: MsgThread) => {
    setActiveThread(thread);
    try {
      const msgs = await getThread(thread.otherUser.id, thread.ad.id);
      setMessages(msgs);
    } catch {
      toast.error('Failed to load thread');
    }
  };

  const handleSend = async () => {
    if (!reply.trim() || !activeThread) return;
    setSending(true);
    try {
      await sendMessage({ receiverId: activeThread.otherUser.id, adId: activeThread.ad.id, message: reply });
      setReply('');
      const msgs = await getThread(activeThread.otherUser.id, activeThread.ad.id);
      setMessages(msgs);
    } catch {
      toast.error('Failed to send');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-sellora-bg min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-4">
        <div className="bg-white border border-sellora-border rounded-lg overflow-hidden" style={{ height: 'calc(100vh - 120px)' }}>
          <div className="flex h-full">
            {/* Sidebar */}
            <div className={`${activeThread ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 border-r border-sellora-border`}>
              <div className="p-4 border-b border-sellora-border">
                <h1 className="font-bold text-sellora-text text-lg">Messages</h1>
              </div>
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="space-y-1 p-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
                    ))}
                  </div>
                ) : threads.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <MessageSquare size={48} className="text-sellora-border mb-3" />
                    <p className="font-semibold text-sellora-text">No messages yet</p>
                    <p className="text-sellora-muted text-sm mt-1">Start chatting with sellers</p>
                  </div>
                ) : (
                  threads.map((t, i) => (
                    <button
                      key={i}
                      onClick={() => openThread(t)}
                      className={`w-full flex items-center gap-3 p-4 hover:bg-sellora-bg border-b border-sellora-border text-left transition-colors ${activeThread?.otherUser.id === t.otherUser.id && activeThread?.ad.id === t.ad.id ? 'bg-blue-50' : ''}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-sellora-primary flex items-center justify-center text-white font-bold shrink-0">
                        {t.otherUser.name?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sellora-text text-sm truncate">{t.otherUser.name}</p>
                        <p className="text-sellora-muted text-xs truncate">{t.ad.title}</p>
                        <p className="text-sellora-muted text-xs truncate mt-0.5">{t.lastMessage}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className={`${activeThread ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
              {activeThread ? (
                <>
                  {/* Chat Header */}
                  <div className="flex items-center gap-3 p-4 border-b border-sellora-border">
                    <button onClick={() => setActiveThread(null)} className="md:hidden text-sellora-muted hover:text-sellora-primary">
                      <ArrowLeft size={20} />
                    </button>
                    <div className="w-9 h-9 rounded-full bg-sellora-primary flex items-center justify-center text-white font-bold shrink-0">
                      {activeThread.otherUser.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sellora-text text-sm">{activeThread.otherUser.name}</p>
                      <p className="text-sellora-muted text-xs truncate">{activeThread.ad.title} · ₹{Number(activeThread.ad.price).toLocaleString('en-IN')}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/ads/${activeThread.ad.id}`)}
                      className="text-xs text-sellora-primary hover:underline shrink-0"
                    >
                      View Ad
                    </button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.length === 0 ? (
                      <div className="text-center text-sellora-muted text-sm py-8">Start the conversation</div>
                    ) : (
                      messages.map((m) => {
                        const isMine = m.senderId === user!.id;
                        return (
                          <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${isMine ? 'bg-sellora-primary text-white' : 'bg-sellora-bg text-sellora-text border border-sellora-border'}`}>
                              <p>{m.body}</p>
                              <p className={`text-[10px] mt-1 ${isMine ? 'text-white/60' : 'text-sellora-muted'}`}>
                                {new Date(m.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-sellora-border flex gap-2">
                    <input
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                      placeholder="Type a message..."
                      className="flex-1 border border-sellora-border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-sellora-primary"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!reply.trim() || sending}
                      className="w-10 h-10 rounded-full btn-gradient flex items-center justify-center disabled:opacity-60 transition-colors shrink-0"
                    >
                      <Send size={16} className="text-sellora-primary" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <MessageSquare size={64} className="text-sellora-border mb-4" />
                  <p className="text-lg font-semibold text-sellora-text">Select a conversation</p>
                  <p className="text-sellora-muted text-sm mt-1">Choose from your existing conversations on the left</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
