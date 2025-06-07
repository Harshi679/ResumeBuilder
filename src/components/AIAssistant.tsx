
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { toast } from 'sonner';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContentSuggestion: (content: string) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ open, onOpenChange, onContentSuggestion }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hi! I\'m your AI resume assistant. I can help you:\n\n• Generate professional content for any section\n• Improve your existing descriptions\n• Tailor your resume for specific job roles\n• Fix grammar and enhance readability\n\nWhat would you like help with today?',
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI response - replace with actual OpenAI API call
    const responses = [
      "Here's a professional summary that highlights your key strengths and experience:",
      "I'll help you improve that section. Here's a more impactful version:",
      "Based on your experience, here's how you can better showcase your achievements:",
      "Let me suggest some powerful action verbs and metrics to strengthen your descriptions:",
    ];
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(responses[Math.floor(Math.random() * responses.length)] + "\n\n" + 
          "• Led cross-functional teams of 5+ engineers to deliver high-impact projects\n" +
          "• Increased system performance by 40% through optimization initiatives\n" +
          "• Implemented automated testing frameworks, reducing deployment time by 60%");
      }, 2000);
    });
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(currentMessage);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast.error('Failed to get AI response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Bot className="h-5 w-5 mr-2 text-primary" />
            AI Resume Assistant
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex-shrink-0 ${message.type === 'user' ? 'ml-2' : 'mr-2'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground'
                    }`}>
                      {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}>
                    <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex flex-row">
                  <div className="flex-shrink-0 mr-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-secondary text-secondary-foreground">
                      <Bot className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="px-4 py-2 rounded-lg bg-muted">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex space-x-2 pt-4 border-t">
          <Input
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask for help with your resume..."
            disabled={isLoading}
          />
          <Button onClick={sendMessage} disabled={isLoading || !currentMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center mt-2">
          💡 Try: "Improve my work experience section" or "Write a summary for a software engineer"
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIAssistant;
