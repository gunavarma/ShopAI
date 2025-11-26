import { ChatInterface } from "@/components/shopwhiz/chat-interface";
import { PageLayout } from "@/components/shopwhiz/page-layout";

export default function ChatPage() {
  return (
    <PageLayout>
      <div className="h-[calc(100vh-12rem)]">
        <ChatInterface />
      </div>
    </PageLayout>
  );
}
