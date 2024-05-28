import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ChatService } from '../chat.service';
import { Subscription } from 'rxjs';
import { User } from '../../interfaces/user';
import { MatSelectionListChange } from '@angular/material/list';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('endOfChat') endOfChat!: ElementRef;
  messageControl = new FormControl('');
  userName!: string;
  senderId!: number;
  recieverName!: string;
  receiverId!: number;
  recieverType!: string;
  userList!: User[];
  messages: {
    senderId: number;
    message?: string;
    image?: string;
    id: number;
  }[] = [];
  private messagesSubscription!: Subscription;
  private previousMessagesSubscription!: Subscription;
  private selectedFile!: File;

  constructor(private socketService: ChatService) {}

  ngOnInit(): void {
    this.senderId = this.socketService.getUserId();
    this.userName = this.socketService.getUserName();
    this.socketService.getAllUsers().subscribe({
      next: res => {
        this.userList = res.filter(user => user.id !== this.senderId);
      },
    });
    this.updateMessages();
  }

  updateMessages() {
    this.messagesSubscription = this.socketService
      .getMessages()
      .subscribe(
        (data: {
          message?: string;
          image?: string;
          senderId: number;
          receiverId: number;
          room: string;
        }) => {
          this.messages.push({ ...data, id: Date.now() + Math.random() });
          this.scrollToBottom();
        }
      );
  }

  findPreviousChat() {
    this.previousMessagesSubscription = this.socketService
      .getPreviousMessages()
      .subscribe(
        (
          previousMessages: {
            message: string;
            senderId: number;
            receiverId: number;
            room: string;
          }[]
        ) => {
          console.log(previousMessages);
          this.messages = previousMessages.map(msg => ({
            ...msg,
            id: Date.now() + Math.random(),
          }));
          this.scrollToBottom();
        }
      );
  }

  joinRoom(event: MatSelectionListChange): void {
    this.receiverId = event?.options[0].value.id;
    this.recieverName = event?.options[0].value.name;
    this.recieverType = event?.options[0].value.type;
    this.socketService.joinRoom(
      this.senderId,
      this.receiverId,
      this.recieverType
    );
    this.messages = [];
    this.findPreviousChat();
  }

  sendMessage(): void {
    const message = this.messageControl.value;
    if (message && this.senderId) {
      this.socketService.sendMessage(message, this.senderId, this.receiverId);
      this.messageControl.setValue('');
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      this.sendImage();
    }
  }

  sendImage(): void {
    if (this.selectedFile && this.senderId) {
      this.socketService.sendImage(
        this.selectedFile,
        this.senderId,
        this.receiverId
      );
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.endOfChat) {
        this.endOfChat.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  trackByMessage(index: number, message: { id: number }): number {
    return message.id;
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
    if (this.previousMessagesSubscription) {
      this.previousMessagesSubscription.unsubscribe();
    }
  }
}
