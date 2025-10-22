import type { Session, CreateSessionOptions, ListSessionsOptions, Profile, ExeqClientOptions } from './types';
export declare class ExeqClient {
    private api;
    constructor(options: ExeqClientOptions);
    createSession(options?: CreateSessionOptions): Promise<Session>;
    getSession(id: string): Promise<Session>;
    listSessions(options?: ListSessionsOptions): Promise<Session[]>;
    stopSession(id: string): Promise<void>;
    extendSession(id: string, duration: string): Promise<Session>;
    listProfiles(): Promise<Profile[]>;
    getProfile(id: string): Promise<Profile>;
    private mapSession;
    private mapProfile;
}
