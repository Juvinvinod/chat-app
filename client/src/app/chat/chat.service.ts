import { HttpClient, HttpParams } from '@angular/common/http';
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

  //get channelId from server and join room using that ID
  joinRoom(senderId: number, receiverId: number, recieverType: string): void {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('sender', String(senderId));
    queryParams = queryParams.append('reciever', String(receiverId));
    queryParams = queryParams.append('type', recieverType);
    this.http
      .get<string>(this.apiURL + '/chat', {
        params: queryParams,
      })
      .subscribe({
        next: res => {
          if (this.currentRoom !== res) {
            this.currentRoom = res;
            this.socket.emit('setup', res);
          }
        },
      });
  }

  //if connected to a room send message to that room
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

  //get previous messages belonging to the room
  getPreviousMessages(): Observable<
    {
      message: string;
      senderId: number;
      receiverId: number;
      room: string;
    }[]
  > {
    return this.socket.fromEvent('previousMessages');
  }

  //get messages from room and filter data for present room
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

  //send image file through websocket
  sendImage(image: File, senderId: number, receiverId: number): void {
    const reader = new FileReader();
    reader.onload = () => {
      const imageData = reader.result as string;
      this.socket.emit('image', {
        image: imageData,
        senderId,
        receiverId,
        room: this.currentRoom,
      });
    };
    reader.readAsDataURL(image);
  }

  //disconnect socket from server
  disconnect() {
    this.socket.disconnect();
  }

  getUserId() {
    const user = localStorage.getItem('user');
    const userObject = user ? JSON.parse(user) : null;
    const id = userObject?.id;
    return id;
  }

  getUserName() {
    const user = localStorage.getItem('user');
    const userObject = user ? JSON.parse(user) : null;
    const name = userObject?.name;
    return name;
  }

  getAllUsers() {
    return this.http.get<User[]>(this.apiURL + '/' + 'users');
  }
}
