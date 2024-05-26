import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, filter } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { User } from '../interfaces/user';

export interface ApiResponse {
  users: User[];
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private currentRoom: string | null = null;
  apiURL = environment.apiURL;
  constructor(
    private socket: Socket,
    private http: HttpClient
  ) {}

  joinRoom(senderId: number, receiverId: number): void {
    const room = `private_${Math.min(senderId, receiverId)}_${Math.max(senderId, receiverId)}`;
    if (this.currentRoom !== room) {
      this.currentRoom = room;
      this.socket.emit('setup', senderId, receiverId);
    }
  }

  sendMessage(message: string, senderId: number, receiverId: number): void {
    if (this.currentRoom) {
      this.socket.emit('chat', {
        message,
        senderId,
        receiverId,
        room: this.currentRoom,
      });
    }
  }

  getMessages(): Observable<{
    message: string;
    senderId: number;
    receiverId: number;
    room: string;
  }> {
    return this.socket
      .fromEvent<{
        message: string;
        senderId: number;
        receiverId: number;
        room: string;
      }>('chat')
      .pipe(filter(message => message.room === this.currentRoom));
  }

  disconnect() {
    this.socket.disconnect();
  }

  getUserId() {
    const user = localStorage.getItem('user');
    const userObject = user ? JSON.parse(user) : null;
    const id = userObject?.id;
    return id;
  }

  getAllUsers() {
    return this.http.get<ApiResponse>(this.apiURL + '/' + 'users');
  }
}
