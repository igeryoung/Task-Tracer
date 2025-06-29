/* eslint-disable @typescript-eslint/no-unsafe-call */
// src/appointments/appointments.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';

@WebSocketGateway({ cors: true })
@Injectable()
export class AppointmentsGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(AppointmentsGateway.name);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  broadcastChange(event: string, payload: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    this.server.emit(event, payload);
  }
}
