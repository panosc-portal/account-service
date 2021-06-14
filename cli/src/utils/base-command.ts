import { Command, flags } from "@oclif/command";
import Axios, { AxiosInstance } from "axios";
import { Role, User } from "../models";

export abstract class BaseCommand extends Command {
  static baseFlags = {
    help: flags.help({ char: 'h' }),
    url: flags.string({
      char: 'u',
      description: 'URL of the account service',
      default: 'http://localhost:3000'
    }),
    token: flags.string({
      char: 't',
      description: 'access token'
    })
  };

  private _apiClient: AxiosInstance;
  private _accountServiceUrl: string;

  protected set accountServiceUrl(value: string) {
    this._accountServiceUrl = value;
  }

  protected get apiClient(): AxiosInstance {
    if (this._apiClient == null) {
      this._apiClient = Axios.create({
        baseURL: `${this._accountServiceUrl}/api`,
        responseType: "json",
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    return this._apiClient;
  }

  async authenticate(token: string): Promise<Role[]> {
    const response = await this.apiClient.get("authenticate", {
      headers: {
        access_token: token
      }
    });
    return response.data;
  }

  async getRoles(): Promise<Role[]> {
    const response = await this.apiClient.get('roles');
    return response.data;
  }

  async getUsers(): Promise<User[]> {
    const query = {
      alias: 'user',
      pagination: { limit: 100, offset: 0},
      join: [
        {member: 'user.roles', alias: 'role', select: true, type: 'LEFT_OUTER_JOIN'}
      ]
    }
    const response = await this.apiClient.post("users/search", query);
    return response.data.data;
  }

  async addUserRole(userId: number, roleId: number): Promise<User> {
    const response = await this.apiClient.post(
      `/users/${userId}/roles/${roleId}`,
      { userId: userId, roleId: roleId }
    );
    return response.data;
  }

  async deleteUserRole(userId: number, roleId: number): Promise<User> {
    const response = await this.apiClient.delete(
      `/users/${userId}/roles/${roleId}`
    );
    return response.data;
  }
}
