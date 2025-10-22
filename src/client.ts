import { Configuration } from './runtime';
import { ApikeyApi } from './apis/index';
import type {
  InternalServerPublicSession,
  InternalServerPublicSessionList,
  InternalServerPublicProfile,
  InternalServerPublicProfileList,
  InternalServerPublicCreateSessionRequest,
  InternalServerPublicExtendSessionRequest,
} from './models/index';
import type {
  Session,
  CreateSessionOptions,
  ListSessionsOptions,
  Profile,
  ExeqClientOptions,
} from './types';

export class ExeqClient {
  private api: ApikeyApi;

  constructor(options: ExeqClientOptions) {
    const config = new Configuration({
      basePath: options.baseUrl || 'https://api.exeq.dev',
      apiKey: options.apiKey,
    });
    this.api = new ApikeyApi(config);
  }

  // Session Management
  async createSession(options: CreateSessionOptions = {}): Promise<Session> {
    const request: InternalServerPublicCreateSessionRequest = {
      duration: options.duration,
      sessionRecordingEnabled: options.sessionRecordingEnabled,
      profileId: options.profileId,
      residentialProxyEnabled: options.residentialProxyEnabled,
      residentialProxyCountry: options.residentialProxyCountry,
      residentialProxyState: options.residentialProxyState,
      residentialProxyCity: options.residentialProxyCity,
    };

    const response = await this.api.v1SessionsPost({
      internalServerPublicCreateSessionRequest: request,
    });

    return this.mapSession(response);
  }

  async getSession(id: string): Promise<Session> {
    const response = await this.api.v1SessionsIdGet({ id });
    return this.mapSession(response);
  }

  async listSessions(options: ListSessionsOptions = {}): Promise<Session[]> {
    const response = await this.api.v1SessionsGet({
      limit: options.limit,
      offset: options.offset,
    });
    return response.sessions?.map(session => this.mapSession(session)) || [];
  }

  async stopSession(id: string): Promise<void> {
    await this.api.v1SessionsIdDelete({ id });
  }

  async extendSession(id: string, duration: string): Promise<Session> {
    const request: InternalServerPublicExtendSessionRequest = { duration };
    const response = await this.api.v1SessionsIdExtendPost({
      id,
      internalServerPublicExtendSessionRequest: request,
    });
    return this.mapSession(response);
  }

  // Profile Management
  async listProfiles(): Promise<Profile[]> {
    const response = await this.api.v1ProfilesGet();
    return response.profiles?.map(profile => this.mapProfile(profile)) || [];
  }

  async getProfile(id: string): Promise<Profile> {
    const response = await this.api.v1ProfilesIdGet({ id });
    return this.mapProfile(response);
  }

  // Private mapping methods
  private mapSession(session: InternalServerPublicSession): Session {
    return {
      id: session.id!,
      status: session.status as Session['status'],
      cdpUrl: session.cdpUrl!,
      vncUrl: session.vncUrl!,
      vncPassword: session.vncPassword!,
      expiresAt: session.expiresAt || null,
      createdAt: session.createdAt!,
      sessionRecordingEnabled: session.sessionRecordingEnabled,
      sessionRecordingUrl: session.sessionRecordingUrl || null,
      residentialProxyEnabled: session.residentialProxyEnabled,
    };
  }

  private mapProfile(profile: InternalServerPublicProfile): Profile {
    return {
      id: profile.id!,
      name: profile.name!,
      createdAt: profile.createdAt!,
    };
  }
}
