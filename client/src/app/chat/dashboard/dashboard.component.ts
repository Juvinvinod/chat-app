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
  senderId!: number;
  recieverName!: string;
  receiverId!: number;
  userList!: User[];
  messages: { senderId: number; message: string }[] = [];
  private messagesSubscription!: Subscription;

  constructor(private socketService: ChatService) {}

  ngOnInit(): void {
    this.socketService.getAllUsers().subscribe({
      next: res => {
        console.log(res.users);
        this.userList = res.users;
      },
    });
    this.senderId = this.socketService.getUserId();
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
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
  }

  joinRoom(event: MatSelectionListChange): void {
    this.receiverId = event?.options[0].value.id;
    this.recieverName = event?.options[0].value.email;
    this.socketService.joinRoom(this.senderId, this.receiverId);
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
