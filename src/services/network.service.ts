import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { NetworkProtocol } from "../protocols/network.protocol";

@Injectable()
export class NetworkService {
  private connected: boolean = this.network.type === "none" ? false : true;
  private connect: any;
  private nonConnect: any;
  public networkProtocol: NetworkProtocol;
  constructor(
    private network: Network
  ) {
    // this.connected = this.network.type != "none";
  }

  checkConnections() {
    console.log("connection type: " + this.network.type);
    if (!this.connect) {
      this.connect = this.network.onConnect().subscribe((data) => {
        console.log("connected");
        this.connected = true;
        this.networkProtocol.changeNetwork();
      }, error => console.log(error));
    }
    if (!this.nonConnect) {
      this.nonConnect = this.network.onDisconnect().subscribe((data) => {
        console.log("disconnected");
        this.connected = false;
        this.networkProtocol.changeNetwork();
      }, error => console.log(error));
    }
  }

  isConnected() {
    return this.connected;
  }

  networkType() {
    return this.network.type;
  }
}
