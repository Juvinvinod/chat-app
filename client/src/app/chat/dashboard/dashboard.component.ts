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
  userList!: User[];
  messages: { senderId: number; message: string }[] = [];
  private messagesSubscription!: Subscription;
  private previousMessagesSubscription!: Subscription;

  constructor(private socketService: ChatService) {}

  ngOnInit(): void {
    this.senderId = this.socketService.getUserId();
    this.userName = this.socketService.getUserName();
    this.socketService.getAllUsers().subscribe({
      next: res => {
        this.userList = res.filter(user => user.id !== this.senderId);
      },
    });

    this.messagesSubscription = this.socketService
      .getMessages()
      .subscribe(
        (data: {
          message: string;
          senderId: number;
          receiverId: number;
          room: string;
        }) => {
          console.log(data);
          this.messages.push(data);
          this.scrollToBottom();
        }
      );
    this.findPreviousChat();
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
          this.messages = previousMessages;
          this.scrollToBottom();
        }
      );
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

  joinRoom(event: MatSelectionListChange): void {
    this.receiverId = event?.options[0].value.id;
    this.recieverName = event?.options[0].value.email;
    this.socketService.joinRoom(this.senderId, this.receiverId);
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

  scrollToBottom() {
    setTimeout(() => {
      if (this.endOfChat) {
        console.log('hi');
        this.endOfChat.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }
}
