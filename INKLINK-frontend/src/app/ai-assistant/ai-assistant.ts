import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './ai-assistant.html',
  styleUrl: './ai-assistant.css'
})
export class AiAssistant implements OnInit {
  conversations: Conversation[] = [];
  currentConversationId: string | null = null;
  userQuery: string = '';
  searchQuery: string = '';
  userName: string = 'Invité';
  isWriting: boolean = false;
  showContentModal: boolean = false;
  mockContents = [
    { name: 'Mon T-shirt Personnalisé', date: '12/05/2026', image: 'assets/images/all products/t-shirt.png' },
    { name: 'Ma Carte de Visite Pro', date: '15/05/2026', image: 'assets/images/all products/buissnes-card.png' },
    { name: 'Mon Hoodie Design', date: '18/05/2026', image: 'assets/images/all products/hoodie0.png' }
  ];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUserName();
    this.loadConversations();
  }

  loadUserName(): void {
    const firstName = localStorage.getItem('userFirstName');
    const lastName = localStorage.getItem('username');
    if (firstName) {
      this.userName = firstName;
    } else if (lastName) {
      this.userName = lastName;
    } else {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          this.userName = user.prenom || user.nom || 'Invité';
        } catch (e) {
          this.userName = 'Invité';
        }
      }
    }
  }

  loadConversations(): void {
    const stored = localStorage.getItem('inklink_chats');
    if (stored) {
      try {
        this.conversations = JSON.parse(stored);
      } catch (e) {
        this.conversations = [];
      }
    }

    if (this.conversations.length === 0) {
      this.conversations = [
        {
          id: 'chat_1',
          title: 'Idée de design T-shirt',
          messages: [
            { sender: 'user', text: 'Je veux créer un t-shirt avec un design moderne.', timestamp: new Date() },
            { sender: 'ai', text: 'Excellent choix ! Vous pouvez utiliser notre générateur de design AI ou notre page de personnalisation pour créer le parfait t-shirt.', timestamp: new Date() }
          ],
          createdAt: new Date()
        },
        {
          id: 'chat_2',
          title: 'Aide Portfolio Artiste',
          messages: [
            { sender: 'user', text: 'Comment puis-je contacter un artiste ?', timestamp: new Date() },
            { sender: 'ai', text: 'Vous pouvez visiter notre page "Artistes" pour explorer leurs créations uniques et les contacter pour des collaborations.', timestamp: new Date() }
          ],
          createdAt: new Date()
        }
      ];
      this.saveConversations();
    }
  }

  saveConversations(): void {
    localStorage.setItem('inklink_chats', JSON.stringify(this.conversations));
  }

  get filteredConversations(): Conversation[] {
    if (!this.searchQuery) {
      return this.conversations;
    }
    return this.conversations.filter(c => 
      c.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  get currentConversation(): Conversation | null {
    return this.conversations.find(c => c.id === this.currentConversationId) || null;
  }

  selectConversation(id: string): void {
    this.currentConversationId = id;
    this.showContentModal = false;
  }

  deleteConversation(id: string, event: Event): void {
    event.stopPropagation();
    this.conversations = this.conversations.filter(c => c.id !== id);
    this.saveConversations();
    if (this.currentConversationId === id) {
      this.currentConversationId = null;
    }
  }

  startNewConversation(): void {
    this.currentConversationId = null;
    this.userQuery = '';
    this.showContentModal = false;
  }

  sendMessage(): void {
    if (!this.userQuery.trim()) return;

    const query = this.userQuery.trim();
    this.userQuery = '';

    let activeChat = this.currentConversation;

    if (!activeChat) {
      const newId = 'chat_' + Date.now();
      const newTitle = query.length > 25 ? query.substring(0, 25) + '...' : query;
      const newChat: Conversation = {
        id: newId,
        title: newTitle,
        messages: [],
        createdAt: new Date()
      };
      this.conversations.unshift(newChat);
      this.currentConversationId = newId;
      activeChat = newChat;
    }

    activeChat.messages.push({
      sender: 'user',
      text: query,
      timestamp: new Date()
    });
    this.saveConversations();

    this.isWriting = true;

    this.http.post<{ reply: string }>(`${environment.BACKEND_ENDPOINT}/ai/chat`, {
      message: query
    }).subscribe({
      next: (response) => {
        if (activeChat) {
          activeChat.messages.push({
            sender: 'ai',
            text: response.reply,
            timestamp: new Date()
          });
          this.saveConversations();
        }
        this.isWriting = false;
      },
      error: (err) => {
        console.error('Error calling AI chat API:', err);
        if (activeChat) {
          activeChat.messages.push({
            sender: 'ai',
            text: 'Erreur AI assistant.',
            timestamp: new Date()
          });
          this.saveConversations();
        }
        this.isWriting = false;
      }
    });
  }

  toggleContentModal(show: boolean): void {
    this.showContentModal = show;
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
